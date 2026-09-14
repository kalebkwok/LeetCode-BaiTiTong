"""FastAPI v2 transport around the schema-1 learning store."""
import json
import logging
import os
import secrets
import sqlite3
import threading
import time
from contextlib import asynccontextmanager
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from starlette.concurrency import run_in_threadpool
from starlette.exceptions import HTTPException
from starlette.responses import JSONResponse
from starlette.staticfiles import StaticFiles

from data_lock import DataLease
from database import Database, StoreError
from .schemas import read_json, validate_command

BASE = Path(__file__).resolve().parents[1]
_time_zone = None
_time_zone_lock = threading.Lock()


def catalog():
    result = {}
    for topic in json.loads((BASE / 'topics.json').read_text()):
        for card in json.loads((BASE / topic['content']).read_text()):
            result[card['uid']] = {'topicId': topic['id'], 'title': card['title']}
    return result


def resolve_time_zone(configured=None):
    candidate = configured if configured is not None else os.environ.get('TZ')
    if candidate is None:
        localtime = str(Path('/etc/localtime').resolve())
        if '/zoneinfo/' in localtime:
            candidate = localtime.split('/zoneinfo/', 1)[1]
        elif Path('/etc/timezone').is_file():
            candidate = Path('/etc/timezone').read_text().strip()
    try:
        if not candidate:
            raise ValueError('无法识别主机学习时区，请使用 --time-zone 指定 IANA 名称。')
        ZoneInfo(candidate)
    except (ZoneInfoNotFoundError, TypeError, ValueError) as exc:
        raise ValueError(f'学习时区无效：{candidate!r}；请指定有效的 IANA 时区。') from exc
    return candidate


def configure_time_zone(configured=None):
    """Set the process timezone once, before SQLite or local calendar calculations."""
    global _time_zone
    zone = resolve_time_zone(configured)
    with _time_zone_lock:
        if _time_zone is not None and _time_zone != zone:
            raise ValueError('同一进程不能切换学习时区，请重启服务。')
        if _time_zone is None:
            if not hasattr(time, 'tzset'):
                raise ValueError('当前平台不支持共享学习时区；请使用 macOS 或 Linux。')
            os.environ['TZ'] = zone
            time.tzset()
            _time_zone = zone
    return zone


def _allowed_values(hosts, origins):
    if (hosts is not None and not isinstance(hosts, (list, tuple))) or (origins is not None and not isinstance(origins, (list, tuple))):
        raise ValueError('Host 和 Origin 配置必须是明确地址列表。')
    hosts = tuple(hosts) if hosts is not None else ('127.0.0.1:8765', 'localhost:8765')
    origins = tuple(origins) if origins is not None else ('http://127.0.0.1:8765', 'http://localhost:8765')
    for host in hosts:
        if not isinstance(host, str) or not host or any(c.isspace() or c in '/*?#@\\' for c in host):
            raise ValueError('allowed_hosts 必须是明确的 Host（可含端口）。')
        parsed = urlsplit('http://' + host)
        try:
            if not parsed.hostname or parsed.path or parsed.port == 0:
                raise ValueError
        except ValueError:
            raise ValueError('allowed_hosts 含无效地址。') from None
    for origin in origins:
        if not isinstance(origin, str) or any(c.isspace() for c in origin):
            raise ValueError('allowed_origins 必须是完整 origin。')
        parsed = urlsplit(origin)
        if parsed.scheme not in ('http', 'https') or parsed.netloc not in hosts or parsed.path or parsed.query or parsed.fragment:
            raise ValueError('allowed_origins 必须是已允许 Host 对应的完整 HTTP(S) origin。')
    return frozenset(hosts), frozenset(origins)


def create_app(data_dir=None, *, allowed_hosts=None, allowed_origins=None,
               time_zone=None):
    directory = Path(data_dir if data_dir is not None else BASE / 'data').resolve()
    hosts, origins = _allowed_values(allowed_hosts, allowed_origins)
    frontend = BASE / 'frontend' / 'dist'
    content = frontend / 'content'

    def validate_static():
        for root in (frontend, content):
            resolved = root.resolve()
            if resolved == directory or directory.is_relative_to(resolved) or resolved.is_relative_to(directory):
                raise ValueError('学习数据目录必须位于静态资源目录之外。')
            if root.is_symlink():
                raise ValueError('静态资源根目录不能是符号链接。')
        if not (frontend / 'index.html').is_file():
            raise ValueError('缺少页面构建产物，请按 README 完成前端构建后再启动。')

    @asynccontextmanager
    async def lifespan(app):
        zone = resolve_time_zone(time_zone)
        validate_static()
        configure_time_zone(zone)
        lease = DataLease(directory)

        def open_database():
            lease.__enter__()
            try:
                return Database(directory, catalog())
            except BaseException:
                lease.__exit__()
                raise

        db = await run_in_threadpool(open_database)
        app.state.database = db
        app.state.token = secrets.token_urlsafe(32)
        app.state.time_zone = zone
        try:
            yield
        finally:
            try:
                await run_in_threadpool(db._automatic_backup, force=True)
            finally:
                await run_in_threadpool(lease.__exit__)

    app = FastAPI(lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)

    @app.exception_handler(StoreError)
    async def store_error(request, exc):
        return JSONResponse({'error': str(exc), 'detail': exc.detail}, status_code=exc.status)

    @app.exception_handler(RequestValidationError)
    async def validation_error(request, exc):
        return JSONResponse({'error': '请求数据格式无效。', 'detail': None}, status_code=400)

    @app.exception_handler(HTTPException)
    async def http_error(request, exc):
        return JSONResponse({'error': '找不到这个接口或文件。' if exc.status_code == 404 else '请求方法无效。', 'detail': None}, status_code=exc.status_code)

    async def storage_error(request, exc):
        logging.getLogger(__name__).error('本地服务错误：%r', exc)
        return JSONResponse({'error': '本地保存未完成，请检查磁盘空间或数据库是否可写，然后重试。', 'detail': None}, status_code=503)

    app.add_exception_handler(sqlite3.Error, storage_error)
    app.add_exception_handler(OSError, storage_error)

    @app.middleware('http')
    async def guard(request, call_next):
        try:
            if len(request.headers.getlist('host')) != 1 or request.headers.get('host') not in hosts:
                raise StoreError('请求 Host 无效。', 403)
            origin_headers = request.headers.getlist('origin')
            if len(origin_headers) > 1 or (origin_headers and origin_headers[0] not in origins):
                raise StoreError('请求来源无效。', 403)
            if request.method == 'OPTIONS':
                raise StoreError('不允许跨来源请求。', 403)
            if request.url.path.startswith('/api/') and not (request.method == 'GET' and request.url.path == '/api/session'):
                tokens = request.headers.getlist('x-review-token')
                if len(tokens) != 1 or not secrets.compare_digest(tokens[0].encode(), app.state.token.encode()):
                    raise StoreError('连接已更新，请重新连接本地服务。', 401)
            response = await call_next(request)
        except StoreError as exc:
            response = await store_error(request, exc)
        for key, value in {'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'X-Frame-Options': 'DENY'}.items():
            response.headers[key] = value
        return response

    @app.get('/api/session')
    def session():
        return {'app': 'shiyi-leetcode-review', 'apiVersion': 2, 'token': app.state.token,
                'dataDirectory': str(app.state.database.directory), 'timeZone': app.state.time_zone,
                'serverNow': int(time.time() * 1000)}

    @app.get('/api/state')
    def state():
        return app.state.database.snapshot()

    @app.get('/api/status')
    def status():
        return app.state.database.status()

    @app.get('/api/learning')
    def learning():
        return app.state.database.learning()

    @app.get('/api/history')
    def history(request: Request):
        before = request.query_params.get('before')
        try:
            before = int(before) if before else None
            if before is not None and not -(2**63) <= before < 2**63:
                raise ValueError
        except ValueError:
            raise StoreError('历史页码无效。') from None
        return app.state.database.history(before, uid=request.query_params.get('uid') or None)

    @app.get('/api/export')
    def export():
        return app.state.database.export()

    @app.post('/api/command')
    async def command(request: Request):
        data = validate_command(await read_json(request))
        return await run_in_threadpool(app.state.database.mutate, data)

    @app.post('/api/backup')
    async def backup(request: Request):
        await read_json(request)
        def save_backup():
            db = app.state.database
            with db.lock:
                return {'name': db.backup(), **db.status()}
        return await run_in_threadpool(save_backup)

    @app.api_route('/api/{path:path}', methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'])
    def unknown_api(path: str):
        raise StoreError('找不到这个接口。', 404)

    if content.is_dir():
        app.mount('/content', StaticFiles(directory=content))
    app.mount('/', StaticFiles(directory=frontend, html=True, check_dir=False))
    return app
