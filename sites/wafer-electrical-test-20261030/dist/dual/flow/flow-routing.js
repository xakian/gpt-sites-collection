import {intersects,route} from './overview-layout.js';

const near=(a,b)=>Math.abs(a-b)<.2;
const length=p=>p.slice(1).reduce((s,q,i)=>s+Math.abs(q[0]-p[i][0])+Math.abs(q[1]-p[i][1]),0);
const segment=(a,b)=>({a,b,vertical:near(a[0],b[0])});
const segments=p=>p.slice(1).map((q,i)=>segment(p[i],q));
function simplify(p){
 const out=[];
 for(const q of p){if(out.length&&near(q[0],out.at(-1)[0])&&near(q[1],out.at(-1)[1]))continue;
  while(out.length>1){const a=out.at(-2),b=out.at(-1);if((near(a[0],b[0])&&near(b[0],q[0])&&(b[1]-a[1])*(q[1]-b[1])>=0)||(near(a[1],b[1])&&near(b[1],q[1])&&(b[0]-a[0])*(q[0]-b[0])>=0))out.pop();else break;}out.push(q);
 }return out;
}
// An intersection is not a graph junction. Penalize both crossings and shared runs.
export function conflict(a,b){let crossings=0,overlap=0;for(const u of a)for(const v of b){
 if(u.vertical===v.vertical){const k=u.vertical?0:1,t=1-k,space=Math.abs(u.a[k]-v.a[k]);if(space<2.5){const n=Math.min(Math.max(u.a[t],u.b[t]),Math.max(v.a[t],v.b[t]))-Math.max(Math.min(u.a[t],u.b[t]),Math.min(v.a[t],v.b[t]));if(n>1)overlap+=n*(1-space/2.5);}}
 else{const h=u.vertical?v:u,w=u.vertical?u:v,x=w.a[0],y=h.a[1];if(x>Math.min(h.a[0],h.b[0])+.1&&x<Math.max(h.a[0],h.b[0])-.1&&y>Math.min(w.a[1],w.b[1])+.1&&y<Math.max(w.a[1],w.b[1])-.1)crossings++;}
 }return crossings*450+overlap*5;
}
const units=s=>[...s].reduce((n,c)=>n+(/[\u0020-\u007e]/.test(c)?.6:1),0);
export function headingObstacles(l){return l.panels.map(p=>({x:p.x+5,y:p.y+3,w:Math.min(p.w-10,Math.max(...p.heading.map(s=>units(s)))*p.headerFont+2),h:p.hh-7}));}
function candidates(e,l,edges){
 const a=l.boxes.get(e.from),b=l.boxes.get(e.to),out=edges.filter(x=>x.from===e.from),ins=edges.filter(x=>x.to===e.to);
 const slot=(list,edge)=>list.length===1?.5:.22+.56*list.indexOf(edge)/(list.length-1),f=slot(out,e),g=slot(ins,e);
 const ports=(r,u)=>[[[r.x+r.w*u,r.y],[r.x+r.w*u,r.y-2]],[[r.x+r.w*u,r.y+r.h],[r.x+r.w*u,r.y+r.h+2]],[[r.x,r.y+r.h*u],[r.x-2,r.y+r.h*u]],[[r.x+r.w,r.y+r.h*u],[r.x+r.w+2,r.y+r.h*u]]];
 const all=[...l.boxes.values()],headers=headingObstacles(l),obstacles=[...all.filter(r=>r!==a&&r!==b),...headers];
 const xs=new Set([2,5,8,l.width-8,l.width-5,l.width-2]),ys=new Set([23,l.height-14]);
 for(const p of l.panels){for(const x of [p.x-3,p.x+p.w+3])if(x>0&&x<l.width)xs.add(x);for(const y of [p.y-3,p.y+p.h+3])if(y>20&&y<l.height-12)ys.add(y);}
 for(const r of all){if(r.group===a.group||r.group===b.group){for(const x of [r.x-2,r.x+r.w+2])xs.add(x);for(const y of [r.y-2,r.y+r.h+2])ys.add(y);}}
 const pool=[],seen=new Set(),back=['loop','feedback'].includes(e.kind);
 function add(p){p=simplify(p);if(p.length<2)return;const key=p.flat().map(n=>n.toFixed(1)).join(',');if(seen.has(key))return;seen.add(key);
  for(let i=1;i<p.length;i++){if(obstacles.some(r=>intersects(p[i-1],p[i],r,.3)))return;if(i>1&&intersects(p[i-1],p[i],a,.1))return;if(i<p.length-1&&intersects(p[i-1],p[i],b,.1))return;}
  const outer=p.some(q=>q[0]<=8||q[0]>=l.width-8);pool.push({points:p,segments:segments(p),base:length(p)*.08+p.length*2+(back&&!outer?180:0)});
 }
 for(const[s,so]of ports(a,f))for(const[t,to]of ports(b,g)){
  add([s,so,[to[0],so[1]],to,t]);add([s,so,[so[0],to[1]],to,t]);
  for(const x of xs)add([s,so,[x,so[1]],[x,to[1]],to,t]);
  for(const y of ys)add([s,so,[so[0],y],[to[0],y],to,t]);
 }
 // Retain the original clear route only as a fallback on exceptionally dense viewports.
 if(!pool.length){const p=route(a,b,l);pool.push({points:p,segments:segments(p),base:length(p)*.08+p.length*2});}
 pool.sort((a,b)=>a.base-b.base);const outer=back?pool.filter(c=>c.points.some(q=>q[0]<=8||q[0]>=l.width-8)):[];return(outer.length?outer:pool).slice(0,220);
}
export function routeGraph(l,edges){
 const pool=edges.map(e=>candidates(e,l,edges)),selected=new Map();
 const priority=e=>({sequence:0,parallel:1,loss:2,condition:3,loop:4,feedback:5}[e.kind]??1);
 const order=edges.map((e,i)=>i).sort((a,b)=>priority(edges[a])-priority(edges[b])||pool[a][0].base-pool[b][0].base);
 function choose(i){const direct=edges[i].kind==='sequence'&&pool[i].find(c=>c.points.length===2);if(direct){selected.set(i,direct);return;}let best,cost=Infinity;for(const c of pool[i]){let score=c.base;for(const[j,p]of selected)if(j!==i)score+=conflict(c.segments,p.segments);if(score<cost){best=c;cost=score;}}selected.set(i,best);}
 for(const i of order)choose(i);
 for(let pass=0;pass<3;pass++)for(const i of [...order].reverse())choose(i);
 return edges.map((e,i)=>({...e,i,points:selected.get(i).points}));
}

export function edgeLabels(l,edges){
 const occupied=[...l.boxes.values(),...headingObstacles(l)],labels=[];
 const overlap=(a,b)=>a.x<b.x+b.w+2&&a.x+a.w>b.x-2&&a.y<b.y+b.h+1&&a.y+a.h>b.y-1;
 for(const e of [...edges].sort((a,b)=>(['loop','feedback'].includes(b.kind)?1:0)-(['loop','feedback'].includes(a.kind)?1:0))){
  if(!e.label||e.kind==='sequence')continue;
  let text=e.kind==='loop'?`未達次數 ↶ ${e.to}`:e.kind==='feedback'?`調整 ↶ ${e.to}`:e.label.replace('不需要','略過').replace('單階段略過','單階段').replace('已達總次數','達標結束').replace('需要後處理','需後處理');
  const font=l.width>=600&&l.height>300?10:9,w=units(text)*font+6,h=font+3;let best;
  const lines=segments(e.points).sort((a,b)=>length([b.a,b.b])-length([a.a,a.b]));
  for(const s of lines){if(s.vertical)continue;for(const ratio of [.5,.25,.75]){const x=s.a[0]+(s.b[0]-s.a[0])*ratio-w/2;for(const dy of [-h-2,2,-h/2]){const r={x,y:s.a[1]+dy,w,h};if(r.x<2||r.x+w>l.width-2||r.y<22||r.y+h>l.height-13||occupied.some(o=>overlap(r,o)))continue;best=r;break;}if(best)break;}if(best)break;}
  if(best){occupied.push(best);labels.push({...best,text,font,edge:e.i});}
 }return labels;
}
