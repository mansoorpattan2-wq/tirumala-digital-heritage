import{chromium,expect}from'@playwright/test';
import assert from'node:assert/strict';
import{mkdir,writeFile}from'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3000';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
await context.addInitScript(()=>{const OriginalAudio=window.Audio;window.__audioPlayers=[];window.Audio=function(...args){const audio=new OriginalAudio(...args);window.__audioPlayers.push(audio);return audio;};window.Audio.prototype=OriginalAudio.prototype;});
const page=await context.newPage();const errors=[],failed=[];page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400&&response.url().startsWith(base))failed.push(response.url());});
const player=()=>page.evaluate(()=>{const a=window.__audioPlayers.at(-1);return{count:window.__audioPlayers.length,src:a.getAttribute('src'),paused:a.paused,duration:a.duration,time:a.currentTime,volume:a.volume};});
const slugs=['thomala','archana','kalyanotsavam','abhishekam','deepalankara','brahmotsavam'];
await mkdir('test-results',{recursive:true});
try{
  await page.goto(base+'/',{waitUntil:'networkidle'});
  await expect(page.locator('.cinematic-intro')).toHaveAttribute('data-phase','ready');
  await expect(page.getByRole('progressbar',{name:'Preparing the opening experience'})).toHaveAttribute('aria-valuenow','4');
  assert.equal((await player()).src,null,'intro never autoplays');assert.equal(await page.locator('#main').evaluate(node=>node.inert),true);
  await page.screenshot({path:'test-results/premium-intro-desktop.png'});
  await page.getByLabel('Enter silently',{exact:true}).check();
  await page.getByRole('button',{name:'Enter the shrine',exact:true}).click();
  await expect(page.locator('.cinematic-intro')).toHaveCount(0);assert.equal(await page.locator('#main').evaluate(node=>node.inert),false);
  await expect.poll(async()=>(await player()).paused).toBe(false);assert.equal((await player()).count,1);
  await page.getByRole('link',{name:'Sacred Sevas',exact:true}).first().click();
  await expect.poll(async()=>(await player()).paused).toBe(true);
  await page.getByRole('link',{name:'Tirumala Digital Heritage home',exact:true}).click();
  await expect(page.locator('.cinematic-intro')).toHaveCount(0);
  await page.getByRole('link',{name:'Replay intro',exact:true}).first().click();
  await expect(page.locator('.cinematic-intro')).toHaveAttribute('data-phase','ready');
  await page.getByRole('button',{name:'Skip intro',exact:true}).click();await expect(page.locator('.cinematic-intro')).toHaveCount(0);
  const durations={};
  for(const slug of slugs){
    await page.goto(base+`/sevas/${slug}/`,{waitUntil:'networkidle'});assert.equal((await player()).src,null,'seva starts silently');
    await page.getByRole('button',{name:'Begin with ambience',exact:true}).click();
    await expect(page.locator('.devotional-audio')).toHaveAttribute('data-playing','true');
    await expect.poll(async()=>(await player()).duration).toBeGreaterThan(0);
    const audio=await player();assert.equal(audio.count,1);assert.ok(audio.src.endsWith('_original_ambience.wav'));assert.ok(Math.abs(audio.duration-16)<.1);durations[slug]=audio.duration;
    await expect(page.locator('.seva-audio-caption')).toContainText('synthesized');await expect(page.locator('.seva-chant-placeholder')).toContainText('awaiting an authorized recording');
    if(slug==='thomala'){await page.getByRole('button',{name:'Offer a symbolic flower',exact:true}).click();await expect(page.locator('.interaction-status')).toContainText('1 symbolic flower');}
    if(slug==='archana'){await page.getByRole('textbox',{name:'Search devotional names'}).fill('Govinda');await expect(page.locator('.sacred-name-list>button')).toHaveCount(1);await page.locator('.sacred-name-list>button').click();await expect(page.locator('.interaction-status')).toContainText('Govinda');}
    if(slug==='kalyanotsavam'){await page.getByRole('button',{name:'The divine celebration',exact:true}).click();await expect(page.locator('.wedding-explorer')).toContainText('Malayappa Swamy');}
    if(slug==='abhishekam'){await page.getByRole('button',{name:'Milk',exact:true}).click();await expect(page.locator('.ceremonial-vessel')).toHaveAttribute('aria-label',/Milk/);}
    if(slug==='deepalankara'){await page.getByRole('button',{name:'Light a symbolic diya',exact:true}).click();await expect(page.locator('.interaction-status')).toContainText('1 / 96');await page.getByRole('button',{name:'Illuminate the scene',exact:true}).click();await expect(page.locator('.interaction-status')).toContainText('96 / 96');}
    if(slug==='brahmotsavam'){await page.getByRole('button',{name:'Day 7',exact:true}).click();await expect(page.locator('.festival-day-story h3')).toHaveText('Sun & moon');}
    await page.getByRole('button',{name:'Open devotional audio controls',exact:true}).click();await page.getByRole('button',{name:'Mute Devotional Music',exact:true}).first().click();await expect(page.locator('.devotional-audio')).toHaveAttribute('data-playing','false');await page.getByRole('button',{name:'Unmute Devotional Music',exact:true}).first().click();await expect(page.locator('.devotional-audio')).toHaveAttribute('data-playing','true');await page.getByRole('button',{name:'Close audio controls',exact:true}).click();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'desktop overflow');
    await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');
    if(slug==='deepalankara'||slug==='thomala')await page.screenshot({path:`test-results/${slug}-interactive-mobile.png`,fullPage:true});
    await page.setViewportSize({width:1440,height:1000});
    await page.getByRole('link',{name:'Return to Sacred Seva Gallery',exact:true}).click();await expect.poll(async()=>(await player()).paused).toBe(true);assert.equal((await player()).src,null,'previous seva stops on client navigation');
  }
  const fallback=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const simple=await fallback.newPage();
  await simple.route('**/assets/intro/portal-1280.webp',route=>route.abort());
  await simple.goto(base+'/?intro=replay',{waitUntil:'networkidle'});await expect(simple.locator('.cinematic-intro')).toHaveAttribute('data-motion','false');await expect(simple.getByRole('button',{name:'Enter the shrine',exact:true})).toBeEnabled();await expect(simple.getByText('Some artwork is unavailable. You can still enter.',{exact:true})).toBeVisible();
  await simple.screenshot({path:'test-results/premium-intro-mobile.png'});await simple.getByRole('button',{name:'Enter the shrine',exact:true}).click();await expect(simple.locator('.cinematic-intro')).toHaveCount(0);await fallback.close();
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  await writeFile('test-results/intro-seva-audio-results.json',JSON.stringify({introRealLoading:true,skippable:true,silentDefault:true,soundEntry:true,sessionSkip:true,replay:true,failedImageFallback:true,reducedMotion:true,oneAudioElement:true,allSixWavsPlay:true,durations,sixInteractiveScenes:true,previousSevaStops:true,mobile:true,errors,failed},null,2));console.log('PASS: combined intro, real preparation, skip/replay/session, optional sound, mobile/reduced motion, six actual WAVs and interactive sevas, route cleanup and no duplicate players.');
}finally{await browser.close();}
