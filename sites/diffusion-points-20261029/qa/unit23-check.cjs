const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../dist/index.html'),'utf8'),src=html.match(/<script>([\s\S]*?)<\/script>/)[1];new Function(src);
const cut=(a,b)=>src.slice(src.indexOf(a),src.indexOf(b));
const model=vm.runInNewContext('let solubilityTotal=18;'+cut('const SOLUBILITY_LIMIT=','function solubilityLayout(')+'({data:solubilityData})');
for(let n=0;n<=24;n++){
 const d=model.data(n);assert.equal(d.total,n);assert.equal(d.dissolved+d.excess,n);assert.equal(d.atoms.length,n);assert.equal(new Set(d.atoms.map(a=>a.id)).size,n);assert.equal(d.atoms.filter(a=>a.dissolved).length,d.dissolved);
 assert.equal(d.dissolved,n<=12?n:12);assert.equal(d.excess,n<=12?0:n-12);assert.equal(d.limit,12);
 if(n){const prev=model.data(n-1);assert.equal(d.dissolved-prev.dissolved,n<=12?1:0);assert.equal(d.excess-prev.excess,n<=12?0:1);}
}
assert.equal(model.data(-3).total,0);assert.equal(model.data(30).total,24);
const meta=vm.runInNewContext(cut('const pages=[','function bindConcepts(')+'({pages,unitTerms,termsSources})');for(const a of [meta.pages,meta.unitTerms,meta.termsSources]){assert.ok(a.length>=23);assert.equal(a.length,meta.pages.length);}
const keys=[...new Set([...meta.unitTerms[22].map(x=>x.concept),...Array.from(meta.pages[22].html.matchAll(/data-concept="(.*?)"/g),x=>x[1])])];assert.equal(keys.length,6);for(const key of keys)assert.ok(src.includes("active==='"+key+"'"),key);
const ctx=new Proxy({}, {get:(o,k)=>o[k]??((...args)=>{for(const a of args)if(typeof a==='number')assert.ok(Number.isFinite(a));}),set:(o,k,v)=>(o[k]=v,true)});
const elements={},env={ctx,width:0,height:0,box:null,solubilityTotal:18,document:{querySelector:id=>elements[id]??={textContent:''}},dot:()=>{},strokeRect:()=>{}};
vm.createContext(env);vm.runInContext(cut('const SOLUBILITY_LIMIT=','const ACTIVATION_TOTAL='),env);
let renders=0;
for(const w of [1360,800,650,390,360])for(const h of [388,430,660])for(let n=0;n<=24;n++){
 env.width=w;env.height=h;env.box={x:w<650?48:w*.14,y:Math.max(28,h*.07),w:w-(w<650?96:w*.28),h:h-Math.max(28,h*.07)-Math.max(30,h*.08)};env.solubilityTotal=n;
 const l=vm.runInContext('solubilityLayout()',env),d=vm.runInContext('solubilityData()',env),points=d.atoms.map(a=>vm.runInContext('solubilityAtomPoint('+JSON.stringify(a)+','+JSON.stringify(l.sample)+')',env));
 assert.ok(l.chart.w>120&&l.chart.h>=90);assert.ok(l.chart.y+l.chart.h+35<h-38);
 for(const p of points){assert.ok(p.x>l.sample.x&&p.x<l.sample.x+l.sample.w);assert.ok(p.y>l.sample.y&&p.y<l.sample.y+l.sample.h);}
 for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){const radius=a=>a.dissolved?4:Math.min(5,l.sample.h*.035);assert.ok(Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y)>radius(d.atoms[i])+radius(d.atoms[j]));}
 for(const key of [null,...keys]){vm.runInContext('drawSolubility('+JSON.stringify(key)+',.7)',env);renders++;}
}
console.log(JSON.stringify({syntax:'pass',pages:meta.pages.length,states:25,massBalance:'pass',thresholdBoundary:'pass',markerSeparation:'pass',concepts:6,renderChecks:renders}));
