"""One running service per database directory, also respected by recovery."""
import fcntl
import os
from pathlib import Path


class DataLease:
    def __init__(self, directory):
        self.directory = Path(directory)
        self.file = None

    def __enter__(self):
        self.directory.mkdir(parents=True, exist_ok=True)
        self.file = (self.directory / '.server.lock').open('a+')
        try:
            fcntl.flock(self.file.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            self.file.close()
            self.file = None
            raise RuntimeError('这个数据库已有服务在使用，请先关闭对应的启动窗口。')
        except BaseException:
            self.file.close()
            self.file = None
            raise
        try:
            self.file.seek(0)
            self.file.truncate()
            self.file.write(str(os.getpid()))
            self.file.flush()
        except BaseException:
            self.__exit__()
            raise
        return self

    def __exit__(self, *args):
        if self.file is not None:
            try:
                fcntl.flock(self.file.fileno(), fcntl.LOCK_UN)
            finally:
                self.file.close()
                self.file = None
