import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {configureClock,addCalendarDays,dayKey,now} from '../src/model/time.js';
configureClock('America/Chicago',1000,1000);
test('calendar days preserve shared wall time over both DST transitions and gaps',()=>{
 for(const [start,expected] of [
  ['2026-03-07T18:00:00Z','2026-03-08T17:00:00Z'],
  ['2026-10-31T17:00:00Z','2026-11-01T18:00:00Z'],
  ['2026-03-07T08:30:00Z','2026-03-08T08:30:00Z'],
  ['2026-10-31T06:30:00Z','2026-11-01T06:30:00Z'],
  ['2026-12-31T18:00:00Z','2027-01-01T18:00:00Z']])assert.equal(addCalendarDays(Date.parse(start),1),Date.parse(expected));
});
test('different browser zones use the same server midnight and clock offset',()=>{
 for(const TZ of ['Asia/Tokyo','America/Los_Angeles','UTC']){
  const script=`import {configureClock,dayKey,addCalendarDays} from './src/model/time.js';configureClock('America/Chicago',0,0);process.stdout.write(JSON.stringify([dayKey(Date.parse('2026-09-14T04:59:59Z')),dayKey(Date.parse('2026-09-14T05:00:00Z')),addCalendarDays(Date.parse('2026-03-07T18:00:00Z'),1)]));`;
  const output=execFileSync(process.execPath,['--input-type=module','-e',script],{cwd:new URL('..',import.meta.url),env:{...process.env,TZ},encoding:'utf8'});
  assert.deepEqual(JSON.parse(output),['2026-09-13','2026-09-14',Date.parse('2026-03-08T17:00:00Z')]);
 }
 configureClock('America/Chicago',Date.now()+60000);assert.ok(Math.abs(now()-Date.now()-60000)<100);
});
