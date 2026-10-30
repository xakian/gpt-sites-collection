import {content,buildings} from '../content/index.js';
import {findPath,startMove} from '../core/movement.js';
import {hexDistance,DIRECTIONS} from '../core/hex.js';
import {building,entrance,occupied,onEntrance,emit,quantity,behavior} from './state.js';
import {available,destinationRoom,transfer,count} from './inventory.js';
import {startJob,recipeFor,deliver,powerUsed,powerCapacity} from './production.js';
export function assignWorker(s,id,role){
 const w=s.actors.find(a=>a.id===id&&a.kind==='worker');if(!w||!['idle','logistics','operator'].includes(role))return false;
 if(s.delivered<1){emit(s,'完成首批交付後解鎖人員分工。');return false;}
 if(w.taskId){emit(s,'工人正在搬運，請等這趟任務完成後再調整分工。');return false;}
 w.role=role;w.goal=null;w.status=role==='idle'?'待命':'尋找工作';emit(s,'人員分工已更新。',id);return true;
}
export function reserveTask(s,w){
 if(w.taskId)return null;
 const options=[];
 for(const route of content.routes)for(const source of s.buildings.filter(b=>b.type===route.from)){
  if(available(s,source,route.material)<1)continue;
  for(const dest of s.buildings.filter(b=>b.type===route.to)){
   if(destinationRoom(s,dest)<1)continue;
   const path=findPath(w,entrance(source),s.grid,p=>occupied(s,p,null,false));
   const path2=findPath(entrance(source),entrance(dest),s.grid,p=>occupied(s,p,null,false));
   if(path&&path2)options.push({source:source.id,destination:dest.id,material:route.material,cost:path.length+path2.length,priority:content.routes.indexOf(route)});
  }
 }
 // Finished output first, so a full input buffer cannot starve delivery.
 options.sort((a,b)=>b.priority-a.priority||a.cost-b.cost);const choice=options[0];if(!choice)return null;
 const t={id:`task-${s.nextId++}`,workerId:w.id,source:choice.source,destination:choice.destination,material:choice.material,quantity:1,status:'reserved'};
 s.tasks.push(t);w.taskId=t.id;return t;
}
function walk(s,w,target){
 if(onEntrance(w,target))return true;
 const path=findPath(w,entrance(target),s.grid,p=>occupied(s,p,w.id));
 if(!path){w.status='等待通道（角色擋路）';yieldEntrance(s,w);return false;}
 if(path.length&&w.stepTimer<=1e-8){if(startMove(w,path[0],s.grid,(p,id)=>occupied(s,p,id)))s.stats.steps++;}
 return false;
}
function yieldEntrance(s,w){
 if(w.stepTimer>1e-8||!s.buildings.some(b=>onEntrance(w,b)))return;
 const direction=DIRECTIONS.findIndex(d=>{const p={q:w.q+d.q,r:w.r+d.r};return !occupied(s,p,w.id)&&!s.buildings.some(b=>{const e=entrance(b);return e.q===p.q&&e.r===p.r;});});
 if(direction>=0&&startMove(w,direction,s.grid,(p,id)=>occupied(s,p,id)))s.stats.steps++;
}
export function updateWorkers(s,dt){
 for(const w of s.actors.filter(a=>a.kind==='worker')){
  if(w.role==='idle'||s.delivered<1){w.status=s.delivered<1?'首批交付後加入':'待命';if(s.delivered>=1)yieldEntrance(s,w);continue;}
  if(w.role==='operator'){
   const candidates=s.buildings.filter(b=>(behavior(b)==='delivery'&&count(b,'accepted')>0)||(!b.job&&recipeFor(s,b))).sort((a,b)=>hexDistance(w,entrance(a))-hexDistance(w,entrance(b)));
   const b=candidates[0];if(!b){w.status='等待可操作設備';yieldEntrance(s,w);continue;}
   w.status=`前往${buildings[b.type].name}`;if(walk(s,w,b)){if(behavior(b)==='delivery')deliver(s,b);else{const r=startJob(s,b);w.status=r.ok?'啟動加工':r.reason;}}
   continue;
  }
  const t=s.tasks.find(t=>t.id===w.taskId)??reserveTask(s,w);
  if(!t){w.status='等待物料或空間';yieldEntrance(s,w);continue;}
  s.stats.logisticsSeconds+=dt;
  const source=building(s,t.source),dest=building(s,t.destination),target=t.status==='reserved'?source:dest;
  w.status=`${t.status==='reserved'?'取料':'送往'} · ${buildings[target.type].name}`;
  if(!walk(s,w,target))continue;
  if(t.status==='reserved'){
   if(!transfer(source,w,t.material,t.quantity)){s.tasks=s.tasks.filter(x=>x!==t);w.taskId=null;emit(s,'預約物料已變動，重新安排任務。');continue;}
   t.status='carrying';
  }else{
   // This task already reserves its destination space; subtract all *other* arrivals.
   if(destinationRoom(s,dest)+t.quantity<t.quantity){w.status='等待目的地空間';continue;}
   if(transfer(w,dest,t.material,t.quantity)){s.tasks=s.tasks.filter(x=>x!==t);w.taskId=null;w.status='搬運完成';}
  }
 }
}
