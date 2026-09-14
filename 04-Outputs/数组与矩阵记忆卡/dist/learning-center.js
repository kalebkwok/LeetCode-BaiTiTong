(function(root){
  'use strict';
  const M=root.LearningModel;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const time=v=>Number.isFinite(v)?new Date(v).toLocaleString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}):'—';
  const shortTime=v=>new Date(v).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
  const names={recognize:'认出方法',explain:'讲清原因',implement:'独立写出'}, scores=['没想起','需要帮助','独立完成'];
  const kinds={main:'识别与解释',followup:'追问',code:'代码默写'};
  const states={overdue:'已逾期',due:'现在可复习',scheduled:'等待下次复习',practice:'自由练习',undone:'记录已撤销'};
  const ratings=e=>Object.entries(e.ratings).map(([k,v])=>`${names[k]}：${scores[v]}`).join(' · ');
  class LearningCenter {
    constructor({element,library,request,getContext,onStart,onMode,onUndo,onNotice,onData,isVisible}){
      Object.assign(this,{element,library,request,getContext,onStart,onMode,onUndo,onNotice,onData,isVisible});
      this.tab='overview';this.data=null;this.requestId=0;this.detailId=0;this.detailUid=null;this.detailCursor=null;this.detailBusy=false;this.page=1;
      this.element.innerHTML=`<div class="center-tabs" role="group" aria-label="学习中心页面"><button data-center-tab="overview" aria-pressed="true">学习总览</button><button data-center-tab="records" aria-pressed="false">刷题记录</button><button data-center-tab="board" aria-pressed="false">复习看板</button></div>
        <p class="center-error warning" role="status" hidden></p><div class="center-loading muted" role="status">正在读取学习记录…</div>
        <section data-center-panel="overview"><div id="overview-content"></div></section>
        <section data-center-panel="records" hidden><p class="muted">每题一行，点击查看逐次提交。提交指在本应用完成自评并成功保存。</p>
          <div class="record-filters"><label class="filter-search">查找题目<input id="record-search" type="search" placeholder="题号或题名" autocomplete="off"></label>
          <label>专题<select id="record-topic"><option value="">所有专题</option>${library.topics.map(t=>`<option value="${esc(t.id)}">${esc(t.number)} · ${esc(t.title)}</option>`).join('')}</select></label>
          <label>复习状态<select id="record-status"><option value="">所有状态</option>${Object.entries(states).map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}</select></label>
          <label>提交开始日期<input id="record-from" type="date"></label><label>提交结束日期<input id="record-to" type="date"></label>
          <label>排序<select id="record-sort"><option value="last">最近提交优先</option><option value="first">最近首次学习</option><option value="count">提交次数最多</option><option value="due">复习日期最早</option></select></label>
          <button class="text-button" id="record-clear">清除筛选</button></div><p class="muted" id="record-summary" role="status"></p><div id="record-table"></div><div id="record-pages" class="record-pages"></div>
        </section><section data-center-panel="board" hidden><div id="board-content"></div></section>`;
      this.element.querySelectorAll('[data-center-tab]').forEach(b=>b.onclick=()=>this.show(b.dataset.centerTab));
      this.element.querySelectorAll('.record-filters input,.record-filters select').forEach(el=>el.addEventListener('input',()=>{this.page=1;this.renderRecords();}));
      this.$('#record-clear').onclick=()=>this.resetFilters();
    }
    $(s){return this.element.querySelector(s);}
    show(tab=this.tab){
      this.tab=tab;
      this.element.querySelectorAll('[data-center-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.centerTab===tab)));
      this.element.querySelectorAll('[data-center-panel]').forEach(p=>p.hidden=p.dataset.centerPanel!==tab);
      this.load();
    }
    async load(){
      const id=++this.requestId;
      try{
        const data=await this.request('/api/learning');if(id!==this.requestId)return;
        this.data=data;this.$('.center-error').hidden=true;this.$('.center-loading').hidden=true;this.render();this.onData?.(data);
      }catch(error){if(id!==this.requestId)return;this.$('.center-loading').hidden=true;this.$('.center-error').hidden=false;this.$('.center-error').textContent='学习记录暂时未更新，请重新连接后重试。'+(this.data?' 当前保留上次读取的内容。':'');}
    }
    invalidate(){clearTimeout(this.refreshTimer);this.refreshTimer=setTimeout(()=>this.load(),250);}
    tick(){if(this.isVisible()&&this.data)this.render();}
    model(){return M.build(this.data,this.library,this.getContext().topicId);}
    render(){if(!this.data)return;if(this.tab==='overview')this.renderOverview();if(this.tab==='records')this.renderRecords();if(this.tab==='board')this.renderBoard();}
    resetFilters(){this.element.querySelectorAll('.record-filters input').forEach(x=>x.value='');this.$('#record-topic').value='';this.$('#record-status').value='';this.$('#record-sort').value='last';this.page=1;this.renderRecords();}
    goRecords(filters={}){this.tab='records';this.resetFilters();for(const [key,value] of Object.entries(filters)){const el=this.$(`#record-${key}`);if(el)el.value=value;}this.show('records');this.renderRecords();}
    renderOverview(){
      const m=this.model(),d=this.data,day=d.days[d.days.length-1];
      this.$('#overview-content').innerHTML=`<div class="overview-welcome"><div><p class="eyebrow">YOUR LEARNING, AT A GLANCE</p><h3>每一次回忆，都看得见。</h3><p class="muted">${esc(M.dayKey(Date.now()))} · ${esc(M.modeLabel(d.settings.dailyNewLimit))} · 每日最多 ${d.settings.dailyNewLimit} 道新题</p></div><button class="primary" data-open-board>去复习看板 →</button></div>
      <div class="metric-grid"><button class="metric" data-metric="all"><span>累计刷过</span><strong>${m.learned}<small>题</small></strong><p>${m.submissions} 次有效提交</p></button><button class="metric" data-metric="today"><span>今天已完成</span><strong>${day.total}<small>题</small></strong><p>新题 ${day.new} · 复习 ${day.review} · 自由练习 ${day.practice}</p></button><button class="metric" data-metric="due"><span>当前待复习</span><strong>${m.due.length}<small>题</small></strong><p>${m.overdue?`其中 ${m.overdue} 题已逾期`:'所有专题统一安排'}</p></button><button class="metric" data-metric="topics"><span>已开始的专题</span><strong>${m.topics.filter(t=>t.learned).length}<small>/ ${m.topics.length}</small></strong><p>按题目去重统计进度</p></button></div>
      <div class="overview-grid"><section class="center-card"><div class="panel-heading"><h3>最近 7 天</h3><span class="muted">每天练过的题数</span></div><div class="week-chart">${d.days.map(x=>{const max=Math.max(1,...d.days.map(v=>v.total));return `<button class="day-column" data-day="${x.date}" aria-label="查看 ${x.date} 的 ${x.total} 道题，${x.submissions} 次提交"><span class="day-value">${x.total}</span><span class="bar-space"><span class="day-bar" style="height:${Math.max(3,x.total/max*100)}%;opacity:${x.total?1:.2}"></span></span><span>${x.date===M.dayKey(Date.now())?'今天':x.date.slice(5)}</span></button>`;}).join('')}</div><p class="fine-print">同题一天计 1 题；重复提交另计次数。撤销不计入统计，旧版累计记录不补入每日图表。</p></section>
      <section class="center-card"><div class="panel-heading"><h3>最近提交</h3><button class="text-button" data-all-records>查看全部</button></div>${d.recent.length?d.recent.map(e=>{const r=m.rows.find(x=>x.uid===e.uid);return `<button class="recent-row" data-detail="${esc(e.uid)}"><span><strong>${esc(r?.card.id)} · ${esc(r?.card.title)}</strong><small>${esc(time(e.at))}</small></span><span class="pill">${e.practice?'自由练习':kinds[e.kind]}</span></button>`;}).join(''):'<div class="center-empty">完成一次自评，提交时间就会出现在这里。<button class="text-button" data-open-board>开始今天第一题 →</button></div>'}</section></div>
      <section class="center-card" id="topic-progress"><div class="panel-heading"><h3>专题进度</h3><span class="muted">点击查看该专题刷题记录</span></div><div class="topic-progress-grid">${m.topics.map(t=>`<button class="topic-progress" data-topic-records="${esc(t.id)}"><span>${esc(t.number)} · ${esc(t.title)}<strong>${t.learned} / ${t.cards.length}</strong></span><span class="mini-track"><span style="width:${t.learned/t.cards.length*100}%"></span></span></button>`).join('')}</div></section>`;
      this.$('[data-metric="all"]').onclick=()=>this.goRecords();this.$('[data-metric="today"]').onclick=()=>this.goRecords({from:M.dayKey(Date.now()),to:M.dayKey(Date.now())});
      this.$('[data-metric="due"]').onclick=()=>this.show('board');this.$('[data-metric="topics"]').onclick=()=>this.$('#topic-progress').scrollIntoView({block:'start'});
      this.$('[data-all-records]').onclick=()=>this.goRecords();
      this.element.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>this.goRecords({from:b.dataset.day,to:b.dataset.day}));
      this.element.querySelectorAll('[data-topic-records]').forEach(b=>b.onclick=()=>this.goRecords({topic:b.dataset.topicRecords}));this.bindActions();
    }
    renderRecords(){
      if(!this.data)return;const m=this.model(),filters=Object.fromEntries(['query','topic','status','from','to','sort'].map(k=>[k,this.$(k==='query'?'#record-search':`#record-${k}`).value]));
      const invalid=filters.from&&filters.to&&filters.from>filters.to;
      const rows=invalid?[]:M.filterRows(m.rows,filters),pages=Math.max(1,Math.ceil(rows.length/20));this.page=Math.min(this.page,pages);
      this.$('#record-summary').textContent=invalid?'开始日期不能晚于结束日期。':`共 ${rows.length} 道题 · 第 ${this.page} / ${pages} 页。日期筛选按实际提交记录匹配，不只看最近一次提交。`;
      this.$('#record-table').innerHTML=rows.length?`<div class="table-scroll"><table class="records-table"><caption class="sr-only">刷题记录，点击题目查看每次提交</caption><thead><tr><th>题目 / 专题</th><th>首次学习</th><th>最近提交</th><th>提交次数</th><th>下次复习</th><th>操作</th></tr></thead><tbody>${rows.slice((this.page-1)*20,this.page*20).map(r=>`<tr><td><button class="record-title" data-detail="${esc(r.uid)}">${esc(r.card.id)} · ${esc(r.card.title)}</button><small>${esc(r.card.topicTitle)}</small></td><td class="date-cell">${esc(time(r.firstAt))}</td><td class="date-cell">${esc(time(r.lastAt))}</td><td>${r.eventCount} 次${r.legacyCount?`<small>另有旧版累计 ${r.legacyCount} 次</small>`:''}</td><td><span class="status-tag ${r.status}">${states[r.status]}</span>${r.record?`<small>${esc(time(r.record.due))}</small>`:''}</td><td><button class="text-button" data-detail="${esc(r.uid)}">时间线</button>${r.card.topicId?`<button class="text-button" data-start="${esc(r.uid)}">现在复习</button>`:''}</td></tr>`).join('')}</tbody></table></div>`:`<div class="center-empty"><h3>${invalid?'调整日期范围':'这里还没有匹配的题目'}</h3><p>${m.rows.length?'可以清除筛选，或换一个专题。':'完成自评并保存后，题目和提交时间会自动出现在这里。'}</p><button class="text-button" data-open-board>去复习看板 →</button></div>`;
      this.$('#record-pages').innerHTML=pages>1?`<button class="secondary" id="records-prev" ${this.page===1?'disabled':''}>← 上一页</button><span>${this.page} / ${pages}</span><button class="secondary" id="records-next" ${this.page===pages?'disabled':''}>下一页 →</button>`:'';
      if(pages>1){this.$('#records-prev').onclick=()=>{this.page--;this.renderRecords();};this.$('#records-next').onclick=()=>{this.page++;this.renderRecords();};}this.bindActions();
    }
    boardCard(c,type,event){
      const r=this.data.state.records[c.uid],note=this.data.state.notes[c.uid]?.text;
      const summary=event?ratings(event):Object.entries(this.data.state.skills[c.uid]||{}).map(([k,s])=>`${names[k]}：${scores[s.value]}`).join(' · ');
      return `<article class="board-card"><div class="board-meta"><span>LC ${esc(c.id)} · ${esc(c.topicTitle||this.library.topics.find(t=>t.cards.some(x=>x.uid===c.uid))?.title)}</span>${type==='due'?`<span class="status-tag ${M.dayKey(r.due)<M.dayKey(Date.now())?'overdue':'due'}">${M.dayKey(r.due)<M.dayKey(Date.now())?'已逾期':'已到期'}</span>`:''}</div><h4>${esc(c.title)}</h4>${type==='done'?`<p class="muted">提交于 ${esc(shortTime(event.at))}${event.practice?' · 自由练习':''}</p>`:r?`<p class="muted">到期 ${esc(time(r.due))}</p>`:''}${summary?`<p class="board-score">${esc(summary)}</p>`:''}${note?`<p class="board-note">卡点：${esc(note)}</p>`:''}<div class="board-actions">${type==='done'?`<button class="text-button" data-detail="${esc(c.uid)}">查看提交</button>`:`<button class="text-button" data-start="${esc(c.uid)}">${type==='fresh'?'开始学习':'开始复习'} →</button>`}</div></article>`;
    }
    renderBoard(){
      const m=this.model(),t=this.library.topics.find(x=>x.id===this.getContext().topicId),day=this.data.days.at(-1);
      this.$('#board-content').innerHTML=`<div class="board-intro"><div><h3>今天，从这里开始。</h3><p class="muted">${esc(M.modeLabel(this.data.settings.dailyNewLimit))} · 今天已引入 ${m.introduced} 道新题，还可引入 ${m.remaining} 道。</p></div><button class="primary" id="board-next" ${!m.due.length&&!m.fresh.length?'disabled':''}>${m.due.length?'先复习到期题':'开始下一道新题'} →</button></div><p class="fine-print">到期旧题覆盖所有专题；新题从“${esc(t.title)}”开始，可在左侧切换专题。切换模式沿用今天已学数量，旧题不占新题额度。</p>
      <div class="review-board"><section class="board-column"><div class="column-heading"><h3><i class="dot amber"></i>待复习</h3><span>${m.due.length}</span></div><p class="column-copy">${m.overdue?`${m.overdue} 题逾期，优先回忆`:'按到期时间排列'}</p>${m.due.map(c=>this.boardCard(c,'due')).join('')||'<p class="column-empty">现在没有到期题。<br>到期后会自动出现在这里。</p>'}</section>
      <section class="board-column"><div class="column-heading"><h3><i class="dot blue"></i>今日新题</h3><span>${m.fresh.length}</span></div><p class="column-copy">${esc(t.title)} · 每日上限 ${this.data.settings.dailyNewLimit}</p>${m.fresh.map(c=>this.boardCard(c,'fresh')).join('')||`<p class="column-empty">${m.remaining?'本专题没有待学新题，可以切换专题。':'今天的新题额度已用完。到期旧题仍可继续复习。'}</p>`}${m.fresh.length<m.remaining?'<p class="fine-print">本专题新题不足剩余额度，可切换专题继续。</p>':''}</section>
      <section class="board-column"><div class="column-heading"><h3><i class="dot green"></i>今日已完成</h3><span>${m.done.length}</span></div><p class="column-copy">${day.submissions} 次有效提交 · 按题目去重</p>${m.done.map(e=>e.card?this.boardCard(e.card,'done',e):`<p class="column-empty">${esc(e.uid)} · ${esc(shortTime(e.at))} 提交</p>`).join('')||'<p class="column-empty">保存一次自评，<br>就会留下今天的记录。</p>'}</section></div><p class="fine-print">“已完成”表示今天提交过，不代表已经掌握。没想起的题到期后会再次进入待复习，同时保留今天的提交记录。</p>`;
      this.$('#board-next').onclick=()=>{const c=m.due[0]||m.fresh[0];if(c)this.onStart(c.uid);};this.bindActions();
    }
    bindActions(){
      this.element.querySelectorAll('[data-detail]').forEach(b=>b.onclick=()=>this.openDetail(b.dataset.detail));
      this.element.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>this.onStart(b.dataset.start));
      this.element.querySelectorAll('[data-open-board]').forEach(b=>b.onclick=()=>this.show('board'));
    }
    async openDetail(uid){
      const row=this.model().rows.find(r=>r.uid===uid);if(!row)return;
      const dialog=document.querySelector('#reference-dialog');if(dialog.open)dialog.close();
      this.detailUid=uid;this.detailCursor=null;this.detailBusy=false;this.detailId++;
      document.querySelector('#reference-title').textContent=`${row.card.id} · ${row.card.title}`;
      document.querySelector('#reference-body').innerHTML=`<div class="detail-summary"><span>${esc(row.card.topicTitle)}</span><span>${row.eventCount} 次有效提交</span>${row.card.topicId?'<button id="detail-practice" class="primary">现在复习</button>':''}</div><p class="fine-print">时间使用本机时区，精确到秒。自评为当次提交结果。</p>${row.legacyCount||(!row.eventCount&&row.learned)?`<p class="legacy-note">包含旧版进度${row.legacyCount?`，累计 ${row.legacyCount} 次计划复习`:''}。${row.firstAt?`旧进度最早留存时间：${esc(time(row.firstAt))}。`:''}旧版没有逐次事件，无法展开这些提交。</p>`:''}<div id="problem-timeline" aria-live="polite"><p class="muted">正在读取提交时间线…</p></div><button id="more-problem-history" class="secondary" hidden>加载更早提交</button>`;
      document.querySelector('#detail-practice')?.addEventListener('click',()=>{dialog.close();this.onStart(uid);});
      document.querySelector('#more-problem-history').onclick=()=>this.loadDetail(true);dialog.showModal();await this.loadDetail();
    }
    async loadDetail(append=false){
      if(this.detailBusy)return;this.detailBusy=true;
      const id=this.detailId,uid=this.detailUid,button=document.querySelector('#more-problem-history');if(button)button.disabled=true;
      try{
        const page=await this.request(`/api/history?uid=${encodeURIComponent(uid)}${append&&this.detailCursor?`&before=${this.detailCursor}`:''}`);
        if(id!==this.detailId||!document.querySelector('#problem-timeline'))return;
        const markup=page.events.map(e=>`<article class="timeline-event ${e.undone?'is-undone':''}"><div class="timeline-meta"><time datetime="${new Date(e.at).toISOString()}">${esc(time(e.at))}</time><span class="status-tag">${e.undone?'已撤销':e.practice?'自由练习':'计划复习'}</span></div><h3>${kinds[e.kind]}</h3><p>${esc(ratings(e))}${e.usedHelp?' · 使用过提示或概念':''}</p><p class="muted">${e.due?`当次安排下次复习：${esc(time(e.due))}`:'本次自由练习未改变复习日期'}</p>${e.canUndo?`<button class="text-button" data-event-undo="${esc(e.id)}">撤销这次记录</button>`:''}</article>`).join('');
        const list=document.querySelector('#problem-timeline');if(append)list.insertAdjacentHTML('beforeend',markup);else list.innerHTML=markup||'<p class="center-empty">没有可展开的逐次提交记录。</p>';
        this.detailCursor=page.nextCursor;button.hidden=!page.nextCursor;button.textContent='加载更早提交';button.onclick=()=>this.loadDetail(true);
        list.querySelectorAll('[data-event-undo]').forEach(b=>b.onclick=async()=>{b.disabled=true;await this.onUndo(b.dataset.eventUndo);await this.load();if(document.querySelector('#reference-dialog').open&&document.querySelector('#problem-timeline'))await this.openDetail(uid);});
      }catch(error){if(id===this.detailId&&document.querySelector('#problem-timeline')){const list=document.querySelector('#problem-timeline');if(!append)list.innerHTML='';const errorBox=document.createElement('p');errorBox.className='warning';errorBox.textContent='暂时无法读取提交记录，请重新连接后重试。';list.append(errorBox);button.hidden=false;button.textContent='重试读取';button.onclick=()=>this.loadDetail(append);}}
      finally{if(id===this.detailId)this.detailBusy=false;if(button)button.disabled=false;}
    }
  }
  root.LearningCenter=LearningCenter;
})(window);
