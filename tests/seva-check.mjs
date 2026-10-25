import{chromium,expect}from'@playwright/test';
import assert from'node:assert/strict';
import{mkdir,writeFile}from'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3000';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[],failed=[];
page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.status()>=400&&response.url().startsWith(base))failed.push(response.url());});
const slugs=['thomala','archana','kalyanotsavam','abhishekam','deepalankara','brahmotsavam'];
const chapterIds=['before-dawn','awakening','heritage','meaning','closing'];
const stage=()=>page.locator('.awakening-stage');
async function choose(i){await page.getByLabel('Choose a Suprabhatam chapter').selectOption(String(i));await expect(stage()).toHaveAttribute('data-chapter',chapterIds[i]);await expect(stage()).toHaveAttribute('data-ready','true');}
await mkdir('test-results',{recursive:true});
try{
  for(const viewport of[{width:1440,height:1000},{width:390,height:844}]){
    await page.setViewportSize(viewport);
    for(const route of['/sevas/',...slugs.map(slug=>`/sevas/${slug}/`),'/sevas/suprabhatam/']){
      const response=await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(response.status(),200,route);await expect(page.locator('h1')).toHaveCount(1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' overflow');
      await page.locator('img').evaluateAll(async images=>{for(const image of images){image.loading='eager';await image.decode();}});
      if(route==='/sevas/'){await expect(page.locator('.seva-card')).toHaveCount(7);await expect(page.locator('.seva-extra-art')).toHaveCount(7);await page.screenshot({path:`test-results/sevas-${viewport.width}.png`,fullPage:true});}
    }
  }
  await page.goto(base+'/sevas/thomala/');await page.getByRole('button',{name:'Mark as explored',exact:true}).click();await page.reload();await expect(page.getByRole('button',{name:'Marked as explored',exact:true})).toBeVisible();
  await page.goto(base+'/sevas/');await expect(page.locator('.seva-card').nth(1)).toContainText('Explored');
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/sevas/suprabhatam/');await page.getByRole('button',{name:'Begin Suprabhatam',exact:true}).click();await expect(stage()).toHaveAttribute('data-ready','true');
  for(let i=1;i<5;i++){await page.getByRole('button',{name:'Next Suprabhatam chapter',exact:true}).click();await expect(stage()).toHaveAttribute('data-chapter',chapterIds[i]);await expect(stage()).toHaveAttribute('data-ready','true');}
  await choose(2);await page.getByRole('button',{name:'Gateway',exact:true}).click();await expect(page.getByText('The gopuram',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Close architecture explanation'}).click();
  await choose(3);await expect(page.locator('.awakening-hymn-sections article')).toHaveCount(4);assert.equal(await page.locator('.awakening-hymn-sections article>span').evaluateAll(nodes=>nodes.reduce((sum,node)=>sum+Number(node.textContent),0)),70);
  await page.getByRole('button',{name:'తెలుగు',exact:true}).click();await expect(page.locator('.awakening-hymn-sections')).toHaveAttribute('lang','te');
  for(const viewport of[{width:1440,height:1000},{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
    await page.setViewportSize(viewport);await expect(stage()).toHaveAttribute('data-chapter','meaning');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'experience overflow');const nav=await page.locator('.awakening-navigation').boundingBox();assert.ok(nav.y>=0&&nav.y+nav.height<=viewport.height+2,'navigation visible');await page.screenshot({path:`test-results/suprabhatam-meaning-${viewport.width}.png`});
  }
  await page.setViewportSize({width:390,height:844});await choose(0);await page.locator('.awakening-story').click();await page.keyboard.press('ArrowRight');await expect(stage()).toHaveAttribute('data-chapter','awakening');
  await page.evaluate(()=>window.scrollTo({top:innerHeight*2,behavior:'instant'}));await expect(stage()).toHaveAttribute('data-chapter','heritage');
  await choose(4);await page.getByRole('link',{name:'Finish & return to Seva Gallery',exact:true}).click();await expect(page.locator('.seva-card').first()).toContainText('Explored');
  await page.goto(base+'/sevas/suprabhatam/');await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'Begin with Stotram accompaniment',exact:true}).click();await expect(page.locator('.awakening')).toHaveAttribute('data-motion','false');await expect(page.locator('.devotional-audio')).toHaveAttribute('data-playing','true');
  await page.getByRole('button',{name:'Replay experience',exact:true}).click();await expect(page.getByRole('button',{name:'Begin Suprabhatam',exact:true})).toBeVisible();
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  await writeFile('test-results/seva-results.json',JSON.stringify({routes:8,galleryCards:7,extraImages:7,chapters:5,viewports:4,languageSwitch:true,hymnCount:70,hotspots:true,keyboard:true,nativeScroll:true,completionPersistence:true,reducedMotion:true,existingAudioConnected:true,errors,failed},null,2));console.log('PASS: eight seva routes, seven cards/extras, five chapters, languages, 70 verses, hotspots, keyboard/scroll, completion, mobile and reduced-motion audio.');
}finally{await browser.close();}
