const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../dist/index.html'),'utf8'),src=html.match(/<script>([\s\S]*?)<\/script>/)[1];new Function(src);
const cut=(a,b)=>src.slice(src.indexOf(a),src.indexOf(b));
const m=vm.runInNewContext('let time=0;const DURATION=90;'+cut('const TRADE_D=','function tradeLayout(')+'({data:tradeData,c:tradeConcentration,erf:tradeErf})');
for(const [x,e] of [[0,0],[.5,.5204998778130465],[1,.8427007929497149],[2,.9953222650189527],[-1,-.8427007929497149]])assert.ok(Math.abs(m.erf(x)-e)<1.5e-7);
let prev=null;
for(let i=0;i<=1000;i++){
 const d=m.data(i*.09);assert.ok(d.depth<1.25&&d.xSurface<1.6);assert.ok(Math.abs(m.c(0,d.depth,d.s)-.12)<1e-10);assert.ok(Math.abs(m.c(d.xSurface,0,d.s)-.12)<1e-10);
 for(let j=0;j<=20;j++){const x=d.xSurface*j/20;assert.ok(Math.abs(m.c(x,d.depthAt(x),d.s)-.12)<1e-9);assert.ok(Math.abs(m.c(x,.2,d.s)-m.c(-x,.2,d.s))<1e-7);}
 if(prev){assert.ok(d.depth>prev.depth);assert.ok(d.lateral>prev.lateral);}prev=d;
}
// Independent values computed with Python math.erf, not the display's approximation.
for(const [t,z,l] of [[0,.2131579430100564,.16285850360800902],[.6,.8311211763567092,.570914620024531],[1,.9863468808768472,.6743094559315237]]){const d=m.data(t*90);assert.ok(Math.abs(d.depth-z)<2e-6);assert.ok(Math.abs(d.lateral-l)<2e-6);}
assert.equal(m.data(0).depthReached,false);assert.equal(m.data(54).depthReached,true);assert.equal(m.data(54).lateralOK,true);assert.equal(m.data(90).lateralOK,false);
const integrate=(f,a,b,n=800)=>{const h=(b-a)/n;let v=f(a)+f(b);for(let i=1;i<n;i++)v+=(i%2?4:2)*f(a+h*i);return v*h/3};
for(const t of [0,.25,.6,1]){
 const d=m.data(t*90),s=d.s;
 const ix=integrate(x=>m.c(x,0,s)*Math.sqrt(Math.PI*s),-4,4),iz=integrate(z=>Math.exp(-z*z/(4*s))/Math.sqrt(Math.PI*s),0,4);
 assert.ok(Math.abs(ix*iz-1)<2e-6,'fixed 2-D total');
 for(const x of [0,.3,.7,1])assert.ok(Math.abs((m.c(x,1e-5,s)-m.c(x,-1e-5,s))/(2e-5))<1e-10,'zero surface flux');
}
// Interior heat-equation check: dC/dt = D*(d2C/dx2+d2C/dz2).
for(const t of [.2,.6,.9])for(const x of [.1,.35,.8])for(const z of [.1,.4]){
 const s=.0025+.1*t,h=.002,k=.0005,C=m.c;
 const dt=(C(x,z,s+.1*k)-C(x,z,s-.1*k))/(2*k),lap=(C(x+h,z,s)+C(x-h,z,s)+C(x,z+h,s)+C(x,z-h,s)-4*C(x,z,s))/(h*h);
 assert.ok(Math.abs(dt-.1*lap)<.003,'2-D PDE');
}
const meta=vm.runInNewContext(cut('const pages=[','function bindConcepts(')+'({pages,unitTerms,termsSources})');for(const a of [meta.pages,meta.unitTerms,meta.termsSources]){assert.ok(a.length>=24);assert.equal(a.length,meta.pages.length);}
const keys=[...new Set([...meta.unitTerms[23].map(x=>x.concept),...Array.from(meta.pages[23].html.matchAll(/data-concept="(.*?)"/g),x=>x[1])])];assert.equal(keys.length,7);for(const key of keys)assert.ok(src.includes("active==='"+key+"'"),key);
const ctx=new Proxy({}, {get:(o,k)=>o[k]??((...args)=>{for(const a of args)if(typeof a==='number')assert.ok(Number.isFinite(a));}),set:(o,k,v)=>(o[k]=v,true)});
const elements={},env={ctx,width:0,height:0,box:null,time:0,DURATION:90,document:{querySelector:id=>elements[id]??={textContent:''}},dot:()=>{},strokeRect:()=>{}};
vm.createContext(env);vm.runInContext(cut('const TRADE_D=','// A fixed-volume'),env);let renders=0;
for(const w of [1360,800,650,390,360])for(const h of [388,430,660])for(const t of [0,54,90]){
 env.width=w;env.height=h;env.time=t;env.box={x:w<650?48:w*.14,y:Math.max(28,h*.07),w:w-(w<650?96:w*.28),h:h-Math.max(28,h*.07)-Math.max(30,h*.08)};
 const b=vm.runInContext('tradeLayout()',env);assert.ok(b.w>180);assert.ok(Math.abs(b.w/3.2-b.h/1.25)<1e-10,'equal length scales');assert.ok(b.y+b.h+107<h-42,'status above notes');
 for(const key of [null,...keys]){vm.runInContext('drawTrade('+JSON.stringify(key)+',.7)',env);renders++;}
}
console.log(JSON.stringify({syntax:'pass',pages:meta.pages.length,states:1001,junctionRoots:'pass',independentReference:'pass',fixedTotal:'pass',surfaceFlux:'pass',twoDimensionalPDE:'pass',threeDesignStates:'pass',concepts:7,renderChecks:renders}));
