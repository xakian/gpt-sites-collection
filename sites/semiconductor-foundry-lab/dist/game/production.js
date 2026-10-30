import {buildings,recipes,content} from '../content/index.js';
import {emit,quantity,behavior} from './state.js';
import {available,add,room,incoming,count} from './inventory.js';
export const powerCapacity=s=>6+(s.utilityLevel-1)*4+Math.max(0,s.buildings.filter(b=>behavior(b)==='utility').length-1)*4;
export const powerUsed=s=>s.buildings.reduce((n,b)=>n+(b.job?.power??0),0)+(s.researchJob?2:0);
export function recipeFor(s,b){return buildings[b.type].recipes.map(id=>recipes[id]).find(r=>Object.entries(r.inputs).every(([m,n])=>available(s,b,m)>=n));}
export function startJob(s,b){
 if(b.job)return {ok:false,reason:'加工尚未完成'};
 const r=recipeFor(s,b);if(!r)return {ok:false,reason:'缺少輸入物料'};
 const fast=r.fast&&b.mode==='fast',power=r.power*(fast?r.fast.powerMultiplier:1),duration=r.duration*(fast?r.fast.durationMultiplier:1);
 if(powerUsed(s)+power>powerCapacity(s))return {ok:false,reason:'供電不足：等待其他設備完成或升級廠務'};
 const anomaly=fast&&(b.batch+1)%(s.research.includes(r.fast.technology)?r.fast.improvedEvery:r.fast.every)===0;
 const outputs={...(anomaly?r.fast.outputs:r.outputs)};
 if(room(b)+quantity(r.inputs)-incoming(s,b)<quantity(outputs))return {ok:false,reason:'輸出緩衝區已滿'};
 Object.entries(r.inputs).forEach(([m,n])=>add(b,m,-n));b.batch++;
 b.job={recipe:r.id,duration,remaining:duration,power,outputs,inputs:{...r.inputs}};b.status='processing';emit(s,`${buildings[b.type].name}開始${r.name}`,b.id);return {ok:true};
}
export function updateProduction(s,dt){
 for(const b of s.buildings){if(!b.job)continue;b.job.remaining=Math.max(0,b.job.remaining-dt);if(b.job.remaining>1e-8)continue;
  const job=b.job;b.job=null;Object.entries(job.outputs).forEach(([m,n])=>add(b,m,n));b.status='ready';
  if(behavior(b)==='process')s.stats.processed++;if(job.outputs.rejected)s.stats.rejected+=job.outputs.rejected;
  emit(s,`${buildings[b.type].name}完成：${job.outputs.rejected?'不合格片待回收':'輸出可取料'}`,b.id);
 }
 if(s.researchJob){s.researchJob.remaining=Math.max(0,s.researchJob.remaining-dt);if(s.researchJob.remaining<=1e-8){s.research.push(s.researchJob.id);s.researchJob=null;emit(s,'製程穩定化完成：快速模式的異常間隔改為每 5 批。');}}
}
export function deliver(s,b){
 const n=count(b,'accepted');if(!n)return false;add(b,'accepted',-n);s.delivered+=n;emit(s,`已交付 ${n} 片合格試驗片`,b.id);
 for(const o of content.orders)if(s.delivered>=o.target&&!s.claimedOrders.includes(o.id)){s.claimedOrders.push(o.id);s.credits+=o.reward;emit(s,`完成「${o.name}」 · 經費 +${o.reward}`,b.id);}
 return true;
}
