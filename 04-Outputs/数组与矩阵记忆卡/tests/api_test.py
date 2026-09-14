import json
import sys
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
import uuid
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from database import Database
from start import ReviewServer, catalog


class APITest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory()
        cls.db = Database(cls.temp.name, catalog())
        cls.server = ReviewServer(('127.0.0.1', 0), cls.db)
        cls.worker = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.worker.start()
        cls.url = 'http://127.0.0.1:' + str(cls.server.server_port)

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown(); cls.server.server_close(); cls.worker.join(); cls.temp.cleanup()

    def request(self, path, data=None, **headers):
        headers.setdefault('X-Review-Token', self.server.token)
        if data is not None: headers.setdefault('Content-Type', 'application/json')
        req = urllib.request.Request(self.url + path, data=json.dumps(data).encode() if data is not None else None, headers=headers)
        try:
            with urllib.request.urlopen(req) as r: return r.status, r.headers, r.read()
        except urllib.error.HTTPError as e: return e.code, e.headers, e.read()

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


if __name__ == '__main__': unittest.main()
