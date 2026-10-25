import{chromium,expect}from'@playwright/test';
import assert from'node:assert/strict';
import{mkdir,writeFile}from'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3000';const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
await context.addInitScript(()=>{
  window.__micStarts=0;window.__micAborts=0;window.__spoken=[];
  class Recognition{start(){window.__micStarts++;window.__recognition=this;this.onstart?.();}abort(){window.__micAborts++;}stop(){this.onend?.();}}
  window.SpeechRecognition=Recognition;
  class Utterance{constructor(text){this.text=text;}}
  window.SpeechSynthesisUtterance=Utterance;
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>['en-IN','te-IN','hi-IN','ta-IN'].map(lang=>({lang,name:lang,localService:true})),addEventListener(){},removeEventListener(){},cancel(){},speak(utterance){window.__spoken.push({text:utterance.text,lang:utterance.lang});utterance.onstart?.();utterance.onboundary?.({charIndex:0,charLength:5});setTimeout(()=>utterance.onend?.(),100);}}});
});
const page=await context.newPage();const errors=[],failures=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failures.push(r.url());});page.on('request',r=>requests.push(r.url()+' '+(r.postData()||'')));
const root=()=>page.locator('.sankalpa-experience');const state=async value=>expect(root()).toHaveAttribute('data-state',value);
const next=()=>page.getByRole('button',{name:'Continue',exact:true}).click();
await mkdir('test-results',{recursive:true});
try{
  await page.goto(base+'/sankalpa/',{waitUntil:'networkidle'});await expect(page.locator('h1')).toHaveCount(1);assert.equal(await page.evaluate(()=>window.__micStarts),0);
  await page.getByRole('button',{name:'Open the shrine',exact:true}).click();await state('HARATHI');await expect(root()).toHaveAttribute('data-started','false');
  await page.getByRole('button',{name:'Begin Harathi',exact:true}).click();await expect(root()).toHaveAttribute('data-started','true');await page.getByRole('button',{name:'Skip Harathi',exact:true}).click();await state('GREETING');await expect(page.locator('.sankalpa-priest')).toHaveAttribute('data-facing','visitor');
  await next();await state('COLLECT_NAME');await expect(page.getByRole('button',{name:'Start microphone',exact:true})).toBeDisabled();assert.equal(await page.evaluate(()=>window.__micStarts),0);
  await page.getByLabel(/I consent to microphone use/).check();await page.getByRole('button',{name:'Start microphone',exact:true}).click();assert.equal(await page.evaluate(()=>window.__micStarts),1);await expect(page.getByRole('button',{name:'Stop microphone',exact:true})).toBeVisible();
  await page.evaluate(()=>window.__recognition.onresult({results:{length:1,0:{isFinal:true,0:{transcript:'Ravi'}}}}));await expect(page.getByLabel('Name',{exact:true})).toHaveValue('Ravi');
  await page.getByLabel('Name',{exact:true}).fill('Ravi Kumar');await next();await state('COLLECT_GOTHRAM');assert.ok(await page.evaluate(()=>window.__micAborts)>0);
  await page.getByRole('button',{name:'Skip this question',exact:true}).click();await state('COLLECT_FAMILY');await page.getByLabel('Family members',{exact:true}).fill('Ganesh, Pranay');await next();await state('COLLECT_INTENTION');await page.getByLabel('Prayer intention',{exact:true}).fill('Family wellbeing');await next();await state('CONFIRM_DETAILS');
  await expect(page.locator('.sankalpa-review')).toContainText('Not provided');await page.getByRole('button',{name:'Edit family',exact:true}).click();await page.getByLabel('Family members',{exact:true}).fill('Ganesh, Pranay, Meera');await next();await state('CONFIRM_DETAILS');await expect(page.locator('.sankalpa-review')).toContainText('Meera');
  await page.screenshot({path:'test-results/sankalpa-review-desktop.png'});
  await page.getByRole('button',{name:'Confirm my details',exact:true}).click();await state('SANKALPAM');await expect(page.locator('.sankalpa-speech')).toContainText('Ravi Kumar');await expect(page.locator('.sankalpa-speech')).toContainText('Family wellbeing');assert.ok(!await page.locator('.sankalpa-speech').textContent().then(text=>text.includes('Vasishta')));
  for(const label of ['తెలుగు','हिन्दी','தமிழ்','English']){await page.getByRole('button',{name:label,exact:true}).click();await expect(root()).toHaveAttribute('data-state','SANKALPAM');assert.ok(await page.locator('.sankalpa-speech').textContent());}
  await page.locator('.sankalpa-settings summary').click();await page.getByLabel(/Allow browser narration/).check();await expect.poll(()=>page.evaluate(()=>window.__spoken.length)).toBeGreaterThan(0);assert.equal(await page.evaluate(()=>window.__spoken.at(-1).lang),'en-IN');
  await next();await state('ARCHANA');await page.getByRole('button',{name:'Offer a symbolic flower',exact:true}).click();await expect(page.locator('.sankalpa-flowers svg')).toHaveCount(1);await next();await state('BLESSINGS');await expect(page.locator('.sankalpa-speech')).toContainText('Ravi Kumar');await page.getByRole('button',{name:'Complete this reflection',exact:true}).click();await state('COMPLETE');
  const storage=await page.evaluate(()=>JSON.stringify({local:{...localStorage},session:{...sessionStorage}}));for(const value of ['Ravi','Ganesh','Pranay','Meera','Family wellbeing'])assert.ok(!storage.includes(value),'no personal details persisted');assert.ok(!requests.some(request=>/Ravi|Ganesh|Pranay|Meera|Family%20wellbeing/.test(request)),'no personal details sent in application requests');
  await page.getByRole('button',{name:'Reset my details',exact:true}).click();await state('HARATHI');await page.getByRole('button',{name:'Skip Harathi',exact:true}).click();await next();await expect(page.getByLabel('Name',{exact:true})).toHaveValue('');
  for(const viewport of[{width:390,height:844},{width:320,height:568},{width:844,height:390}]){await page.setViewportSize(viewport);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');if(viewport.width===390)await page.screenshot({path:'test-results/sankalpa-mobile.png',fullPage:true});}
  await page.getByRole('button',{name:'Close personal prayer',exact:true}).click();await expect(root()).toHaveCount(0);await expect(page.locator('.shrine-room')).toHaveAttribute('data-open','true');
  await page.getByRole('button',{name:'Personal virtual prayer',exact:true}).click();await state('HARATHI');await expect(root()).toHaveAttribute('data-started','false');
  await page.emulateMedia({reducedMotion:'reduce'});await expect(root()).toHaveAttribute('data-motion','false');
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(base+'/darshan/');await page.getByRole('button',{name:'Open the shrine',exact:true}).click();await page.clock.install();await page.getByRole('button',{name:'Offer harathi',exact:true}).click();await page.clock.fastForward(12500);await state('GREETING');await expect(page.locator('.sankalpa-priest')).toHaveAttribute('data-facing','visitor');
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);await writeFile('test-results/sankalpa-results.json',JSON.stringify({allElevenStates:true,harathiSkip:true,frontFacingGuide:true,textFlow:true,microphoneConsent:true,recognitionAdapterMocked:true,editableTranscript:true,confirmationEdit:true,noGuessedGothram:true,fourLanguages:true,voiceAdapterMocked:true,personalizedReflection:true,symbolicArchana:true,reset:true,noPersonalStorage:true,noPersonalNetworkRequests:true,reopenClearsDetails:true,viewports:4,reducedMotion:true,errors,failures},null,2));console.log('PASS: Sankalpa eleven-state journey, consented voice adapters, editable details, no guessed gothram, four languages, prayer/Archana/blessing, privacy, reset and mobile/reduced motion.');
}finally{await browser.close();}
