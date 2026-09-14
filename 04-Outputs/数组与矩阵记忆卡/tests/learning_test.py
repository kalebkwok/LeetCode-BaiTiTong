"""Learning center metrics, per-problem history and mode changes, using isolated data."""
import sys
import tempfile
import unittest
import uuid
from datetime import datetime, timedelta
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from database import Database, empty
from start import catalog

class LearningTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.now = int(datetime(2026, 9, 13, 12).timestamp()*1000)
        self.db = Database(self.temp.name, catalog(), clock=lambda: self.now)
    def tearDown(self): self.temp.cleanup()
    def command(self, kind, payload):
        return self.db.mutate({'id': str(uuid.uuid4()), 'type': kind, 'payload': payload})
    def rate(self, uid='lc-238', **args):
        return self.command('review', {'uid': uid, 'kind': 'main', 'ratings': {'recognize': 2, 'explain': 2}, **args})
    def test_daily_unique_counts_keep_multiple_submissions_and_free_practice(self):
        self.rate(); self.now += 1000; self.rate()
        self.rate('lc-1', practice=True)
        overview = self.db.learning()
        day = overview['days'][-1]
        self.assertEqual((day['total'], day['submissions'], day['new'], day['practice']), (2, 3, 1, 1))
        self.assertEqual(len(overview['today']), 2)
        row = next(p for p in overview['problems'] if p['uid']=='lc-238')
        self.assertEqual(row['eventCount'], 2)
        self.assertEqual(row['legacyCount'], 0)
        self.assertEqual(row['lastAt']-row['firstAt'], 1000)
    def test_undo_removes_metrics_but_preserves_visible_timeline(self):
        event=self.rate()['result']['eventId']
        self.command('undo', {'eventId': event})
        d=self.db.learning()
        self.assertEqual(d['days'][-1]['total'], 0)
        self.assertEqual(d['today'], [])
        self.assertFalse(d['problems'][0]['learned'])
        self.assertTrue(self.db.history(uid='lc-238')['events'][0]['undone'])
    def test_legacy_totals_do_not_invent_daily_events(self):
        state=empty();state['records']['lc-238']={'stage':0,'phase':'main','firstSeen':self.now-86400000,'lastReviewed':self.now,'due':self.now+86400000,'reviews':12}
        self.command('import', {'data': state})
        d=self.db.learning()
        self.assertEqual((d['problems'][0]['legacyCount'],d['problems'][0]['eventCount']), (12,0))
        self.assertEqual(d['days'][-1]['total'],0)
        self.assertEqual(self.db.history(uid='lc-238')['events'],[])
        self.rate()
        d=self.db.learning()
        self.assertEqual((d['problems'][0]['legacyCount'],d['problems'][0]['eventCount']), (12,1))
    def test_modes_share_quota_across_topics_and_survive_reopen(self):
        ids=list(catalog())[:21]
        for uid in ids[:3]: self.rate(uid)
        blocked=self.rate(ids[3]);self.assertNotIn(ids[3],blocked['state']['records'])
        self.command('settings', {'dailyNewLimit':20})
        for uid in ids[3:20]: self.rate(uid)
        capped=self.rate(ids[20]);self.assertNotIn(ids[20],capped['state']['records'])
        self.command('settings', {'dailyNewLimit':3})
        capped=self.rate(ids[20]);self.assertNotIn(ids[20],capped['state']['records'])
        # Existing reviews remain available after switching down.
        self.rate(ids[0]);self.assertEqual(len(self.db.snapshot()['state']['records']),20)
        reopened=Database(self.temp.name,catalog(),clock=lambda:self.now)
        self.assertEqual(reopened.snapshot()['settings']['dailyNewLimit'],3)
        self.now += 86400000
        self.rate(ids[20]);self.assertIn(ids[20],self.db.snapshot()['state']['records'])
    def test_timeline_filter_pagination_equal_timestamps_and_undo_eligibility(self):
        for _ in range(4): self.rate();self.rate('lc-1')
        a=self.db.history(uid='lc-238',limit=2)
        b=self.db.history(uid='lc-238',before=a['nextCursor'],limit=2)
        self.assertEqual(len({e['id'] for e in a['events']+b['events']}),4)
        self.assertTrue(all(e['uid']=='lc-238' for e in a['events']+b['events']))
        self.assertEqual(sum(e['canUndo'] for e in a['events']+b['events']),1)
        self.assertIsNone(b['nextCursor'])
    def test_calendar_midnight_reclassifies_review_and_keeps_seven_dates(self):
        self.now=int(datetime(2026,9,12,23,59,59).timestamp()*1000)
        self.rate()
        self.now+=2000;self.rate()
        d=self.db.learning()
        self.assertEqual(len(d['days']),7)
        self.assertEqual(d['days'][-2]['new'],1)
        self.assertEqual(d['days'][-1]['review'],1)
        self.assertEqual(d['problems'][0]['activityDays'],['2026-09-12','2026-09-13'])
        self.assertEqual(len(d['today']),1)

    def test_shared_timezone_dst_due_dates_and_calendar_buckets(self):
        from backend.api import configure_time_zone
        configure_time_zone('America/Chicago')
        for start, due in [('2026-03-07T18:00:00+00:00','2026-03-08T17:00:00+00:00'),
                           ('2026-10-31T17:00:00+00:00','2026-11-01T18:00:00+00:00'),
                           ('2026-03-07T08:30:00+00:00','2026-03-08T08:30:00+00:00'),
                           ('2026-10-31T06:30:00+00:00','2026-11-01T06:30:00+00:00')]:
            with self.subTest(start=start), tempfile.TemporaryDirectory() as directory:
                self.now=int(datetime.fromisoformat(start).timestamp()*1000)
                self.db=Database(directory,catalog(),clock=lambda:self.now)
                result=self.rate()
                self.assertEqual(result['state']['records']['lc-238']['due'],int(datetime.fromisoformat(due).timestamp()*1000))
                # Move to the next local calendar midnight, including 23/25-hour days.
                tomorrow=datetime.combine(datetime.fromtimestamp(self.now/1000).date()+timedelta(days=1),datetime.min.time())
                self.now=int(tomorrow.timestamp()*1000);self.rate()
                d=self.db.learning()
                dates=[datetime.fromisoformat(x['date']).date() for x in d['days']]
                self.assertEqual(len(set(dates)),7)
                self.assertTrue(all(b-a==timedelta(days=1) for a,b in zip(dates,dates[1:])))
                self.assertEqual((d['days'][-2]['total'],d['days'][-1]['total']),(1,1))
                self.assertEqual(len(d['today']),1)

if __name__=='__main__': unittest.main()
