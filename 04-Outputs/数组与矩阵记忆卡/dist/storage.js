/* Local database transport. Durable browser outbox is only a retry buffer, never the source of truth. */
(function(root){
  'use strict';
  const KEY='shiyi-pending-v2';
  class LocalReviewStore {
    constructor({fetcher,storage,onChange=()=>{},onStatus=()=>{},onConflict=()=>{}}={}){
      this.fetcher=fetcher||root.fetch.bind(root);this.storage=storage||root.localStorage;
      this.onChange=onChange;this.onStatus=onStatus;this.onConflict=onConflict;
      this.snapshot=null;this.token='';this.queue=[];this.waiters=new Map();this.running=false;this.timer=null;this.blocked=false;this.unprotected=false;
      try{const raw=this.storage.getItem(KEY);if(raw){const parsed=JSON.parse(raw);if(!Array.isArray(parsed)||parsed.some(x=>!x||typeof x.id!=='string'||!x.payload))throw Error('invalid');this.queue=parsed;}}
      catch(error){this.blocked=true;this.onStatus('损坏的待保存缓存已保留。请先导出它，再清理缓存重新连接。','blocked');}
    }
    id(){return root.crypto.randomUUID();}
    persist(){
      if(this.blocked)return;
      try{this.storage.setItem(KEY,JSON.stringify(this.queue));this.unprotected=false;}
      catch(error){this.unprotected=true;this.onStatus('浏览器暂存不可用。未保存内容只在本页，请保持页面打开并连接本地服务。','offline');}
    }
    async request(path,options={},retry=true){
      const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),5000);
      try{
        const response=await this.fetcher(path,{...options,cache:'no-store',signal:controller.signal,headers:{...(options.body?{'Content-Type':'application/json'}:{}),'X-Review-Token':this.token,...options.headers}});
        if(response.status===401&&retry){await this.session();return this.request(path,options,false);}
        let result;try{result=await response.json();}catch(error){throw Error('本地服务尚未升级或未运行，请关闭旧启动窗口后重新打开记忆卡。');}
        if(!response.ok){const error=Error(result.error||'本地服务暂时不可用。');error.status=response.status;error.detail=result.detail;throw error;}
        return result;
      }finally{clearTimeout(timeout);}
    }
    async session(){const s=await this.request('/api/session',{},false);if(s.apiVersion!==2)throw Error('请重启本地记忆卡，启用数据库服务。');this.token=s.token;}
    async open(){await this.session();this.apply(await this.request('/api/state'));if(!this.blocked)this.flush();return this.snapshot;}
    apply(snapshot){this.snapshot=snapshot;this.onChange(this.view(),snapshot.result);}
    view(){
      if(!this.snapshot)return null;
      const s=JSON.parse(JSON.stringify(this.snapshot));
      for(const op of this.queue){
        const p=op.payload;
        if(op.type==='note')s.state.notes[p.uid]={text:p.text,at:s.state.notes[p.uid]?.at??0};
        if(op.type==='draft'){const k=`${p.uid}:${p.kind}`;s.drafts[k]={text:p.text,at:s.drafts[k]?.at??0};}
      }
      return s;
    }
    enqueue(type,payload,id){
      if(this.blocked)return Promise.reject(Error('待保存缓存需要先恢复。'));
      if(!this.snapshot)return Promise.reject(Error('尚未连接本地数据库。'));
      let op=id&&this.queue.find(x=>x.id===id);
      if(!op){op={id:id||this.id(),type,payload,databaseId:this.snapshot.databaseId};this.queue.push(op);}
      this.persist();this.onStatus(`${this.queue.length} 项正在保存到本地数据库…`,'saving');
      const promise=new Promise((resolve,reject)=>{const list=this.waiters.get(op.id)||[];list.push({resolve,reject});this.waiters.set(op.id,list);});
      this.flush();return promise;
    }
    text(type,uid,kind,text,expectedAt){
      const existing=[...this.queue].reverse().find(x=>!x.sent&&x.type===type&&x.payload.uid===uid&&x.payload.kind===kind);
      if(existing){existing.payload.text=text;this.persist();return new Promise((resolve,reject)=>{const w=this.waiters.get(existing.id)||[];w.push({resolve,reject});this.waiters.set(existing.id,w);});}
      const doc=type==='note'?this.snapshot.state.notes[uid]:this.snapshot.drafts[`${uid}:${kind}`];
      return this.enqueue(type,{uid,...(kind?{kind}:{}),text,expectedAt:expectedAt===undefined?(doc?.at??null):expectedAt});
    }
    async flush(){
      if(this.running||this.blocked||!this.snapshot)return;
      clearTimeout(this.timer);this.running=true;
      try{
        while(this.queue.length){
          const op=this.queue[0];if(op.error){this.onConflict(op,op.error);break;}
          op.sent=true;this.persist();
          let response;
          try{response=await this.request('/api/command',{method:'POST',body:JSON.stringify({id:op.id,type:op.type,payload:op.payload,databaseId:op.databaseId})});}
          catch(error){
            if(error.status>=400&&error.status<500&&error.status!==401){op.error={message:error.message,status:error.status,detail:error.detail};this.persist();this.onStatus('有一项保存需要你处理，其余内容仍保留。','conflict');this.onConflict(op,op.error);}
            else{this.onStatus(`本地服务未连接，${this.queue.length} 项${this.unprotected?'只暂存在本页':'已暂存在浏览器'}，连接恢复后重试。`,'offline');this.timer=setTimeout(()=>this.flush(),5000);}
            break;
          }
          this.queue.shift();
          if(op.type==='note'||op.type==='draft'){
            const p=op.payload,newAt=op.type==='note'?response.state.notes[p.uid]?.at:response.drafts[`${p.uid}:${p.kind}`]?.at;
            for(const next of this.queue){if(!next.sent&&next.type===op.type&&next.payload.uid===p.uid&&next.payload.kind===p.kind&&next.payload.expectedAt===p.expectedAt)next.payload.expectedAt=newAt;}
          }
          this.persist();this.apply(response);
          for(const waiter of this.waiters.get(op.id)||[])waiter.resolve(response);
          this.waiters.delete(op.id);
        }
      }finally{this.running=false;if(!this.queue.length&&!this.blocked)this.onStatus('已保存到本地数据库','saved');}
    }
    async sync(){if(this.running||this.queue.length||this.blocked)return;try{const s=await this.request('/api/state');if(!this.snapshot||s.revision!==this.snapshot.revision||s.databaseId!==this.snapshot.databaseId)this.apply(s);this.onStatus('已保存到本地数据库','saved');}catch(error){this.onStatus('本地服务未连接；已有数据仍保存在数据库中。','offline');}}
    async resolve(id,keepLocal){
      const op=this.queue.find(x=>x.id===id);if(!op)return;
      const latest=await this.request('/api/state');this.snapshot=latest;
      if(keepLocal){
        const oldId=op.id;op.id=this.id();op.databaseId=latest.databaseId;op.sent=false;delete op.error;
        if(op.type==='note'||op.type==='draft')op.payload.overwrite=true;
        this.waiters.set(op.id,this.waiters.get(oldId)||[]);this.waiters.delete(oldId);
      }else{
        this.queue=this.queue.filter(x=>x.id!==id);
        for(const waiter of this.waiters.get(id)||[])waiter.reject(Error('已保留数据库版本；本页待保存内容未写入。'));
        this.waiters.delete(id);
      }
      this.persist();this.apply(latest);this.flush();
    }
    async settled(){if(!this.queue.length)return;await Promise.all(this.queue.map(op=>new Promise((resolve,reject)=>{const list=this.waiters.get(op.id)||[];list.push({resolve,reject});this.waiters.set(op.id,list);})));}
  }
  if(typeof module!=='undefined'&&module.exports)module.exports=LocalReviewStore;else root.LocalReviewStore=LocalReviewStore;
})(typeof window!=='undefined'?window:globalThis);
