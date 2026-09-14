import json
import sys
import tempfile
import sqlite3
import time
import unittest
import uuid
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from fastapi.testclient import TestClient
from backend.api import create_app
from data_lock import DataLease


class APITest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.app = create_app(self.temp.name, time_zone='America/Chicago')
        self.client = TestClient(self.app, base_url='http://127.0.0.1:8765')
        self.client.__enter__()
        self.db = self.app.state.database

    def tearDown(self):
        self.client.__exit__(None, None, None)
        self.temp.cleanup()

    def request(self, path, data=None, **headers):
        headers.setdefault('X-Review-Token', self.app.state.token)
        if data is not None: headers.setdefault('Content-Type', 'application/json')
        response = self.client.request('POST' if data is not None else 'GET', path, content=json.dumps(data).encode() if data is not None else None, headers=headers)
        return response.status_code, response.headers, response.content

    def test_same_origin_api_persists_and_returns_a_complete_snapshot(self):
        payload = {'id': str(uuid.uuid4()), 'type': 'draft', 'payload': {'uid': 'lc-1', 'kind': 'main', 'text': '先查补数', 'expectedAt': None}}
        status, headers, body = self.request('/api/command', payload)
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(body)['drafts']['lc-1:main']['text'], '先查补数')
        self.assertEqual(headers['Cache-Control'], 'no-store')
        self.assertEqual(self.request('/api/state')[0], 200)

    def test_other_sites_and_missing_token_cannot_mutate_learning_data(self):
        data = {'id': str(uuid.uuid4()), 'type': 'settings', 'payload': {'dailyNewLimit': 9}}
        self.assertEqual(self.request('/api/command', data, Origin='https://example.com')[0], 403)
        self.assertEqual(self.request('/api/command', data, **{'X-Review-Token': ''})[0], 401)
        self.assertEqual(self.request('/api/state', Host='unrelated.example')[0], 403)
        self.assertEqual(self.db.snapshot()['settings']['dailyNewLimit'], 3)

    def test_learning_overview_and_scoped_timeline(self):
        command = {'id': str(uuid.uuid4()), 'type': 'review', 'payload': {'uid': 'lc-238', 'kind': 'main', 'ratings': {'recognize': 2, 'explain': 1}}}
        self.assertEqual(self.request('/api/command', command)[0], 200)
        status, _, body = self.request('/api/learning')
        self.assertEqual(status, 200)
        data = json.loads(body)
        self.assertEqual(len(data['days']), 7)
        self.assertIn('lc-238', [p['uid'] for p in data['problems']])
        status, _, body = self.request('/api/history?uid=lc-238')
        self.assertEqual(status, 200)
        self.assertTrue(all(e['uid'] == 'lc-238' for e in json.loads(body)['events']))
        self.assertEqual(self.request('/api/history?uid=invalid')[0], 400)
        self.assertEqual(self.request('/api/learning', **{'X-Review-Token': ''})[0], 401)

    def test_database_files_are_outside_the_public_web_root(self):
        self.assertEqual(self.request('/data/review.sqlite3')[0], 404)
        self.assertEqual(self.request('/../data/review.sqlite3')[0], 404)
        self.assertEqual(self.request('/api/command', {'bad': True})[0], 400)

    def test_strict_types_and_json_errors_never_commit_or_return_422(self):
        before = self.db.snapshot()
        payloads = [
            {'type': 'review', 'payload': {'uid': 'lc-1', 'kind': 'main', 'ratings': {'recognize': True, 'explain': 2}}},
            {'type': 'review', 'payload': {'uid': 'lc-1', 'kind': 'main', 'ratings': {'recognize': '2', 'explain': 2}}},
            {'type': 'review', 'payload': {'uid': 'lc-1', 'kind': [], 'ratings': {}}},
            {'type': 'review', 'payload': {'uid': 'lc-1', 'kind': 'main', 'practice': 'false', 'ratings': {'recognize': 2, 'explain': 2}}},
            {'type': 'note', 'payload': {'uid': 'lc-1', 'text': 'x', 'overwrite': 'false'}},
            {'type': 'draft', 'payload': {'uid': 'lc-1', 'kind': 'main', 'text': 'x', 'expectedAt': True}},
            {'type': 'settings', 'payload': {'dailyNewLimit': True}},
            {'type': 'settings', 'payload': {'topicId': []}},
            {'type': 'import', 'payload': {'data': {'format': 'shiyi-backup', 'version': 1, 'settings': []}}},
        ]
        for command in payloads:
            with self.subTest(command=command):
                command['id'] = str(uuid.uuid4())
                status, _, raw = self.request('/api/command', command)
                self.assertEqual(status, 400)
                self.assertEqual(set(json.loads(raw)), {'error', 'detail'})
        headers = {'X-Review-Token': self.app.state.token, 'Content-Type': 'application/json'}
        for body in ('{bad', 'NaN', '{"id": NaN}', '[]', 'null', '[' * 2000):
            self.assertEqual(self.client.post('/api/command', content=body, headers=headers).status_code, 400)
        self.assertEqual(self.client.post('/api/command', content='{}', headers={**headers, 'Content-Type': 'text/plain'}).status_code, 415)
        self.assertEqual(self.db.snapshot(), before)

    def test_streamed_size_limit_with_missing_and_forged_content_length(self):
        from database import MAX_BYTES
        before = self.db.snapshot()['revision']
        headers = {'X-Review-Token': self.app.state.token, 'Content-Type': 'application/json'}
        for extra in ({}, {'Content-Length': '1'}, {'Content-Length': str(MAX_BYTES + 1)}):
            response = self.client.post('/api/command', content=iter([b' ' * MAX_BYTES, b'1']), headers={**headers, **extra})
            self.assertEqual(response.status_code, 413)
            self.assertEqual(set(response.json()), {'error', 'detail'})
        self.assertEqual(self.client.post('/api/backup', content='{}', headers={**headers, 'Content-Length': 'invalid'}).status_code, 400)
        self.assertEqual(self.db.snapshot()['revision'], before)

    def test_exact_authorities_and_real_resource_errors(self):
        headers = {'X-Review-Token': self.app.state.token}
        for path in ('/api/missing', '/missing.js', '/content/missing.json', '/content/notes/missing.html', '/content/%2e%2e/%2e%2e/data/review.sqlite3', '/backups/missing.sqlite3', '/app/'):
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path, headers=headers).status_code, 404)
        self.assertEqual(self.client.get('/').status_code, 200)
        self.assertIn('src="/assets/', self.client.get('/').text)
        self.assertEqual(self.client.get('/content/notes/lc-1.html').status_code, 200)
        for hostile in ({'Host': '127.0.0.1:8766'}, {'Origin': 'null'}, {'Origin': 'http://localhost:8766'}, {'Host': 'evil.test', 'X-Forwarded-Host': 'localhost:8765'}):
            self.assertEqual(self.client.get('/api/session', headers=hostile).status_code, 403)
        self.assertEqual(self.client.get('/api/state', headers=[('X-Review-Token', self.app.state.token), ('X-Review-Token', self.app.state.token)]).status_code, 401)
        self.assertEqual(self.client.options('/api/command').status_code, 403)
        self.assertEqual(self.client.get('/api/history?before=9223372036854775808', headers=headers).status_code, 400)
        with patch.object(self.db, 'snapshot', side_effect=sqlite3.OperationalError('synthetic disk failure')):
            response = self.client.get('/api/state', headers=headers)
        self.assertEqual(response.status_code, 503)
        self.assertEqual(set(response.json()), {'error', 'detail'})

    def test_session_clock_and_lifetime_lease(self):
        response = self.client.get('/api/session').json()
        self.assertEqual(response['timeZone'], 'America/Chicago')
        self.assertLess(abs(response['serverNow'] - time.time() * 1000), 2000)
        self.assertEqual(response['apiVersion'], 2)
        with self.assertRaisesRegex(RuntimeError, '已有服务'):
            with DataLease(self.temp.name):
                self.fail('a second owner acquired the running data directory')
        with self.db.connect() as db:
            self.assertEqual(db.execute('PRAGMA user_version').fetchone()[0], 1)
            self.assertEqual(db.execute('PRAGMA journal_mode').fetchone()[0], 'wal')


class LifecycleTest(unittest.TestCase):
    def test_local_launcher_config_is_optional_and_strict(self):
        from start import load_config
        with tempfile.TemporaryDirectory() as directory:
            path=Path(directory)/'launch.local.json'
            self.assertEqual(load_config(path), {})
            config={'port': 18765, 'timeZone': 'America/Chicago', 'allowedHosts': ['study.example.ts.net'], 'allowedOrigins': ['https://study.example.ts.net']}
            path.write_text(json.dumps(config))
            self.assertEqual(load_config(path), config)
            for invalid in ([], {'port':True}, {'port':70000}, {'dataDir':[]}, {'timeZone':False}, {'allowedHosts':'*'}, {'unknown':1}):
                path.write_text(json.dumps(invalid))
                with self.assertRaises(ValueError):load_config(path)

    def test_failed_start_releases_lease_and_normal_exit_backs_up(self):
        with tempfile.TemporaryDirectory() as directory:
            with patch('backend.api.Database', side_effect=RuntimeError('synthetic startup failure')):
                with self.assertRaisesRegex(RuntimeError, 'synthetic'):
                    with TestClient(create_app(directory, time_zone='America/Chicago')):
                        pass
            with DataLease(directory):
                pass
            app = create_app(directory, time_zone='America/Chicago')
            with patch('backend.api.Database._automatic_backup') as backup:
                with TestClient(app):
                    pass
                backup.assert_called_with(force=True)
            with DataLease(directory):
                pass

    def test_unsafe_static_paths_and_invalid_configuration_fail_before_database(self):
        from backend.api import BASE
        with patch('backend.api.Database') as database:
            for directory, zone in [(BASE / 'frontend/dist/private', 'America/Chicago'), ('/unused-shiyi-test', 'Not/AZone')]:
                with self.assertRaises(ValueError):
                    with TestClient(create_app(directory, time_zone=zone)):
                        pass
            database.assert_not_called()
        for kwargs in ({'allowed_hosts': ['*']}, {'allowed_origins': ['https://evil.test']}, {'allowed_hosts': ['localhost:99999']}):
            with self.assertRaises(ValueError):
                create_app('/unused-shiyi-test', **kwargs)
        # Private Serve is an exact, local deployment choice; no wildcard or proxy trust.
        with tempfile.TemporaryDirectory() as directory:
            app = create_app(directory, allowed_hosts=['study.example.ts.net'], allowed_origins=['https://study.example.ts.net'], time_zone='America/Chicago')
            with TestClient(app, base_url='https://study.example.ts.net') as client:
                self.assertEqual(client.get('/api/session', headers={'Origin': 'https://study.example.ts.net'}).status_code, 200)
                self.assertEqual(client.get('/api/session', headers={'Origin': 'https://other.example.ts.net'}).status_code, 403)


if __name__ == '__main__': unittest.main()
