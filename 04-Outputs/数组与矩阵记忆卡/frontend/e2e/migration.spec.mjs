import {test,expect} from '@playwright/test';
const base='http://127.0.0.1:18765';
async function api(page,path,command){
 const session=await (await page.request.get(base+'/api/session')).json();
 const response=await page.request[command?'post':'get'](base+path,{headers:{'X-Review-Token':session.token},...(command?{data:command}:{})});
 expect(response.ok()).toBeTruthy();return response.json();
}
const state=page=>api(page,'/api/state');
async function openCard(page,uid,kind='main',practice=false){
 await page.goto(`${base}/#review?uid=${uid}&kind=${kind}&practice=${practice}`);
 await expect(page.getByTestId('study-card')).toBeVisible();
}
async function grade(page,help=false){
 if(help)await page.getByRole('button',{name:'给我一点提示',exact:true}).click();
 await page.getByRole('button',{name:/我想好了，核对答案/}).click();
 for(const name of ['认出方法','讲清原因'])await page.getByRole('group',{name,exact:true}).getByLabel(help?'需要帮助':'独立完成',{exact:true}).check();
}
async function queueEmpty(page){await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('shiyi-pending-v2')||'[]').length)).toBe(0);}

test('React review, hints, draft input, reference, submit and undo',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await openCard(page,'lc-238');
 await page.getByText('写下我的思路（可选）',{exact:true}).click();
 const input=page.getByRole('textbox',{name:'思路草稿'});
 await input.fill('先算左边，再算右边。');
 await input.dispatchEvent('compositionstart',{data:''});
 await input.press('Space');
 await expect(page.getByRole('button',{name:/我想好了，核对答案/})).toBeVisible();
 await input.dispatchEvent('compositionend',{data:'中文'});
 await input.fill('中文草稿：先算左边，再算右边。');
 await queueEmpty(page);await expect(input).toBeFocused();
 await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
 await expect(input).toHaveValue('中文草稿：先算左边，再算右边。');await expect(input).toBeFocused();
 await grade(page,true);
 await expect(page.getByRole('group',{name:'认出方法',exact:true}).getByLabel('独立完成',{exact:true})).toBeDisabled();
 expect(await page.getByRole('link',{name:'本地原题解',exact:true}).getAttribute('href')).toBe('/content/notes/lc-238.html');
 await page.getByRole('button',{name:'保存自评，下一题',exact:true}).click();
 await expect.poll(async()=> (await api(page,'/api/history?uid=lc-238')).events.length).toBe(1);
 const event=(await api(page,'/api/history?uid=lc-238')).events[0];expect(event.usedHelp).toBe(true);expect(event.ratings).toEqual({recognize:1,explain:1});
 await page.getByRole('button',{name:'撤销这次记录',exact:true}).click();
 await expect.poll(async()=> (await api(page,'/api/history?uid=lc-238')).events[0].undone).toBe(true);
 expect((await state(page)).drafts['lc-238:main'].text).toContain('中文草稿');expect(errors).toEqual([]);
});

test('a committed response lost across page reload retries the identical command once',async({page})=>{
 await openCard(page,'lc-1');let lost=false;const bodies=[];
 await page.route('**/api/command',async route=>{
  const body=route.request().postData(),command=JSON.parse(body);
  if(command.type!=='review')return route.continue();
  bodies.push(body);
  if(!lost){const response=await route.fetch();expect(response.status()).toBe(200);lost=true;await route.abort('failed');}
  else await route.continue();
 });
 await grade(page);await page.getByRole('button',{name:'保存自评，下一题',exact:true}).click();
 await expect.poll(()=>lost).toBe(true);await expect(page.locator('[data-status="offline"]')).toBeVisible();
 page.on('dialog',dialog=>dialog.accept());await page.reload();await queueEmpty(page);
 expect(bodies.length).toBeGreaterThanOrEqual(2);expect(new Set(bodies).size).toBe(1);
 const h=await api(page,'/api/history?uid=lc-1');expect(h.events.length).toBe(1);expect((await state(page)).state.records['lc-1'].reviews).toBe(1);
});

test('two browser zones show both draft versions and honor explicit conflict choices',async({browser})=>{
 const ca=await browser.newContext({timezoneId:'Asia/Tokyo'}),cb=await browser.newContext({timezoneId:'America/Los_Angeles'});
 const a=await ca.newPage(),b=await cb.newPage();
 try{
  await openCard(a,'lc-53','code',true);await openCard(b,'lc-53','code',true);
  const aa=a.getByRole('textbox',{name:'Python 默写代码'}),bb=b.getByRole('textbox',{name:'Python 默写代码'});
  await bb.focus();await aa.fill('浏览器 A：运行和');await queueEmpty(a);
  await bb.fill('浏览器 B：重新开始');
  const dialog=b.getByRole('dialog');await expect(dialog).toBeVisible();await expect(dialog).toContainText('浏览器 A：运行和');await expect(dialog).toContainText('浏览器 B：重新开始');
  await dialog.getByRole('button',{name:'明确将本页内容应用到当前库',exact:true}).click();await queueEmpty(b);
  await expect.poll(async()=> (await state(a)).drafts['lc-53:code'].text).toBe('浏览器 B：重新开始');
  await expect(b.getByTestId('study-card').getByRole('heading',{level:3})).toHaveText('最大子数组和');
  await a.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await expect(a.locator('.daily-box')).toContainText('America/Chicago');await expect(b.locator('.daily-box')).toContainText('America/Chicago');
  await aa.focus();await bb.fill('浏览器 B：另一份修改');await queueEmpty(b);await aa.fill('浏览器 A：放弃此版本');
  await expect(a.getByRole('dialog')).toBeVisible();await a.getByRole('dialog').getByRole('button',{name:'保留数据库版本，跳过这次保存',exact:true}).click();await queueEmpty(a);
  await expect(aa).toHaveValue('浏览器 B：另一份修改');
 }finally{await ca.close();await cb.close();}
});

test('restored and missing epochs import without automatic writes, then explicit apply',async({page})=>{
 await page.goto(base+'/#data');await expect(page.getByRole('heading',{name:'共享进度与学习节奏'})).toBeVisible();
 const old=await state(page),backup=await api(page,'/api/backup',{});
 await api(page,'/api/command',{id:crypto.randomUUID(),type:'restore',payload:{name:backup.name},databaseId:old.databaseId});
 await page.reload();await expect(page.getByRole('heading',{name:'共享进度与学习节奏'})).toBeVisible();
 for(const epoch of [old.databaseId,undefined]){
  const before=await state(page),id=crypto.randomUUID(),payload={uid:epoch?'lc-41':'lc-73',kind:'main',ratings:{recognize:2,explain:2},practice:true};
  const op={id,type:'review',payload,...(epoch?{databaseId:epoch}:{})};op.body=JSON.stringify(op);op.sent=true;
  await page.locator('input[type=file]').setInputFiles({name:'pending.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'shiyi-pending',version:1,operations:[op]}))});
  const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();expect((await state(page)).revision).toBe(before.revision);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('shiyi-pending-v2'))[0]);expect(saved.databaseId).toBe(epoch);expect(saved.body).toBe(op.body);
  await dialog.getByRole('button',{name:'明确将本页内容应用到当前库',exact:true}).click();await queueEmpty(page);
  const h=await api(page,`/api/history?uid=${payload.uid}`);expect(h.events.length).toBe(1);expect(h.events[0].id).not.toBe(id);
 }
});

test('legacy localStorage migrates without deleting its source',async({page})=>{
 const raw=JSON.stringify({version:1,records:{},skills:{},notes:{'lc-56':{text:'旧入口测试卡点',at:1789000000000}}});
 await page.addInitScript(value=>localStorage.setItem('shiyi-leetcode-progress-v1',value),raw);
 await page.goto(base+'/');await expect.poll(async()=> (await state(page)).state.notes['lc-56']?.text).toBe('旧入口测试卡点');
 expect(await page.evaluate(()=>localStorage.getItem('shiyi-leetcode-progress-v1'))).toBe(raw);
});

test('mobile-width pages, search, dialogs and backup controls stay accessible',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/');
 await expect(page.getByRole('heading',{name:'每一次回忆，都看得见。'})).toBeVisible();
 for(const tab of ['刷题记录','复习看板','学习总览']){
  await page.getByRole('button',{name:tab,exact:true}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.getByRole('button',{name:/记忆地图/}).click();await page.getByRole('searchbox').fill('238');
 await expect(page.locator('.map-card')).toHaveCount(1);await page.reload();await expect(page.getByRole('searchbox')).toHaveValue('238');
 await page.getByRole('button',{name:/查看.*的关联题/}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
 await page.locator('.map-card').getByRole('button',{name:'默写',exact:true}).click();
 const input=page.getByRole('textbox',{name:'Python 默写代码'});await input.fill('def f():\n    return "中文"');await queueEmpty(page);await expect(input).toBeFocused();
 await page.getByRole('button',{name:'补一个相关概念',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'关闭详情'}).click();await expect(input).toHaveValue('def f():\n    return "中文"');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/mobile-review.png',fullPage:true});
 await page.getByRole('button',{name:/数据与设置/}).click();await page.getByRole('button',{name:'现在创建备份',exact:true}).click();await expect(page.locator('.backup-item').first()).toBeVisible();
 await page.locator('.backup-item').first().getByRole('button',{name:'恢复此备份'}).click();await expect(page.getByRole('button',{name:'确认恢复',exact:true})).toBeDisabled();await page.getByRole('button',{name:'关闭详情'}).click();
 await page.getByRole('button',{name:/怎么记得住/}).click();await expect(page.getByRole('heading',{name:'诚实地评价刚才的回忆'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});


test('confirmed updates arrive on the normal 15-second poll without replacing the reading card',async({page})=>{
 await openCard(page,'lc-66','code',true);
 const title=await page.getByTestId('study-card').getByRole('heading',{level:3}).textContent();
 const before=await state(page);
 await api(page,'/api/command',{id:crypto.randomUUID(),type:'draft',databaseId:before.databaseId,payload:{uid:'lc-66',kind:'code',text:'另一设备已确认的草稿',expectedAt:null}});
 await expect(page.getByRole('textbox',{name:'Python 默写代码'})).toHaveValue('另一设备已确认的草稿',{timeout:18000});
 await expect(page.getByTestId('study-card').getByRole('heading',{level:3})).toHaveText(title);
});
