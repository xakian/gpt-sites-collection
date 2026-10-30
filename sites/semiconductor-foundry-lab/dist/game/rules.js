import {content,buildings,materials,technologies} from '../content/index.js';
import {findPath,moveBySteps} from '../core/movement.js';
import {player,building,entrance,onEntrance,occupied,emit,quantity,behavior} from './state.js';
import {count,transfer,available,destinationRoom,accepts,add} from './inventory.js';
import {startJob,updateProduction,deliver,powerUsed,powerCapacity} from './production.js';
import {assignWorker,updateWorkers} from './workers.js';
import {placeBuilding} from './construction.js';
export function contextBuilding(s,id){const selected=building(s,id),nearby=s.buildings.find(b=>onEntrance(player(s),b));return selected&&onEntrance(player(s),selected)?selected:nearby??selected??null;}
export function actionsFor(s,b,actor=player(s)){
 if(!b)return [];
 const result=[];const addAction=(action,label,extra={})=>result.push({action,label,...extra});
 const input=Object.keys(actor.inventory).find(id=>accepts(b,id));
 if(input&&destinationRoom(s,b)>0)addAction('deposit',`放入${materials[input].name}`,{material:input});
 const output=Object.keys(b.inventory).find(id=>available(s,b,id)>0&&!accepts(b,id));
 if(output&&quantity(actor.inventory)<actor.capacity)addAction('take',`取出${materials[output].name}`,{material:output});
 if(behavior(b)==='supply'){
  if(available(s,b,'raw')>0&&quantity(actor.inventory)<actor.capacity)addAction('take','領取 1 片試驗晶圓',{material:'raw'});
  if(count(actor,'rejected'))addAction('recycle','回收攜帶的不合格片');
  if(count(b,'rejected'))addAction('recycleStored','回收庫內不合格片');
  if(destinationRoom(s,b)>=6)addAction('purchase','補充 6 片原料 · 經費 8');
 }
 if(!b.job&&buildings[b.type].recipes.length)addAction('start','啟動加工／檢測');
 if(behavior(b)==='delivery'&&count(b,'accepted'))addAction('deliver','提交合格試驗片');
 return result;
}
export function interact(s,id,action=null,material=null){
 const b=contextBuilding(s,id),actor=player(s);if(!b){emit(s,'請先選取設備。');return false;}
 if(!onEntrance(actor,b)){emit(s,'請先走到設備右側箭頭入口。');return false;}
 const options=actionsFor(s,b),choice=action?options.find(x=>x.action===action&&(!material||x.material===material)):options[0];
 if(!choice){emit(s,b.job?'設備正在運轉，完成後可取料。':'目前沒有可執行的互動。');return false;}
 let ok=false;
 if(choice.action==='take'){ok=available(s,b,choice.material)>0&&quantity(actor.inventory)<actor.capacity&&transfer(b,actor,choice.material,1);}
 if(choice.action==='deposit'){ok=destinationRoom(s,b)>0&&transfer(actor,b,choice.material,1);}
 if(choice.action==='start'){const r=startJob(s,b);if(!r.ok)emit(s,r.reason,b.id);return r.ok;}
 if(choice.action==='deliver')return deliver(s,b);
 if(choice.action==='purchase'){
  if(s.credits<8){emit(s,'經費不足；交付訂單或回收不合格片可取得經費。');return false;}
  s.credits-=8;add(b,'raw',6);s.stats.rawPurchased+=6;ok=true;
 }
 if(choice.action==='recycle'||choice.action==='recycleStored'){
  const source=choice.action==='recycle'?actor:b;const n=count(source,'rejected');if(n){add(source,'rejected',-n);s.credits+=n*2;s.stats.recycled=(s.stats.recycled??0)+n;ok=true;}
 }
 if(ok)emit(s,choice.label,b.id);return ok;
}
export function applyIntent(s,intent){
 if(s.paused)return false;
 if(intent.type==='interact')return interact(s,intent.buildingId,intent.action,intent.material);
 if(intent.type==='placeBuilding')return placeBuilding(s,intent.buildingType,intent.q,intent.r,intent.movingId);
 if(intent.type==='assignTask')return assignWorker(s,intent.workerId,intent.role);
 if(intent.type==='setMode'){const b=building(s,intent.buildingId);if(!b||behavior(b)!=='process'||!['stable','fast'].includes(intent.mode))return false;if(b.job){emit(s,'加工完成後再切換模式。');return false;}b.mode=intent.mode;emit(s,`已切換${b.mode==='fast'?'快速':'穩定'}模式。`);return true;}
 if(intent.type==='moveTo'){
  const actor=player(s),path=findPath(actor,intent.target,s.grid,p=>occupied(s,p,actor.id));if(!path){emit(s,'目前走不到：請保留通道，或等待工人離開。');actor.goal=null;return false;}actor.goal={...intent.target};return true;
 }
 if(intent.type==='research'){
  const t=technologies[intent.id];if(!t||s.research.includes(t.id)||s.researchJob||s.delivered<t.delivered||t.requires.some(x=>!s.research.includes(x))||s.credits<t.cost){emit(s,'研究需要累計交付 4 片、經費 22，且沒有其他研究進行中。');return false;}
  if(powerUsed(s)+2>powerCapacity(s)){emit(s,'研究需要 2 點可用電力。');return false;}
  s.credits-=t.cost;s.researchJob={id:t.id,remaining:t.duration,duration:t.duration};emit(s,'製程穩定化研究開始。');return true;
 }
 if(intent.type==='upgradeUtility'){
  if(s.utilityLevel>=100){emit(s,'廠務已達示例等級上限。');return false;}
  const cost=s.utilityLevel*20;if(s.credits<cost){emit(s,`升級需要經費 ${cost}。`);return false;}s.credits-=cost;s.utilityLevel++;emit(s,'廠務已升級，可用電力增加 4。');return true;
 }
 return false;
}
export function stepGame(s,input,dt){
 if(s.paused)return;s.elapsed+=dt;input.advance?.(dt);
 for(const a of s.actors){a.arrivalFlash=Math.max(0,(a.arrivalFlash??0)-dt);if(a.kind==='worker')a.stepTimer=Math.max(0,a.stepTimer-dt);}
 const actor=player(s);if(input.queued)actor.goal=null;
 moveBySteps(actor,dt,s.grid,()=>{
  const requested=input.direction();if(requested!==null)return requested;
  if(!actor.goal)return null;
  if(actor.q===actor.goal.q&&actor.r===actor.goal.r){actor.goal=null;return null;}
  const path=findPath(actor,actor.goal,s.grid,p=>occupied(s,p,actor.id));if(!path?.length){actor.goal=null;emit(s,'移動暫停：通道被占用。');return null;}return path[0];
 },(p,id)=>occupied(s,p,id),()=>s.stats.steps++);
 for(const intent of input.intents.splice(0))applyIntent(s,intent);
 updateProduction(s,dt);updateWorkers(s,dt);
}
