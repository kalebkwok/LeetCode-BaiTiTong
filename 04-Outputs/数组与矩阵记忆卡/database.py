"""Transactional local learning store. Uses only Python's standard library."""
from __future__ import annotations

import copy
import hashlib
import json
import re
import sqlite3
import threading
import time
import uuid
from datetime import datetime, timedelta
from contextlib import contextmanager, closing
from pathlib import Path

SCHEMA = 1
INTERVALS = [1, 3, 7, 14, 30]
SKILLS = {'recognize', 'explain', 'implement'}
KINDS = {'main', 'followup', 'code'}
DEFAULT_SETTINGS = {'dailyNewLimit': 3, 'topicId': 'arrays-matrices-03'}
MAX_BYTES = 16 * 1024 * 1024


class StoreError(Exception):
    def __init__(self, message, status=400, detail=None):
        super().__init__(message)
        self.status, self.detail = status, detail


def empty():
    return {'version': 1, 'records': {}, 'skills': {}, 'notes': {}}


def valid_time(value):
    return type(value) in (int, float) and 0 <= value < 253370764800000


def valid_uid(value):
    return isinstance(value, str) and re.fullmatch(r'lc-\d+', value) is not None


def validate_state(raw):
    if not isinstance(raw, dict) or raw.get('version') != 1 or any(not isinstance(raw.get(k), dict) for k in ('records', 'skills', 'notes')):
        raise StoreError('这不是有效的复习备份，已有数据未改变。')
    result = empty()
    for uid, r in raw['records'].items():
        if not valid_uid(uid) or not isinstance(r, dict):
            raise StoreError('复习记录格式无效。')
        if (type(r.get('stage')) is not int or not -1 <= r['stage'] <= 4 or r.get('phase') not in ('main', 'followup')
                or type(r.get('reviews')) is not int or r['reviews'] < 1
                or not all(valid_time(r.get(k)) for k in ('firstSeen', 'lastReviewed', 'due'))
                or r['lastReviewed'] < r['firstSeen']):
            raise StoreError('复习记录含无效日期或评分。')
        result['records'][uid] = {k: r[k] for k in ('stage', 'phase', 'reviews', 'firstSeen', 'lastReviewed', 'due')}
    for uid, skills in raw['skills'].items():
        if not valid_uid(uid) or not isinstance(skills, dict):
            raise StoreError('能力记录无效。')
        result['skills'][uid] = {}
        for key, s in skills.items():
            if key not in SKILLS or not isinstance(s, dict) or type(s.get('value')) is not int or s['value'] not in (0, 1, 2) or not valid_time(s.get('at')):
                raise StoreError('能力评分无效。')
            result['skills'][uid][key] = {'value': s['value'], 'at': s['at']}
    for uid, n in raw['notes'].items():
        if not valid_uid(uid) or not isinstance(n, dict) or not isinstance(n.get('text'), str) or len(n['text']) > 1500 or not valid_time(n.get('at')):
            raise StoreError('卡点笔记无效。')
        result['notes'][uid] = {'text': n['text'], 'at': n['at']}
    return result


def merge_state(current, incoming):
    result, other = validate_state(current), validate_state(incoming)
    for uid, r in other['records'].items():
        old = result['records'].get(uid)
        result['records'][uid] = r if not old else {**(r if r['lastReviewed'] > old['lastReviewed'] else old), 'firstSeen': min(r['firstSeen'], old['firstSeen'])}
    for uid, skills in other['skills'].items():
        dest = result['skills'].setdefault(uid, {})
        for key, value in skills.items():
            if key not in dest or value['at'] > dest[key]['at']:
                dest[key] = value
    for uid, note in other['notes'].items():
        if uid not in result['notes'] or note['at'] > result['notes'][uid]['at']:
            result['notes'][uid] = note
    return result


class Database:
    def __init__(self, directory, catalog, clock=None):
        self.directory = Path(directory).resolve()
        self.path = self.directory / 'review.sqlite3'
        self.backup_dir = self.directory / 'backups'
        self.catalog = catalog
        self.clock = clock or (lambda: int(time.time() * 1000))
        self.lock = threading.RLock()
        self.backup_error = ''
        self.last_auto = 0
        self.directory.mkdir(parents=True, exist_ok=True)
        self.backup_dir.mkdir(exist_ok=True)
        with self.connect() as db:
            version = db.execute('PRAGMA user_version').fetchone()[0]
            if version > SCHEMA:
                raise StoreError('数据库来自更新版本，请使用相应版本的应用打开。', 503)
            if db.execute('PRAGMA quick_check').fetchone()[0] != 'ok':
                raise StoreError('数据库完整性检查未通过。原文件已保留，请从自动备份恢复。', 503)
            db.executescript('''
                CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY, value TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS progress(uid TEXT PRIMARY KEY, body TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS skills(uid TEXT NOT NULL, skill TEXT NOT NULL, value INTEGER NOT NULL CHECK(value BETWEEN 0 AND 2), at INTEGER NOT NULL, PRIMARY KEY(uid,skill));
                CREATE TABLE IF NOT EXISTS notes(uid TEXT PRIMARY KEY, text TEXT NOT NULL, at INTEGER NOT NULL);
                CREATE TABLE IF NOT EXISTS drafts(uid TEXT NOT NULL, kind TEXT NOT NULL, text TEXT NOT NULL, at INTEGER NOT NULL, PRIMARY KEY(uid,kind));
                CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY, value TEXT NOT NULL);
                CREATE TABLE IF NOT EXISTS review_events(id TEXT PRIMARY KEY, uid TEXT NOT NULL, at INTEGER NOT NULL, kind TEXT NOT NULL, practice INTEGER NOT NULL, ratings TEXT NOT NULL, used_help INTEGER NOT NULL, due INTEGER, undone INTEGER NOT NULL DEFAULT 0, before_json TEXT, after_json TEXT);
                CREATE INDEX IF NOT EXISTS review_events_time ON review_events(at DESC);
                CREATE INDEX IF NOT EXISTS review_events_problem_time ON review_events(uid,at DESC);
                CREATE TABLE IF NOT EXISTS operations(id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, result TEXT NOT NULL, at INTEGER NOT NULL);
                CREATE TABLE IF NOT EXISTS migrations(fingerprint TEXT PRIMARY KEY, source TEXT NOT NULL, payload TEXT NOT NULL, at INTEGER NOT NULL);
                CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT NOT NULL, at INTEGER NOT NULL, detail TEXT NOT NULL);
            ''')
            db.execute('PRAGMA user_version=1')
            for k, v in {'revision': '0', 'databaseId': str(uuid.uuid4())}.items():
                db.execute('INSERT OR IGNORE INTO meta VALUES (?,?)', (k, v))
            for k, v in DEFAULT_SETTINGS.items():
                db.execute('INSERT OR IGNORE INTO settings VALUES (?,?)', (k, json.dumps(v)))
        self._automatic_backup(force=True)

    @contextmanager
    def connect(self):
        db = sqlite3.connect(self.path, timeout=10)
        db.row_factory = sqlite3.Row
        try:
            db.execute('PRAGMA journal_mode=WAL')
            db.execute('PRAGMA synchronous=FULL')
            with db:
                yield db
        finally:
            db.close()

    @staticmethod
    def _state(db):
        s = empty()
        s['records'] = {r['uid']: json.loads(r['body']) for r in db.execute('SELECT * FROM progress')}
        for r in db.execute('SELECT * FROM skills'):
            s['skills'].setdefault(r['uid'], {})[r['skill']] = {'value': r['value'], 'at': r['at']}
        s['notes'] = {r['uid']: {'text': r['text'], 'at': r['at']} for r in db.execute('SELECT * FROM notes')}
        return s

    @staticmethod
    def _settings(db):
        return {r['key']: json.loads(r['value']) for r in db.execute('SELECT * FROM settings')}

    @staticmethod
    def _drafts(db):
        return {f"{r['uid']}:{r['kind']}": {'text': r['text'], 'at': r['at']} for r in db.execute('SELECT * FROM drafts')}

    def _snapshot(self, db):
        meta = dict(db.execute('SELECT key,value FROM meta'))
        return {'state': self._state(db), 'drafts': self._drafts(db), 'settings': self._settings(db), 'revision': int(meta['revision']), 'databaseId': meta['databaseId']}

    def snapshot(self):
        with self.lock, self.connect() as db:
            return self._snapshot(db)

    def status(self):
        with self.lock, self.connect() as db:
            return {'schemaVersion': SCHEMA, 'databasePath': str(self.path), 'backupPath': str(self.backup_dir),
                    'reviewCount': db.execute('SELECT COUNT(*) FROM review_events WHERE undone=0').fetchone()[0],
                    'startedCount': db.execute('SELECT COUNT(*) FROM progress').fetchone()[0],
                    'migrationCount': db.execute('SELECT COUNT(*) FROM migrations').fetchone()[0],
                    'backupError': self.backup_error, 'backups': self.backups(), **self._snapshot(db)}

    def history(self, before=None, limit=50, uid=None):
        if uid is not None and not valid_uid(uid):
            raise StoreError('题号格式无效。')
        with self.lock, self.connect() as db:
            cursor = db.execute('SELECT at,rowid FROM review_events WHERE rowid=?', (before,)).fetchone() if before else None
            rows = db.execute('SELECT rowid,* FROM review_events WHERE (at,rowid)<(?,?) AND (? IS NULL OR uid=?) ORDER BY at DESC,rowid DESC LIMIT ?', (cursor['at'] if cursor else 8640000000000000, cursor['rowid'] if cursor else 9223372036854775807, uid, uid, limit + 1)).fetchall()
            selected = rows[:limit]
            state = self._state(db)
            events = [self._event(r) for r in selected]
            for event, row in zip(events, selected):
                current = {'record': state['records'].get(row['uid']), 'skills': state['skills'].get(row['uid'], {})}
                event['canUndo'] = bool(row['before_json']) and not row['undone'] and current == json.loads(row['after_json'] or 'null')
            return {'events': events, 'nextCursor': selected[-1]['rowid'] if len(rows) > limit else None}

    @staticmethod
    def _event(r):
        return {'id': r['id'], 'uid': r['uid'], 'at': r['at'], 'kind': r['kind'], 'practice': bool(r['practice']),
                'ratings': json.loads(r['ratings']), 'usedHelp': bool(r['used_help']), 'due': r['due'], 'undone': bool(r['undone'])}

    def learning(self):
        """Read one consistent overview; retain legacy totals without inventing events."""
        now = self.clock()
        today = datetime.fromtimestamp(now / 1000).date()
        days = [(today - timedelta(days=i)).isoformat() for i in reversed(range(7))]
        day_key = lambda at: datetime.fromtimestamp(at / 1000).date().isoformat()
        with self.lock, self.connect() as db:
            snapshot = self._snapshot(db)
            state = snapshot['state']
            aggregates = {r['uid']: dict(r) for r in db.execute('''
                SELECT uid, COUNT(*) AS eventCount, MIN(at) AS firstAt, MAX(at) AS lastAt,
                       SUM(practice=0) AS plannedCount
                FROM review_events WHERE undone=0 GROUP BY uid''')}
            activity = {}
            for r in db.execute("SELECT uid, strftime('%Y-%m-%d',at/1000.0,'unixepoch','localtime') AS day FROM review_events WHERE undone=0 GROUP BY uid,day"):
                activity.setdefault(r['uid'], []).append(r['day'])
            all_uids = {r[0] for r in db.execute('SELECT DISTINCT uid FROM review_events')}
            all_uids.update(state['records'])
            all_uids.update(uid for uid, s in state['skills'].items() if s)
            problems = []
            for uid in all_uids:
                a = aggregates.get(uid, {})
                record = state['records'].get(uid)
                skill_times = [s['at'] for s in state['skills'].get(uid, {}).values()]
                first = ([a['firstAt']] if a else []) + ([record['firstSeen']] if record else [])
                last = ([a['lastAt']] if a else []) + ([record['lastReviewed']] if record else []) + skill_times
                problems.append({'uid': uid, 'firstAt': min(first or skill_times, default=None), 'lastAt': max(last, default=None),
                                 'eventCount': a.get('eventCount', 0), 'legacyCount': max(0, (record or {}).get('reviews', 0) - a.get('plannedCount', 0)),
                                 'activityDays': activity.get(uid, []), 'learned': bool(a or record or skill_times)})
            problems.sort(key=lambda p: (p['lastAt'] or -1, p['uid']), reverse=True)
            start = int(datetime.combine(today - timedelta(days=6), datetime.min.time()).timestamp() * 1000)
            end = int(datetime.combine(today + timedelta(days=1), datetime.min.time()).timestamp() * 1000)
            daily = {day: {'date': day, 'total': 0, 'new': 0, 'review': 0, 'practice': 0, 'submissions': 0} for day in days}
            # A problem counts once per day; scheduled learning takes precedence over free practice.
            rows = db.execute("SELECT uid, strftime('%Y-%m-%d',at/1000.0,'unixepoch','localtime') AS day, COUNT(*) AS n, MIN(practice) AS practice FROM review_events WHERE undone=0 AND at>=? AND at<? GROUP BY uid,day", (start, end))
            for r in rows:
                d = daily[r['day']]
                record = state['records'].get(r['uid'])
                category = 'practice' if r['practice'] else 'new' if record and day_key(record['firstSeen']) == r['day'] else 'review'
                d['total'] += 1
                d[category] += 1
                d['submissions'] += r['n']
            today_start = int(datetime.combine(today, datetime.min.time()).timestamp() * 1000)
            today_rows = db.execute('SELECT * FROM review_events WHERE undone=0 AND at>=? AND at<? ORDER BY at DESC,rowid DESC', (today_start, end))
            done = {}
            for row in today_rows:
                done.setdefault(row['uid'], self._event(row))
            recent = [self._event(r) for r in db.execute('SELECT * FROM review_events WHERE undone=0 ORDER BY at DESC,rowid DESC LIMIT 8')]
            return {**snapshot, 'generatedAt': now, 'problems': problems, 'days': list(daily.values()), 'today': list(done.values()), 'recent': recent}

    def _write_state(self, db, state):
        db.execute('DELETE FROM progress')
        db.execute('DELETE FROM skills')
        db.execute('DELETE FROM notes')
        for uid, r in state['records'].items():
            db.execute('INSERT INTO progress VALUES (?,?)', (uid, json.dumps(r)))
        for uid, skills in state['skills'].items():
            for key, s in skills.items():
                db.execute('INSERT INTO skills VALUES (?,?,?,?)', (uid, key, s['value'], s['at']))
        for uid, n in state['notes'].items():
            db.execute('INSERT INTO notes VALUES (?,?,?)', (uid, n['text'], n['at']))

    def _uid(self, uid):
        if not valid_uid(uid) or uid not in self.catalog:
            raise StoreError('题目不在当前题库中。')
        return uid

    def mutate(self, command):
        if not isinstance(command, dict) or not isinstance(command.get('id'), str) or not re.fullmatch(r'[a-zA-Z0-9_-]{8,100}', command['id']):
            raise StoreError('保存请求缺少有效编号。')
        kind, payload = command.get('type'), command.get('payload')
        if not isinstance(payload, dict) or kind not in ('review', 'undo', 'note', 'draft', 'settings', 'import', 'migrate', 'restore'):
            raise StoreError('不支持的保存请求。')
        fingerprint = hashlib.sha256(json.dumps({'type': kind, 'payload': payload}, sort_keys=True).encode()).hexdigest()
        with self.lock:
            with self.connect() as db:
                old = db.execute('SELECT * FROM operations WHERE id=?', (command['id'],)).fetchone()
                if old:
                    if old['fingerprint'] != fingerprint:
                        raise StoreError('同一个请求编号不能保存不同内容。', 409)
                    return {**self._snapshot(db), 'result': json.loads(old['result']), 'duplicate': True}
                epoch = db.execute("SELECT value FROM meta WHERE key='databaseId'").fetchone()[0]
                if command.get('databaseId') and command['databaseId'] != epoch:
                    raise StoreError('数据库已被恢复或替换。这次待保存内容来自恢复前，请先检查再决定是否重试。', 409, {'conflict': 'database'})
            if kind in ('import', 'migrate', 'restore'):
                self.backup('before-' + kind, preserve=payload.get('name') if kind == 'restore' else None)
            with self.connect() as db:
                db.execute('BEGIN IMMEDIATE')
                now = self.clock()
                if kind == 'review':
                    result = self._review(db, command['id'], payload, now)
                elif kind == 'undo':
                    result = self._undo(db, payload, now)
                elif kind in ('note', 'draft'):
                    result = self._text(db, kind, payload, now)
                elif kind == 'settings':
                    result = self._save_settings(db, payload)
                elif kind in ('import', 'migrate'):
                    result = self._import(db, payload, kind, now)
                else:
                    result = self._restore(db, payload, now)
                db.execute("UPDATE meta SET value=CAST(value AS INTEGER)+1 WHERE key='revision'")
                db.execute('INSERT INTO operations VALUES (?,?,?,?)', (command['id'], fingerprint, json.dumps(result, ensure_ascii=False), now))
                db.execute('INSERT INTO audit(action,at,detail) VALUES (?,?,?)', (kind, now, json.dumps(result, ensure_ascii=False)))
                response = {**self._snapshot(db), 'result': result}
            self._automatic_backup()
            return response

    def _review(self, db, event_id, p, now):
        uid = self._uid(p.get('uid'))
        kind, ratings = p.get('kind'), p.get('ratings')
        keys = {'recognize', 'explain'} if kind == 'main' else {'implement'} if kind == 'code' else {'explain'}
        if not isinstance(kind, str) or kind not in KINDS or not isinstance(ratings, dict) or set(ratings) != keys or any(type(v) is not int or v not in (0, 1, 2) for v in ratings.values()):
            raise StoreError('请分别评价本次练到的能力。')
        if type(p.get('practice', False)) is not bool or type(p.get('usedHelp', False)) is not bool:
            raise StoreError('练习状态无效。')
        state = self._state(db)
        old = state['records'].get(uid)
        before = {'record': old, 'skills': state['skills'].get(uid, {})}
        helped = p.get('usedHelp', False)
        actual = {k: min(v, 1) if helped else v for k, v in ratings.items()}
        skills = copy.deepcopy(before['skills'])
        for k, v in actual.items():
            skills[k] = {'value': v, 'at': now}
            db.execute('INSERT OR REPLACE INTO skills VALUES (?,?,?,?)', (uid, k, v, now))
        practice = p.get('practice', False) or kind == 'code'
        day = datetime.fromtimestamp(now / 1000).date()
        introduced = sum(datetime.fromtimestamp(r['firstSeen'] / 1000).date() == day for r in state['records'].values())
        capped = not old and not practice and introduced >= self._settings(db)['dailyNewLimit']
        practice = practice or capped
        due, record = None, old
        if practice:
            label = '今日新题已达上限，本次保存为自由练习。' if capped else '已保存能力自评，复习日期不变。'
        else:
            score = min(actual.values())
            stage = -1 if score == 0 else 0 if score == 1 else min((old['stage'] if old else -1) + 1, 4)
            due = now + 600000 if score == 0 else int((datetime.fromtimestamp(now / 1000) + timedelta(days=INTERVALS[stage])).timestamp() * 1000)
            record = {'stage': stage, 'due': due, 'firstSeen': old['firstSeen'] if old else now, 'lastReviewed': now, 'reviews': (old['reviews'] if old else 0) + 1, 'phase': kind if score == 0 else 'followup' if kind == 'main' else 'main'}
            db.execute('INSERT OR REPLACE INTO progress VALUES (?,?)', (uid, json.dumps(record)))
            label = '下次复习：' + ('10 分钟后' if score == 0 else f'{INTERVALS[stage]} 天后')
        after = {'record': record, 'skills': skills}
        db.execute('INSERT INTO review_events VALUES (?,?,?,?,?,?,?,?,?,?,?)', (event_id, uid, now, kind, int(practice), json.dumps(actual), int(helped), due, 0, json.dumps(before), json.dumps(after)))
        return {'label': label, 'eventId': event_id, 'uid': uid}

    def _undo(self, db, p, now):
        r = db.execute('SELECT * FROM review_events WHERE id=?', (p.get('eventId'),)).fetchone()
        if not r or r['undone'] or not r['before_json']:
            raise StoreError('这条记录不能撤销或已经撤销。', 409)
        state = self._state(db)
        current = {'record': state['records'].get(r['uid']), 'skills': state['skills'].get(r['uid'], {})}
        if current != json.loads(r['after_json']):
            raise StoreError('这道题已有后续学习记录，不能撤销较早记录。其他数据未改变。', 409)
        before = json.loads(r['before_json'])
        db.execute('DELETE FROM progress WHERE uid=?', (r['uid'],))
        db.execute('DELETE FROM skills WHERE uid=?', (r['uid'],))
        if before['record']:
            db.execute('INSERT INTO progress VALUES (?,?)', (r['uid'], json.dumps(before['record'])))
        for key, s in before['skills'].items():
            db.execute('INSERT INTO skills VALUES (?,?,?,?)', (r['uid'], key, s['value'], s['at']))
        db.execute('UPDATE review_events SET undone=1 WHERE id=?', (r['id'],))
        return {'label': '已撤销这次学习记录，卡点和草稿保留。', 'eventId': r['id']}

    def _text(self, db, kind, p, now):
        uid = self._uid(p.get('uid'))
        text = p.get('text')
        limit = 1500 if kind == 'note' else 50000
        if not isinstance(text, str) or len(text) > limit:
            raise StoreError(f'内容不能超过 {limit} 个字符。')
        if kind == 'draft' and (not isinstance(p.get('kind'), str) or p['kind'] not in KINDS):
            raise StoreError('草稿类型无效。')
        query = ('SELECT * FROM notes WHERE uid=?', (uid,)) if kind == 'note' else ('SELECT * FROM drafts WHERE uid=? AND kind=?', (uid, p['kind']))
        old = db.execute(*query).fetchone()
        if p.get('expectedAt') != (old['at'] if old else None) and (old is None or old['text'] != text) and not p.get('overwrite', False):
            raise StoreError('另一页面已修改这份内容。请选择保留哪一个版本。', 409, {'conflict': kind, 'uid': uid, 'kind': p.get('kind'), 'databaseText': old['text'] if old else '', 'yourText': text})
        # Strictly increasing field time makes same-millisecond writes distinguishable.
        at = max(now, (old['at'] + 1) if old else now)
        if kind == 'note':
            db.execute('INSERT OR REPLACE INTO notes VALUES (?,?,?)', (uid, text, at))
        else:
            db.execute('INSERT OR REPLACE INTO drafts VALUES (?,?,?,?)', (uid, p['kind'], text, at))
        return {'label': '已保存到本地数据库。', 'uid': uid, 'field': kind, 'at': at}

    def _save_settings(self, db, p):
        if not isinstance(p, dict) or not p or set(p) - set(DEFAULT_SETTINGS):
            raise StoreError('设置项无效。')
        if 'dailyNewLimit' in p and (type(p['dailyNewLimit']) is not int or not 0 <= p['dailyNewLimit'] <= 20):
            raise StoreError('每日新题数应为 0 到 20；0 表示只复习旧题。')
        if 'topicId' in p and (not isinstance(p['topicId'], str) or p['topicId'] not in {v['topicId'] for v in self.catalog.values()}):
            raise StoreError('专题不存在。')
        for k, v in p.items():
            db.execute('INSERT OR REPLACE INTO settings VALUES (?,?)', (k, json.dumps(v)))
        return {'label': '学习设置已保存。'}

    def _import(self, db, p, kind, now):
        raw = p.get('data')
        modern = isinstance(raw, dict) and raw.get('format') == 'shiyi-backup' and raw.get('version') == 2
        incoming = validate_state(raw.get('state') if modern else raw)
        digest = hashlib.sha256(json.dumps(raw, sort_keys=True).encode()).hexdigest()
        if kind == 'migrate' and db.execute('SELECT 1 FROM migrations WHERE fingerprint=?', (digest,)).fetchone():
            return {'label': '这份浏览器进度已迁移，未重复导入。', 'migration': digest}
        self._write_state(db, merge_state(self._state(db), incoming))
        if modern:
            self._import_extras(db, raw, replace=False)
        if kind == 'migrate':
            db.execute('INSERT INTO migrations VALUES (?,?,?,?)', (digest, str(p.get('source', 'browser'))[:200], json.dumps(raw, ensure_ascii=False), now))
        return {'label': '旧浏览器进度已安全迁入数据库。' if kind == 'migrate' else '备份已合并，保留各项较新记录。', 'migration': digest}

    def _import_extras(self, db, raw, replace):
        drafts = raw.get('drafts', {})
        if not isinstance(drafts, dict):
            raise StoreError('备份中的草稿格式无效。')
        for key, d in drafts.items():
            pieces = key.split(':')
            if len(pieces) != 2 or not valid_uid(pieces[0]) or pieces[1] not in KINDS or not isinstance(d, dict) or not isinstance(d.get('text'), str) or len(d['text']) > 50000 or not valid_time(d.get('at')):
                raise StoreError('备份中的草稿无效。')
            old = db.execute('SELECT at FROM drafts WHERE uid=? AND kind=?', pieces).fetchone()
            if not old or d['at'] > old['at'] or replace:
                db.execute('INSERT OR REPLACE INTO drafts VALUES (?,?,?,?)', (*pieces, d['text'], d['at']))
        settings = raw.get('settings', {})
        if settings:
            self._save_settings(db, settings)
        events = raw.get('events', [])
        if not isinstance(events, list):
            raise StoreError('备份中的学习历史无效。')
        for e in events:
            if not isinstance(e, dict) or not isinstance(e.get('id'), str) or not re.fullmatch(r'[a-zA-Z0-9_-]{8,100}', e['id']) or not valid_uid(e.get('uid')) or not valid_time(e.get('at')) or not isinstance(e.get('kind'), str) or e['kind'] not in KINDS or not isinstance(e.get('ratings'), dict) or not e['ratings'] or any(k not in SKILLS or type(v) is not int or v not in (0, 1, 2) for k, v in e['ratings'].items()) or (e.get('due') is not None and not valid_time(e['due'])):
                raise StoreError('备份中的学习事件无效。')
            db.execute('INSERT OR IGNORE INTO review_events VALUES (?,?,?,?,?,?,?,?,?,?,?)', (e['id'], e['uid'], e['at'], e['kind'], int(bool(e.get('practice'))), json.dumps(e['ratings']), int(bool(e.get('usedHelp'))), e.get('due'), int(bool(e.get('undone'))), None, None))

    def export(self):
        with self.lock, self.connect() as db:
            snap = self._snapshot(db)
            events = [{'id': r['id'], 'uid': r['uid'], 'at': r['at'], 'kind': r['kind'], 'practice': bool(r['practice']), 'ratings': json.loads(r['ratings']), 'usedHelp': bool(r['used_help']), 'due': r['due'], 'undone': bool(r['undone'])} for r in db.execute('SELECT * FROM review_events ORDER BY rowid')]
            return {'format': 'shiyi-backup', 'version': 2, 'exportedAt': self.clock(), 'state': snap['state'], 'drafts': snap['drafts'], 'settings': snap['settings'], 'events': events}

    def backups(self):
        return [{'name': p.name, 'bytes': p.stat().st_size, 'at': int(p.stat().st_mtime * 1000)} for p in sorted(self.backup_dir.glob('review-*.sqlite3'), key=lambda p: p.stat().st_mtime, reverse=True)]

    def backup(self, reason='manual', preserve=None):
        with self.lock:
            safe_reason = re.sub(r'[^a-z-]', '', reason)[:30] or 'manual'
            name = f"review-{datetime.now():%Y%m%d-%H%M%S}-{uuid.uuid4().hex[:8]}-{safe_reason}.sqlite3"
            target = self.backup_dir / name
            try:
                with self.connect() as source, closing(sqlite3.connect(target)) as dest:
                    source.backup(dest)
                    if dest.execute('PRAGMA quick_check').fetchone()[0] != 'ok':
                        raise StoreError('备份校验失败，原数据库保持不变。', 503)
                self.backup_error = ''
                items = self.backups()
                keep = {i['name'] for i in items[:29 if preserve else 30]}
                if preserve:
                    keep.add(preserve)
                for item in items:
                    if item['name'] not in keep:
                        (self.backup_dir / item['name']).unlink()
                return name
            except Exception:
                target.unlink(missing_ok=True)
                raise

    def _automatic_backup(self, force=False):
        now = time.monotonic()
        if force or now - self.last_auto >= 15 * 60:
            try:
                self.backup('auto')
                self.last_auto = now
            except (OSError, sqlite3.Error, StoreError) as exc:
                self.backup_error = '自动备份未完成：' + str(exc)

    def backup_path(self, name):
        if not isinstance(name, str) or not re.fullmatch(r'review-[a-zA-Z0-9-]+\.sqlite3', name):
            raise StoreError('备份名称无效。')
        path = self.backup_dir / name
        if not path.is_file() or path.is_symlink():
            raise StoreError('找不到这个备份。', 404)
        return path

    def _restore(self, db, p, now):
        path = self.backup_path(p.get('name'))
        with closing(sqlite3.connect(f'{path.as_uri()}?mode=ro', uri=True)) as other:
            other.row_factory = sqlite3.Row
            if other.execute('PRAGMA quick_check').fetchone()[0] != 'ok' or other.execute('PRAGMA user_version').fetchone()[0] != SCHEMA:
                raise StoreError('这个备份不能安全恢复。')
            state = validate_state(self._state(other))
            self._write_state(db, state)
            for table in ('drafts', 'settings', 'review_events', 'migrations'):
                db.execute(f'DELETE FROM {table}')
                rows = other.execute(f'SELECT * FROM {table}').fetchall()
                if rows:
                    placeholders = ','.join('?' for _ in rows[0])
                    db.executemany(f'INSERT INTO {table} VALUES ({placeholders})', [tuple(r) for r in rows])
            # Preserve all request receipts: delayed retries must not resurrect pre-restore reviews.
            db.execute("UPDATE meta SET value=? WHERE key='databaseId'", (str(uuid.uuid4()),))
        return {'label': '已恢复所选备份；恢复前的数据也已另存备份。', 'restored': p['name']}
