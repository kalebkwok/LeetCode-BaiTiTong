(() => {
  'use strict';
  const E = window.ReviewEngine, library = window.REVIEW_LIBRARY;
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const STORAGE_KEY = 'shiyi-leetcode-progress-v1';
  const labels = {recognize:'认出方法',explain:'讲清原因',implement:'独立写出'};
  const scores = ['没想起','需要帮助','独立完成'];
  const typeLabels = {main:'识别与解释',followup:'换个角度问',code:'合上答案默写'};
  let state = E.empty(), topic = library.topics.find(t=>t.id==='arrays-matrices-03') || library.topics[0], view = 'review', current = null;
  let revealed = false, hintLevel = 0, usedHelp = false, undo = null, scratch = '', writing = false, ready = false;
  let bootstrapBusy=false, conflict=null;
  let scratchAt=null;
  let drafts={}, settings={dailyNewLimit:3,topicId:'arrays-matrices-03'};
  let returnAttempt = null, activeDay = E.dayKey(Date.now());
  const allCards = library.topics.flatMap(t=>t.cards);
  const findCard = uid => allCards.find(c=>c.uid===uid);
  const topicFor = uid => library.topics.find(t=>t.cards.some(c=>c.uid===uid));
  function warning(message) { $('#storage-warning').textContent = message; $('#storage-warning').hidden = !message; }
  function notice(message, allowUndo=false) {
    $('#notice').hidden = false;
    $('#notice').innerHTML = escape(message) + (allowUndo ? '<button class="text-button undo" id="undo-btn">撤销这次记录</button>' : '');
    if (allowUndo) $('#undo-btn').onclick = ()=>undoReview();
  }
  const store=new window.LocalReviewStore({
    onChange:snapshot=>{
      state=snapshot.state;drafts=snapshot.drafts;settings=snapshot.settings;
      if(ready){updateStats();if(view==='map')renderMap();center.invalidate();}
    },
    onStatus:(message,status)=>{
      $('#connection-status').textContent=message;$('#connection-status').dataset.status=status;
      $('#retry-save').hidden=!['offline','blocked','conflict'].includes(status);
      $('#pending-help').hidden=!['blocked','conflict'].includes(status);
    },
    onConflict:(op,error)=>{conflict={op,error};$('#pending-help').hidden=false;showConflict();}
  });
  const center=new window.LearningCenter({element:$('#learning-center'),library,
    request:path=>store.request(path),getContext:()=>({topicId:topic.id}),
    onStart:uid=>{
      if(!ready||writing)return;
      const card=findCard(uid);if(!card)return;
      const record=state.records[uid];
      const fresh=dailyQueue().some(x=>x.uid===uid&&!record);
      if((record&&record.due<=Date.now())||fresh){returnAttempt=null;start({uid,kind:record?.phase||'main'});}
      else openPractice(uid);
    },
    onUndo:eventId=>undoReview(eventId),onNotice:notice,onData:()=>updateStats(),isVisible:()=>view==='history'
  });
  function renderModes(){
    document.querySelectorAll('.mode-picker').forEach(el=>{
      el.innerHTML=Object.entries(window.LearningModel.modes).map(([key,m])=>`<button type="button" data-mode="${key}" aria-pressed="${settings.dailyNewLimit===m.limit}" ${!ready||writing?'disabled':''}><strong>${m.label}</strong><span>每天最多 ${m.limit} 道新题</span></button>`).join('')+(![3,20].includes(settings.dailyNewLimit)?`<p class="fine-print">当前保留旧设置：每天 ${settings.dailyNewLimit} 道新题，选择模式即可切换。</p>`:'');
      el.querySelectorAll('[data-mode]').forEach(button=>button.onclick=async()=>{
        if(!ready||writing)return;
        const mode=window.LearningModel.modes[button.dataset.mode];if(mode.limit===settings.dailyNewLimit)return;
        setBusy(true);
        try{await store.enqueue('settings',{dailyNewLimit:mode.limit});notice(`已切换到${mode.label}：每天最多 ${mode.limit} 道新题，沿用今天已学数量。`);}
        catch(error){notice(error.message);}finally{setBusy(false);renderModes();}
      });
    });
  }
  const draftKey=(uid,kind)=>`${uid}:${kind}`;
  function dailyQueue(){
    const now=Date.now();
    const due=allCards.filter(c=>state.records[c.uid]?.due<=now).sort((a,b)=>state.records[a.uid].due-state.records[b.uid].due).map(c=>({uid:c.uid,kind:state.records[c.uid].phase}));
    const fresh=E.queue(state,topic.cards,now,settings.dailyNewLimit).filter(x=>!state.records[x.uid]);
    return [...due,...fresh];
  }
  function setBusy(value){
    writing=value;
    document.querySelectorAll('nav button,#topic-select,#back-review,#back-board,.mode-picker button').forEach(el=>el.disabled=value||!ready);
    const button=$('#rating-form button[type="submit"]');if(button){button.disabled=value;button.textContent=value?'正在保存…':current?.practice?'保存自评，结束练习':'保存自评，下一题';}
  }
  async function bootstrap(){
    if(bootstrapBusy)return;bootstrapBusy=true;
    try{
      await store.open();
      await store.settled();
      let raw,marked;
      try{raw=localStorage.getItem(STORAGE_KEY);marked=localStorage.getItem('shiyi-migrated-v2');}catch(error){/* Browser migration is optional when storage is unavailable. */}
      if(raw&&raw!==marked){
        let legacy;
        try{legacy=E.validate(JSON.parse(raw));}catch(error){warning('旧浏览器进度格式异常，原文已保留。可在“数据与设置”导出旧数据；数据库仍可使用。');}
        if(legacy){
          const nonempty=Object.keys(legacy.records).length||Object.keys(legacy.skills).length||Object.keys(legacy.notes).length;
          if(nonempty){await store.enqueue('migrate',{data:legacy,source:location.origin});notice('已将此浏览器的旧进度迁入数据库，原始浏览器数据仍保留。');}
          try{localStorage.setItem('shiyi-migrated-v2',raw);}catch(error){/* Server migration receipts prevent duplicate imports. */}
        }
      }
      topic=library.topics.find(t=>t.id===settings.topicId)||topic;
      ready=true;updateTopic();setBusy(false);selectView('history');
    }catch(error){warning(error.message||'尚未连接本地数据库。请重新打开启动文件，然后点“重新连接”。');$('#retry-save').hidden=false;}
    finally{bootstrapBusy=false;}
  }
  function displayTime(time) {
    if (!Number.isFinite(time)) return '';
    const remaining = time-Date.now();
    if (remaining <= 0) return '现在可复习';
    if (remaining < 3600000) return `${Math.ceil(remaining/60000)} 分钟后`;
    return new Date(time).toLocaleString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
  }
  function updateStats() {
    const s=E.stats(state,topic.cards),global=E.stats(state,allCards),queue=dailyQueue();
    $('#due-badge').textContent=queue.length;
    $('#reviewed-count').textContent=center.data&&window.LearningModel.dayKey(center.data.generatedAt)===window.LearningModel.dayKey(Date.now())?center.data.today.length:global.reviewed;
    $('#learned-label').textContent=`本专题已开始 ${s.started} / ${topic.cards.length} 题`;
    $('#learned-bar').style.width=`${s.started/topic.cards.length*100}%`;
    $('#session-count').textContent=current?.practice?'自由练习':`${global.due} 到期旧题 · ${queue.filter(x=>!state.records[x.uid]).length} 新题`;
    $('#daily-rule').textContent=`${window.LearningModel.modeLabel(settings.dailyNewLimit)} · 所有专题合计每天最多 ${settings.dailyNewLimit} 道新题。到期旧题统一优先，新题从当前专题开始。`;
    renderModes();
  }
  function selectView(next) {
    view = next;
    for (const name of ['review','map','history','data','guide']) {
      $(`#${name}-view`).hidden = name!==next;
      $(`#${name}-tab`).classList.toggle('active', name===next);
      if (name===next) $(`#${name}-tab`).setAttribute('aria-current','page'); else $(`#${name}-tab`).removeAttribute('aria-current');
    }
    if (next==='map') renderMap();
    if (next==='history') center.show();
    if (next==='data') loadData();
    updateStats();
  }
  function start(attempt, scroll=true) {
    if (!attempt) { current=null; renderEmpty(); selectView('review'); return; }
    topic=topicFor(attempt.uid);updateTopic();
    scratch=drafts[draftKey(attempt.uid,attempt.kind)]?.text||'';
    scratchAt=store.snapshot.drafts[draftKey(attempt.uid,attempt.kind)]?.at??null;
    current = {...attempt,practice:!!attempt.practice,operationId:store.id()};
    revealed=false;hintLevel=0;usedHelp=false;writing=false;
    $('#practice-note').hidden = !current.practice;
    $('#session-title').textContent = current.kind==='code' ? '把思路写成代码。' : current.practice ? '换个角度，再想一次。' : '今天，记住一点点。';
    renderCard();selectView('review');
    if (scroll) { $('#main').focus({preventScroll:true}); $('#review-view').scrollIntoView({block:'start'}); }
  }
  function nextDue(scroll=true) { returnAttempt=null; start(dailyQueue()[0],scroll); }
  function openPractice(uid,kind='main',keepReturn=false) {
    const owner=topicFor(uid);if(!owner||!ready||writing)return;
    if(!keepReturn)returnAttempt=null;
    if(owner!==topic){topic=owner;updateTopic();saveTopic();}
    start({uid,kind,practice:true});
  }
  function rememberAttempt() { return current ? {current:{...current},revealed,hintLevel,usedHelp,scratch,scratchAt,returnTo:returnAttempt} : null; }
  function restoreAttempt() {
    if (!returnAttempt) { nextDue();return; }
    const saved = returnAttempt;returnAttempt=saved.returnTo||null;
    topic=topicFor(saved.current.uid);updateTopic();saveTopic();
    current=saved.current;revealed=saved.revealed;hintLevel=saved.hintLevel;usedHelp=saved.usedHelp;scratch=saved.scratch;scratchAt=saved.scratchAt??null;
    $('#practice-note').hidden=!current.practice;
    $('#session-title').textContent=current.kind==='code'?'把思路写成代码。':current.practice?'换个角度，再想一次。':'今天，记住一点点。';
    renderCard();selectView('review');
  }
  function renderEmpty() {
    $('#card').hidden=true;$('#empty-state').hidden=false;$('#practice-note').hidden=true;
    const s=E.stats(state,allCards), unseen=topic.cards.filter(c=>!state.records[c.uid]).length;
    $('#session-title').textContent='这一轮完成了。';
    const next = Number.isFinite(s.nextDue) ? `下一题：${displayTime(s.nextDue)}。` : '';
    $('#empty-state').innerHTML=`<span class="empty-mark" aria-hidden="true">✓</span><h3>给记忆一点时间。</h3><p>今天已复习 ${s.reviewed} 道题。${escape(next)}</p><p>${unseen ? `每日新题上限为 ${settings.dailyNewLimit} 道；可以到数据与设置调整。` : '本专题的题目都已开始，之后按复习日期回来。'}现在可以选一道默写，或结束今天的练习。</p><button id="pick-practice" class="primary">选一道，合上答案默写</button><button id="refresh-due" class="text-button">检查到期题目</button>`;
    $('#pick-practice').onclick=()=>selectView('map');$('#refresh-due').onclick=()=>nextDue();
    updateStats();
  }
  function answerMarkup(c) {
    return `<p class="eyebrow">一句话记住</p><p class="mnemonic">${escape(c.mnemonic)}</p><p class="why">${escape(c.why)}</p><div class="callout"><strong>关键变量一直表示什么</strong><p>${escape(c.invariant)}</p></div><h4>怎么一步步写出来</h4><ol class="steps">${c.steps.map(s=>`<li>${escape(s)}</li>`).join('')}</ol><div class="trap"><strong>容易错的地方</strong><br>${escape(c.trap)}</div><p class="complexity">${escape(c.complexity)}</p><details class="code-details"><summary>${escape(c.traceLabel||'手推一遍例子')}</summary><pre class="trace">${escape(c.trace)}</pre></details>`;
  }
  function renderCard() {
    const c = findCard(current.uid), kind = current.kind;
    $('#card').hidden=false;$('#empty-state').hidden=true;
    const isFollow=kind==='followup', isCode=kind==='code';
    const previousMistake=state.notes[c.uid]?.text;
    const question=isFollow?c.followup.prompt:c.prompt;
    $('#card').innerHTML=`<div class="card-body"><div class="card-meta"><span>LEETCODE ${c.id}</span><span class="pill">${escape(c.level)}</span><span>${typeLabels[kind]}</span></div><h3>${escape(c.title)}</h3><p class="problem">${escape(question)}</p>${isFollow?`<details class="scratch"><summary>题目背景</summary><p>${escape(c.prompt)}</p></details>`:`<pre class="example">${escape(c.example)}</pre>`}
      ${previousMistake?`<p class="mistake-prompt">这次也检查一下：${escape(previousMistake)}</p>`:''}
      <p class="recall-title">${isCode?'合上参考，写完整函数，再手推一个边界输入。':isFollow?'先解释，再用一个例子验证。':'先花 30 秒，在脑海里回答'}</p>
      ${kind==='main'?'<ol class="recall-list"><li>用什么办法？</li><li>关键变量是什么？</li><li>为什么这样做？</li></ol>':''}
      <details class="scratch" ${isCode||scratch?'open':''}><summary>${isCode?'Python 默写区':'写下我的思路（可选）'}</summary><label for="scratch" class="muted">${isCode?'代码自动保存到本机；这里不运行代码，完成后与参考自查。':'也可以口述。思路与默写分别自动保存，刷新后仍可继续。'}</label><textarea id="scratch" maxlength="50000" spellcheck="false" placeholder="${isCode?'def solve(...):':'方法 / 关键变量 / 边界'}" ${revealed?'readonly':''}>${escape(scratch)}</textarea></details>
      <div id="hint-box" class="hint-box" ${hintLevel?'':'hidden'}>${hintContent(c)}</div>
      <div id="help-actions" class="help-actions" ${revealed?'hidden':''}><button id="hint-btn" class="secondary" ${hintLevel>=3?'disabled':''}>${hintLevel?'再给一层提示':'给我一点提示'}${hintLevel?` · ${hintLevel}/3`:''}</button><button id="concept-btn" class="text-button">补一个相关概念</button></div>
      </div>
      <div class="card-actions" ${revealed?'hidden':''}><button id="reveal" class="primary">${isCode?'写完了，对照代码':'我想好了，核对答案'}<span class="key">Space</span></button><span class="muted">先尝试，再展开</span></div>
      <div id="answer" ${revealed?'':'hidden'}>${revealed?renderAnswer(c):''}</div>`;
    $('#scratch').addEventListener('input',event=>{scratch=event.target.value;store.text('draft',c.uid,kind,scratch,scratchAt).then(response=>{if(current?.uid===c.uid&&current?.kind===kind)scratchAt=response.drafts[draftKey(c.uid,kind)]?.at??null;}).catch(error=>notice(error.message));});
    $('#hint-btn').onclick=showHint;$('#concept-btn').onclick=()=>openConcepts(c);
    $('#reveal').onclick=reveal;
    if (revealed) bindAnswer(c);
  }
  function hintContent(c) {
    if (!hintLevel) return '';
    const messages=[c.hint,`关键观察：${c.recognition}`,c.steps.join('\n')];
    return messages.slice(0,hintLevel).map((t,i)=>`<p><strong>提示 ${i+1}</strong> · ${escape(t).replace(/\n/g,'<br>')}</p>`).join('');
  }
  function showHint() { if (revealed || hintLevel>=3) return;hintLevel++;usedHelp=true;renderCard();$('#hint-box').scrollIntoView({block:'nearest'}); }
  function reveal() {
    if (!current || revealed) return;
    revealed=true;renderCard();$('#answer').scrollIntoView({block:'start'});
    $('#answer-heading')?.focus({preventScroll:true});
  }
  function renderAnswer(c) {
    const keys = current.kind==='main'?['recognize','explain']:current.kind==='code'?['implement']:['explain'];
    const code=`${c.codeNote?`<p class="muted">${escape(c.codeNote)}</p>`:''}<pre class="solution-code"><code>${escape(c.code)}</code></pre>`;
    const explanation=current.kind==='main'?answerMarkup(c):current.kind==='code'?code:`<p class="follow-answer">${escape(c.followup.answer)}</p><details class="code-details"><summary>回到这道题的完整思路</summary>${answerMarkup(c)}</details>`;
    return `<div class="answer"><h4 id="answer-heading" tabindex="-1" class="answer-heading">${current.kind==='code'?'参考代码':'核对刚才的回答'}</h4>${explanation}</div>
      <form id="rating-form" class="rating-area"><p>只评价刚才合上答案时的表现。${usedHelp?'本次用过提示或概念，最高记录为“需要帮助”。':''}</p>
      ${keys.map(key=>`<fieldset class="skill-rating"><legend>${labels[key]}</legend><div class="rating-options">${scores.map((label,value)=>`<label><input type="radio" name="${key}" value="${value}" required ${usedHelp&&value===2?'disabled':''}><span>${label}</span></label>`).join('')}</div></fieldset>`).join('')}
      <label for="mistake" class="note-label">下次最想检查的一个卡点</label><textarea id="mistake" maxlength="1500" rows="2" placeholder="例如：为什么这次更新必须读取上一轮的状态？">${escape(state.notes[c.uid]?.text||'')}</textarea><p class="muted" id="note-status">卡点自动保存到本地数据库，下次会再次提醒。</p>
      <div class="submit-row"><button class="primary" type="submit">${current.practice?'保存自评，结束练习':'保存自评，下一题'}</button><span id="schedule-preview" class="muted">${current.practice?'自由练习不改复习日期':'选择后显示下次复习时间'}</span></div></form>
      <div class="answer extras">${current.kind!=='code'?`<details class="code-details"><summary>查看 Python 参考代码</summary>${code}</details>`:''}
      <div class="practice-actions">${current.kind!=='followup'?'<button class="text-button" id="followup-btn">换个问题自测</button>':''}${current.kind!=='code'?'<button class="text-button" id="code-btn">合上答案，默写这题</button>':''}</div>
      <details class="code-details"><summary>相关概念与容易混淆的题</summary><h4>看到什么，想到这个方法</h4><p>${escape(c.recognition)}</p>${c.prerequisites.map(id=>{const concept=topic.concepts.find(x=>x.id===id);return `<button type="button" class="concept-chip" data-concept="${escape(id)}">${escape(concept.title)}</button>`;}).join('')}<div class="related-list">${c.related.map(r=>{const other=findCard(`lc-${r.id}`);return `<div><span class="relation-kind">${escape(r.kind||'思路联系')}</span><strong>${r.id} · ${escape(other.title)}</strong><p>${escape(r.why)}</p><button type="button" class="text-button" data-related="lc-${r.id}">打开对比题</button></div>`;}).join('')}</div></details>
      <div class="links"><a href="notes/${escape(c.uid)}.html" target="_blank" rel="noopener">本地原题解</a><a href="${escape(c.noteUrl)}">在 Obsidian 中打开</a><a href="${escape(c.url)}" target="_blank" rel="noreferrer">题目页面</a></div></div>`;
  }
  function readRatings() { const data=new FormData($('#rating-form'));return Object.fromEntries([...data.entries()].map(([k,v])=>[k,Number(v)])); }
  function bindAnswer(c) {
    $('#rating-form').addEventListener('change',()=>{
      const ratings=Object.values(readRatings());
      if (ratings.length) $('#schedule-preview').textContent=current.practice?'自由练习不改复习日期':`下次：${E.schedule(state.records[c.uid],Math.min(...ratings)).label}`;
    });
    let noteAt=store.snapshot.state.notes[c.uid]?.at??null;
    $('#mistake').oninput=event=>{
      const text=event.target.value;$('#note-status').textContent='正在保存卡点…';
      store.text('note',c.uid,undefined,text,noteAt).then(response=>{noteAt=response.state.notes[c.uid]?.at??null;if(current?.uid===c.uid&&$('#note-status'))$('#note-status').textContent='卡点已写入数据库。';}).catch(error=>notice(error.message));
    };
    $('#rating-form').onsubmit=event=>{event.preventDefault();submitReview();};
    $('#followup-btn')?.addEventListener('click',()=>{returnAttempt=rememberAttempt();openPractice(c.uid,'followup',true);});
    $('#code-btn')?.addEventListener('click',()=>{returnAttempt=rememberAttempt();openPractice(c.uid,'code',true);});
    document.querySelectorAll('[data-concept]').forEach(btn=>btn.onclick=()=>openConcepts(c,btn.dataset.concept));
    document.querySelectorAll('[data-related]').forEach(btn=>btn.onclick=()=>{
      openRelated(btn.dataset.related);
    });
  }
  async function submitReview() {
    if(!ready||!current||!revealed||writing||!$('#rating-form').reportValidity())return;
    const attempt={...current},prior=rememberAttempt();setBusy(true);
    try{
      const result=await store.enqueue('review',{uid:attempt.uid,kind:attempt.kind,practice:attempt.practice,ratings:readRatings(),usedHelp},attempt.operationId);
      undo={eventId:result.result.eventId,attempt:prior};
      if(attempt.practice){if(returnAttempt)restoreAttempt();else{current=null;selectView('map');}}else nextDue();
      notice(result.result.label,true);
    }catch(error){notice(error.message);}
    finally{setBusy(false);}
  }
  async function undoReview(eventId){
    const id=eventId||undo?.eventId;if(!id||writing)return;
    setBusy(true);
    try{
      const result=await store.enqueue('undo',{eventId:id});
      if(!eventId&&undo?.eventId===id){returnAttempt=undo.attempt;undo=null;restoreAttempt();if(current)current.operationId=store.id();}
      if(eventId&&undo?.eventId===id)undo=null;
      notice(result.result.label);if(view==='history')center.load();
    }catch(error){notice(error.message);}
    finally{setBusy(false);}
  }
  function openRelated(uid) {
    const c=findCard(uid);
    const dialog=$('#reference-dialog');
    $('#reference-title').textContent=`${c.id} · ${c.title}`;
    $('#reference-body').innerHTML=`<p class="eyebrow">${escape(topicFor(uid).number)} · ${escape(topicFor(uid).title)}</p><p>${escape(c.prompt)}</p>${answerMarkup(c)}<button class="primary" id="related-practice">合上答案，回忆这题</button>`;
    $('#related-practice').onclick=()=>{dialog.close();openPractice(uid);};
    dialog.showModal();
  }
  function connectionMarkup(c) {
    return c.related.map(r=>{
      const other=findCard(`lc-${r.id}`),owner=topicFor(other.uid);
      return `<div><span class="relation-kind">${escape(r.kind||'思路联系')}</span><strong>${r.id} · ${escape(other.title)}</strong><span class="muted">${escape(owner.number)} · ${escape(owner.title)}</span><p>${escape(r.why)}</p><button class="text-button" data-connection-practice="${other.uid}">先回忆这题</button><button class="text-button" data-connection-answer="${other.uid}">查看对比思路</button></div>`;
    }).join('');
  }
  function openConnections(uid) {
    const c=findCard(uid),owner=topicFor(uid),dialog=$('#reference-dialog');
    $('#reference-title').textContent=`从 ${c.id} · ${c.title} 想到什么`;
    $('#reference-body').innerHTML=`<p class="muted">${escape(owner.connectionRule||'比较题目条件，再解释方法的相同与不同。')}</p><div class="callout"><strong>先比较，再打开</strong><p>条件变了什么？原方法还能用吗？需要保留哪个新状态？</p></div><div class="related-list">${connectionMarkup(c)}</div>`;
    $('#reference-body').querySelectorAll('[data-connection-practice]').forEach(b=>b.onclick=()=>{dialog.close();openPractice(b.dataset.connectionPractice);});
    $('#reference-body').querySelectorAll('[data-connection-answer]').forEach(b=>b.onclick=()=>{dialog.close();openRelated(b.dataset.connectionAnswer);});
    dialog.showModal();
  }
  function openConcepts(c,only) {
    if(!revealed)usedHelp=true;
    const concepts=topic.concepts.filter(x=>only?x.id===only:c.prerequisites.includes(x.id));
    $('#reference-title').textContent=only?concepts[0].title:'补一个概念，再回来想';
    $('#reference-body').innerHTML=concepts.map(x=>`<section><h3>${escape(x.title)}</h3><p>${escape(x.explanation)}</p><pre class="trace">${escape(x.example)}</pre></section>`).join('');
    $('#reference-dialog').showModal();
  }
  function renderMap() {
    const query=$('#problem-search').value.trim().toLowerCase();
    const terms=query.split(/\s+/).filter(Boolean);
    const scope=query?library.topics:[topic];
    const matches=c=>terms.every(term=>`${c.id} lc-${c.id} ${c.title} ${c.prompt} ${c.mnemonic} ${c.recognition} ${c.invariant} ${topicFor(c.uid).title}`.toLowerCase().includes(term));
    const count=scope.reduce((sum,t)=>sum+t.cards.filter(matches).length,0);
    $('#map-heading').textContent=query?`${count} 道相关题，跨专题对照。`:`${topic.cards.length} 道题，${topic.groups.length} 条思路。`;
    $('#connection-rule').textContent=query?'同一个关键词可能对应不同约束。先比较题干，再点“关联”理解方法何时相同、何时改变。':topic.connectionRule||'先记“看到什么，想到什么”。点一道题，自测一下。';
    $('#search-summary').textContent=query?`已搜索全部 ${allCards.length} 道题。清空搜索可返回当前专题。`:'点“关联”查看每道题的迁移关系与易混淆点。';
    $('#memory-map').innerHTML=scope.map(t=>t.groups.map(group=>{
      const cards=t.cards.filter(c=>c.group===group.id&&matches(c));if(!cards.length)return '';
      return `<section class="map-group"><h3>${query?`${escape(t.number)} · ${escape(t.title)} / `:''}${escape(group.title)}</h3><p>${escape(group.description)}</p><div class="map-list">${cards.map(c=>{
        const r=state.records[c.uid], skills=state.skills[c.uid]||{};
        return `<article class="map-card"><div class="map-meta"><span>LC ${c.id} · ${escape(c.level)}</span><span>${r?escape(displayTime(r.due)):'未开始'}</span></div><strong>${escape(c.title)}</strong><p>${escape(c.mnemonic)}</p><div class="skill-status">${Object.entries(labels).map(([key,label])=>`<span class="skill-${skills[key]?.value??'unrated'}">${label}：${skills[key]?scores[skills[key].value]:'未评'}</span>`).join('')}</div>${state.notes[c.uid]?.text?`<p class="map-mistake">卡点：${escape(state.notes[c.uid].text)}</p>`:''}<div class="map-actions"><button class="text-button" data-main="${c.uid}">回忆</button><button class="text-button" data-follow="${c.uid}">追问</button><button class="text-button" data-code="${c.uid}">${drafts[draftKey(c.uid,'code')]?.text?'继续默写':'默写'}</button><button class="text-button" data-connections="${c.uid}" aria-label="查看 ${escape(c.title)} 的关联题">关联 · ${c.related.length}</button></div></article>`;
      }).join('')}</div></section>`;
    }).join('')).join('') || '<p class="empty-state">暂时没有匹配的题目。试试题号、中文题名，或更短的思路线索。</p>';
    document.querySelectorAll('[data-main]').forEach(b=>b.onclick=()=>openPractice(b.dataset.main));
    document.querySelectorAll('[data-follow]').forEach(b=>b.onclick=()=>openPractice(b.dataset.follow,'followup'));
    document.querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>openPractice(b.dataset.code,'code'));
    document.querySelectorAll('[data-connections]').forEach(b=>b.onclick=()=>openConnections(b.dataset.connections));
  }
  function download(text,name) {
    const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function exportPending(){
    const raw=localStorage.getItem('shiyi-pending-v2');
    if(store.blocked){download(raw||'',`拾忆-待恢复缓存-${Date.now()}.json`);return;}
    download(JSON.stringify({format:'shiyi-pending',version:1,operations:store.queue},null,2),`拾忆-待保存内容-${Date.now()}.json`);
  }
  $('#export-btn').onclick=async()=>{
    try{
      if(store.queue.length){exportPending();notice('已导出尚未提交的内容。连接恢复后会继续保存；可通过导入备份重新提交这个文件。');return;}
      const data=await store.request('/api/export');download(JSON.stringify(data,null,2),`拾忆-完整备份-${new Date().toISOString().slice(0,10)}.json`);notice('已导出进度、草稿、学习历史与设置。');
    }catch(error){notice(error.message);}
  };
  $('#import-btn').onclick=()=>{if(ready&&!writing)$('#import-file').click();};
  $('#import-file').onchange=async event=>{
    const file=event.target.files[0];if(!file)return;
    setBusy(true);
    try{
      if(file.size>16*1024*1024)throw Error('备份超过 16 MB，未导入。');
      const incoming=JSON.parse(await file.text());
      if(incoming.format==='shiyi-pending'){
        if(!Array.isArray(incoming.operations)||incoming.operations.some(op=>!op||!['review','note','draft','settings','undo','migrate','import'].includes(op.type)||!op.payload||typeof op.id!=='string'))throw Error('待保存内容格式无效。');
        for(const op of incoming.operations)await store.enqueue(op.type,op.payload,op.id);
        notice('待保存内容已重新提交；相同请求不会重复计入。');
      }else{
        const result=await store.enqueue('import',{data:incoming});notice(result.result.label);
      }
      undo=null;nextDue();
    }catch(error){notice(error instanceof SyntaxError?'不是有效的 JSON 备份，已有数据未改变。':error.message);}
    finally{setBusy(false);event.target.value='';}
  };
  async function loadData(){
    try{
      const info=await store.request('/api/status');
      renderModes();
      $('#database-info').innerHTML=`<p><strong>SQLite · 已开始 ${info.startedCount} 题 · ${info.reviewCount} 次有效学习记录</strong></p><p class="data-path">${escape(info.databasePath)}</p><p class="muted">进度、能力、卡点、草稿、设置和逐次学习记录都在这个文件中。题库的 Markdown 与 JSON 继续单独维护。</p><p class="muted">自动备份文件夹</p><p class="data-path">${escape(info.backupPath)}</p>${info.backupError?`<p class="warning">${escape(info.backupError)}</p>`:''}<button id="export-legacy" class="text-button">导出这个浏览器的旧版数据</button>`;
      $('#export-legacy').onclick=()=>{let raw;try{raw=localStorage.getItem(STORAGE_KEY);}catch(error){}if(raw)download(raw,'拾忆-旧浏览器原始备份.json');else notice('这个浏览器没有旧版进度。');};
      $('#backup-list').innerHTML=info.backups.map(b=>`<div class="backup-item"><div><strong>${escape(new Date(b.at).toLocaleString('zh-CN'))}</strong><span class="muted">${Math.ceil(b.bytes/1024)} KB · ${escape(b.name.includes('-auto')?'自动备份':b.name.includes('-before-')?'变更前备份':'手动备份')}</span></div><button class="text-button" data-restore="${escape(b.name)}">恢复…</button></div>`).join('')||'<p class="muted">暂时没有备份，点上方按钮创建第一份。</p>';
      $('#backup-list').querySelectorAll('[data-restore]').forEach(b=>b.onclick=()=>confirmRestore(b.dataset.restore,info.backups.find(x=>x.name===b.dataset.restore)));
    }catch(error){$('#database-info').innerHTML=`<p class="warning">${escape(error.message)}</p>`;}
  }
  $('#backup-now').onclick=async()=>{
    const button=$('#backup-now');button.disabled=true;button.textContent='正在创建备份…';
    try{if(store.queue.length)throw Error('还有待保存内容，请先完成保存再创建备份。');await store.request('/api/backup',{method:'POST',body:'{}'});notice('完整数据库备份已创建并通过完整性检查。');await loadData();}
    catch(error){notice(error.message);}finally{button.disabled=false;button.textContent='现在创建备份';}
  };
  function confirmRestore(name,backup){
    if(store.queue.length){notice('还有待保存内容，请先处理完再恢复备份。');return;}
    const dialog=$('#reference-dialog');if(dialog.open)dialog.close();
    $('#reference-title').textContent='恢复到这份备份';
    $('#reference-body').innerHTML=`<p>备份时间：<strong>${escape(new Date(backup.at).toLocaleString('zh-CN'))}</strong></p><p>将用这份备份替换当前进度、草稿、设置和学习历史。恢复前会先保存当前数据库，因此可以回到恢复前的状态。</p><p class="muted">其他打开的页面会同步新状态；来自恢复前的待保存内容需要单独处理。</p><button id="confirm-restore" class="primary">先备份当前数据，再恢复</button>`;
    $('#confirm-restore').onclick=async()=>{
      const button=$('#confirm-restore');button.disabled=true;button.textContent='正在备份并恢复…';
      try{
        const response=await store.enqueue('restore',{name});dialog.close();undo=null;returnAttempt=null;current=null;
        topic=library.topics.find(t=>t.id===settings.topicId)||topic;updateTopic();updateStats();notice(response.result.label);loadData();
      }catch(error){notice(error.message);button.disabled=false;button.textContent='先备份当前数据，再恢复';}
    };
    dialog.showModal();
  }
  function showConflict(){
    const dialog=$('#reference-dialog');if(dialog.open)dialog.close();
    if(store.blocked){
      $('#reference-title').textContent='保留待恢复的数据';
      $('#reference-body').innerHTML='<p>待保存缓存的格式异常。先导出原文，再清理缓存；数据库本身不会被清空。</p><button id="export-broken" class="primary">导出待恢复原文</button><button id="clear-broken" class="text-button" disabled>已备份，清理损坏缓存并重新连接</button>';
      $('#export-broken').onclick=()=>{exportPending();$('#clear-broken').disabled=false;};
      $('#clear-broken').onclick=()=>{localStorage.removeItem('shiyi-pending-v2');store.blocked=false;store.queue=[];dialog.close();if(!ready)bootstrap();else store.sync();};
    }else if(conflict){
      const {op,error}=conflict,d=error.detail||{};
      $('#reference-title').textContent='处理这次待保存内容';
      $('#reference-body').innerHTML=`<p>${escape(error.message)}</p>${d.databaseText!==undefined?`<h3>数据库中</h3><pre class="trace conflict-text">${escape(d.databaseText||'（空）')}</pre><h3>这个页面中</h3><pre class="trace conflict-text">${escape(d.yourText||'（空）')}</pre>`:`<pre class="trace conflict-text">${escape(JSON.stringify(op.payload,null,2))}</pre>`}<button id="export-conflict" class="text-button">先导出待保存内容</button><div class="practice-actions"><button id="discard-pending" class="secondary">保留数据库版本，跳过这次保存</button>${d.conflict?'<button id="overwrite-pending" class="primary">用本页内容重新保存</button>':''}</div>`;
      $('#export-conflict').onclick=exportPending;
      const resolve=async local=>{try{dialog.close();conflict=null;await store.resolve(op.id,local);if(!ready&&!bootstrapBusy)bootstrap();}catch(err){notice(err.message);}};
      $('#discard-pending').onclick=()=>resolve(false);$('#overwrite-pending')?.addEventListener('click',()=>resolve(true));
    }else{return;}
    dialog.showModal();
  }
  $('#review-tab').onclick=()=>{if(!ready||writing)return;center.tab='board';selectView('history');};
  $('#back-board').onclick=()=>{if(!writing){center.tab='board';selectView('history');}};
  $('#map-tab').onclick=()=>{if(ready&&!writing)selectView('map');};$('#guide-tab').onclick=()=>{if(ready&&!writing)selectView('guide');};
  $('#history-tab').onclick=()=>{if(ready&&!writing){center.tab='overview';selectView('history');}};$('#data-tab').onclick=()=>{if(ready&&!writing)selectView('data');};
  $('#back-review').onclick=()=>{if(!writing)nextDue();};
  $('#close-reference').onclick=()=>$('#reference-dialog').close();
  $('#reference-dialog').addEventListener('click',event=>{if(event.target===$('#reference-dialog'))$('#reference-dialog').close();});
  document.addEventListener('keydown',event=>{
    if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||$('#reference-dialog').open)return;
    if(event.target.closest('input,textarea,button,select,summary,a,[contenteditable="true"]'))return;
    if(event.code==='Space'&&view==='review'&&current&&!revealed){event.preventDefault();reveal();}
  });
  window.addEventListener('focus',()=>{if(ready)store.sync();});
  window.addEventListener('online',()=>{if(ready)store.flush();else bootstrap();});
  window.addEventListener('beforeunload',event=>{if(store.queue.length){event.preventDefault();event.returnValue='';}});
  const picker=$('#topic-select');
  picker.innerHTML=library.topics.map(t=>`<option value="${escape(t.id)}">${escape(t.number)} · ${escape(t.title)}</option>`).join('');
  $('#topic-picker').hidden=library.topics.length<2;
  picker.onchange=()=>{if(!ready||writing)return;const previousView=view;topic=library.topics.find(t=>t.id===picker.value);$('#problem-search').value='';updateTopic();saveTopic();if(previousView==='history'){current=null;center.load();}else {nextDue();if(previousView==='map')selectView('map');}};
  function saveTopic(){if(ready)store.enqueue('settings',{topicId:topic.id}).catch(error=>notice(error.message));}
  function updateTopic(){ picker.value=topic.id;$('#topic-title').textContent=topic.title;$('#chapter-number').textContent=`CHAPTER ${topic.number}`;$('#map-count').textContent=topic.cards.length;$('#library-label').textContent=`本地学习 · ${library.topics.length} 专题 · ${allCards.length} 题`;document.title=`拾忆 · ${topic.title}`; }
  $('#problem-search').addEventListener('input',()=>{if(ready)renderMap();});
  $('#retry-save').onclick=()=>{if(!ready)bootstrap();else if(conflict||store.blocked)showConflict();else if(store.queue.length)store.flush();else store.sync();};
  $('#pending-help').onclick=showConflict;
  setBusy(false);bootstrap();
  setInterval(()=>{
    if(!ready)return;
    const day=E.dayKey(Date.now());if(day!==activeDay){activeDay=day;updateStats();}
    store.sync();
    if(view==='history'){if(center.data&&window.LearningModel.dayKey(center.data.generatedAt)!==window.LearningModel.dayKey(Date.now()))center.load();else center.tick();}
    if(!current&&view==='review'&&dailyQueue().length)nextDue(false);
    else if(!current&&view==='review')renderEmpty();
  },15000);
  const context=document.modelContext;
  if(context?.registerTool){
    const lifecycle=new AbortController();
    for(const tool of [
      {name:'get_review_status',title:'读取复习情况',description:'Read current topic counts and active question without revealing its answer.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({topic:topic.title,...E.stats(state,allCards),storage:store.queue.length?'pending':'database',current:current?{uid:current.uid,kind:current.kind,revealed}:null})},
      {name:'start_problem_practice',title:'开始一道自测题',description:'Open a problem in free practice. Does not grade it or change its review date.',inputSchema:{type:'object',properties:{uid:{type:'string'},kind:{type:'string',enum:['main','followup','code']}},required:['uid','kind'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>{if(!ready||writing||!input||!findCard(input.uid)||!['main','followup','code'].includes(input.kind))throw Error('请选择题库中的一道有效题目与练习方式。');openPractice(input.uid,input.kind);return {uid:input.uid,kind:input.kind,practice:true};}}
    ]){try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch(error){/* Optional browser capability. */}}
    window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
})();
