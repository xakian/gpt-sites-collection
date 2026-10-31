import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {sceneState} from '../dist/state.js';
import {drawScene} from '../dist/scene.js';
const count=(html,cls)=>(html.match(new RegExp('class="'+cls+'"','g'))||[]).length;
test('implant, mask removal and heat follow the chosen process order',()=>{
 for(let t=0;t<=40;t+=.05){const s=sceneState(t);if(s.local<12.5)assert.equal(s.mask,1);if(s.heat>0)assert.equal(s.mask,0);if(s.electrons>0){assert.equal(s.repair,1);assert.equal(s.heat,0);}}
});
test('three retained dopants and every representative silicon atom survive strip and anneal',()=>{
 for(let t=10;t<37.5;t+=.05){const s=sceneState(t),svg=drawScene(s,1280,364);assert.equal(count(svg,'si')+count(svg,'si displaced'),55);assert.equal(count(svg,'phosphorus'),s.mask>0?5:3);}
});
test('new material is pristine and the material geometry is continuous at loop seam',()=>{
 const a=drawScene(sceneState(0),390,708),b=drawScene(sceneState(40),390,708);
 const material=svg=>svg.slice(svg.indexOf('<g id="material"'),svg.indexOf('</g>',svg.indexOf('<g id="material"')));
 assert.equal(material(a),material(b));assert.equal(count(b,'phosphorus'),0);assert.equal(count(b,'electron'),0);
});
test('all baseline sizes render finite geometry throughout the cycle',()=>{
 for(const [w,h] of [[1280,500],[1024,768],[390,844],[360,560],[844,390]])for(let t=0;t<=40;t+=.1){const svg=drawScene(sceneState(t),w,h-136);assert.ok(!/NaN|Infinity/.test(svg));assert.ok(svg.endsWith('</g>'));}
});
test('the shared shell is unchanged from the 1.0.0 manifest',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../dist/shared/template-manifest.json',import.meta.url)));
 assert.equal(manifest.version,'1.0.0');for(const [name,expected] of Object.entries(manifest.files)){const data=fs.readFileSync(new URL('../dist/shared/'+name,import.meta.url));assert.equal(crypto.createHash('sha256').update(data).digest('hex'),expected);}
});
