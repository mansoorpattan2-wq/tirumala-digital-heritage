import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import sharp from 'sharp';
import { dailyIndexAtScroll, readResume, sceneFromHash } from '../lib/pilgrimage-navigation.mjs';
const manifest = JSON.parse(await readFile(new URL('../public/assets/tirumala/scene-manifest.json', import.meta.url), 'utf8'));
const scenes = manifest.chapters;
const daily = scenes.filter(scene => !scene.optional);

test('the supplied narrative preserves order and keeps festival outside daily scroll', () => {
  assert.equal(daily.length, 7);
  assert.equal(scenes.length, 8);
  assert.ok(scenes.at(-1).optional);
  for (let i=0;i<8;i++) assert.ok(scenes[i].id.startsWith(String(i+1).padStart(2,'0')));
  assert.equal(manifest.supportsFreeRoam3D, false);
  assert.equal(manifest.supports360, false);
  for (const scene of scenes) assert.equal(scene.verifiedGeometry, false);
  assert.equal(dailyIndexAtScroll(100000, 0, 844, daily.length), 6);
  assert.equal(dailyIndexAtScroll(-100, 0, 844, daily.length), 0);
});

test('forward, reverse and resized scroll select the same daily scene', () => {
  for (const height of [568, 844, 1024]) {
    for (let i=6;i>=0;i--) assert.equal(dailyIndexAtScroll(100+i*height,100,height,7),i);
    for (let i=0;i<7;i++) assert.equal(dailyIndexAtScroll(100+i*height,100,height,7),i);
  }
});

test('resume and direct links reject malformed, obsolete and unknown data', () => {
  assert.equal(readResume('{broken', scenes), undefined);
  assert.equal(readResume(JSON.stringify({version:0,sceneId:scenes[0].id}),scenes),undefined);
  assert.equal(readResume(JSON.stringify({version:1,sceneId:'missing'}),scenes),undefined);
  assert.equal(sceneFromHash('#%E0%A4%A', scenes), undefined);
  assert.equal(sceneFromHash('#'+scenes[5].id,scenes).id,scenes[5].id);
  assert.equal(readResume(JSON.stringify({version:1,sceneId:scenes[7].id}),scenes).optional,true);
});

test('all eight originals and all responsive derivatives exist and decode', async () => {
  for (const scene of scenes) {
    const paths=[scene.original,scene.src,...scene.srcSet.split(',').map(v=>v.trim().split(' ')[0])];
    for (const path of new Set(paths)) {
      const file=new URL('../public'+path,import.meta.url);
      assert.ok((await stat(file)).size>0,path);
      const image=sharp(await readFile(file));
      const metadata=await image.metadata();
      assert.ok(Math.abs(metadata.width/metadata.height-scene.width/scene.height)<.006,path);
      await image.raw().toBuffer();
    }
  }
});
