import test from 'node:test';
import assert from 'node:assert/strict';
import {stateAt,stages,DURATION} from '../dist/model.js';
test('material dependency and preservation throughout every 10ms of a cycle',()=>{
 for(let t=0;t<DURATION/1000;t+=.01){const s=stateAt(t);
  if(s.barrier>0){assert.equal(s.etch,1);assert.equal(s.mask,0);}
  if(s.seed>0)assert.equal(s.barrier,1);
  if(s.fill>0)assert.equal(s.seed,1);
  if(s.copperPolish>0)assert.equal(s.fill,1);
  if(s.barrierPolish>0)assert.equal(s.copperPolish,1);
  if(s.entry>0)assert.equal(s.exit,1,'finished sample must leave before a fresh sample enters');
 }
});
test('stage keyframes are valid and cover all stages, including the end slider',()=>{
 stages.forEach((s,i)=>assert.equal(stateAt(s.key).stage,i));
 assert.equal(stages.at(-1).end*1000,DURATION);
 assert.equal(stateAt(44).stage,8);
 assert.equal(stateAt(44).entry,1);
});
test('scrubbing is deterministic; material transformations never reverse within a sample',()=>{
 const keys=['etch','barrier','seed','fill','copperPolish','barrierPolish','exit','entry'];
 let previous=stateAt(0);
 for(let t=.01;t<44;t+=.01){const current=stateAt(t);for(const k of keys)assert.ok(current[k]>=previous[k],k);previous=current;}
 const expected=stateAt(27.5);stateAt(43);stateAt(2);assert.deepEqual(stateAt(27.5),expected);
});
