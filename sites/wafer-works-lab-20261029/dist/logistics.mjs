import {Engine,id,event,clone,locationKey,pointOf,routeRecipe} from './core.mjs';
import {path,port,distance} from './navigation.mjs';
import {INFRA} from './content.mjs';
Engine.prototype.releaseTask=function(tid,state='DONE'){
 const w=this.w,t=w.tasks[tid];if(!t)return;for(const [key,owner] of Object.entries(w.reservations))if(owner===tid)delete w.reservations[key];
 t.state=state;t.endTick=w.tick;t.reason=null;const a=w.actors[t.workerId];if(a?.task===tid)a.task=null;delete this.paths[t.workerId];event(w,'taskEnded',{taskId:tid,state});
};
Engine.prototype.cancelTask=function(){
 const w=this.w,a=w.actors.worker,t=w.tasks[a?.task];if(!t)return;
 if(a.action){delete w.actions[a.action];a.action=null;}
 (w.rules.skipItems??=[]).push(t.itemId);
 if(!a.carried){this.releaseTask(t.id,'CANCELLED');return;}
 for(const [key,owner] of Object.entries(w.reservations))if(owner===t.id&&key!==`item:${t.itemId}`)delete w.reservations[key];
 t.state='RETURNING';t.returning=true;t.destination=null;t.reason='返還材料倉';t.retryCount=0;delete this.paths.worker;this.prepareReturn(t);
};
Engine.prototype.prepareReturn=function(t){
 const n=this.freeSlot('warehouse',t.id);if(n<0){t.state='BLOCKED';t.reason='返還位置不足：騰出材料倉一格，或走近工人接手';t.destination=null;return false;}
 t.destination={type:'storage',id:'warehouse',slot:n};this.w.reservations[locationKey(t.destination)]=t.id;t.state='RETURNING';t.reason='實際返還材料倉';return true;
};
Engine.prototype.assignTask=function(item,destination){
 const w=this.w,a=w.actors.worker;if(!a||a.task||a.carried||w.reservations[`item:${item.id}`]||w.reservations[locationKey(destination)])return false;
 if(Object.values(w.actions).some(x=>x.keys.includes(`item:${item.id}`)||x.keys.includes(locationKey(destination))))return false;
 const source=clone(item.location),sp=pointOf(w,source),dp=pointOf(w,destination);if(!sp||!dp||!path(w,a,sp)||!path(w,sp,dp))return false;
 const t={id:id(w,'T'),workerId:'worker',itemId:item.id,source,destination:clone(destination),state:'TO_SOURCE',createdTick:w.tick,reason:'前往來源',retryCount:0,lastProgressTick:w.tick,lastX:a.x,lastY:a.y,navRevision:w.navRevision,loadedStartDistance:null,loadedStartTicks:null};w.tasks[t.id]=t;w.reservations[`item:${item.id}`]=t.id;w.reservations[locationKey(destination)]=t.id;a.task=t.id;event(w,'taskAssigned',{taskId:t.id,itemId:item.id});return true;
};
Engine.prototype.scheduleWorker=function(){
 const w=this.w,a=w.actors.worker;if(!a||!w.rules.enabled||a.task||a.carried)return;
 const candidates=Object.values(w.items).filter(i=>i.kind==='wafer_lot'&&i.lifecycle==='available'&&w.lots[i.lotId].disposition==='active'&&!w.rules.skipItems?.includes(i.id)&&!w.reservations[`item:${i.id}`]&&(
  (i.location.type==='machine'&&w.machines[i.location.id].phase==='DONE')||
  (i.location.type==='storage'&&i.location.id==='warehouse'&&w.lots[i.lotId].cursor===0)||
  (i.location.type==='ground'&&w.rules.groundItem===i.id)
 )).sort((i,j)=>(i.location.type==='ground'?0:i.location.type==='machine'?1:2)-(j.location.type==='ground'?0:j.location.type==='machine'?1:2)||i.id.localeCompare(j.id));
 for(const i of candidates){const l=w.lots[i.lotId];let dest=null;
  if(l.cursor===this.c.routes[l.routeId].steps.length){const slot=this.freeSlot('shipping');if(slot>=0)dest={type:'storage',id:'shipping',slot};}
  else{const rid=this.c.routes[l.routeId].steps[l.cursor][0],cap=this.c.recipes[rid].capability,target=w.rules.targets[cap];const machines=Object.values(w.machines).filter(m=>(!target||m.id===target)&&this.machineFree(m)&&routeRecipe(w,m,l,this.c).length).map(m=>({m,p:path(w,pointOf(w,i.location),port(m))})).filter(x=>x.p).sort((a,b)=>a.p.length-b.p.length||a.m.id.localeCompare(b.m.id));if(machines[0])dest={type:'machine',id:machines[0].m.id};}
  if(dest&&this.assignTask(i,dest))return;
 }
};
Engine.prototype.workerTick=function(){
 const w=this.w,a=w.actors.worker;if(!a)return;let t=w.tasks[a.task];
 if(!t){if(w.tick%15===0)this.scheduleWorker();return;}
 if(a.action)return;
 const i=w.items[t.itemId];if(!i){t.state='BLOCKED';t.reason='物品引用失效，請讀取有效備份';return;}
 if(t.returning&&!t.destination){if(w.tick%15===0)this.prepareReturn(t);return;}
 const stamp=()=>`${w.navRevision}/${i.revision}/${t.destination?.type==='machine'?w.machines[t.destination.id]?.revision:JSON.stringify(w.storages[t.destination?.id])}`;
 if(t.state==='BLOCKED'&&!t.returning){if(t.blockedStamp===stamp())return;t.navRevision=w.navRevision;t.retryCount=0;t.state=a.carried?'TO_DESTINATION':'TO_SOURCE';delete this.paths.worker;}
 if(t.state==='TO_SOURCE'&&a.carried===t.itemId){t.state='TO_DESTINATION';t.reason='攜帶晶圓前往下一站';t.loadedStartDistance=a.loadedDistance;t.loadedStartTicks=a.loadedTicks;delete this.paths.worker;}
 if(['TO_DESTINATION','RETURNING'].includes(t.state)&&!a.carried&&locationKey(i.location)===locationKey(t.destination)){t.loadedDistance=a.loadedDistance-(t.loadedStartDistance||0);t.loadedTicks=a.loadedTicks-(t.loadedStartTicks||0);if(w.rules.groundItem===i.id)w.rules.groundItem=null;this.releaseTask(t.id,t.returning?'CANCELLED':'DONE');return;}
 const atSource=t.state==='TO_SOURCE',point=pointOf(w,atSource?t.source:t.destination);if(!point){t.state='BLOCKED';t.reason='目的地不存在';return;}
 if(distance(a,point)<=.0001){
  const q=atSource?{type:i.location.type==='machine'?'unload':'pickup',item:i.id,target:i.location.type==='machine'?i.location.id:undefined}:{type:t.destination.type==='machine'?'load':'store',item:i.id,target:t.destination.id,slot:t.destination.slot};
  const r=this.dispatch({...q,actor:'worker',taskId:t.id});if(!r.ok){t.reason=r.message;t.state='BLOCKED';t.navRevision=w.navRevision;t.blockedStamp=stamp();}
 }else{
  if(!this.paths.worker){if(t.nextRetryTick&&w.tick<t.nextRetryTick)return;const res=this.go('worker',point);if(!res.ok){t.retryCount++;t.nextRetryTick=w.tick+120;t.reason='沒有可行通路';if(t.retryCount>=3){t.state='BLOCKED';t.navRevision=w.navRevision;t.blockedStamp=stamp();}return;}}
  this.follow(a);
  if(distance(a,{x:t.lastX,y:t.lastY})>.01){t.lastProgressTick=w.tick;t.lastX=a.x;t.lastY=a.y;}
  else if(w.tick-t.lastProgressTick>=120){delete this.paths.worker;t.retryCount++;t.lastProgressTick=w.tick;if(t.retryCount>=3){t.state='BLOCKED';t.reason='路徑受阻，調整配置或取消任務';t.navRevision=w.navRevision;t.blockedStamp=stamp();}}
 }
};
