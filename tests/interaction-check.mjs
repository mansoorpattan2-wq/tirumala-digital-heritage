import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const {chapters:scenes}=JSON.parse(await readFile('public/assets/tirumala/scene-manifest.json','utf8'));
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3000';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--disable-webgl']});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();
const errors=[], failed=[], requests=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base))failed.push(r.url());});
page.on('request',r=>requests.push(r.url()));
const title=()=>page.locator('.scene-story h2');
const ready=()=>expect(page.locator('.pilgrimage-scene')).toHaveAttribute('data-status','ready');
const pick=async i=>{await page.getByLabel('Choose a chapter').selectOption(scenes[i].id);await expect(title()).toHaveText(scenes[i].title);await ready();};

try {
  await page.goto(base+'/journey/',{waitUntil:'networkidle'});
  const firstRequests=requests.filter(url=>url.includes('/assets/tirumala/'));
  assert.ok(firstRequests.every(url=>/01-seven-hills-dawn|02-alipiri-ascent/.test(url)), 'entry loads only scene one and its successor');
  assert.ok(!firstRequests.some(url=>url.includes('.png')), 'no full-resolution originals at entry');
  await expect(page.getByText('Sound unavailable · No audio supplied')).toBeVisible();
  await page.getByRole('button',{name:'Begin the pilgrimage',exact:true}).click();
  await ready();
  await expect(title()).toHaveText(scenes[0].title);
  await expect(page.locator('canvas,audio,video')).toHaveCount(0);
  await page.getByRole('button',{name:'Pause motion',exact:true}).click();
  const frozen=await page.locator('.scene-current').evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(250);
  assert.equal(await page.locator('.scene-current').evaluate(el=>getComputedStyle(el).transform),frozen,'pause freezes image transform');
  await page.getByRole('button',{name:'Motion off',exact:true}).click();
  await page.locator('.scene-story').focus();
  await page.keyboard.press('ArrowRight');
  await expect(title()).toHaveText(scenes[1].title);
  await page.keyboard.press('ArrowLeft');
  await expect(title()).toHaveText(scenes[0].title);
  for(let i=1;i<7;i++) {
    await page.getByRole('button',{name:'Next chapter',exact:true}).click();
    await expect(title()).toHaveText(scenes[i].title);
    await ready();
  }
  assert.ok(!requests.some(url=>url.includes('08-festival-procession')),'festival is not fetched during daily route');
  await page.getByRole('button',{name:'Quiet reflection',exact:true}).first().click();
  await expect(title()).toHaveText('Stay here for a moment.');
  await expect(page.getByRole('button',{name:'Still reflection',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Explore the optional festival',exact:true}).click();
  await expect(title()).toHaveText(scenes[7].title); await ready();
  await page.getByRole('button',{name:'Return to dusk',exact:true}).click();
  await expect(title()).toHaveText(scenes[6].title);
  await pick(3);
  await page.reload({waitUntil:'networkidle'});
  await expect(title()).toHaveText(scenes[3].title);
  await page.getByRole('button',{name:'Return to start',exact:true}).click();
  await page.getByRole('button',{name:'Resume: '+scenes[3].title,exact:true}).click();
  await expect(title()).toHaveText(scenes[3].title);
  await pick(0);
  await page.evaluate(()=>window.scrollTo({top:innerHeight*2,behavior:'instant'}));
  await expect(title()).toHaveText(scenes[2].title);
  await page.evaluate(()=>window.scrollTo({top:innerHeight,behavior:'instant'}));
  await expect(title()).toHaveText(scenes[1].title);
  // The request remains active while hidden, but finite scene motion must pause.
  await ready();
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  await expect(page.locator('.pilgrimage-scene')).toHaveAttribute('data-motion','false');
  const hiddenTransform=await page.locator('.scene-current').evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(200);
  assert.equal(await page.locator('.scene-current').evaluate(el=>getComputedStyle(el).transform),hiddenTransform);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
  await pick(5);
  for(const viewport of [{width:1440,height:1000},{width:768,height:1024},{width:390,height:844},{width:320,height:568},{width:844,height:390}]) {
    await page.setViewportSize(viewport); await ready();
    await expect(title()).toHaveText(scenes[5].title);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');
    for(const selector of ['.pilgrimage-navigation','.experience-controls']) {
      const box=await page.locator(selector).boundingBox();
      assert.ok(box.y>=0&&box.y+box.height<=viewport.height+2,selector+' stays on screen '+JSON.stringify({viewport,box}));
    }
    assert.equal(await page.locator('.scene-current').evaluate(el=>getComputedStyle(el).objectFit),'contain');
    assert.equal(await page.locator('.scene-current').evaluate(el=>getComputedStyle(el).transform),'none','architecture is never warped or zoomed');
    if([1440,390,320].includes(viewport.width))await page.screenshot({path:`test-results/pilgrimage-day-${viewport.width}.png`});
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/journey/?motion=off#'+scenes[4].id,{waitUntil:'networkidle'});
  await expect(title()).toHaveText(scenes[4].title);
  await expect(page.getByRole('button',{name:'Motion off',exact:true})).toHaveAttribute('aria-pressed','false');
  // Start at the entry screen with a no-motion route as well.
  await page.getByRole('button',{name:'Return to start',exact:true}).click();
  await page.getByRole('button',{name:'Explore without motion',exact:true}).click();
  await expect(page.locator('.pilgrimage')).toHaveAttribute('data-motion','false');
  assert.deepEqual(errors,[]); assert.deepEqual(failed,[]);

  const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await reduced.goto(base+'/journey/');
  await reduced.getByRole('button',{name:'Begin the pilgrimage',exact:true}).click();
  await expect(reduced.getByRole('button',{name:'Reduced motion',exact:true})).toBeDisabled();
  await expect(reduced.locator('.scene-current')).toHaveCSS('transition-duration','0s');
  await reduced.close();

  const failurePage=await browser.newPage();
  await failurePage.route('**/assets/tirumala/03-ghat-road*',route=>route.fulfill({status:404,body:'Simulated missing image'}));
  await failurePage.goto(base+'/journey/#'+scenes[2].id,{waitUntil:'networkidle'});
  await expect(failurePage.getByText('This scene could not load.',{exact:true})).toBeVisible();
  await failurePage.unroute('**/assets/tirumala/03-ghat-road*');
  await failurePage.getByRole('button',{name:'Retry image',exact:true}).click();
  await expect(failurePage.locator('.pilgrimage-scene')).toHaveAttribute('data-status','ready');
  await failurePage.getByRole('button',{name:'Next chapter',exact:true}).click();
  await expect(failurePage.locator('.scene-story h2')).toHaveText(scenes[3].title);
  await failurePage.close();

  const savedData=await browser.newContext({viewport:{width:390,height:844}});
  await savedData.addInitScript(()=>{Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true,effectiveType:'2g'}});});
  const lean=await savedData.newPage();const leanImages=[];
  lean.on('request',r=>{if(r.url().includes('/assets/tirumala/'))leanImages.push(r.url());});
  await lean.goto(base+'/journey/',{waitUntil:'networkidle'});
  await lean.getByRole('button',{name:'Begin the pilgrimage',exact:true}).click();
  await expect(lean.getByRole('button',{name:'Reduced data',exact:true})).toBeDisabled();
  assert.ok(leanImages.every(url=>url.includes('01-seven-hills-dawn-640.webp')),'save-data uses only current 640px image');
  await savedData.close();
  await writeFile('test-results/pilgrimage-results.json',JSON.stringify({sequence:true,optionalFestival:true,reflection:true,keyboard:true,scrollBothDirections:true,resumeReload:true,noMotion:true,reducedMotion:true,reducedData:true,hiddenTab:true,imageFailureRetry:true,noWebGL:true,viewports:5,noAudioRequests:!requests.some(url=>/\.(mp3|wav|ogg)/.test(url)),errors,failed},null,2));
  console.log('PASS: ordered pilgrimage, optional festival, reflection, keyboard/scroll, resume, responsive views, motion/data settings, hidden tab and failed-image retry without WebGL or audio.');
} finally { await browser.close(); }
