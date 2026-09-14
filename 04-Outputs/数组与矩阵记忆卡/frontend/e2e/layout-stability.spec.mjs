import {test,expect} from '@playwright/test';
const base='http://127.0.0.1:18765';

// iOS Safari has no scroll anchoring, so any element that changes height above
// the viewport shoves the whole page. The pending-queue button in the sidebar
// used to appear on every enqueue and vanish on every save, moving the page
// 36px up and down once per keystroke. Chrome hid that from us by anchoring the
// scroll; Safari cannot. These checks keep the row reserved instead.
test('typing never moves the document on a phone viewport',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(`${base}/#review?uid=lc-217&kind=main`);
  await expect(page.getByTestId('study-card')).toBeVisible();
  await page.getByText('写下我的思路（可选）',{exact:true}).click();
  // Emulate Safari, which cannot mask the shift the way Chrome anchoring does.
  await page.addStyleTag({content:'html{overflow-anchor:none}'});
  const draft=page.getByRole('textbox',{name:'思路草稿'});
  await draft.click();

  await page.evaluate(()=>{
    window.__probe={samples:[],raf:0};
    const loop=()=>{
      const ta=document.querySelector('.scratch textarea'),si=document.querySelector('.save-indicator');
      if(ta&&si)window.__probe.samples.push({top:Math.round(ta.getBoundingClientRect().top),siH:Math.round(si.getBoundingClientRect().height)});
      window.__probe.raf=requestAnimationFrame(loop);
    };
    loop();
  });
  await draft.pressSequentially('typing steadily on a phone',{delay:110});
  await page.waitForTimeout(900);
  const s=await page.evaluate(()=>{cancelAnimationFrame(window.__probe.raf);return window.__probe.samples;});

  const spread=key=>Math.max(...s.map(x=>x[key]))-Math.min(...s.map(x=>x[key]));
  expect(s.length).toBeGreaterThan(50);
  expect(spread('siH'),'sidebar save area changed height while typing').toBeLessThanOrEqual(1);
  expect(spread('top'),'the field being typed in moved on screen').toBeLessThanOrEqual(1);

  // The row stays reserved when nothing is pending. That is the whole point, so
  // guard it against being "tidied" back into conditional rendering.
  const pending=page.locator('.save-indicator button').filter({hasText:'处理待保存内容'});
  await expect(pending).toHaveCount(1);
  await expect(pending).toBeHidden();
  expect((await pending.boundingBox()).height,'hidden button must keep its row').toBeGreaterThan(20);
});

// Reserving a row must not cost the affordance: when saves genuinely stall the
// button has to become visible, and still work.
test('the reserved button appears and opens its dialog when saves stall',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.route('**/api/command',route=>route.abort());
  await page.goto(`${base}/#review?uid=lc-217&kind=main`);
  await expect(page.getByTestId('study-card')).toBeVisible();
  await page.getByText('写下我的思路（可选）',{exact:true}).click();
  await page.getByRole('textbox',{name:'思路草稿'}).fill('这次输入会留在本地队列');

  const pending=page.locator('.save-indicator button').filter({hasText:'处理待保存内容'});
  await expect(pending).toBeVisible();
  await pending.click();
  await expect(page.getByText('处理待保存内容',{exact:true})).toBeVisible();
});
