import {attribute,maximum,groups} from './core.mjs';

const compare=(a,b)=>a.id.localeCompare(b.id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

// Display offsets never change scores. Each occupied value has a bounded cell.
// Farthest-point placement is deterministic and independent of selection/filtering.
export function coordinatePoints(topics,xAxis,yAxis,counts,box){
 const mx=maximum(xAxis,counts),my=maximum(yAxis,counts),dx=box.w/mx,dy=box.h/my;
 const result=[];
 for(const group of groups([...topics].sort(compare),xAxis,yAxis,counts)){
  const ox=box.x+group.x*dx,oy=box.y+box.h-group.y*dy;
  const ax=Math.min(dx*.38,70),ay=Math.min(dy*.38,70);
  const cell={x0:Math.max(box.x,ox-ax),x1:Math.min(box.x+box.w,ox+ax),y0:Math.max(box.y,oy-ay),y1:Math.min(box.y+box.h,oy+ay)};
  const placed=[];
  const candidates=[{x:clamp(ox,cell.x0,cell.x1),y:clamp(oy,cell.y0,cell.y1)}];
  for(let i=1;i<=Math.max(120,group.topics.length*12);i++)candidates.push({x:cell.x0+(cell.x1-cell.x0)*((i*.61803398875)%1),y:cell.y0+(cell.y1-cell.y0)*((i*.41421356237)%1)});
  const distances=candidates.map(p=>-((p.x-ox)**2+(p.y-oy)**2));
  for(const t of group.topics){
   let bestIndex=0;for(let i=1;i<candidates.length;i++)if(distances[i]>distances[bestIndex])bestIndex=i;
   const best=candidates[bestIndex];placed.push(best);
   result.push({id:t.id,x:best.x,y:best.y,originX:ox,originY:oy,valueX:attribute(t,xAxis,counts).value,valueY:attribute(t,yAxis,counts).value});
   for(let i=0;i<candidates.length;i++){const d=(candidates[i].x-best.x)**2+(candidates[i].y-best.y)**2;distances[i]=placed.length===1?d:Math.min(distances[i],d);}
  }
 }
 return result;
}

// The overview has one undirected display edge per pair; source predicates remain intact.
export function overviewEdges(data){
 const ids=new Set(data.topics.map(t=>t.id)),pairs=new Map();
 for(const e of data.relations){if(e.status!=='confirmed'||e.from===e.to||!ids.has(e.from)||!ids.has(e.to))continue;const [a,b]=[e.from,e.to].sort(),key=a+'|'+b;if(!pairs.has(key))pairs.set(key,{from:a,to:b});}
 return [...pairs.values()].sort((a,b)=>(a.from+'|'+a.to).localeCompare(b.from+'|'+b.to));
}

// Solve once per dataset, never while navigating. No live force simulation.
export function overviewLayout(data){
 const topics=[...data.topics].sort(compare),n=topics.length,edges=overviewEdges(data),index=new Map(topics.map((t,i)=>[t.id,i]));
 const p=topics.map((t,i)=>{const angle=i*2.39996322973,r=Math.sqrt((i+.5)/Math.max(1,n));return{id:t.id,x:r*Math.cos(angle),y:r*Math.sin(angle)};});
 if(n<2)return {points:p.map(t=>({...t,x:.5,y:.5})),edges};
 const ideal=Math.sqrt(4/n),iterations=n>200?110:260;
 for(let iteration=0;iteration<iterations;iteration++){
  const f=p.map(()=>({x:0,y:0}));
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){let dx=p[i].x-p[j].x,dy=p[i].y-p[j].y,d=Math.max(.002,Math.hypot(dx,dy));const force=ideal*ideal/d;f[i].x+=dx/d*force;f[i].y+=dy/d*force;f[j].x-=dx/d*force;f[j].y-=dy/d*force;}
  for(const e of edges){const i=index.get(e.from),j=index.get(e.to),dx=p[i].x-p[j].x,dy=p[i].y-p[j].y,d=Math.max(.002,Math.hypot(dx,dy)),force=d*d/ideal;f[i].x-=dx/d*force;f[i].y-=dy/d*force;f[j].x+=dx/d*force;f[j].y+=dy/d*force;}
  const temperature=.13*(1-iteration/iterations)+.001;
  for(let i=0;i<n;i++){f[i].x-=p[i].x*.12;f[i].y-=p[i].y*.12;const len=Math.max(.001,Math.hypot(f[i].x,f[i].y)),step=Math.min(temperature,len);p[i].x+=f[i].x/len*step;p[i].y+=f[i].y/len*step;}
 }
 const xs=p.map(t=>t.x),ys=p.map(t=>t.y),minX=Math.min(...xs),minY=Math.min(...ys),rangeX=Math.max(.001,Math.max(...xs)-minX),rangeY=Math.max(.001,Math.max(...ys)-minY);
 return {points:p.map(t=>({...t,x:(t.x-minX)/rangeX,y:(t.y-minY)/rangeY})),edges};
}

export function graphRegions(w,h){
 // Portrait keeps both maps visible, stacked; landscape uses a constant 58/42 split.
 if(w<680)return {stacked:true,local:{x:14,y:94,w:w-28,h:(h-166)*.51},global:{x:14,y:112+(h-166)*.51,w:w-28,h:(h-166)*.49-18}};
 const cut=Math.round(w*.58);return {stacked:false,local:{x:22,y:98,w:cut-44,h:Math.max(80,h-174)},global:{x:cut+22,y:98,w:w-cut-44,h:Math.max(80,h-174)}};
}

// Closest dot wins, rather than opening a bundled-member dialog.
export function nearestPoint(points,x,y,radius=22){
 let found=null,distance=radius;
 for(const p of points){const d=Math.hypot(p.x-x,p.y-y);if(d<=distance){distance=d;found=p;}}
 return found;
}
