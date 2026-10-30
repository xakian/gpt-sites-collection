import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const sandbox={window:{},URL};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('dist/data.js','utf8'),sandbox);
vm.runInContext(fs.readFileSync('dist/core.js','utf8'),sandbox);
const {KCore:K,SEED}=sandbox.window,d=K.validateData(SEED),clone=K.clone;
assert.equal(d.nodes.length,40);assert.equal(d.dimensions.length,5);
let allIDs=new Set(d.nodes.map(n=>n.id)),connected=new Set([d.coreId]);
while(true){let size=connected.size;for(const r of d.relations)if(connected.has(r.source)||connected.has(r.target)){connected.add(r.source);connected.add(r.target)}if(size===connected.size)break}
assert.equal(connected.size,allIDs.size,'All example nodes should be connected to the core');
for(const n of d.nodes)for(const dim of d.dimensions){assert.ok(n.scores[dim.id]);assert.ok(n.scores[dim.id].reason)}
const defaultGroups=K.groupNodes(d.nodes,'abstraction','math');assert.equal(defaultGroups.pending.length,1);assert.ok(defaultGroups.groups.some(g=>g.nodes.length>1));
assert.equal(defaultGroups.groups.reduce((s,g)=>s+g.nodes.length,0)+defaultGroups.pending.length,40);
const first=defaultGroups.groups.find(g=>g.nodes.length>1);assert.equal(new Set(first.nodes.map(n=>n.id)).size,first.nodes.length);
const swapped=K.groupNodes(d.nodes,'math','abstraction');for(const g of defaultGroups.groups)assert.ok(swapped.groups.some(s=>s.x===g.y&&s.y===g.x&&s.nodes.length===g.nodes.length));
assert.ok(K.filterNodes(d,'Gaussian').length>=3);assert.ok(K.filterNodes(d,'KD-032').length===1);assert.ok(K.filterNodes(d,'',['熱傳']).every(n=>n.domains.includes('熱傳')));assert.ok(K.filterNodes(d,'',[],['公式']).every(n=>n.type==='公式'));
let shared=d.relations.filter(r=>r.type==='part'&&r.target==='KD-014');assert.ok(shared.length>1);assert.equal(d.nodes.filter(n=>n.id==='KD-014').length,1);
let edited=clone(d);edited.nodes[39].scores.math={value:3,reason:'理解界面模型需要微積分。'};assert.equal(K.groupNodes(K.validateData(edited).nodes,'abstraction','math').pending.length,0);
assert.equal(K.serialize(K.validateData(JSON.parse(K.serialize(edited)))).replace(/"exportedAt": "[^"]+"/,''),K.serialize(edited).replace(/"exportedAt": "[^"]+"/,''));
const bad=(edit,pattern)=>{const n=clone(d);edit(n);assert.throws(()=>K.validateData(n),pattern)};
bad(d=>d.nodes[0].scores.math.value=0,/1–5/);bad(d=>d.nodes[0].scores.math.reason='',/理由/);bad(d=>d.nodes[0].id=d.nodes[1].id,/重複/);bad(d=>d.relations[0].target='missing',/不存在/);bad(d=>d.dimensions[0].rules.pop(),/完整/);bad(d=>d.relations.push({...d.relations[0],id:'dup'}),/重複/);bad(d=>d.relations.push({id:'cycle',source:'KD-015',target:'KD-001',type:'part',reason:'cycle'}),/循環/);bad(d=>d.nodes[0].sources[0].url='javascript:alert(1)',/http/);
let future=clone(d);future.dimensions.push({id:'new_dim',name:'新維度',rules:['一','二','三','四','五'],reference:'測試'});let validFuture=K.validateData(future);assert.equal(validFuture.nodes[0].scores.new_dim.value,null);
let custom=clone(d);custom.dimensions=custom.dimensions.slice(0,2).map((x,i)=>({...x,id:'custom_'+i}));custom.nodes.forEach(n=>n.scores={custom_0:{value:null,reason:''},custom_1:{value:2,reason:'測試'}});assert.equal(K.validateData(custom).dimensions.length,2);
// Check worked numerical examples and half-space Gaussian dose by quadrature.
assert.ok(Math.abs(Math.sqrt(1e-14*3600)*1e4-.06)<1e-12);
const Q=1e13,D=1e-13,t=3600,NB=1e16,cs=Q/Math.sqrt(Math.PI*D*t),xj=2*Math.sqrt(D*t*Math.log(cs/NB));assert.ok(Math.abs(cs/1e17-2.97354)<1e-4);assert.ok(Math.abs(xj*1e4-.699)<.001);
let total=0,dx=10*Math.sqrt(D*t)/10000;for(let i=0;i<10000;i++){const x=(i+.5)*dx;total+=cs*Math.exp(-x*x/(4*D*t))*dx}assert.ok(Math.abs(total/Q-1)<1e-9);
console.log(JSON.stringify({result:'PASS',nodes:d.nodes.length,relations:d.relations.length,coordinateGroups:defaultGroups.groups.length,pending:defaultGroups.pending.length,checks:'Connectivity, aggregation, axis switch, filters, shared children, editable scores, JSON round trip, invalid imports, future dimensions, worked examples'}));
