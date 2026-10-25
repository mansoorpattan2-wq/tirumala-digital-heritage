import test from 'node:test';
import assert from 'node:assert/strict';
import { samplePath } from '../lib/camera-path.mjs';
const chapters=[{cameraStart:[0,0,0],cameraEnd:[10,5,0],target:[0,0,0],range:[0,.5]},{cameraStart:[10,5,0],cameraEnd:[0,10,10],target:[0,0,0],range:[.5,1]}];
test('camera reaches both endpoints and clamps overscroll',()=>{assert.deepEqual(samplePath(chapters,-.2).position,[0,0,0]);assert.deepEqual(samplePath(chapters,1.2).position,[0,10,10])});
test('camera path is continuous at a chapter boundary',()=>{const a=samplePath(chapters,.5-1e-6).position,b=samplePath(chapters,.5).position;assert.ok(Math.hypot(...a.map((v,i)=>v-b[i]))<.0001);assert.equal(samplePath(chapters,.5).index,1)});
test('reverse scrolling gives the same position without accumulated state',()=>{const forward=Array.from({length:101},(_,i)=>samplePath(chapters,i/100));for(let i=100;i>=0;i--)assert.deepEqual(samplePath(chapters,i/100),forward[i])});
