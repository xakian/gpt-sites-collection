const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../dist/index.html'),'utf8'),src=html.match(/<script>([\s\S]*?)<\/script>/)[1];
new Function(src);
const cut=(a,b)=>src.slice(src.indexOf(a),src.indexOf(b));
const m=vm.runInNewContext('const DURATION=90;let time=0;'+cut('const LATTICE_SIZE=', 'function latticeLayout(')+'({data:latticeData})');
const distance=(a,b)=>Math.abs(a%5-b%5)+Math.abs(Math.floor(a/5)-Math.floor(b/5));
const start=m.data(0),end=m.data(90);
assert.equal(start.occupants[12],12);assert.equal(start.vacancy,13);
assert.equal(end.occupants[14],12);assert.equal(end.vacancy,13);assert.equal(end.dopantMoves,2);assert.equal(end.completed,6);
assert.deepEqual(Array.from(end.dopantPath),[12,13,14]);
let checked=0;
for(let i=0;i<=9000;i++){
 const d=m.data(i/100),ids=d.occupants.filter(x=>x!==null);
 assert.equal(ids.length,24);assert.equal(new Set(ids).size,24);assert.ok(!ids.includes(13));
 assert.equal(ids.filter(x=>x===12).length,1);assert.equal(d.occupants.filter(x=>x===null).length,1);assert.equal(d.occupants[d.vacancy],null);
 assert.equal(d.dopantMoves,d.completed===0?0:d.completed===6?2:1);
 assert.equal(d.vacancyPath.length,d.completed+1);
 for(let k=1;k<d.vacancyPath.length;k++)assert.equal(distance(d.vacancyPath[k],d.vacancyPath[k-1]),1);
 if(d.moving){assert.equal(distance(d.moving.from,d.moving.to),1);assert.equal(d.moving.to,d.vacancy);assert.ok(d.moving.atom!==null);assert.ok(d.moving.tween>=0&&d.moving.tween<=1);}
 // Scrubbing is independent of prior call order.
 assert.equal(JSON.stringify(d),JSON.stringify(m.data(i/100)));checked++;
}
for(let i=1;i<=6;i++){
 const before=m.data(i*15-1e-7),after=m.data(i*15);
 assert.ok(before.moving.tween>1-1e-10);assert.equal(after.occupants[before.moving.to],before.moving.atom);assert.equal(after.occupants[before.moving.from],null);
}
assert.equal(m.data(-1).completed,0);assert.equal(m.data(100).completed,6);
const meta=vm.runInNewContext(cut('const pages=[','function bindConcepts(')+'({pages,unitTerms,termsSources})');for(const a of [meta.pages,meta.unitTerms,meta.termsSources]){assert.ok(a.length>=21);assert.equal(a.length,meta.pages.length);}
const keys=[...new Set([...meta.unitTerms[20].map(x=>x.concept),...Array.from(meta.pages[20].html.matchAll(/data-concept="(.*?)"/g),x=>x[1])])];
assert.equal(keys.length,7);for(const key of keys)assert.ok(src.includes("active==='"+key+"'"),key);
const elements={};const ctx=new Proxy({}, {get:(o,k)=>o[k]??((...args)=>{for(const a of args)if(typeof a==='number')assert.ok(Number.isFinite(a));}),set:(o,k,v)=>(o[k]=v,true)});
const env={ctx,width:0,height:0,box:null,time:0,DURATION:90,document:{querySelector:id=>elements[id]??=( {textContent:'',setAttribute(){}} )},arrow:()=>{}};
vm.createContext(env);vm.runInContext(cut('const LATTICE_SIZE=','const SPECIES_TEMPERATURE='),env);
for(const width of [1360,650,390,360])for(const height of [350,420,650])for(const t of [0,12,15,30,45,60,75,88,90])for(const key of [null,...keys]){
 env.width=width;env.height=height;env.box={x:width<650?48:width*.14,y:Math.max(28,height*.07),w:width-(width<650?96:width*.28),h:height-Math.max(28,height*.07)-Math.max(30,height*.08)};env.time=t;
 vm.runInContext('drawLattice('+JSON.stringify(key)+',.7)',env);
 const l=vm.runInContext('latticeLayout()',env);assert.ok(l.step>=27.5);assert.ok(l.x>32&&l.x+l.span<width-32);assert.ok(l.y+l.span+66<height-30);
 assert.equal(elements['#latticeStep'].disabled,t===90);
}
console.log(JSON.stringify({syntax:'pass',pages:meta.pages.length,conservedStates:checked,atoms:24,vacancies:1,exchanges:6,dopantJumps:2,concepts:keys.length,transitionContinuity:'pass',renderContracts:'pass'}));
