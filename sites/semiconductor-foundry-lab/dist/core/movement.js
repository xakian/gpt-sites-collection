// HexBase startMove/moveBySteps, generalized from two combatants to an occupancy predicate.
import {CONFIG,terrainOffset} from './config.js';
import {DIRECTIONS,cellAt,releaseFlatCell,hexToWorld,inBounds,hexKey} from './hex.js';
export function canMove(actor,direction,grid,isBlocked=()=>false){
 if(!DIRECTIONS[direction]||actor.stepTimer>1e-8)return false;
 const d=DIRECTIONS[direction],target={q:actor.q+d.q,r:actor.r+d.r};
 return inBounds(target,grid.radius)&&!isBlocked(target,actor.id);
}
export function startMove(actor,direction,grid,isBlocked){
 if(!canMove(actor,direction,grid,isBlocked))return false;
 const d=DIRECTIONS[direction],origin=cellAt(grid,actor),q=actor.q+d.q,r=actor.r+d.r;
 Object.assign(actor,{q,r,...hexToWorld(q,r),stepTimer:actor.stepInterval??CONFIG.MOVE_STEP_INTERVAL,arrivalFlash:CONFIG.MOVE_ARRIVAL_FLASH,moveSerial:(actor.moveSerial??0)+1});
 releaseFlatCell(grid,origin);return true;
}
export function moveBySteps(actor,dt,grid,direction,isBlocked,onArrival){
 let remaining=dt;
 while(remaining>1e-8){
  if(actor.stepTimer>1e-8){const consumed=Math.min(remaining,actor.stepTimer);actor.stepTimer=Math.max(0,actor.stepTimer-consumed);remaining-=consumed;continue;}
  const requested=direction();if(requested===null)break;
  if(!startMove(actor,requested,grid,isBlocked))break;
  onArrival?.(actor);
 }
}
export const actorPosition=(actor,grid)=>({x:actor.x,y:actor.y-terrainOffset(cellAt(grid,actor).visualLevel)});
export function findPath(from,to,grid,isBlocked=()=>false){
 if(!inBounds(to,grid.radius)||isBlocked(to,from.id))return null;
 const key=p=>hexKey(p.q,p.r),front=[from],came=new Map([[key(from),null]]);
 for(let i=0;i<front.length;i++){
  const p=front[i];if(key(p)===key(to)){const path=[];let k=key(p);while(came.get(k)){const v=came.get(k);path.unshift(v.direction);k=v.previous;}return path;}
  DIRECTIONS.forEach((d,direction)=>{const n={q:p.q+d.q,r:p.r+d.r},k=key(n);if(inBounds(n,grid.radius)&&!came.has(k)&&!isBlocked(n,from.id)){came.set(k,{previous:key(p),direction});front.push(n);}});
 }
 return null;
}
