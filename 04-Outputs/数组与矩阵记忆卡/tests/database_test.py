"""Persistence, recovery and concurrency tests using isolated temporary databases."""
import copy
import json
import sqlite3
import sys
import tempfile
import unittest
import uuid
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from database import Database, StoreError, empty
from start import catalog
from data_lock import DataLease
from recover import recover


class DatabaseTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.now = 1789228800000
        self.db = Database(self.temp.name, catalog(), clock=lambda: self.now)

    def tearDown(self):
        self.temp.cleanup()

    def command(self, kind, payload, identifier=None):
        return self.db.mutate({'id': identifier or str(uuid.uuid4()), 'type': kind, 'payload': payload})

    def rate(self, uid='lc-238', **values):
        return self.command('review', {'uid': uid, 'kind': 'main', 'ratings': {'recognize': 2, 'explain': 2}, **values})

    def test_database_reopen_preserves_progress_drafts_and_notes(self):
        self.rate()
        self.command('note', {'uid': 'lc-238', 'text': '先写结果再更新乘积', 'expectedAt': None})
        self.command('draft', {'uid': 'lc-238', 'kind': 'code', 'text': 'def solve(nums):\n    pass', 'expectedAt': None})
        reopened = Database(self.temp.name, catalog()).snapshot()
        self.assertEqual(reopened['state']['records']['lc-238']['reviews'], 1)
        self.assertEqual(reopened['state']['notes']['lc-238']['text'], '先写结果再更新乘积')
        self.assertIn('def solve', reopened['drafts']['lc-238:code']['text'])
        self.assertEqual(len(self.db.history()['events']), 1)

    def test_retry_of_committed_request_cannot_double_count(self):
        request = {'id': str(uuid.uuid4()), 'type': 'review', 'payload': {'uid': 'lc-238', 'kind': 'main', 'ratings': {'recognize': 2, 'explain': 1}}}
        self.db.mutate(request)
        response = self.db.mutate(request)
        self.assertTrue(response['duplicate'])
        self.assertEqual(response['state']['records']['lc-238']['reviews'], 1)
        self.assertEqual(len(self.db.history()['events']), 1)
        request['payload']['ratings']['explain'] = 0
        with self.assertRaises(StoreError): self.db.mutate(request)

    def test_parallel_reviews_are_serialized_without_lost_updates(self):
        with ThreadPoolExecutor(max_workers=6) as pool:
            list(pool.map(lambda _: self.rate(), range(12)))
        self.assertEqual(self.db.snapshot()['state']['records']['lc-238']['reviews'], 12)
        self.assertEqual(len(self.db.history()['events']), 12)

    def test_help_and_coding_are_saved_as_distinct_history(self):
        r = self.rate(usedHelp=True)
        self.assertEqual(r['state']['skills']['lc-238']['recognize']['value'], 1)
        old = copy.deepcopy(r['state']['records'])
        r = self.rate(kind='code', practice=True, ratings={'implement': 2})
        self.assertEqual(r['state']['records'], old)
        self.assertTrue(self.db.history()['events'][0]['practice'])

    def test_global_new_limit_and_review_only_mode(self):
        self.command('settings', {'dailyNewLimit': 1})
        self.rate('lc-238')
        r = self.rate('lc-1')
        self.assertNotIn('lc-1', r['state']['records'])
        self.assertEqual(r['state']['skills']['lc-1']['explain']['value'], 2)
        self.assertTrue(self.db.history()['events'][0]['practice'])
        self.command('settings', {'dailyNewLimit': 0})
        self.now += 86400000
        r = self.rate('lc-238')
        self.assertEqual(r['state']['records']['lc-238']['reviews'], 2)

    def test_note_conflict_protects_other_browser_text(self):
        a = self.command('note', {'uid': 'lc-238', 'text': 'A', 'expectedAt': None})
        at = a['state']['notes']['lc-238']['at']
        self.command('note', {'uid': 'lc-238', 'text': 'B', 'expectedAt': at})
        with self.assertRaises(StoreError) as err:
            self.command('note', {'uid': 'lc-238', 'text': 'old A edit', 'expectedAt': at})
        self.assertEqual(err.exception.status, 409)
        self.assertEqual(self.db.snapshot()['state']['notes']['lc-238']['text'], 'B')
        self.command('note', {'uid': 'lc-238', 'text': 'chosen version', 'expectedAt': at, 'overwrite': True})
        self.assertEqual(self.db.snapshot()['state']['notes']['lc-238']['text'], 'chosen version')

    def test_legacy_migration_is_idempotent_and_preserves_newer_records(self):
        legacy = self.rate()['state']
        legacy['notes']['lc-1'] = {'text': '旧浏览器卡点', 'at': self.now}
        self.now += 1000
        newer = self.rate(ratings={'recognize': 0, 'explain': 1})['state']['records']['lc-238']
        self.command('migrate', {'data': legacy})
        self.command('migrate', {'data': legacy})
        status = self.db.status()
        self.assertEqual(status['migrationCount'], 1)
        self.assertEqual(status['state']['records']['lc-238'], newer)
        self.assertEqual(status['state']['notes']['lc-1']['text'], '旧浏览器卡点')

    def test_bad_import_rolls_back_every_field(self):
        self.rate()
        before = self.db.snapshot()
        data = self.db.export()
        data['state']['notes']['lc-1'] = {'text': 'must rollback', 'at': self.now}
        data['drafts']['lc-1:code'] = {'text': 42, 'at': self.now}
        with self.assertRaises(StoreError): self.command('import', {'data': data})
        self.assertEqual(self.db.snapshot(), before)

    def test_export_import_roundtrip_includes_history_and_drafts(self):
        self.rate()
        self.command('draft', {'uid': 'lc-238', 'kind': 'code', 'text': 'code', 'expectedAt': None})
        self.command('settings', {'dailyNewLimit': 7})
        exported = self.db.export()
        with tempfile.TemporaryDirectory() as directory:
            second = Database(directory, catalog())
            response = second.mutate({'id': str(uuid.uuid4()), 'type': 'import', 'payload': {'data': exported}})
            self.assertEqual(response['state'], exported['state'])
            self.assertEqual(response['drafts'], exported['drafts'])
            self.assertEqual(response['settings']['dailyNewLimit'], 7)
            self.assertEqual(second.history()['events'][0]['uid'], 'lc-238')

    def test_backup_restore_and_stale_pending_request_protection(self):
        first = self.rate()
        backup = self.db.backup()
        self.now += 2000
        self.rate(ratings={'recognize': 0, 'explain': 0})
        self.command('draft', {'uid': 'lc-238', 'kind': 'code', 'text': 'new draft', 'expectedAt': None})
        restored = self.command('restore', {'name': backup})
        self.assertEqual(restored['state'], first['state'])
        self.assertEqual(restored['drafts'], {})
        self.assertNotEqual(restored['databaseId'], first['databaseId'])
        self.assertTrue(any('before-restore' in x['name'] for x in self.db.backups()))
        with self.assertRaises(StoreError) as err:
            self.db.mutate({'id': str(uuid.uuid4()), 'databaseId': first['databaseId'], 'type': 'settings', 'payload': {'dailyNewLimit': 5}})
        self.assertEqual(err.exception.detail['conflict'], 'database')
        with self.assertRaises(StoreError): self.command('restore', {'name': '../../review.sqlite3'})

    def test_undo_only_reverts_target_review_not_notes_or_other_problems(self):
        event = self.rate()['result']['eventId']
        self.command('note', {'uid': 'lc-238', 'text': '保留卡点', 'expectedAt': None})
        self.rate('lc-1')
        r = self.command('undo', {'eventId': event})
        self.assertNotIn('lc-238', r['state']['records'])
        self.assertIn('lc-1', r['state']['records'])
        self.assertEqual(r['state']['notes']['lc-238']['text'], '保留卡点')
        first = self.rate()['result']['eventId']
        self.rate()
        with self.assertRaises(StoreError): self.command('undo', {'eventId': first})

    def test_offline_recovery_preserves_damaged_original_and_uses_a_new_epoch(self):
        before = self.rate()
        backup = self.db.backup()
        self.db.path.write_bytes(b'damaged test database')
        archive = recover(self.temp.name, backup)
        self.assertEqual((archive / 'review.sqlite3').read_bytes(), b'damaged test database')
        restored = Database(self.temp.name, catalog()).snapshot()
        self.assertEqual(restored['state'], before['state'])
        self.assertNotEqual(restored['databaseId'], before['databaseId'])

    def test_live_database_lease_prevents_recovery(self):
        backup = self.db.backup()
        with DataLease(self.temp.name):
            with self.assertRaises(RuntimeError): recover(self.temp.name, backup)

    def test_history_paginates_equal_timestamps_and_old_imports(self):
        for _ in range(4): self.rate()
        page = self.db.history(limit=2)
        next_page = self.db.history(page['nextCursor'], limit=2)
        self.assertEqual(len({e['id'] for e in page['events'] + next_page['events']}), 4)
        self.assertIsNone(next_page['nextCursor'])


if __name__ == '__main__': unittest.main()
