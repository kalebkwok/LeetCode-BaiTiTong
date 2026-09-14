/* Shared calculations for the learning overview, filters and daily board. */
(function(root){
  'use strict';
  const dayKey=time=>{const d=new Date(time);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const modes={casual:{limit:3,label:'休闲模式'},crazy:{limit:20,label:'疯狂模式'}};
  const modeLabel=limit=>Object.values(modes).find(m=>m.limit===limit)?.label||'旧版自定义设置';
  function build(data,library,topicId,now=Date.now()){
    const cards=library.topics.flatMap(t=>t.cards.map(c=>({...c,topicId:t.id,topicTitle:t.title})));
    const lookup=new Map(cards.map(c=>[c.uid,c])), records=data.state.records, today=dayKey(now);
    const status=uid=>{const r=records[uid];return !r?'practice':r.due>now?'scheduled':dayKey(r.due)<today?'overdue':'due';};
    const rows=data.problems.map(p=>({...p,card:lookup.get(p.uid)||{uid:p.uid,id:p.uid.replace('lc-',''),title:'已移出当前题库',topicTitle:'历史题目'},status:p.learned?status(p.uid):'undone',record:records[p.uid]}));
    const due=cards.filter(c=>records[c.uid]?.due<=now).sort((a,b)=>records[a.uid].due-records[b.uid].due);
    const introduced=Object.values(records).filter(r=>dayKey(r.firstSeen)===today).length;
    const remaining=Math.max(0,data.settings.dailyNewLimit-introduced);
    const fresh=cards.filter(c=>c.topicId===topicId&&!records[c.uid]).slice(0,remaining);
    const learned=new Set(rows.filter(r=>r.learned).map(r=>r.uid));
    return {rows,due,fresh,remaining,introduced,overdue:due.filter(c=>dayKey(records[c.uid].due)<today).length,
      done:data.today.map(e=>({...e,card:lookup.get(e.uid)})),
      learned:learned.size,submissions:rows.reduce((n,r)=>n+r.eventCount,0),
      topics:library.topics.map(t=>({...t,learned:t.cards.filter(c=>learned.has(c.uid)).length}))};
  }
  function filterRows(rows,{query='',topic='',status='',from='',to='',sort='last'}={}){
    const q=query.trim().toLocaleLowerCase();
    return rows.filter(r=>(!q||`${r.uid} ${r.card.id} ${r.card.title}`.toLocaleLowerCase().includes(q))&&(!topic||r.card.topicId===topic)&&(!status||r.status===status)&&
      ((!from&&!to)||r.activityDays.some(d=>(!from||d>=from)&&(!to||d<=to))))
      .sort((a,b)=>sort==='count'?b.eventCount-a.eventCount||((b.lastAt||0)-(a.lastAt||0)):sort==='due'?(a.record?.due??Infinity)-(b.record?.due??Infinity):sort==='first'?(b.firstAt||0)-(a.firstAt||0):(b.lastAt||0)-(a.lastAt||0));
  }
  const api={dayKey,modes,modeLabel,build,filterRows};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LearningModel=api;
})(typeof window!=='undefined'?window:globalThis);
