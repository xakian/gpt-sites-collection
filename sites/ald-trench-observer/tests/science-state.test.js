import test from 'node:test';
import assert from 'node:assert/strict';
import {stateAt,siteState} from '../dist/model.js';
import {layout,surfacePoint} from '../dist/layout.js';
const g=layout(390,708);
test('all sites retain chemically bound material through first purge; oxide through second purge',()=>{
 for(let c=0;c<3;c++)for(const site of g.sites){
  for(const t of [7,7.5,8.99]){const p=siteState(stateAt((t+c*14)*1000),site);assert.equal(p.al,1);assert.equal(p.thickness,c);}
  for(const t of [14,15,15.999]){const p=siteState(stateAt((t+c*14)*1000),site);assert.equal(p.al,0);assert.equal(p.thickness,c+1);}
 }
});
test('surface depth delays reaction; saturation stops further growth',()=>{
 const top={depth:0,index:0},bottom={depth:1,index:0};
 assert.equal(siteState(stateAt(3500),top).al,1);assert.equal(siteState(stateAt(3500),bottom).al,0);
 for(const site of g.sites)assert.deepEqual(siteState(stateAt(6200),site),siteState(stateAt(6900),site));
});
test('film never thins during processing; direct seek gives same states as sequential sampling',()=>{
 for(const site of g.sites){let last=0;for(let ms=0;ms<46000;ms+=25){const v=siteState(stateAt(ms),site);assert.ok(v.thickness>=last-1e-10);last=v.thickness;}assert.equal(last,3);}
 const targets=[1000,4400,6700,8600,11900,15700,43600,47000];const direct=targets.map(t=>g.sites.map(v=>siteState(stateAt(t),v)));
 targets.forEach((t,i)=>assert.deepEqual(g.sites.map(v=>siteState(stateAt(t),v)),direct[i]));
});
test('each boundary preserves surface state except invisible substrate replacement',()=>{
 for(const t of [2,7,9,14,16,21,23,28,30,35,37,42,44,46])for(const site of g.sites){const a=siteState(stateAt(t*1000-.001),site),b=siteState(stateAt(t*1000+.001),site);assert.ok(Math.abs(a.thickness-b.thickness)<.001);assert.ok(Math.abs(a.al-b.al)<.001);}
 assert.equal(stateAt(47999.999).completed,3);assert.ok(stateAt(47999.999).shift>.999);assert.equal(stateAt(48000).completed,0);assert.equal(stateAt(48000).shift,-1);assert.equal(stateAt(50000).shift,0);
});
test('bottom reactive sites remain on the exposed surface, not buried in the sidewall',()=>{
 for(const [w,h]of [[1280,364],[1024,632],[390,708],[360,424],[844,254]]){const g=layout(w,h);for(const site of g.sites.filter(v=>v.seg===2)){const pt=surfacePoint(site,3*g.layer,g);assert.ok(pt[0]>g.left+3*g.layer&&pt[0]<g.right-3*g.layer);assert.equal(pt[1],g.bottom-3*g.layer);}}
});
