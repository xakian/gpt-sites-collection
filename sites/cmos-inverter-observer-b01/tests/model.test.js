import test from'node:test';import assert from'node:assert/strict';import{stateAt}from'../dist/model.js';
test('complementary stable paths and correct output',()=>{let lo=stateAt(3),hi=stateAt(13);assert(lo.pOn&&!lo.nOn&&lo.output===1);assert(hi.nOn&&!hi.pOn&&hi.output===0);});
test('output lags input and stable state has no charging current',()=>{assert(stateAt(7).input>0&&stateAt(7).output===1);assert(stateAt(17).input<1&&stateAt(17).output===0);for(const t of[3,13,22])assert(!stateAt(t).charging&&!stateAt(t).discharging);assert.equal(stateAt(23.999).output,stateAt(0).output);});
