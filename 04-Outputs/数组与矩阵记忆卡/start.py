"""Stable local launcher for the single-worker FastAPI application."""
import argparse
import json
import os
import threading
import time
import urllib.error
import urllib.request
import webbrowser
from pathlib import Path

BASE = Path(__file__).resolve().parent


def catalog():
    # Retain the old test/import entry point; the API owns catalog loading.
    from backend.api import catalog as load_catalog
    return load_catalog()


def load_config(path=BASE / 'launch.local.json'):
    """Optional local-only settings, also used by the double-click launcher."""
    if not path.exists():
        return {}
    config = json.loads(path.read_text())
    fields = {'port', 'dataDir', 'timeZone', 'allowedHosts', 'allowedOrigins'}
    if not isinstance(config, dict) or set(config) - fields:
        raise ValueError('启动配置必须是 JSON 对象，只含 port/dataDir/timeZone/allowedHosts/allowedOrigins。')
    if 'port' in config and (type(config['port']) is not int or not 1 <= config['port'] <= 65535):
        raise ValueError('启动配置 port 必须为 1 到 65535 的整数。')
    for key in ('dataDir', 'timeZone'):
        if key in config and (not isinstance(config[key], str) or not config[key]):
            raise ValueError(f'启动配置 {key} 必须是非空字符串。')
    for key in ('allowedHosts', 'allowedOrigins'):
        if key in config and (not isinstance(config[key], list) or any(not isinstance(v, str) for v in config[key])):
            raise ValueError(f'启动配置 {key} 必须是地址列表。')
    return config


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    try:
        config = load_config()
    except (OSError, ValueError) as exc:
        parser.exit(1, f'无法读取 launch.local.json：{exc}\n')
    parser.add_argument('--no-open', action='store_true')
    parser.add_argument('--port', type=int, default=config.get('port', 8765))
    parser.add_argument('--data-dir', type=Path, default=BASE / config.get('dataDir', 'data'))
    parser.add_argument('--time-zone', default=os.environ.get('SHIYI_TIME_ZONE', config.get('timeZone')))
    parser.add_argument('--allow-host', action='append', default=config.get('allowedHosts', []))
    parser.add_argument('--allow-origin', action='append', default=config.get('allowedOrigins', []))
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error('--port 必须在 1 到 65535 之间。')
    try:
        import uvicorn
        from backend.api import create_app
    except ImportError:
        parser.exit(1, '缺少 Python 环境，请按 README 创建 .venv 并安装 requirements.lock。\n')
    if not (BASE / 'frontend/dist/index.html').is_file():
        parser.exit(1, '缺少前端构建。请先在 frontend 中运行 npm ci 和 npm run build。\n')
    url = f'http://127.0.0.1:{args.port}/'
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    try:
        with opener.open(url + 'api/session', timeout=1) as response:
            existing = json.load(response)
    except (urllib.error.URLError, ValueError, OSError):
        existing = {}
    if existing.get('app') == 'shiyi-leetcode-review' and existing.get('apiVersion') == 2:
        if existing.get('dataDirectory') != str(args.data_dir.resolve()):
            parser.exit(1, '这个端口的拾忆使用了另一数据目录，请换端口或关闭对应实例。\n')
        if args.time_zone and existing.get('timeZone') != args.time_zone:
            parser.exit(1, '已运行实例的学习时区不同，请关闭该实例后重新启动。\n')
        print('拾忆已在运行：' + url)
        if not args.no_open:
            webbrowser.open(url)
        return
    hosts = [f'127.0.0.1:{args.port}', f'localhost:{args.port}', *args.allow_host]
    origins = [f'http://127.0.0.1:{args.port}', f'http://localhost:{args.port}', *args.allow_origin]
    app = create_app(args.data_dir, allowed_hosts=hosts, allowed_origins=origins,
                     time_zone=args.time_zone)
    server = uvicorn.Server(uvicorn.Config(app, host='127.0.0.1', port=args.port,
                            workers=1, proxy_headers=False, access_log=False))
    if not args.no_open:
        def open_when_ready():
            for _ in range(100):
                if server.started:
                    webbrowser.open(url)
                    return
                if server.should_exit:
                    return
                time.sleep(0.1)
        threading.Thread(target=open_when_ready, daemon=True).start()
    print('拾忆 · 共享学习进度：' + url, flush=True)
    print('学习数据目录：' + str(args.data_dir.resolve()), flush=True)
    server.run()
    if not server.started:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
