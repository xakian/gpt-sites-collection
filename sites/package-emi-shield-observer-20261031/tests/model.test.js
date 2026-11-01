import test from 'node:test';import assert from 'node:assert/strict';import {stateAt} from '../dist/model.js';
test('先遮蔽再鍍，去遮蔽與退場保留銅殼',()=>{for(let t=0;t<30;t+=.01){const s=stateAt(t);if(s.top>0)assert.equal(s.seat,1);if(s.unmask>0){assert.equal(s.top,1);assert.equal(s.sides,1);}if(s.shield)assert.equal(s.board,1);if(s.exit>0)assert.equal(s.sides,1);}});
