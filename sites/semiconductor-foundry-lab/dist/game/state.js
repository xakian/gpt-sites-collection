import {content,buildings} from '../content/index.js';
import {createGrid,cellAt,hexToWorld,hexKey} from '../core/hex.js';
export const GAME_ID='semiconductor-foundry-lab';
export const quantity=inventory=>Object.values(inventory).reduce((a,b)=>a+b,0);
export const player=s=>s.actors.find(a=>a.kind==='player');
export const building=(s,id)=>s.buildings.find(b=>b.id===id);
export const behavior=b=>buildings[b.type].behavior;
export const entrance=b=>({q:b.q+buildings[b.type].entrance.q,r:b.r+buildings[b.type].entrance.r});
export const footprint=b=>buildings[b.type].footprint.map(p=>({q:p.q+b.q,r:p.r+b.r}));
export const at=(a,b)=>a.q===b.q&&a.r===b.r;
export const onEntrance=(actor,b)=>at(actor,entrance(b));
export function occupied(s,p,actorId=null,actors=true){return s.buildings.some(b=>footprint(b).some(t=>at(t,p)))||(actors&&s.actors.some(a=>a.id!==actorId&&at(a,p)));}
export function makeGrid(){const g=createGrid(content.map.radius);for(const t of content.map.terrain){const c=cellAt(g,t);c.terrainLevel=t.level;c.visualLevel=t.level;}return g;}
export function newBuilding(type,q,r,id){return {id,kind:'equipment',type,q,r,appearance:type,status:'idle',inventory:{},job:null,mode:'stable',batch:0,level:1};}
export function createGameState(){
 const actor=(id,kind,p)=>({id,kind,...p,...hexToWorld(p.q,p.r),appearance:kind,status:'待命',inventory:{},capacity:3,stepTimer:0,stepInterval:kind==='worker'?.48:.30,moveSerial:0,role:'idle',taskId:null,goal:null});
 return {gameId:GAME_ID,elapsed:0,paused:true,grid:makeGrid(),actors:[actor('player','player',content.map.player),...content.map.workers.map((p,i)=>actor(`worker-${i+1}`,'worker',p))],buildings:content.map.buildings.map((b,i)=>({...newBuilding(b.type,b.q,b.r,`equipment-${i+1}`),inventory:{...b.inventory}})),tasks:[],credits:64,delivered:0,claimedOrders:[],research:[],researchJob:null,utilityLevel:1,nextId:10,events:[],stats:{rawPurchased:0,processed:0,rejected:0,steps:0,logisticsSeconds:0},notice:'示例內容：先點「開始運轉」，在物料庫入口取料。'};
}
export function emit(s,text,entityId=null){s.notice=text;s.events.push({id:s.nextId++,at:s.elapsed,text,entityId});s.events=s.events.slice(-12);}
export const stateKey=s=>`${Math.floor(s.elapsed*4)}:${s.nextId}:${s.paused}`;
export const cellKey=p=>hexKey(p.q,p.r);
