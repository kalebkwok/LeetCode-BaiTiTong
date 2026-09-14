import test from 'node:test';
import assert from 'node:assert/strict';
import M from '../src/model/learning-model.js';
const now=new Date(2026,8,13,12).getTime(),day=M.dayKey(now);
const library={topics:[{id:'a',title:'数组',cards:Array.from({length:25},(_,i)=>({uid:`lc-${i+1}`,id:i+1,title:`题目${i+1}`}))},{id:'b',title:'链表',cards:[{uid:'lc-100',id:100,title:'链表题'}]}]};
function data(limit=3){return {state:{records:{},skills:{},notes:{}},settings:{dailyNewLimit:limit},problems:[],today:[]};}
test('casual and crazy give 3 and 20 new slots, sharing already introduced problems',()=>{
 const d=data();assert.equal(M.build(d,library,'a',now).fresh.length,3);
 d.settings.dailyNewLimit=20;assert.equal(M.build(d,library,'a',now).fresh.length,20);
 d.state.records['lc-100']={firstSeen:now,due:now+86400000};assert.equal(M.build(d,library,'a',now).fresh.length,19);
 d.settings.dailyNewLimit=3;assert.equal(M.build(d,library,'a',now).fresh.length,2);
});
test('switch down does not reset quota; overdue problems are global and precede future cards',()=>{
 const d=data();for(let i=1;i<=8;i++)d.state.records[`lc-${i}`]={firstSeen:now,due:now+86400000};
 d.state.records['lc-100']={firstSeen:now-86400000*5,due:now-86400000};
 const m=M.build(d,library,'a',now);assert.equal(m.fresh.length,0);assert.equal(m.remaining,0);assert.equal(m.overdue,1);assert.deepEqual(m.due.map(c=>c.uid),['lc-100']);
});
test('date filters match any submitted day, topic/status/search compose, sorting is explicit',()=>{
 const rows=[{uid:'lc-1',card:{id:1,title:'两数之和',topicId:'a'},activityDays:['2026-09-10',day],lastAt:now,eventCount:3,status:'scheduled'},{uid:'lc-2',card:{id:2,title:'两数相加',topicId:'b'},activityDays:[day],lastAt:now-1000,eventCount:8,status:'overdue'}];
 assert.deepEqual(M.filterRows(rows,{from:'2026-09-10',to:'2026-09-10'}).map(r=>r.uid),['lc-1']);
 assert.deepEqual(M.filterRows(rows,{query:'两数',topic:'b',status:'overdue'}).map(r=>r.uid),['lc-2']);
 assert.deepEqual(M.filterRows(rows,{sort:'count'}).map(r=>r.uid),['lc-2','lc-1']);
});
test('undone-only entries stay discoverable without inflating learned totals',()=>{
 const d=data();d.problems=[{uid:'lc-1',learned:false,eventCount:0,activityDays:[]},{uid:'lc-100',learned:true,eventCount:2,activityDays:[day]}];
 const m=M.build(d,library,'a',now);assert.equal(m.learned,1);assert.equal(m.submissions,2);assert.equal(m.rows[0].status,'undone');assert.equal(m.topics[1].learned,1);
});
