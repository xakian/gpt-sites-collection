import test from 'node:test';import assert from 'node:assert/strict';import{stateAt}from'../dist/model.js';
test('bias polarity, barrier and depletion respond consistently',()=>{const z=stateAt(3),f=stateAt(11),r=stateAt(23);assert(f.width<z.width&&z.width<r.width);assert(f.barrier<z.barrier&&z.barrier<r.barrier);assert.equal(f.bias,1);assert.equal(r.bias,-1);});
test('same junction returns continuously to zero bias',()=>{for(const t of [6,8,14,17,20,26]){assert(Math.abs(stateAt(t-.001).width-stateAt(t+.001).width)<.001);}assert(Math.abs(stateAt(29.999).width-stateAt(0).width)<1e-5);});
