import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ channel:'chrome', headless:true });
const page = await browser.newPage({ viewport:{width:1440,height:1000} });
await page.addInitScript(()=>sessionStorage.setItem('tirumala-sacred-intro-seen','yes'));
const errors=[], failures=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.status()>=400&&response.url().startsWith(base))failures.push(response.url());});
const routes=['/','/heritage/','/architecture/','/pilgrim-guide/','/festivals/','/gallery/','/guide/','/about/','/journey/','/darshan/'];
try {
  for (const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      const response=await page.goto(base+route,{waitUntil:'networkidle'});
      assert.equal(response.status(),200,route);
      await expect(page.locator('h1')).toHaveCount(1);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' overflow');
      await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(async image=>{image.loading='eager';await image.decode();}));});
      if(route==='/'||route==='/journey/')await page.screenshot({path:`test-results/${route==='/'?'home':'pilgrimage-entry'}-${viewport.width}.png`});
    }
  }
  await page.goto(base+'/pilgrim-guide/');
  await page.getByLabel('Check official darshan arrangements').check();
  await page.reload();
  await expect(page.getByLabel('Check official darshan arrangements')).toBeChecked();
  await page.getByText('Understanding darshan',{exact:true}).click();
  await expect(page.getByText('Official darshan services',{exact:true})).toBeVisible();
  await page.goto(base+'/gallery/');
  await page.getByRole('button',{name:'AI artwork',exact:true}).click();
  await expect(page.locator('.gallery-grid figure')).toHaveCount(10);
  await page.getByRole('button',{name:'Documentary',exact:true}).click();
  await expect(page.locator('.gallery-grid figure')).toHaveCount(4);
  await page.goto(base+'/guide/');
  await page.locator('.filter-tabs button').nth(1).click();
  await expect(page.locator('.language-story')).toHaveAttribute('lang','te-IN');
  await page.goto(base);
  const cursor=page.locator('.cursor-companion');
  await expect(cursor).toHaveAttribute('data-enabled','true');
  await page.getByRole('link',{name:'Begin the pilgrimage',exact:true}).hover();
  await expect(cursor).toHaveAttribute('data-visible','true');
  await expect(cursor).toHaveAttribute('data-mode','interactive');
  await expect(cursor).toHaveAttribute('data-label','OPEN');
  assert.equal(await cursor.evaluate(node=>getComputedStyle(node).pointerEvents),'none');
  const touchContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const touchPage=await touchContext.newPage();
  await touchPage.goto(base,{waitUntil:'networkidle'});
  await expect(touchPage.locator('.cursor-companion')).toHaveAttribute('data-enabled','false');
  await touchContext.close();
  const reducedContext=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const reducedPage=await reducedContext.newPage();
  await reducedPage.goto(base,{waitUntil:'networkidle'});
  await expect(reducedPage.locator('.cursor-companion')).toHaveAttribute('data-enabled','false');
  await reducedContext.close();
  await page.getByRole('button',{name:'Open navigation'}).click();
  await expect(page.locator('#mobile-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-nav')).toHaveCount(0);
  await page.getByRole('link',{name:'Begin the pilgrimage',exact:true}).click();
  await expect(page.getByRole('button',{name:'Begin the pilgrimage',exact:true})).toBeVisible();
  assert.deepEqual(errors,[]); assert.deepEqual(failures,[]);
  await writeFile('test-results/browser-results.json',JSON.stringify({routes:10,desktop:true,mobile:true,imagesDecoded:true,galleryCounts:[10,4],checklistPersistence:true,languageSwitch:true,cursorHover:true,cursorDisabledForTouchAndReducedMotion:true,mobileMenu:true,clientNavigation:true,errors,failures},null,2));
  console.log('PASS: ten routes on desktop/mobile, image decoding, gallery, checklist, languages, cursor behavior, keyboard menu and client navigation.');
} finally { await browser.close(); }
