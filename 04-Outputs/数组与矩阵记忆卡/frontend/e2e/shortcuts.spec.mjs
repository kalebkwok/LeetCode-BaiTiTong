import {test,expect} from '@playwright/test';
const base='http://127.0.0.1:18765';
// lc-217 is deliberately unused by migration.spec.mjs: both files share one
// temporary database, so card-level state must not overlap between them.
const uid='lc-217';
async function token(page){return (await (await page.request.get(base+'/api/session')).json()).token;}
async function state(page){return (await page.request.get(base+'/api/state',{headers:{'X-Review-Token':await token(page)}})).json();}
async function status(page){return (await page.request.get(base+'/api/status',{headers:{'X-Review-Token':await token(page)}})).json();}
async function queueEmpty(page){await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('shiyi-pending-v2')||'[]').length)).toBe(0);}

test('keyboard: Space reveals, 1/2/3 rate the first unrated skill, Enter submits',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${base}/#review?uid=${uid}&kind=main`);
  await expect(page.getByTestId('study-card')).toBeVisible();
  await expect(page.getByRole('button',{name:/我想好了，核对答案/})).toBeVisible();

  await page.keyboard.press('Space');
  const recognize=page.getByRole('group',{name:'认出方法',exact:true});
  const explain=page.getByRole('group',{name:'讲清原因',exact:true});
  await expect(recognize.getByLabel('没想起',{exact:true})).toBeVisible();
  await expect(recognize.getByLabel('没想起',{exact:true})).not.toBeChecked();

  await page.keyboard.press('Digit1');
  await expect(recognize.getByLabel('没想起',{exact:true})).toBeChecked();

  await page.keyboard.press('Digit2');
  await expect(explain.getByLabel('需要帮助',{exact:true})).toBeChecked();

  await page.keyboard.press('Enter');
  await expect.poll(async()=>(await status(page)).reviewCount).toBeGreaterThanOrEqual(1);
  expect(errors).toEqual([]);
});

test('keyboard guards: help caps the score and text fields swallow the shortcuts',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${base}/#review?uid=${uid}&kind=main`);
  await expect(page.getByTestId('study-card')).toBeVisible();

  await page.getByText('写下我的思路（可选）',{exact:true}).click();
  const draft=page.getByRole('textbox',{name:'思路草稿'});
  await draft.click();
  await draft.press('Space');
  await draft.pressSequentially('x1');
  await expect(page.getByRole('button',{name:/我想好了，核对答案/})).toBeVisible();

  await page.getByRole('button',{name:'给我一点提示',exact:true}).click();
  await page.getByRole('button',{name:/我想好了，核对答案/}).click();
  const recognize=page.getByRole('group',{name:'认出方法',exact:true});
  await page.keyboard.press('Digit3');
  await expect(recognize.getByLabel('独立完成',{exact:true})).not.toBeChecked();
  await page.keyboard.press('Digit2');
  await expect(recognize.getByLabel('需要帮助',{exact:true})).toBeChecked();

  const note=page.getByRole('textbox',{name:'下次最想检查的一个卡点'});
  await note.click();
  await note.pressSequentially('3');
  await expect(recognize.getByLabel('需要帮助',{exact:true})).toBeChecked();
  expect(errors).toEqual([]);
});

test('re-tapping the active mode reports back without writing to the database',async({page})=>{
  await page.goto(`${base}/#history`);
  const active=page.locator('.mode-picker button[aria-pressed="true"]');
  await expect(active).toHaveCount(1);
  await queueEmpty(page);
  const before=(await state(page)).revision;

  await active.click();
  await expect(page.getByText(/当前已经是每日/)).toBeVisible();
  await queueEmpty(page);
  expect((await state(page)).revision).toBe(before);
});
