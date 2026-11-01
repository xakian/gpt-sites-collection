import test from 'node:test';import assert from 'node:assert/strict';import {stateAt} from '../dist/model.js';
test('mold follows placement; release follows cure and support',()=>{for(let t=0;t<32;t+=.02){const s=stateAt(t);if(s.mold>0)assert.deepEqual(s.die,[1,1,1]);if(s.release>0){assert.equal(s.cure,1);assert.equal(s.hold,1);}if(s.exit>0)assert.equal(s.release,1);}});
