import assert from 'node:assert/strict';
import fs from 'node:fs';
import {metrics,partition,AXES} from '../dist/core.mjs';
import {coordinatePoints,overviewLayout,overviewEdges,graphRegions,nearestPoint} from '../dist/map-layout.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../dist/data.json',import.meta.url))),before=JSON.stringify(data),counts=metrics(data);
let checks=0;
for(const [w,h]of [[1440,900],[390,844],[320,740],[844,390]])for(const x of Object.keys(AXES))for(const y of Object.keys(AXES))if(x!==y){
 const central=partition(data,x,y,counts).central,box={x:42,y:108,w:w-70,h:h-240},p=coordinatePoints(central,x,y,counts,box);
 assert.equal(p.length,central.length);assert.equal(new Set(p.map(t=>t.id)).size,p.length);
 assert.deepEqual(p,coordinatePoints([...central].reverse(),x,y,counts,box));
 for(const t of p){assert.ok(Number.isFinite(t.x)&&Number.isFinite(t.y));assert.ok(t.x>=box.x&&t.x<=box.x+box.w&&t.y>=box.y&&t.y<=box.y+box.h);}
 for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++)assert.ok(Math.hypot(p[i].x-p[j].x,p[i].y-p[j].y)>5.2,`${w}x${h} ${x}${y} overlapping dots ${p[i].id},${p[j].id}`);
 checks++;
}
const overview=overviewLayout(data);assert.equal(overview.points.length,48);assert.equal(overview.edges.length,68);assert.deepEqual(overview,overviewLayout({...data,topics:[...data.topics].reverse(),relations:[...data.relations].reverse()}));
assert.equal(JSON.stringify(data),before);
assert.equal(overviewEdges({...data,relations:[...data.relations,...data.relations]}).length,68);
assert.deepEqual(overviewLayout({topics:[],relations:[]}),{points:[],edges:[]});
assert.deepEqual(overviewLayout({topics:[{id:'one'}],relations:[]}).points,[{id:'one',x:.5,y:.5}]);
for(const [w,h]of [[1440,900],[390,844],[320,740],[844,390]]){const r=graphRegions(w,h);for(const b of [r.local,r.global])assert.ok(b.x>=0&&b.y>=0&&b.x+b.w<=w&&b.y+b.h<=h);}
assert.equal(nearestPoint([{id:'a',x:0,y:0},{id:'b',x:10,y:0}],9,0).id,'b');assert.equal(nearestPoint([{id:'a',x:0,y:0}],100,100),null);
console.log(`Passed: ${checks} axis/viewport layouts, independent dots, deterministic overview, edge deduplication, boundaries, nearest selection, unchanged data.`);
