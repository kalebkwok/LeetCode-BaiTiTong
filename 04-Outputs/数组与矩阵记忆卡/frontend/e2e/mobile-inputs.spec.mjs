import {test,expect} from '@playwright/test';
const base='http://127.0.0.1:18765';

// iOS Safari zooms the whole page whenever a focused field computes below
// 16px, which users experience as the screen drifting while typing. These
// checks pin every editable field at 16px or more on phone/tablet widths.
async function fields(page){
  return page.locator('textarea,input:not([type=radio]):not([type=checkbox]),select').evaluateAll(nodes=>nodes.map(n=>({
    field:n.tagName.toLowerCase()+(n.id?'#'+n.id:(n.className?'.'+String(n.className).split(' ')[0]:'')),
    size:getComputedStyle(n).fontSize,
  })));
}
async function expectAllAtLeast16(page,context){
  const found=await fields(page);
  expect(found.length,`${context}: expected at least one editable field`).toBeGreaterThan(0);
  for(const f of found)expect.soft(Number.parseFloat(f.size),`${context} ${f.field} = ${f.size}`).toBeGreaterThanOrEqual(16);
}

test('phone and tablet fields stay at 16px so iOS does not zoom while typing',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(`${base}/#review?uid=lc-217&kind=main`);
  await expect(page.getByTestId('study-card')).toBeVisible();
  await page.getByText('写下我的思路（可选）',{exact:true}).click();
  await page.getByRole('button',{name:/我想好了，核对答案/}).click();
  await expect(page.getByRole('textbox',{name:'下次最想检查的一个卡点'})).toBeVisible();
  await expectAllAtLeast16(page,'review 390px portrait');

  await page.setViewportSize({width:844,height:390});
  await expectAllAtLeast16(page,'review 844px landscape');

  await page.setViewportSize({width:390,height:844});
  await page.goto(`${base}/?fresh=1#history?tab=records`);
  await expect(page.locator('.record-filters')).toBeVisible();
  await expectAllAtLeast16(page,'records 390px portrait');
});
