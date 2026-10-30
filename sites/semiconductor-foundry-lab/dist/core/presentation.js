// HexBase cubic 140 ms travel. Logical cells remain authoritative; arbitrary entity collection.
import {CONFIG} from './config.js';
import {actorPosition} from './movement.js';
import {hexDistance} from './hex.js';
const clamp=t=>Math.max(0,Math.min(1,t));
const easeOut=t=>1-(1-clamp(t))**3;
export class Presentation {
 constructor(){this.reset();}
 reset(){this.actors=new Map();this.lastTime=null;this.time=0;}
 update(state,dt,reducedMotion=false){
  if(this.lastTime!==null&&state.elapsed<this.lastTime-1e-8)this.reset();
  this.lastTime=state.elapsed;dt=state.paused?0:Math.max(0,Math.min(.1,dt));this.time+=dt;
  const seen=new Set();
  for(const actor of state.actors){
   seen.add(actor.id);const target=actorPosition(actor,state.grid),old=this.actors.get(actor.id),moved=old&&(old.q!==actor.q||old.r!==actor.r);
   const snap=!old||reducedMotion||(actor.moveSerial??0)<old.serial||(moved&&hexDistance(old,actor)>1);
   let track=old;
   if(snap)track={...target,offsetX:0,offsetY:0,age:CONFIG.MOVE_PRESENTATION};
   else if(moved)track={...old,offsetX:old.x-target.x,offsetY:old.y-target.y,age:0};
   else track.age=Math.min(CONFIG.MOVE_PRESENTATION,track.age+dt);
   const progress=clamp(track.age/CONFIG.MOVE_PRESENTATION),weight=1-easeOut(progress);
   track.x=target.x+track.offsetX*weight;track.y=target.y+track.offsetY*weight;track.progress=progress;
   Object.assign(track,{q:actor.q,r:actor.r,serial:actor.moveSerial??0});this.actors.set(actor.id,track);
  }
  for(const id of this.actors.keys())if(!seen.has(id))this.actors.delete(id);
 }
 position(actor,grid){return this.actors.get(actor.id)??actorPosition(actor,grid);}
}
