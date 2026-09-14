"""Run the browser acceptance server with synthetic, disposable learning data."""
import signal
import subprocess
import sys
import tempfile
from pathlib import Path

if __name__ == '__main__':
    with tempfile.TemporaryDirectory(prefix='shiyi-browser-') as directory:
        server = subprocess.Popen([sys.executable, str(Path(__file__).parents[1] / 'start.py'),
                                   '--no-open', '--port', '18765', '--data-dir', directory,
                                   '--time-zone', 'America/Chicago'])
        def stop(signum, _frame):
            if server.poll() is None:
                server.send_signal(signum)
            raise SystemExit(0)
        signal.signal(signal.SIGTERM, stop)
        signal.signal(signal.SIGINT, stop)
        try:
            raise SystemExit(server.wait())
        finally:
            if server.poll() is None:
                server.terminate()
                try:
                    server.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    server.kill()
                    server.wait()
