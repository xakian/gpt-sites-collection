const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../dist/index.html'),'utf8'),src=html.match(/<script>([\s\S]*?)<\/script>/)[1];new Function(src);
const cut=(a,b)=>src.slice(src.indexOf(a),src.indexOf(b));
const model=vm.runInNewContext('const DURATION=90;let activationCount=4,time=0;'+cut('const ACTIVATION_TOTAL=','function activationLayout(')+'({data:activationData})');
let checked=0;
for(let count=0;count<=8;count++)for(let tick=0;tick<=900;tick++){
 const d=model.data(count,tick/10);
 assert.equal(d.total,8);assert.equal(d.atoms.length,8);assert.equal(new Set(d.atoms.map(a=>a.id)).size,8);
 assert.equal(d.active+d.inactive,8);assert.equal(d.fraction,count/8);
 assert.equal(d.atoms.filter(a=>a.active).length,count);assert.equal(d.electrons.length,count);assert.equal(d.ions,count);
 assert.equal(d.atoms.reduce((n,a)=>n+a.charge,0)+d.electrons.reduce((n,e)=>n+e.charge,0),0);assert.equal(d.netCharge,0);
 assert.equal(new Set(d.electrons.map(e=>e.id)).size,count);
 for(let i=0;i<d.electrons.length;i++)for(let j=i+1;j<d.electrons.length;j++)assert.ok(Math.abs(d.electrons[i].y-d.electrons[j].y)>.10499);
 for(const e of d.electrons){assert.ok(e.x>=.08-1e-12&&e.x<=.92+1e-12);assert.ok(e.y>=.0525-1e-12&&e.y<=.9475+1e-12);assert.ok(d.atoms.find(a=>a.id===e.id).active);}
 checked++;
}
for(let count=0;count<=8;count++){
 const a=model.data(count,0),b=model.data(count,90);
 for(let i=0;i<count;i++){assert.ok(Math.abs(a.electrons[i].x-b.electrons[i].x)<1e-12);assert.ok(Math.abs(a.electrons[i].y-b.electrons[i].y)<1e-12);}
}
assert.equal(model.data(-1).active,0);assert.equal(model.data(9).active,8);
const meta=vm.runInNewContext(cut('const pages=[','function bindConcepts(')+'({pages,unitTerms,termsSources})');for(const a of [meta.pages,meta.unitTerms,meta.termsSources]){assert.ok(a.length>=22);assert.equal(a.length,meta.pages.length);}
const keys=[...new Set([...meta.unitTerms[21].map(x=>x.concept),...Array.from(meta.pages[21].html.matchAll(/data-concept="(.*?)"/g),x=>x[1])])];
assert.equal(keys.length,8);for(const key of keys)assert.ok(src.includes("active==='"+key+"'"),key);
const ctx=new Proxy({}, {get:(o,k)=>o[k]??((...args)=>{for(const a of args)if(typeof a==='number')assert.ok(Number.isFinite(a));}),set:(o,k,v)=>(o[k]=v,true)});
const elements={},env={ctx,width:0,height:0,box:null,time:0,DURATION:90,activationCount:4,document:{querySelector:id=>elements[id]??={textContent:''}},dot:()=>{},arrow:()=>{}};
vm.createContext(env);vm.runInContext(cut('const ACTIVATION_TOTAL=','// An abstract site graph:'),env);
for(const w of [1360,650,390,360])for(const h of [340,420,650])for(const count of [0,4,8])for(const key of [null,...keys]){
 env.width=w;env.height=h;env.box={x:w<650?48:w*.14,y:Math.max(28,h*.07),w:w-(w<650?96:w*.28),h:h-Math.max(28,h*.07)-Math.max(30,h*.08)};env.activationCount=count;
 vm.runInContext('drawActivation('+JSON.stringify(key)+',.7)',env);
 const l=vm.runInContext('activationLayout()',env);assert.ok(l.left.w>100&&l.right.w>100&&l.barW>100);assert.equal(l.left.w,l.right.w);assert.ok(l.barY+52<h-37);
}
console.log(JSON.stringify({syntax:'pass',pages:meta.pages.length,states:checked,totalAtoms:8,neutrality:'pass',activationAndIonizationAssumptions:'separate',periodicMotion:'continuous',concepts:8,renderContracts:'pass'}));
