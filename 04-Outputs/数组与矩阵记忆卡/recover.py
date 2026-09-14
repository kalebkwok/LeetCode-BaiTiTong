"""Offline recovery when a damaged database prevents opening the web interface."""
import argparse
import os
import shutil
import sqlite3
import uuid
from contextlib import closing
from datetime import datetime
from pathlib import Path
from data_lock import DataLease
from database import SCHEMA

BASE = Path(__file__).resolve().parent


def recover(directory, backup_name):
    directory = Path(directory).resolve()
    if Path(backup_name).name != backup_name or not backup_name.startswith('review-') or not backup_name.endswith('.sqlite3'):
        raise ValueError('请提供 backups 文件夹中的完整备份文件名。')
    backup = directory / 'backups' / backup_name
    if not backup.is_file() or backup.is_symlink():
        raise ValueError('找不到这份备份。')
    with DataLease(directory):
        with closing(sqlite3.connect(f'{backup.as_uri()}?mode=ro', uri=True)) as db:
            if db.execute('PRAGMA quick_check').fetchone()[0] != 'ok' or db.execute('PRAGMA user_version').fetchone()[0] != SCHEMA:
                raise ValueError('备份完整性或版本检查未通过，原数据库未改变。')
            tables = {r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
            if not {'progress','skills','notes','drafts','review_events','meta','settings'} <= tables:
                raise ValueError('这不是拾忆数据库。')
        archive = directory / 'recovery' / (datetime.now().strftime('%Y%m%d-%H%M%S-') + uuid.uuid4().hex[:8])
        archive.mkdir(parents=True)
        target = directory / 'review.sqlite3'
        staging = archive / 'restored.tmp'
        shutil.copy2(backup, staging)
        # Assign a new epoch before swapping: pending requests from before recovery require explicit review.
        with closing(sqlite3.connect(staging)) as restored:
            restored.execute('PRAGMA journal_mode=DELETE')
            restored.execute("UPDATE meta SET value=? WHERE key='databaseId'", (str(uuid.uuid4()),))
            restored.commit()
        originals = [directory / name for name in ('review.sqlite3','review.sqlite3-wal','review.sqlite3-shm')]
        for old in originals:
            if old.is_file(): shutil.copy2(old, archive / old.name)
        try:
            for old in originals[1:]:
                old.unlink(missing_ok=True)
            os.replace(staging, target)
        except OSError:
            for old in originals:
                saved = archive / old.name
                if saved.is_file(): shutil.copy2(saved, old)
            raise
        return archive


def main():
    parser = argparse.ArgumentParser(description='关闭拾忆服务后，从本地自动备份恢复数据库。')
    parser.add_argument('backup_name')
    parser.add_argument('--data-dir', type=Path, default=BASE / 'data')
    args = parser.parse_args()
    try:
        archive = recover(args.data_dir, args.backup_name)
    except (OSError, ValueError, RuntimeError, sqlite3.Error) as exc:
        print('未完成恢复：' + str(exc))
        raise SystemExit(1)
    print('恢复完成，可以重新双击打开记忆卡。')
    print('恢复前的原文件保留在：' + str(archive))


if __name__ == '__main__': main()
