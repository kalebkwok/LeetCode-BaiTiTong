import {useEffect, useRef, useState, type ReactNode} from 'react';
import type {Kind, Ratings, Skill, Snapshot, TextDocument} from './types';
import {DiscardedOperation,type LocalReviewStore} from './api';

export const skillNames:Record<Skill,string> = {recognize:'认出方法',explain:'讲清原因',implement:'独立写出'};
export const scores = ['没想起','需要帮助','独立完成'];
export const kindNames:Record<Kind,string> = {main:'识别与解释',followup:'换个角度问',code:'合上答案默写'};
export const ratingText = (ratings:Ratings) => Object.entries(ratings).map(([k,v])=>`${skillNames[k as Skill]}：${scores[v!]}`).join(' · ');
export const errorText = (error:unknown) => error instanceof Error ? error.message : '操作未完成，请重试。';
export function download(text:string,name:string){
  const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download=name;link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function Modal({title,children,onClose}:{title:string;children:ReactNode;onClose:()=>void}){
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const dialog=ref.current!;dialog.showModal();return()=>dialog.close();},[]);
  return <dialog ref={ref} aria-labelledby="reference-title" onCancel={onClose} onClose={e=>{if(!e.currentTarget.open)onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="dialog-header"><h2 id="reference-title">{title}</h2><button className="secondary" onClick={onClose} aria-label="关闭详情">关闭 ×</button></div>
    <div id="reference-body">{children}</div>
  </dialog>;
}
export function Modes({limit,onMode,busy=false}:{limit:number;onMode:(limit:number)=>void;busy?:boolean}){
  return <div className="mode-picker" aria-label="学习模式">{[3,20].map(n=><button key={n} disabled={busy} aria-pressed={limit===n} data-mode={n===3?'casual':'crazy'} onClick={()=>onMode(n)}><strong>{n===3?'休闲模式':'疯狂模式'}</strong><span>每天最多 {n} 道新题</span></button>)}{![3,20].includes(limit)&&<p className="fine-print">保留旧设置：每日 {limit} 道。切换模式不重置今天的额度。</p>}</div>;
}

// Local input state keeps IME and selection stable while confirmed snapshots refresh.
export function DraftInput({store,snapshot,uid,kind,type='draft',label,readOnly=false,onError}:{store:LocalReviewStore;snapshot:Snapshot;uid:string;kind?:Kind;type?:'note'|'draft';label:string;readOnly?:boolean;onError:(message:string)=>void}){
  const getDoc=(s:Snapshot|null):TextDocument|undefined=>type==='note'?s?.state.notes[uid]:s?.drafts[`${uid}:${kind}`];
  const doc=getDoc(snapshot), confirmed=getDoc(store.snapshot);
  const [value,setValue]=useState(doc?.text||''),[focused,setFocused]=useState(false);
  const latest=useRef(value),dirty=useRef(false),at=useRef<number|null>(confirmed?.at??null);
  useEffect(()=>{if(!focused&&!dirty.current){setValue(doc?.text||'');latest.current=doc?.text||'';at.current=confirmed?.at??null;}},[doc?.text,confirmed?.at,focused]);
  function change(text:string){
    setValue(text);latest.current=text;dirty.current=true;
    void store.text(type,uid,kind,text,at.current).then(result=>{
      at.current=getDoc(result)?.at??null;
      if(latest.current===text)dirty.current=false;
    }).catch(error=>{
      if(error instanceof DiscardedOperation){
        const current=getDoc(store.view());dirty.current=false;latest.current=current?.text||'';
        setValue(latest.current);at.current=getDoc(store.snapshot)?.at??null;
      }
      onError(errorText(error));
    });
  }
  return <label className="draft-label">{label}<textarea aria-label={label} value={value} spellCheck={false} readOnly={readOnly} maxLength={type==='note'?1500:50000} rows={type==='note'?2:8} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onChange={e=>change(e.target.value)}/></label>;
}
