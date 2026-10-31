import {test} from 'node:test';
import assert from 'node:assert/strict';
import {evaluate,STEPS,DURATION,OVERVIEW} from '../dist/topic.js';
import {layoutFor} from '../dist/layout.js';
test('seven scientific keyframes preserve exposure, development, etch and strip order',()=>{
 assert.equal(DURATION,32000);assert.equal(STEPS.length,7);
 const frames=STEPS.map(s=>evaluate(s.key));
 assert.equal(frames[0].resist,0);assert.equal(frames[0].filmCenter,1);
 assert.equal(frames[2].expose,1);assert.equal(frames[2].centerResist,1);assert.equal(frames[2].filmCenter,1);
 assert.equal(frames[3].centerResist,0);assert.equal(frames[3].resist,1);assert.equal(frames[3].filmCenter,1);
 assert.equal(frames[4].filmCenter,0);assert(frames[4].resist>.9);
 assert.equal(frames[5].resist,0);assert.equal(frames[5].filmCenter,0);
 assert.equal(evaluate(OVERVIEW).resist,0);assert.equal(evaluate(OVERVIEW).sampleVisible,true);
});
test('every millisecond keeps bounded materials and mutually separate processing tools',()=>{
 for(let t=0;t<DURATION;t++){
  const s=evaluate(t);for(const key of ['resist','centerResist','filmCenter','coat','expose','develop','etch','strip'])assert(s[key]>=0&&s[key]<=1,`${t}: ${key}`);
  assert(s.centerResist<=s.resist);assert(s.develop===0||s.expose===1);
  assert(s.etch===0||s.develop===1);assert(s.strip===0||s.etch===1);
  assert(!(s.developer>0&&s.plasma>0));assert(!(s.optical>0&&s.developer>0));assert(!(s.plasma>0&&s.stripper>0));
 }
});
test('removal is monotonic and finished film never returns while the sample exits',()=>{
 let prior=evaluate(12000);
 for(let t=12001;t<DURATION;t++){
  const s=evaluate(t);assert(s.centerResist<=prior.centerResist+1e-12);assert(s.filmCenter<=prior.filmCenter+1e-12);
  if(t>=27000){assert.equal(s.resist,0);assert.equal(s.filmCenter,0);}
  prior=s;
 }
});
test('seek calculations are deterministic and material geometry joins continuously',()=>{
 const keys=['resist','centerResist','filmCenter','optical','entry','exit'];
 for(const t of [1200,3000,3200,4900,7000,7800,7950,8200,10300,10600,11300,11900,12000,12900,15100,17000,17900,21400,23000,23700,25500,27000,30200,31600]){
  const before=evaluate(t-1),after=evaluate(t+1);for(const k of keys)assert(Math.abs(before[k]-after[k])<.01,`${t}: ${k}`);
  assert.deepEqual(evaluate(t),evaluate(t));
 }
});
test('old sample leaves before the fresh starting geometry can be visible',()=>{
 assert.equal(evaluate(0).sampleVisible,false);assert.equal(evaluate(DURATION-1).sampleVisible,false);
 assert.equal(evaluate(DURATION-1).filmCenter,0);assert.equal(evaluate(0).filmCenter,1);
 assert.equal(evaluate(1500).offset,0);assert.equal(evaluate(30000).offset,0);
 assert(evaluate(30900).offset>0);assert(evaluate(600).offset<0);
});
test('five required sizes retain optical separation and visible material dimensions',()=>{
 for(const [w,h] of [[1280,364],[1024,632],[390,708],[360,424],[844,254]]){
  const l=layoutFor(w,h);assert(l.x>=0);assert(l.x+l.w<w);assert(l.siliconY+l.siliconH<h);
  assert(l.maskY+13<l.resistY);assert(l.maskY+l.lensOffset+7<l.resistY);
  assert(l.left-l.x>l.font*4);assert(l.right<l.x+l.w);assert(l.resistH>=32);
 }
});
