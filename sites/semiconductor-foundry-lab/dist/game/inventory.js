import {buildings,recipes} from '../content/index.js';
import {quantity,behavior} from './state.js';
export const count=(e,id)=>e.inventory[id]??0;
export function add(e,id,n){const next=count(e,id)+n;if(!Number.isInteger(next)||next<0)throw new Error('Inventory underflow');if(next)e.inventory[id]=next;else delete e.inventory[id];}
export function transfer(from,to,id,n){if(!Number.isInteger(n)||n<=0||count(from,id)<n)return false;add(from,id,-n);add(to,id,n);return true;}
export function outputReservation(b){return b.job?Math.max(0,quantity(b.job.outputs)):0;}
export const room=b=>buildings[b.type].capacity-quantity(b.inventory)-outputReservation(b);
export function reserved(s,source,id){return s.tasks.filter(t=>t.source===source&&t.material===id&&t.status==='reserved').reduce((a,t)=>a+t.quantity,0);}
export const available=(s,b,id)=>count(b,id)-reserved(s,b.id,id);
export const incoming=(s,b)=>s.tasks.filter(t=>t.destination===b.id).reduce((n,t)=>n+t.quantity,0);
export const destinationRoom=(s,b)=>room(b)-incoming(s,b);
export function accepts(b,id){if(behavior(b)==='delivery')return id==='accepted';if(behavior(b)==='supply')return id==='raw'||id==='rejected';return buildings[b.type].recipes.some(r=>id in recipes[r].inputs);}
