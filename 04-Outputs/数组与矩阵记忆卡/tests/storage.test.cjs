const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/storage.js');
const E=require('../dist/review-engine.js');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const clone=x=>JSON.parse(JSON.stringify(x));
function harness(){
 const map=new Map(),storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
 const state={state:E.empty(),drafts:{},settings:{dailyNewLimit:3,topicId:'arrays-matrices-03'},revision:0,databaseId:'test-db'};
 const receipts=new Map();let lost=false,dropNext=false;
 const fetcher=async(path,options)=>{
  if(path==='/api/session')return {ok:true,status:200,json:async()=>({apiVersion:2,token:'token'})};
  if(path==='/api/state')return {ok:true,status:200,json:async()=>clone(state)};
  const command=JSON.parse(options.body),p=command.payload;
  if(!receipts.has(command.id)){
   if(command.type==='review')state.state=E.review(state.state,p,1000+state.revision).state;
   if(command.type==='draft'){
    const key=`${p.uid}:${p.kind}`,old=state.drafts[key];
    if(p.expectedAt!==(old?.at??null)&&!p.overwrite)return {ok:false,status:409,json:async()=>({error:'conflict',detail:{conflict:'draft',databaseText:old?.text,yourText:p.text}})};
    state.drafts[key]={text:p.text,at:1000+state.revision};
   }
   state.revision++;receipts.set(command.id,true);
  }
  if(dropNext){dropNext=false;lost=true;throw TypeError('response lost after commit');}
  return {ok:true,status:200,json:async()=>({...clone(state),result:{label:'saved'}})};
 };
 return {storage,state,receipts,fetcher,setDrop:()=>dropNext=true,get lost(){return lost;}};
}
test('a lost response survives reload and retries without duplicate review',async()=>{
 const h=harness(),a=new Store(h);await a.open();h.setDrop();
 a.enqueue('review',{uid:'lc-238',kind:'main',ratings:{recognize:2,explain:2}});
 await tick();assert.equal(h.lost,true);assert.equal(a.queue.length,1);clearTimeout(a.timer);
 const b=new Store(h);await b.open();await tick();
 assert.equal(b.queue.length,0);assert.equal(b.snapshot.state.records['lc-238'].reviews,1);assert.equal(h.receipts.size,1);
});
test('rapid draft edits coalesce while retaining the latest text',async()=>{
 const h=harness(),s=new Store(h);await s.open();
 await Promise.all([s.text('draft','lc-238','code','a'),s.text('draft','lc-238','code','ab'),s.text('draft','lc-238','code','abc')]);
 assert.equal(h.state.drafts['lc-238:code'].text,'abc');assert.equal(s.queue.length,0);
});
test('conflicting draft remains in outbox until user chooses a version',async()=>{
 const h=harness(),s=new Store(h);await s.open();h.state.drafts['lc-238:code']={text:'other browser',at:5000};
 const pending=s.text('draft','lc-238','code','my edit',null).catch(e=>e.message);await tick();
 assert.equal(s.queue.length,1);assert.equal(s.queue[0].error.status,409);assert.equal(h.state.drafts['lc-238:code'].text,'other browser');
 await s.resolve(s.queue[0].id,false);await pending;assert.equal(s.snapshot.drafts['lc-238:code'].text,'other browser');assert.equal(s.queue.length,0);
});
test('configurable new limit can pause new cards without hiding due reviews',()=>{
 let state=E.review(E.empty(),{uid:'lc-238',kind:'main',ratings:{recognize:0,explain:0}},1000).state;
 const cards=[{uid:'lc-238'},{uid:'lc-1'}];
 assert.deepEqual(E.queue(state,cards,601000,0),[{uid:'lc-238',kind:'main'}]);
});
