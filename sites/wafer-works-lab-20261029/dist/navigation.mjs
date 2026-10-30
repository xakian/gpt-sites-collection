import {MAP,INFRA} from './content.mjs';
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function port(m){const d=[{x:.5,y:2.5},{x:-.5,y:.5},{x:1.5,y:-.5},{x:2.5,y:1.5}][m.rotation||0];return{x:m.x+d.x,y:m.y+d.y};}
export const obstacles=w=>[...INFRA,...Object.values(w.machines).map(m=>({...m,w:2,h:2}))];
export function canStand(w,x,y,r=.25){
 if(!Number.isFinite(x)||!Number.isFinite(y)||x-r<1||y-r<1||x+r>MAP.w-1||y+r>MAP.h-1)return false;
 return !obstacles(w).some(o=>{const a=Math.max(o.x,Math.min(x,o.x+o.w)),b=Math.max(o.y,Math.min(y,o.y+o.h));return Math.hypot(x-a,y-b)<r-1e-8;});
}
export function segmentClear(w,a,b,r=.25){const n=Math.max(1,Math.ceil(distance(a,b)/.08));for(let i=0;i<=n;i++)if(!canStand(w,a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n,r))return false;return true;}
export function move(w,a,dx,dy){const n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/.1));let d=0;for(let i=0;i<n;i++){let x=a.x,y=a.y;if(canStand(w,a.x+dx/n,a.y))a.x+=dx/n;if(canStand(w,a.x,a.y+dy/n))a.y+=dy/n;d+=Math.hypot(a.x-x,a.y-y);}return d;}
const key=(x,y)=>`${x},${y}`;
export function flood(w,start={x:2.5,y:15.5}){
 const sx=Math.floor(start.x),sy=Math.floor(start.y),seen=new Set(),q=[];
 if(!canStand(w,sx+.5,sy+.5))return seen;
 seen.add(key(sx,sy));q.push([sx,sy]);
 for(let i=0;i<q.length;i++){let [x,y]=q[i];for(const [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(!seen.has(k)&&canStand(w,nx+.5,ny+.5)&&segmentClear(w,{x:x+.5,y:y+.5},{x:nx+.5,y:ny+.5})){seen.add(k);q.push([nx,ny]);}}}return seen;
}
export function path(w,start,end){
 const sx=Math.floor(start.x),sy=Math.floor(start.y),ex=Math.floor(end.x),ey=Math.floor(end.y),sk=key(sx,sy),ek=key(ex,ey),q=[[sx,sy]],prev=new Map([[sk,null]]);
 if(!canStand(w,ex+.5,ey+.5)||!canStand(w,sx+.5,sy+.5))return null;
 for(let i=0;i<q.length;i++){const [x,y]=q[i],k=key(x,y);if(k===ek)break;for(const [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]){const nx=x+dx,ny=y+dy,nk=key(nx,ny);if(!prev.has(nk)&&canStand(w,nx+.5,ny+.5)&&segmentClear(w,{x:x+.5,y:y+.5},{x:nx+.5,y:ny+.5})){prev.set(nk,k);q.push([nx,ny]);}}}
 if(!prev.has(ek))return null;let out=[],k=ek;while(k){const [x,y]=k.split(',').map(Number);out.push({x:x+.5,y:y+.5});k=prev.get(k);}out.reverse();if(distance(start,out[0])<.001)out.shift();return out;
}
export function placementReason(w,candidate,exclude){
 const {x,y}=candidate;if(!Number.isInteger(x)||!Number.isInteger(y)||x<1||y<1||x+2>23||y+2>17)return '設備必須放在牆內的整格';
 const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
 const box={x,y,w:2,h:2};if(overlap(box,MAP.safe))return '安全區不可建造';
 const rest={...w,machines:Object.fromEntries(Object.entries(w.machines).filter(([id])=>id!==exclude))};
 if(obstacles(rest).some(o=>overlap(box,o)))return '占地與設備或基礎設施重疊';
 const ports=[...INFRA.map(o=>o.port),...Object.values(rest.machines).map(port)];
 if(ports.some(p=>p.x>x&&p.x<x+2&&p.y>y&&p.y<y+2))return '不可遮住既有操作點';
 if(Object.values(w.items).some(i=>i.location.type==='ground'&&i.location.x>x&&i.location.x<x+2&&i.location.y>y&&i.location.y<y+2))return '占地上有物品';
 const trial={...rest,machines:{...rest.machines,preview:candidate}};const p=port(candidate);
 if(!canStand(trial,p.x,p.y)||ports.some(q=>distance(p,q)<.1)||(p.x>=1&&p.x<4&&p.y>=13&&p.y<17))return '操作點不可使用';
 if(Object.values(w.actors).some(a=>!canStand(trial,a.x,a.y)))return '不可壓住角色';
 const reachable=flood(trial);for(const q of [...ports,p,...Object.values(w.actors),...Object.values(w.items).filter(i=>i.location.type==='ground').map(i=>i.location)])if(!reachable.has(key(Math.floor(q.x),Math.floor(q.y))))return '此配置封住必要通道或物品';
 return null;
}
export function groundSpot(w,a){const spots=[],ports=[...INFRA.map(i=>i.port),...Object.values(w.machines).map(port)];for(let x=Math.floor(a.x)-1;x<=Math.floor(a.x)+1;x++)for(let y=Math.floor(a.y)-1;y<=Math.floor(a.y)+1;y++){const p={x:x+.5,y:y+.5};if(distance(a,p)<=1.1&&canStand(w,p.x,p.y)&&segmentClear(w,a,p,.02)&&!(x>=1&&x<=3&&y>=13&&y<=16)&&!ports.some(q=>distance(p,q)<.1)&&!Object.values(w.items).some(i=>i.location.type==='ground'&&distance(i.location,p)<.1))spots.push(p);}return spots.sort((p,q)=>distance(a,p)-distance(a,q))[0]||null;}
