import type {CommandType, ConflictError, Operation, Payload, Session, Snapshot} from './types';
import {configureClock} from './model/time.js';
import {validate} from './model/review-engine.js';

export const PENDING_KEY = 'shiyi-pending-v2';
const LEGACY_KEY = 'shiyi-leetcode-progress-v1';
const commands: CommandType[] = ['review','undo','note','draft','settings','import','migrate','restore'];
type Waiter = {resolve:(value:Snapshot)=>void;reject:(error:Error)=>void};
type Fetcher = (path:string,options?:RequestInit)=>Promise<Pick<Response,'ok'|'status'|'json'>>;
type StorageLike = Pick<Storage,'getItem'|'setItem'> & Partial<Pick<Storage,'removeItem'>>;
export class DiscardedOperation extends Error {
  constructor(){super('已保留数据库版本；这次待保存内容未写入。');}
}
export class RequestError extends Error {
  status: number;
  detail?: ConflictError['detail'];
  constructor(message:string,status:number,detail?:ConflictError['detail']) {super(message);this.status=status;this.detail=detail;}
}
const message = (error:unknown) => error instanceof Error ? error.message : '暂时无法连接服务。';
const bodyFor = (op:Operation) => JSON.stringify({id:op.id,type:op.type,payload:op.payload,databaseId:op.databaseId});
function validateOperations(value:unknown): Operation[] {
  if (!Array.isArray(value)) throw Error('待保存内容格式无效，原文件未改变。');
  const ids=new Set<string>();
  for (const op of value) {
    if (!op || typeof op.id!=='string' || !op.id || ids.has(op.id) || !commands.includes(op.type) || !op.payload || typeof op.payload!=='object' || Array.isArray(op.payload) || (op.databaseId!==undefined&&typeof op.databaseId!=='string')) throw Error('待保存内容格式无效，原文件未改变。');
    ids.add(op.id);
    if (op.body!==undefined) {
      if (typeof op.body!=='string') throw Error('待保存请求体无效。');
      const saved=JSON.parse(op.body);
      if(JSON.stringify(saved)!==bodyFor(op)) throw Error('待保存请求体与操作不一致，未导入。');
    }
  }
  return structuredClone(value) as Operation[];
}

export class LocalReviewStore {
  fetcher:Fetcher;
  storage:StorageLike;
  onChange:(snapshot:Snapshot|null,result?:Snapshot['result'])=>void;
  onStatus:(message:string,status:string)=>void;
  onConflict:(op:Operation,error:ConflictError)=>void;
  snapshot:Snapshot|null=null;
  sessionInfo:Session|null=null;
  token=''; queue:Operation[]=[];waiters=new Map<string,Waiter[]>();running=false;
  timer:ReturnType<typeof setTimeout>|null=null;
  blocked=false;unprotected=false;status='connecting';statusMessage='正在连接共享数据库…';
  private listeners=new Set<()=>void>();
  private version=0;
  private opening:Promise<Snapshot|null>|null=null;
  private leases=0;
  private managed=false;
  private interval:ReturnType<typeof setInterval>|null=null;
  private migrating=false;
  private focus=()=>{void this.sync();};
  private online=()=>{void (this.snapshot?this.sync():this.open()).catch(error=>this.setStatus(message(error),'offline'));};
  private before=(event:BeforeUnloadEvent)=>{if(this.queue.length||this.blocked){event.preventDefault();event.returnValue='';}};
  constructor({fetcher,storage,onChange=()=>{},onStatus=()=>{},onConflict=()=>{}}:{fetcher?:Fetcher;storage?:StorageLike;onChange?:(snapshot:Snapshot|null,result?:Snapshot['result'])=>void;onStatus?:(message:string,status:string)=>void;onConflict?:(op:Operation,error:ConflictError)=>void}={}) {
    this.fetcher=fetcher || globalThis.fetch.bind(globalThis);
    this.storage=storage || {getItem:key=>globalThis.localStorage.getItem(key),setItem:(key,value)=>globalThis.localStorage.setItem(key,value),removeItem:key=>globalThis.localStorage.removeItem(key)};
    this.onChange=onChange;this.onStatus=onStatus;this.onConflict=onConflict;
    try {const raw=this.storage.getItem(PENDING_KEY);if(raw)this.queue=validateOperations(JSON.parse(raw));}
    catch {this.blocked=true;this.setStatus('损坏的待保存缓存已保留。请先导出原文，再清理缓存。','blocked');}
  }
  id(){return globalThis.crypto.randomUUID();}
  subscribe=(listener:()=>void)=>{this.listeners.add(listener);return ()=>this.listeners.delete(listener);};
  getVersion=()=>this.version;
  private emit(){this.version++;for(const listener of this.listeners)listener();}
  private setStatus(text:string,status:string){this.status=status;this.statusMessage=text;this.onStatus(text,status);this.emit();}
  persist(){if(this.blocked)return;try{this.storage.setItem(PENDING_KEY,JSON.stringify(this.queue));this.unprotected=false;}catch{this.unprotected=true;this.setStatus('浏览器暂存不可用。未保存内容只在本页，请保持页面打开。','offline');}this.emit();}
  async request<T=Snapshot>(path:string,options:RequestInit={},retry=true):Promise<T> {
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),5000);
    try {
      const response=await this.fetcher(path,{...options,cache:'no-store',signal:controller.signal,headers:{...(options.body?{'Content-Type':'application/json'}:{}),'X-Review-Token':this.token,...options.headers}});
      if(response.status===401&&retry){await this.session();return this.request<T>(path,options,false);}
      let result;try{result=await response.json();}catch{throw Error('服务未运行或尚未升级，请重新打开启动文件。');}
      if(!response.ok)throw new RequestError(result.error||'服务暂时不可用。',response.status,result.detail);
      return result as T;
    } finally {clearTimeout(timeout);}
  }
  async session(){const s=await this.request<Session>('/api/session',{},false);if(s.apiVersion!==2)throw Error('请重启拾忆，启用数据库服务。');this.token=s.token;this.sessionInfo=s;configureClock(s.timeZone,s.serverNow);this.emit();}
  open(){
    if(this.opening)return this.opening;
    this.opening=(async()=>{await this.session();this.apply(await this.request('/api/state'));if(!this.blocked)void this.flush();return this.snapshot;})().finally(()=>{this.opening=null;});
    return this.opening;
  }
  apply(snapshot:Snapshot){if(this.snapshot?.databaseId===snapshot.databaseId&&snapshot.revision<this.snapshot.revision)return;this.snapshot=snapshot;this.onChange(this.view(),snapshot.result);this.emit();}
  view(){if(!this.snapshot)return null;const s=structuredClone(this.snapshot);for(const op of this.queue){const p=op.payload;if(op.databaseId!==s.databaseId)continue;if(op.type==='note'&&p.uid)s.state.notes[p.uid]={text:p.text||'',at:s.state.notes[p.uid]?.at??0};if(op.type==='draft'&&p.uid){const k=`${p.uid}:${p.kind}`;s.drafts[k]={text:p.text||'',at:s.drafts[k]?.at??0};}}return s;}
  private wait(id:string){return new Promise<Snapshot>((resolve,reject)=>{const list=this.waiters.get(id)||[];list.push({resolve,reject});this.waiters.set(id,list);});}
  enqueue(type:CommandType,payload:Payload,id?:string){
    if(this.blocked)return Promise.reject(Error('待保存缓存需要先恢复。'));
    if(!this.snapshot)return Promise.reject(Error('尚未连接共享数据库。'));
    let op=id&&this.queue.find(x=>x.id===id);
    if(!op){op={id:id||this.id(),type,payload:structuredClone(payload),databaseId:this.snapshot.databaseId};this.queue.push(op);}
    this.persist();this.setStatus(`${this.queue.length} 项正在保存到共享数据库…`,'saving');
    const result=this.wait(op.id);void this.flush();return result;
  }
  text(type:'note'|'draft',uid:string,kind:Payload['kind'],text:string,expectedAt?:number|null){
    if(!this.snapshot||this.blocked)return Promise.reject(Error('尚未连接或待保存缓存需要恢复。'));
    const existing=[...this.queue].reverse().find(x=>!x.sent&&!x.error&&x.type===type&&x.payload.uid===uid&&x.payload.kind===kind);
    if(existing){existing.payload.text=text;this.persist();return this.wait(existing.id);}
    const doc=type==='note'?this.snapshot.state.notes[uid]:this.snapshot.drafts[`${uid}:${kind}`];
    return this.enqueue(type,{uid,...(kind?{kind}:{}),text,expectedAt:expectedAt===undefined?(doc?.at??null):expectedAt});
  }
  private epochConflict(op:Operation):boolean {
    if(op.databaseId===this.snapshot?.databaseId)return false;
    op.error={message:op.databaseId?'这项操作属于另一份数据库或恢复前的数据库，请明确选择是否应用到当前共享进度。':'这项旧操作缺少数据库标识，请明确选择是否应用到当前共享进度。',status:409,detail:{conflict:'database',originalDatabaseId:op.databaseId??null,currentDatabaseId:this.snapshot?.databaseId}};
    this.persist();return true;
  }
  async flush(){
    if(this.running||this.blocked||!this.snapshot)return;
    if(this.timer)clearTimeout(this.timer);this.running=true;
    try {
      while(this.queue.length){
        const op=this.queue[0];this.epochConflict(op);
        if(op.error){this.setStatus('有一项保存需要处理，其余内容仍保留。','conflict');this.onConflict(op,op.error);break;}
        op.sent=true;op.body??=bodyFor(op);this.persist();
        let response:Snapshot;
        try{response=await this.request('/api/command',{method:'POST',body:op.body});}
        catch(error){
          if(error instanceof RequestError&&error.status>=400&&error.status<500&&error.status!==401){op.error={message:error.message,status:error.status,detail:error.detail};this.persist();this.setStatus('有一项保存需要处理，其余内容仍保留。','conflict');this.onConflict(op,op.error);}
          else{this.setStatus(`服务未连接，${this.queue.length} 项${this.unprotected?'只暂存在本页':'已暂存在浏览器'}，恢复连接后重试。`,'offline');if(!this.managed||this.leases)this.timer=setTimeout(()=>void this.flush(),5000);}
          break;
        }
        this.queue.shift();
        if(op.type==='note'||op.type==='draft'){
          const p=op.payload,at=op.type==='note'?response.state.notes[p.uid!]?.at:response.drafts[`${p.uid}:${p.kind}`]?.at;
          for(const next of this.queue)if(!next.sent&&next.type===op.type&&next.payload.uid===p.uid&&next.payload.kind===p.kind&&next.payload.expectedAt===p.expectedAt)next.payload.expectedAt=at;
        }
        this.persist();this.apply(response);for(const waiter of this.waiters.get(op.id)||[])waiter.resolve(response);this.waiters.delete(op.id);
      }
    }finally{this.running=false;if(!this.queue.length&&!this.blocked)this.setStatus('已保存到共享数据库','saved');}
  }
  async sync(){
    if(this.running||this.blocked)return;
    if(this.queue.length){await this.flush();return;}
    try{await this.session();const s=await this.request('/api/state');if(!this.snapshot||s.revision!==this.snapshot.revision||s.databaseId!==this.snapshot.databaseId)this.apply(s);this.setStatus('已保存到共享数据库','saved');}
    catch(error){this.setStatus(message(error)+' 已有记录仍保存在数据库。','offline');}
  }
  async resolve(id:string,keepLocal:boolean){
    const op=this.queue.find(x=>x.id===id);if(!op)return;
    const latest=await this.request('/api/state');this.snapshot=latest;
    if(keepLocal){const oldId=op.id;op.id=this.id();op.databaseId=latest.databaseId;op.sent=false;delete op.body;delete op.error;if(op.type==='note'||op.type==='draft')op.payload.overwrite=true;this.waiters.set(op.id,this.waiters.get(oldId)||[]);this.waiters.delete(oldId);}
    else{this.queue=this.queue.filter(x=>x.id!==id);for(const waiter of this.waiters.get(id)||[])waiter.reject(new DiscardedOperation());this.waiters.delete(id);}
    this.persist();this.apply(latest);void this.flush();
  }
  importQueue(value:unknown){
    if(this.blocked||!this.snapshot)throw Error('请先连接并处理已有待保存缓存。');
    const incoming=validateOperations(value);
    for(const op of incoming){const existing=this.queue.find(x=>x.id===op.id);if(existing&&bodyFor(existing)!==bodyFor(op))throw Error('同一请求 ID 对应不同内容，未导入。');}
    for(const op of incoming)if(!this.queue.some(x=>x.id===op.id)){this.epochConflict(op);this.queue.push(op);}
    this.persist();void this.flush();return incoming.length;
  }
  exportPending(){return this.blocked?(this.storage.getItem(PENDING_KEY)||''):JSON.stringify({format:'shiyi-pending',version:1,operations:this.queue},null,2);}
  legacyRaw(){return this.storage.getItem(LEGACY_KEY);}
  async migrateLegacy(){
    if(this.migrating||this.blocked||this.queue.length||!this.snapshot)return;
    this.migrating=true;
    try{const raw=this.legacyRaw();if(!raw||raw===this.storage.getItem('shiyi-migrated-v2'))return;const data=validate(JSON.parse(raw));if(Object.keys(data.records).length||Object.keys(data.skills).length||Object.keys(data.notes).length)await this.enqueue('migrate',{data,source:globalThis.location?.origin||'legacy-browser'});this.storage.setItem('shiyi-migrated-v2',raw);}
    finally{this.migrating=false;}
  }
  clearBroken(){if(!this.blocked)return;this.storage.removeItem?.(PENDING_KEY);this.queue=[];this.blocked=false;this.emit();return this.open();}
  settled(){return Promise.all(this.queue.map(op=>this.wait(op.id)));}
  connect(){
    this.managed=true;this.leases++;
    const {focus,online,before}=this;
    if(this.leases===1){this.interval=setInterval(focus,15000);globalThis.addEventListener('focus',focus);globalThis.addEventListener('online',online);globalThis.addEventListener('beforeunload',before);}
    return ()=>{this.leases--;if(!this.leases){if(this.interval)clearInterval(this.interval);if(this.timer)clearTimeout(this.timer);globalThis.removeEventListener('focus',focus);globalThis.removeEventListener('online',online);globalThis.removeEventListener('beforeunload',before);}};
  }
}
let singleton:LocalReviewStore|undefined;
export const getStore=()=>singleton??=new LocalReviewStore();
