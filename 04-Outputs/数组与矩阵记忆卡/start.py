"""Local website + SQLite API. No installation, account or external service."""
import argparse
import functools
import json
import secrets
import sqlite3
import threading
import urllib.error
import urllib.parse
import urllib.request
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from database import Database, StoreError, MAX_BYTES
from data_lock import DataLease

BASE = Path(__file__).resolve().parent
URL = 'http://127.0.0.1:8765/'


def catalog():
    result = {}
    for t in json.loads((BASE / 'topics.json').read_text()):
        for c in json.loads((BASE / t['content']).read_text()):
            result[c['uid']] = {'topicId': t['id'], 'title': c['title']}
    return result


class ReviewServer(ThreadingHTTPServer):
    daemon_threads = True
    def __init__(self, address, database):
        self.database = database
        self.token = secrets.token_urlsafe(32)
        super().__init__(address, functools.partial(Handler, directory=str(BASE / 'dist')))


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        # Normal requests are quiet; failures remain visible for troubleshooting.
        if len(args) > 1 and str(args[1]) not in ('200', '304'):
            super().log_message(fmt, *args)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'same-origin')
        self.send_header('X-Frame-Options', 'DENY')
        super().end_headers()

    def _guard(self, token=True):
        port = self.server.server_address[1]
        allowed = {f'127.0.0.1:{port}', f'localhost:{port}'}
        if self.headers.get('Host') not in allowed:
            raise StoreError('此服务仅供本机访问。', 403)
        origin = self.headers.get('Origin')
        if origin and origin not in {'http://' + a for a in allowed}:
            raise StoreError('请求来源无效。', 403)
        if token and not secrets.compare_digest(self.headers.get('X-Review-Token', ''), self.server.token):
            raise StoreError('连接已更新，请重新连接本地服务。', 401)

    def _json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _error(self, exc):
        if isinstance(exc, StoreError):
            self._json({'error': str(exc), 'detail': exc.detail}, exc.status)
        else:
            self._json({'error': '本地保存未完成，请检查磁盘空间或数据库是否可写，然后重试。'}, 503)
            print('本地服务错误：', repr(exc), flush=True)

    def do_GET(self):
        parsed = urllib.parse.urlsplit(self.path)
        try:
            self._guard(token=parsed.path.startswith('/api/') and parsed.path != '/api/session')
            if not parsed.path.startswith('/api/'):
                return super().do_GET()
            db = self.server.database
            if parsed.path == '/api/session':
                return self._json({'app': 'shiyi-leetcode-review', 'apiVersion': 2, 'token': self.server.token, 'dataDirectory': str(db.directory)})
            if parsed.path == '/api/state':
                return self._json(db.snapshot())
            if parsed.path == '/api/status':
                return self._json(db.status())
            if parsed.path == '/api/learning':
                return self._json(db.learning())
            if parsed.path == '/api/history':
                query = urllib.parse.parse_qs(parsed.query)
                try:
                    before = int(query['before'][0]) if 'before' in query else None
                except (ValueError, IndexError):
                    raise StoreError('历史页码无效。')
                return self._json(db.history(before, uid=query.get('uid', [None])[0]))
            if parsed.path == '/api/export':
                return self._json(db.export())
            raise StoreError('找不到这个接口。', 404)
        except (StoreError, sqlite3.Error, OSError) as exc:
            self._error(exc)

    def do_POST(self):
        try:
            self._guard()
            if self.headers.get_content_type() != 'application/json':
                raise StoreError('只接受 JSON 数据。', 415)
            try:
                length = int(self.headers.get('Content-Length', '0'))
            except ValueError:
                raise StoreError('数据长度无效。')
            if not 0 < length <= MAX_BYTES:
                raise StoreError('备份或保存请求超过 16 MB。', 413)
            try:
                data = json.loads(self.rfile.read(length))
            except (ValueError, UnicodeError):
                raise StoreError('不是有效的 JSON 数据。')
            path = urllib.parse.urlsplit(self.path).path
            if path == '/api/command':
                return self._json(self.server.database.mutate(data))
            if path == '/api/backup':
                name = self.server.database.backup()
                return self._json({'name': name, **self.server.database.status()})
            raise StoreError('找不到这个接口。', 404)
        except (StoreError, sqlite3.Error, OSError) as exc:
            self._error(exc)

    def do_OPTIONS(self):
        self.send_error(403, 'Cross-origin requests are not allowed')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--no-open', action='store_true')
    parser.add_argument('--port', type=int, default=8765)
    parser.add_argument('--data-dir', type=Path, default=BASE / 'data', help='Default: data/review.sqlite3 beside the launcher')
    args = parser.parse_args()
    url = f'http://127.0.0.1:{args.port}/'
    # Check only the requested local origin; never silently switch ports or data folders.
    try:
        with urllib.request.urlopen(url + 'api/session', timeout=1) as r:
            existing = json.load(r)
        if existing.get('app') == 'shiyi-leetcode-review' and existing.get('apiVersion') == 2:
            if existing.get('dataDirectory') != str(args.data_dir.resolve()):
                print('这个端口的拾忆使用了另一数据目录，请换一个端口或关闭该实例。')
                raise SystemExit(1)
            print('拾忆已在运行：' + url)
            if not args.no_open:
                webbrowser.open(url)
            return
    except (urllib.error.URLError, ValueError, OSError):
        pass
    try:
        with DataLease(args.data_dir):
            database = Database(args.data_dir, catalog())
            try:
                server = ReviewServer(('127.0.0.1', args.port), database)
            except OSError as exc:
                print(f'{args.port} 端口无法启动。若旧版拾忆仍在运行，请关闭旧启动窗口后再打开。\n{exc}')
                raise SystemExit(1)
            print('拾忆 · 本地算法复习：' + url, flush=True)
            print('学习数据：' + str(database.path), flush=True)
            print('进度与草稿自动保存；关闭此窗口停止服务。', flush=True)
            if not args.no_open:
                threading.Timer(0.5, lambda: webbrowser.open(url)).start()
            try:
                server.serve_forever()
            except KeyboardInterrupt:
                pass
            finally:
                server.server_close()
                database._automatic_backup(force=True)
    except (sqlite3.Error, StoreError, OSError, RuntimeError) as exc:
        print('无法安全打开数据库，原文件未被删除：' + str(exc))
        print('数据库目录：' + str(args.data_dir.resolve()))
        print('请按 README 的“数据库损坏时恢复”说明，用 backups 中的备份恢复。')
        raise SystemExit(1)


if __name__ == '__main__':
    main()
