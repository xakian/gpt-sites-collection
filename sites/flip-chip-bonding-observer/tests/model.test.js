import test from 'node:test';
import assert from 'node:assert/strict';
import {stateAt,stages,contactGeometry,jointPath} from '../dist/model.js';
const layout={cx:500,dieWidth:600,subY:300,hoverY:150};
test('every solder contact remains aligned and spans the same two surfaces after placement',()=>{
 for(let ms=11800;ms<35200;ms+=50){const s=stateAt(ms),cs=contactGeometry(s,layout);assert.equal(cs.length,4);for(const c of cs){assert.equal(c.x,c.padX);assert.equal(c.bottom,300);assert.ok(Math.abs(c.bottom-c.top-c.gap)<1e-9);assert.ok(c.gap>=30&&c.gap<=38);assert.ok(!/NaN|Infinity/.test(jointPath(c.x,c.top,c.bottom,s.wet,22)));}}
});
test('material transformation is monotonic until the completed assembly exits',()=>{
 let last=stateAt(0);for(let ms=20;ms<36000;ms+=20){const s=stateAt(ms);for(const prop of ['flip','align','place','wet','fill','cure'])assert.ok(s[prop]>=last[prop],`${prop} reversed at ${ms}`);if(s.fill>0)assert.equal(s.wet,1);if(s.cure>0)assert.equal(s.fill,1);last=s;}assert.equal(stateAt(34000).cure,1);assert.equal(stateAt(35500).visible,false);assert.equal(stateAt(0).fill,0);
});
test('all stage boundaries are continuous for geometry and material amounts',()=>{
 for(const {end}of stages.slice(0,-1)){const a=stateAt(end*1000-.01),b=stateAt(end*1000+.01);for(const prop of ['flip','align','place','wet','fill','cure','offset'])assert.ok(Math.abs(a[prop]-b[prop])<.001);}
});
test('flip keeps ordered contact identities and settles before descent',()=>{
 for(let ms=0;ms<=11800;ms+=20){const s=stateAt(ms),cs=contactGeometry(s,layout);assert.deepEqual(cs.map(c=>c.id),['A','B','C','D']);for(let i=1;i<4;i++)assert.ok(cs[i].x>cs[i-1].x);if(s.place>0){assert.equal(s.flip,1);assert.equal(s.align,1);}}
});
