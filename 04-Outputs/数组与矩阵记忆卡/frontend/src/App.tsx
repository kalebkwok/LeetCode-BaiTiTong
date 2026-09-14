import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import type {Attempt,Kind,Learning,Library,Snapshot} from './types';
import {getStore} from './api';
import {download,errorText,Modal,Modes} from './components';
import LearningCenter,{Timeline} from './features/LearningCenter';
import StudyCard,{Answer} from './features/StudyCard';
import {DataSettings,Guide,MemoryMap} from './features/OtherViews';
import {dayKey,now,timeZone} from './model/time.js';
import {queue} from './model/review-engine.js';
import M from './model/learning-model.js';

const store=getStore();
let libraryRequest:Promise<Library>|null=null;
const loadLibrary=()=>libraryRequest??=store.request<Library>('/content/library.json').catch(e=>{libraryRequest=null;throw e;});
const pages=['history','review','map','data','guide'];
function readRoute(){const [page,search='']=location.hash.slice(1).split('?');return {page:pages.includes(page)?page:'history',params:new URLSearchParams(search)};}
const newAttempt=(uid:string,kind:Kind='main',practice=false):Attempt=>({uid,kind,practice,operationId:store.id(),revealed:false,hintLevel:0,usedHelp:false,ratings:{}});
type Popup={type:'concept'|'related'|'connections'|'history'|'restore';value:string}|null;

export default function App(){
  const version=useSyncExternalStore(store.subscribe,store.getVersion);
  const snapshot=store.view();
  const [library,setLibrary]=useState<Library|null>(null),[learning,setLearning]=useState<Learning|null>(null),[loadError,setLoadError]=useState('');
  const [route,setRoute]=useState(readRoute),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[popup,setPopup]=useState<Popup>(null),[pendingOpen,setPendingOpen]=useState(false),[exportedBroken,setExportedBroken]=useState(false),[restoreConfirmed,setRestoreConfirmed]=useState(false);
  const [attempt,setAttempt]=useState<Attempt|null>(()=>{const r=readRoute(),uid=r.params.get('uid'),kind=r.params.get('kind');return r.page==='review'&&uid?newAttempt(uid,kind==='code'||kind==='followup'?kind:'main',r.params.get('practice')==='true'):null;});
  const [previous,setPrevious]=useState<Attempt[]>([]),[undo,setUndo]=useState<{id:string;attempt:Attempt}|null>(null);
  const writing=useRef(false),importInput=useRef<HTMLInputElement>(null),lastConflict=useRef(''),migrationAttempted=useRef(false);
  useEffect(()=>{const disconnect=store.connect();let active=true;void Promise.all([store.open(),loadLibrary()]).then(([,lib])=>{if(active){setLibrary(lib);setLoadError('');}}).catch(e=>{if(active)setLoadError(errorText(e));});return()=>{active=false;disconnect();};},[]);
  useEffect(()=>{if(snapshot&&library&&!store.queue.length&&!migrationAttempted.current){migrationAttempted.current=true;void store.migrateLegacy().catch(e=>setNotice('旧浏览器原文已保留。'+errorText(e)));}},[version,library,snapshot]);
  useEffect(()=>{if(!snapshot)return;let active=true;const timer=setTimeout(()=>{void store.request<Learning>('/api/learning').then(data=>{if(active){setLearning(data);setLoadError('');}}).catch(e=>{if(active)setLoadError(errorText(e));});},150);return()=>{active=false;clearTimeout(timer);};},[snapshot?.revision,snapshot?.databaseId,route.page,store.sessionInfo?.serverNow]);
  useEffect(()=>{const changed=()=>{const next=readRoute();setRoute(next);if(next.page==='review'&&next.params.get('uid'))setAttempt(old=>{const uid=next.params.get('uid')!,value=next.params.get('kind'),kind=value==='followup'||value==='code'?value:'main';return old?.uid===uid&&old.kind===kind?old:newAttempt(uid,kind,next.params.get('practice')==='true');});};window.addEventListener('hashchange',changed);return()=>window.removeEventListener('hashchange',changed);},[]);
  const conflict=store.queue.find(op=>op.error);
  useEffect(()=>{if(conflict&&lastConflict.current!==conflict.id){lastConflict.current=conflict.id;setPopup(null);setPendingOpen(true);}if(!conflict)lastConflict.current='';},[conflict?.id]);
  function navigate(page:string,values:Record<string,string>={},replace=false){
    const params=new URLSearchParams(route.params);for(const [key,value] of Object.entries(values)){if(value)params.set(key,value);else params.delete(key);}
    const hash=`#${page}${params.size?'?'+params.toString():''}`;
    if(replace)history.replaceState(null,'',hash);else history.pushState(null,'',hash);
    setRoute({page,params});
  }
  function showAttempt(next:Attempt){setAttempt(next);navigate('review',{uid:next.uid,kind:next.kind,practice:String(next.practice),topic:library?.topics.find(t=>t.cards.some(c=>c.uid===next.uid))?.id||''});}
  function start(uid:string,kind:Kind='main',practice=true){if(writing.current||!library?.topics.some(t=>t.cards.some(c=>c.uid===uid)))return;setPopup(null);showAttempt(newAttempt(uid,kind,practice||kind==='code'));}
  const routeTopic=route.params.get('topic'),savedTopic=snapshot?.settings.topicId;
  const topic=library?.topics.find(t=>t.id===(routeTopic||savedTopic))||library?.topics[0];
  const topicMissing=!!(library&&savedTopic&&!routeTopic&&!library.topics.some(t=>t.id===savedTopic));
  useEffect(()=>{if(topicMissing)setNotice('数据库里保存的专题编号已不存在，已临时显示第一个专题；重新选择一次专题即可修正。');},[topicMissing]);
  const cards=library?.topics.flatMap(t=>t.cards)||[];
  const card=cards.find(c=>c.uid===attempt?.uid),owner=library?.topics.find(t=>t.cards.some(c=>c.uid===card?.uid));
  function next(){
    const s=store.view();if(!s||!topic)return;
    const due=cards.filter(c=>s.state.records[c.uid]?.due<=now()).sort((a,b)=>s.state.records[a.uid].due-s.state.records[b.uid].due);
    const fresh=queue(s.state,topic.cards,now(),s.settings.dailyNewLimit).filter(c=>!s.state.records[c.uid]);
    const choice=due.length?{uid:due[0].uid,kind:s.state.records[due[0].uid].phase}:fresh[0];
    if(choice)showAttempt(newAttempt(choice.uid,choice.kind,false));else{setAttempt(null);navigate('review',{uid:'',kind:'',practice:''});}
  }
  async function mode(limit:number){if(!snapshot)return;if(limit===snapshot.settings.dailyNewLimit){setNotice(`当前已经是每日 ${limit} 道新题。`);return;}try{await store.enqueue('settings',{dailyNewLimit:limit});setNotice(`已切换为每日 ${limit} 道新题，沿用今天已学数量。`);}catch(e){setNotice(errorText(e));}}
  async function submit(){
    if(!attempt||writing.current)return;writing.current=true;setBusy(true);const saved=structuredClone(attempt);
    try{const result=await store.enqueue('review',{uid:saved.uid,kind:saved.kind,practice:saved.practice,ratings:saved.ratings,usedHelp:saved.usedHelp},saved.operationId);
      if(result.result?.eventId)setUndo({id:result.result.eventId,attempt:saved});setNotice(result.result?.label||'已保存。');
      if(saved.practice){if(previous.length){const back=previous.at(-1)!;setPrevious(previous.slice(0,-1));showAttempt(back);}else{setAttempt(null);navigate('history',{tab:'board',uid:'',kind:'',practice:''});}}else next();
    }catch(e){setNotice(errorText(e));}finally{writing.current=false;setBusy(false);}
  }
  async function undoEvent(id:string){try{const result=await store.enqueue('undo',{eventId:id});setNotice(result.result?.label||'已撤销。');if(undo?.id===id){setUndo(null);if(!popup)showAttempt({...undo.attempt,operationId:store.id()});}}catch(e){setNotice(errorText(e));}}
  function exportPending(){try{download(store.exportPending(),`拾忆-待保存内容-${Date.now()}.json`);setExportedBroken(true);setNotice('已导出待保存内容；原请求编号和数据库标识保持不变。');}catch(e){setNotice(errorText(e));}}
  async function exportData(){if(store.queue.length||store.blocked){exportPending();return;}try{const data=await store.request('/api/export');download(JSON.stringify(data,null,2),`拾忆-已提交记录-${dayKey(now())}.json`);setNotice('已导出已提交记录 JSON，可用于合并；精确回滚请使用 SQLite 备份。');}catch(e){setNotice(errorText(e));}}
  async function importFile(file:File){try{if(file.size>16*1024*1024)throw Error('文件超过 16 MB，未导入。');const incoming=JSON.parse(await file.text());if(incoming?.format==='shiyi-pending'){store.importQueue(incoming.operations);setNotice('已载入待保存内容；数据库标识不一致的操作需要单独确认。');}else{await store.enqueue('import',{data:incoming});setNotice('已合并较新的记录。');}}catch(e){setNotice(errorText(e));}}
  async function restore(name:string){if(store.queue.length)return;try{await store.enqueue('restore',{name});setPopup(null);setAttempt(null);setPrevious([]);setUndo(null);navigate('history',{tab:'overview',uid:''});setNotice('已恢复备份，数据库标识已更新。其他页面的旧请求需要单独确认。');}catch(e){setNotice(errorText(e));}}
  async function retry(){try{await store.open();setLibrary(await loadLibrary());setLoadError('');}catch(e){setLoadError(errorText(e));}}
  const model=learning&&library&&topic?M.build(learning,library,topic.id,now()):null;
  const selected=popup&&cards.find(c=>c.uid===popup.value),selectedOwner=selected&&library?.topics.find(t=>t.cards.some(c=>c.uid===selected.uid));
  return <><a className="skip" href="#main" onClick={e=>{e.preventDefault();document.getElementById('main')?.focus();}}>跳到主要内容</a><header className="topbar"><div className="brand"><span className="brand-icon" aria-hidden="true">▦</span> 拾忆 <span className="brand-sub">算法记忆卡</span></div><span className="local-label">共享进度 · {library?.topics.length||12} 专题 · {cards.length||177} 题</span></header><div className="layout"><aside className="sidebar"><p className="eyebrow">CHAPTER {topic?.number??'—'}</p><h1>{topic?.title||'拾忆'}</h1>{library&&topic&&<label id="topic-picker">切换专题<select id="topic-select" value={topic.id} disabled={busy} onChange={e=>{navigate(route.page,{topic:e.target.value,search:''});void store.enqueue('settings',{topicId:e.target.value}).catch(e=>setNotice(errorText(e)));}}>{library.topics.map(t=><option key={t.id} value={t.id}>{t.number} · {t.title}</option>)}</select></label>}{snapshot&&<Modes limit={snapshot.settings.dailyNewLimit} onMode={n=>void mode(n)} busy={busy}/>}<p className="side-copy">先回忆，再核对。<br/>把解题思路留在脑海里。</p>
    <nav aria-label="学习方式">{[['review','今日复习'],['map','记忆地图'],['history','学习中心'],['data','数据与设置'],['guide','怎么记得住']].map(([page,label])=><button key={page} disabled={busy} className={`nav-button ${route.page===page?'active':''}`} aria-current={route.page===page?'page':undefined} onClick={()=>navigate(page==='review'?'history':page,{tab:page==='review'?'board':'overview'})}>{label}<span>{page==='review'&&model?model.due.length+model.fresh.length:'↗'}</span></button>)}</nav>
    <div className="daily-box"><span className="eyebrow">每天一小步</span><p><strong>{learning?.today.length||0}</strong> 道今天已完成</p><p className="muted">{timeZone()} · 共享学习日</p></div><div className="save-indicator"><span role="status" data-status={store.status}>{store.statusMessage}</span>{['offline','blocked','conflict'].includes(store.status)&&<button className="text-button" onClick={()=>void retry()}>重新连接 / 重试保存</button>}{(store.queue.length>0||store.blocked)&&<button className="text-button" onClick={()=>{setPopup(null);setPendingOpen(true);}}>处理待保存内容（{store.queue.length}）</button>}</div><details className="backup"><summary>保存与备份</summary><p>进度和草稿在服务端 SQLite 中共享。</p><button className="text-button" onClick={()=>void exportData()}>{store.queue.length||store.blocked?'导出待保存内容':'导出已提交记录 JSON'}</button><button className="text-button" disabled={!snapshot} onClick={()=>importInput.current?.click()}>导入 JSON</button></details></aside>
    <main id="main" tabIndex={-1}>{notice&&<div className="notice" role="status">{notice}{undo&&<button className="text-button" disabled={busy} onClick={()=>void undoEvent(undo.id)}>撤销这次记录</button>}</div>}{loadError&&<p className="warning" role="alert">{loadError} <button className="text-button" onClick={()=>void retry()}>重试连接</button></p>}
    {(!snapshot||!library||!topic)?<p className="loading-copy">正在连接共享数据库并读取题库…</p>:<>
      {route.page==='history'&&<section><div className="section-heading"><div><p className="eyebrow">YOUR LEARNING SPACE</p><h2>学习中心</h2></div></div>{learning?<LearningCenter data={learning} library={library} topic={topic} params={route.params} update={values=>navigate('history',values,true)} start={start} history={uid=>setPopup({type:'history',value:uid})}/>:<p>正在读取学习记录…</p>}</section>}
      {route.page==='review'&&<section><button className="text-button" disabled={busy} onClick={()=>navigate('history',{tab:'board'})}>← 返回复习看板</button><div className="section-heading"><h2>{attempt?.kind==='code'?'把思路写成代码。':'今天，记住一点点。'}</h2></div>{attempt?.practice&&<div className="practice-note">自由练习记录能力与历史，不改复习日期。{!!previous.length&&<button className="text-button" disabled={busy} onClick={()=>{showAttempt(previous.at(-1)!);setPrevious(previous.slice(0,-1));}}>返回原来的练习</button>}</div>}{attempt&&card&&owner?<StudyCard key={attempt.operationId} attempt={attempt} card={card} topic={owner} library={library} snapshot={snapshot} store={store} busy={busy} change={patch=>setAttempt(old=>old?{...old,...patch}:old)} submit={()=>void submit()} practice={kind=>{setPrevious([...previous,attempt]);start(card.uid,kind,true);}} concepts={()=>setPopup({type:'concept',value:card.uid})} related={uid=>setPopup({type:'related',value:uid})} onError={setNotice}/>:<div className="empty-state"><h3>给记忆一点时间。</h3><p>当前没有正在练习的题目。到期题覆盖所有专题，新题从当前专题开始。</p><button className="primary" onClick={next}>检查到期题目</button><button className="text-button" onClick={()=>navigate('map')}>选一道，合上答案默写</button></div>}</section>}
      {route.page==='map'&&<section><div className="section-heading"><h2>沿着思路，把题连起来。</h2></div><MemoryMap library={library} topic={topic} snapshot={snapshot} search={route.params.get('search')||''} onSearch={search=>navigate('map',{search},true)} start={start} connections={uid=>setPopup({type:'connections',value:uid})}/></section>}
      {route.page==='data'&&<section><div className="section-heading"><h2>数据与设置</h2></div><DataSettings store={store} snapshot={snapshot} onMode={n=>void mode(n)} onRestore={name=>{setRestoreConfirmed(false);setPopup({type:'restore',value:name});}} onExport={()=>void exportData()} onImport={()=>importInput.current?.click()} notice={setNotice}/></section>}
      {route.page==='guide'&&<section><div className="section-heading"><h2>从每天 15 分钟开始。</h2></div><Guide/></section>}
    </>}
    </main></div><input type="file" ref={importInput} accept=".json,application/json" hidden onChange={e=>{const file=e.target.files?.[0];if(file)void importFile(file);e.target.value='';}}/>
    {popup&&<Modal title={popup.type==='restore'?'确认恢复共享数据库':popup.type==='connections'?`从 ${selected?.title||popup.value} 想到什么`:selected?`${selected.id} · ${selected.title}`:popup.value} onClose={()=>setPopup(null)}>
      {popup.type==='concept'&&selectedOwner?.concepts.filter(c=>selected?.prerequisites.includes(c.id)).map(c=><section key={c.id}><h3>{c.title}</h3><p>{c.explanation}</p><pre className="trace">{c.example}</pre></section>)}
      {popup.type==='related'&&selected&&<><p>{selected.prompt}</p><Answer card={selected}/><button className="primary" onClick={()=>{if(attempt)setPrevious([...previous,attempt]);start(selected.uid,'main',true);}}>合上答案，回忆这题</button></>}
      {popup.type==='connections'&&selected&&<><p>{selectedOwner?.connectionRule}</p><div className="callout">先比较条件：原方法还能用吗？需要保留什么新状态？</div><div className="related-list">{selected.related.map(r=><div key={r.id}><strong>{r.id} · {cards.find(c=>c.id===r.id)?.title}</strong><p>{r.why}</p><button className="text-button" onClick={()=>start(`lc-${r.id}`,'main',true)}>先回忆这题</button><button className="text-button" onClick={()=>setPopup({type:'related',value:`lc-${r.id}`})}>查看对比思路</button></div>)}</div></>}
      {popup.type==='history'&&learning&&<Timeline uid={popup.value} data={learning} store={store} onUndo={undoEvent} onStart={()=>start(popup.value,'main',true)}/>}
      {popup.type==='restore'&&<><p>恢复将影响所有参与者的进度、草稿、设置和历史。服务会先备份当前库，并更换数据库标识；其他页面的旧请求需要确认。</p><p className="data-path">{popup.value}</p><label><input type="checkbox" checked={restoreConfirmed} onChange={e=>setRestoreConfirmed(e.target.checked)}/> 我确认恢复这份共享备份</label><div className="practice-actions"><button className="primary" disabled={!restoreConfirmed||!!store.queue.length} onClick={()=>void restore(popup.value)}>确认恢复</button></div></>}
    </Modal>}
    {pendingOpen&&<Modal title="处理待保存内容" onClose={()=>setPendingOpen(false)}>{store.blocked?<><p>损坏的缓存原文已保留。先导出，再明确清理该缓存；不会清空数据库。</p><button className="primary" onClick={exportPending}>导出待恢复原文</button><button className="secondary" disabled={!exportedBroken} onClick={()=>{void store.clearBroken()?.then(()=>setPendingOpen(false)).catch(e=>setNotice(errorText(e)));}}>已备份，清理损坏缓存</button></>:conflict?<><p>{conflict.error?.message}</p>{conflict.error?.detail?.databaseText!==undefined?<><h3>数据库中</h3><pre className="trace conflict-text">{String(conflict.error.detail.databaseText)||'（空）'}</pre><h3>这个页面中</h3><pre className="trace conflict-text">{String(conflict.error.detail.yourText??conflict.payload.text??'')||'（空）'}</pre></>:<><p>原数据库标识：{conflict.databaseId||'缺失'}；当前：{snapshot?.databaseId}</p><pre className="trace conflict-text">{JSON.stringify(conflict.payload,null,2)}</pre></>}<button className="text-button" onClick={exportPending}>先导出待保存内容</button><div className="practice-actions"><button className="secondary" onClick={()=>{void store.resolve(conflict.id,false).then(()=>setPendingOpen(false)).catch(e=>setNotice(errorText(e)));}}>保留数据库版本，跳过这次保存</button>{conflict.error?.detail?.conflict&&<button className="primary" onClick={()=>{void store.resolve(conflict.id,true).then(()=>setPendingOpen(false)).catch(e=>setNotice(errorText(e)));}}>明确将本页内容应用到当前库</button>}</div></>:<><p>{store.queue.length} 项待保存。原请求编号会用于重试。</p><button className="secondary" onClick={()=>void store.sync()}>重试保存</button><button className="text-button" onClick={exportPending}>导出待保存内容</button></>}</Modal>}
  </>;
}
