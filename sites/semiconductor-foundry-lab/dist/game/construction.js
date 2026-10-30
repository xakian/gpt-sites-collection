import {buildings} from '../content/index.js';
import {inBounds,cellAt} from '../core/hex.js';
import {findPath} from '../core/movement.js';
import {footprint,entrance,occupied,newBuilding,player,emit,at} from './state.js';
export function canPlace(s,type,q,r,movingId=null){
 const def=buildings[type];if(!def||!Number.isInteger(q)||!Number.isInteger(r))return {ok:false,reason:'無效設備或格子'};
 if(!movingId&&s.buildings.length>=100)return {ok:false,reason:'此版本最多配置 100 座設備'};
 if(def.unlock&&!s.research.includes(def.unlock)&&!movingId)return {ok:false,reason:'需要先完成製程穩定化研究'};
 const old=s.buildings.find(b=>b.id===movingId);
 if(movingId&&(!old||old.type!==type||old.job||s.tasks.some(t=>t.source===movingId||t.destination===movingId)))return {ok:false,reason:'設備加工或物流任務中，完成後才能搬動'};
 if(!movingId&&s.credits<def.cost)return {ok:false,reason:'經費不足'};
 const candidate=newBuilding(type,q,r,movingId??'preview');
 const trial={...s,buildings:[...s.buildings.filter(b=>b.id!==movingId),candidate]};
 for(const p of footprint(candidate))if(!inBounds(p,s.grid.radius)||cellAt(s.grid,p).terrainLevel!==0||s.actors.some(a=>at(a,p))||s.buildings.filter(b=>b.id!==movingId).some(b=>footprint(b).some(t=>at(t,p))))return {ok:false,reason:'佔格衝突、非平地或超出基地'};
 for(const b of trial.buildings){const e=entrance(b);if(!inBounds(e,s.grid.radius)||occupied(trial,e,null,false))return {ok:false,reason:'入口必須保留一格通道'};if(!findPath(player(s),e,s.grid,p=>occupied(trial,p,null,false)))return {ok:false,reason:'不能封住設備與玩家之間的必要通道'};}
 return {ok:true,reason:'可放置 · 入口箭頭朝右',candidate};
}
export function placeBuilding(s,type,q,r,movingId=null){
 const result=canPlace(s,type,q,r,movingId);if(!result.ok){emit(s,result.reason);return false;}
 if(movingId){const b=s.buildings.find(x=>x.id===movingId);Object.assign(b,{q,r});}
 else{s.credits-=buildings[type].cost;s.buildings.push(newBuilding(type,q,r,`equipment-${s.nextId++}`));}
 s.actors.forEach(a=>{a.goal=null;});emit(s,movingId?'設備已搬移，路徑已更新。':`已建造${buildings[type].name}`);return true;
}
