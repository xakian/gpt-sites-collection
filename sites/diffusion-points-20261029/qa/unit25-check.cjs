const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../dist/index.html'),'utf8'),src=html.match(/<script>([\s\S]*?)<\/script>/)[1];new Function(src);
const cut=(a,b)=>src.slice(src.indexOf(a),src.indexOf(b));
const m=vm.runInNewContext('let time=0,sheetThickness=.4,sheetSquares=2;'+cut('const SHEET_RHO=','function sheetLayout(')+'({data:sheetData,markers:sheetMarkers,period:SHEET_PERIOD})');
let states=0;
for(let layer=1;layer<=5;layer++)for(let n=1;n<=4;n++){
 const d=m.data(layer*.2,n);states++;
 const expectedRs=1000/layer,expectedR=1000*n/layer,expectedI=100*layer/n;
 assert.ok(Math.abs(d.rs-expectedRs)<1e-9);assert.ok(Math.abs(d.r-expectedR)<1e-9);assert.ok(Math.abs(d.microamps-expectedI)<1e-9);
 assert.ok(Math.abs(d.rs*d.tCm-.02)<1e-12);assert.ok(Math.abs(d.conductance*d.r-1)<1e-12);assert.ok(Math.abs(d.field-50/n)<1e-10);
 // Independently use R=rho*L/A and sum uniform depth conductance.
 assert.ok(Math.abs(d.r-.02*d.lengthCm/(d.widthCm*d.tCm))<1e-9);assert.ok(Math.abs((d.tCm/.02)*d.rs-1)<1e-12);
 assert.ok(Math.abs(d.markerRate/d.current-10000/3)<1e-8);
 for(let t=0;t<=36;t+=.25){const points=m.markers(d,t);assert.equal(points.length,4*n*layer);for(const p of points){assert.ok(p.x>=0&&p.x<1);assert.ok(p.row>=0&&p.row<layer);}}
 // Unlabelled marker field repeats seamlessly; IDs can cycle through slots.
 const normalize=t=>Array.from(m.markers(d,t),p=>p.row+p.x).sort((a,b)=>a-b);
 const start=normalize(.123),end=normalize(.123+m.period);start.forEach((x,i)=>assert.ok(Math.abs(x-end[i])<1e-12));
}
assert.equal(m.data(-1,0).layers,1);assert.equal(m.data(10,100).n,4);
const meta=vm.runInNewContext(cut('const pages=[','function bindConcepts(')+'({pages,unitTerms,termsSources})');for(const a of [meta.pages,meta.unitTerms,meta.termsSources]){assert.ok(a.length>=25);assert.equal(a.length,meta.pages.length);}
const keys=[...new Set([...meta.unitTerms[24].map(x=>x.concept),...Array.from(meta.pages[24].html.matchAll(/data-concept="(.*?)"/g),x=>x[1])])];assert.equal(keys.length,7);for(const key of keys)assert.ok(src.includes("active==='"+key+"'"),key);
const ctx=new Proxy({}, {get:(o,k)=>o[k]??((...args)=>{for(const a of args)if(typeof a==='number')assert.ok(Number.isFinite(a));}),set:(o,k,v)=>(o[k]=v,true)});
const elements={},env={ctx,width:0,height:0,box:null,time:0,sheetThickness:.4,sheetSquares:2,document:{querySelector:id=>elements[id]??={textContent:''}},dot:()=>{},strokeRect:()=>{},arrow:()=>{}};
vm.createContext(env);vm.runInContext(cut('const SHEET_RHO=','function syncSheetControls('),env);let renders=0;
for(const w of [1360,800,650,390,360,320])for(const h of [360,372,430,660])for(let layer=1;layer<=5;layer++)for(let n=1;n<=4;n++){
 env.width=w;env.height=h;env.time=17.3;env.sheetThickness=layer*.2;env.sheetSquares=n;env.box={x:w<650?48:w*.14,y:Math.max(28,h*.07),w:w-(w<650?96:w*.28)};
 const l=vm.runInContext('sheetLayout(sheetData())',env);assert.ok(l.square>=32);assert.ok(l.x-16>0&&l.x+l.w+16<w);assert.ok(l.sideY>l.topY+l.square+30);assert.ok(l.statY+80<=h-52+1e-8,'equation before notes');
 for(const key of [null,...keys]){vm.runInContext('drawSheet('+JSON.stringify(key)+',.7)',env);renders++;}
}
console.log(JSON.stringify({syntax:'pass',pages:meta.pages.length,states,geometryAndOhmsLaw:'pass',uniformDepthConductance:'pass',currentMarkerRate:'pass',loopContinuity:'pass',concepts:keys.length,renderChecks:renders}));
