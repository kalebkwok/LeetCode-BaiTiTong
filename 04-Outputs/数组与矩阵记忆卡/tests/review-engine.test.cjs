const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/review-engine.js');
const cards=[238,56,73,189,48].map(id=>({uid:`lc-${id}`}));
const now=new Date(2026,8,12,12).getTime();
const rate=(state,uid,options={},time=now)=>E.review(state,{uid,kind:'main',ratings:{recognize:2,explain:2},...options},time).state;
test('daily introduction limit survives a JSON reload; next day adds three',()=>{
 let s=E.empty();assert.equal(E.queue(s,cards,now).length,3);
 for(const c of cards.slice(0,3))s=rate(s,c.uid);
 s=E.validate(JSON.parse(JSON.stringify(s)));
 assert.equal(E.queue(s,cards,now).length,0);
 const tomorrow=new Date(2026,8,13,12).getTime();
 assert.equal(E.queue(s,cards,tomorrow).filter(c=>!s.records[c.uid]).length,2);
 assert.equal(E.queue(s,cards,tomorrow)[0].kind,'followup');
});
test('failed recall repeats the same question in ten minutes',()=>{
 const s=rate(E.empty(),'lc-238',{ratings:{recognize:2,explain:0}});
 assert.equal(s.records['lc-238'].due,now+600000);
 assert.equal(s.records['lc-238'].phase,'main');
 assert.equal(E.queue(s,cards,now+600000)[0].uid,'lc-238');
});
test('success widens intervals; help resets to one day and cannot claim independence',()=>{
 let s=rate(E.empty(),'lc-238');
 s=rate(s,'lc-238',{kind:'followup',ratings:{explain:2}},s.records['lc-238'].due);
 assert.equal(s.records['lc-238'].stage,1);
 assert.equal(s.records['lc-238'].phase,'main');
 s=rate(s,'lc-238',{usedHelp:true});
 assert.equal(s.skills['lc-238'].recognize.value,1);
 assert.equal(s.records['lc-238'].stage,0);
});
test('coding and free practice only update assessed skills, not schedules',()=>{
 const original=rate(E.empty(),'lc-238');
 const next=rate(original,'lc-238',{kind:'code',ratings:{implement:2},practice:true});
 assert.deepEqual(original.records,next.records);
 assert.equal(next.skills['lc-238'].implement.value,2);
 assert.deepEqual(original.skills['lc-238'].recognize,next.skills['lc-238'].recognize);
 assert.deepEqual(rate(E.empty(),'lc-56',{practice:true}).records,{});
});
test('malformed imports and missing scores fail without mutating input',()=>{
 const s=E.empty(),before=JSON.stringify(s);
 assert.throws(()=>rate(s,'lc-238',{ratings:{recognize:2}}));
 assert.throws(()=>E.validate({version:1,records:{'lc-238':{due:'tomorrow'}},skills:{},notes:{}}));
 assert.throws(()=>E.validate({version:1,records:{},skills:{},notes:{'lc-238':{text:3,at:now}}}));
 assert.equal(JSON.stringify(s),before);
});
test('backup merge preserves newest records and independent notes/skills',()=>{
 const older=rate(E.empty(),'lc-238',{},now),newer=rate(older,'lc-238',{ratings:{recognize:1,explain:0}},now+1000);
 older.notes['lc-56']={text:'端点相接',at:now};
 const merged=E.merge(newer,older);
 assert.equal(merged.records['lc-238'].lastReviewed,now+1000);
 assert.equal(merged.records['lc-238'].firstSeen,now);
 assert.equal(merged.notes['lc-56'].text,'端点相接');
 assert.equal(merged.skills['lc-238'].explain.value,0);
});
test('day intervals use local calendar dates across daylight saving changes',()=>{
 const start=new Date(2026,2,7,12),result=E.schedule(undefined,2,start.getTime());
 const end=new Date(result.due);
 assert.equal(end.getDate(),8);assert.equal(end.getHours(),12);
});
