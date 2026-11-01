import assert from 'node:assert/strict';
import {stateAt} from './dist/model.js';import {draw} from './dist/graphics.js';
for(const [w,h] of [[1280,364],[1024,632],[390,708],[360,424],[844,254]]){
 for(const t of [0,1.99,2,2.01,8.99,9,9.01,15.99,16,16.01,22,25,28.99]){
  const svg=draw(stateAt(t),{w,h});assert(!/NaN|undefined|Infinity/.test(svg));
  const ids=[...svg.matchAll(/data-die="(\d)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
  assert(ids.includes(t<9?'1':t<16?'2':'3'),`Tracked die missing at ${t}`);
 }
}
assert.equal(stateAt(25.99).cured,false);assert.equal(stateAt(26).cured,true);
console.log('PASS: 5 layouts × 14 key/boundary states, unique die identities and cure boundary.');
