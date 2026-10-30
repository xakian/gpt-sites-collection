import {content,buildings,recipes,materials,technologies} from '../content/index.js';
import {GAME_ID,makeGrid,footprint,entrance,at,quantity,occupied,player} from './state.js';
import {inBounds,hexToWorld} from '../core/hex.js';
import {findPath} from '../core/movement.js';
import {powerUsed,powerCapacity} from './production.js';
export const SAVE_KEY=`${GAME_ID}:save:v1`;
const finite=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
const integer=n=>finite(n)&&Number.isSafeInteger(n);
const fail=message=>{throw new Error(`存檔無法載入：${message}`);};
export function serialize(s){
 const {grid,...world}=s;
 return JSON.stringify({gameId:GAME_ID,schemaVersion:1,contentVersion:content.version,simulationTime:s.elapsed,world},null,2);
}
export function deserialize(text){
 if(typeof text!=='string'||text.length>2_000_000)fail('檔案過大或格式錯誤');
 let e;try{e=JSON.parse(text);}catch{fail('不是有效 JSON');}
 if(e?.gameId!==GAME_ID||e.schemaVersion!==1||e.contentVersion!==content.version)fail('遊戲、格式或內容版本不相容');
 const s=e.world;if(!s||!finite(s.elapsed)||s.elapsed!==e.simulationTime||!integer(s.credits)||!integer(s.delivered)||!integer(s.nextId)||s.nextId<10||!integer(s.utilityLevel)||s.utilityLevel<1||s.utilityLevel>100)fail('世界數值無效');
 if(!Array.isArray(s.actors)||s.actors.length!==1+content.map.workers.length||!Array.isArray(s.buildings)||s.buildings.length<content.map.buildings.length||s.buildings.length>100||!Array.isArray(s.tasks)||s.tasks.length>content.map.workers.length)fail('實體數量錯誤');
 const ids=[...s.actors,...s.buildings,...s.tasks].map(x=>x?.id);if(ids.some(x=>typeof x!=='string'||!/^\b[a-z][a-z0-9-]{0,79}$/.test(x))||new Set(ids).size!==ids.length)fail('實體 id 無效或重複');
 const inventory=(entity,capacity)=>{if(!entity.inventory||Array.isArray(entity.inventory)||typeof entity.inventory!=='object')fail('庫存格式錯誤');for(const [id,n]of Object.entries(entity.inventory))if(!materials[id]||!integer(n)||n<=0)fail('物料或數量錯誤');if(quantity(entity.inventory)>capacity)fail('超過容量');};
 const position=p=>{if(!inBounds(p,content.map.radius))fail('格子超出邊界');};
 const occupiedCells=new Set();
 for(const b of s.buildings){
  if(!buildings[b.type]||b.kind!=='equipment'||!integer(b.batch)||!['stable','fast'].includes(b.mode))fail('設備定義錯誤');position(b);inventory(b,buildings[b.type].capacity);
  for(const p of footprint(b)){position(p);const key=`${p.q},${p.r}`;if(occupiedCells.has(key))fail('設備重疊');occupiedCells.add(key);}
  position(entrance(b));
  if(b.job){const j=b.job,r=recipes[j.recipe];if(!r||r.building!==b.type||!finite(j.remaining)||j.remaining>j.duration||!finite(j.duration)||j.duration<=0||!finite(j.power))fail('加工狀態錯誤');
   const fast=r.fast&&j.duration===r.duration*r.fast.durationMultiplier;
   if(j.duration!==r.duration*(fast?r.fast.durationMultiplier:1)||j.power!==r.power*(fast?r.fast.powerMultiplier:1)||JSON.stringify(j.inputs)!==JSON.stringify(r.inputs))fail('加工成本錯誤');
   const outputs=j.outputs;if(!outputs||quantity(outputs)!==quantity(r.outputs))fail('加工產出錯誤');
   if(JSON.stringify(outputs)!==JSON.stringify(r.outputs)&&!(fast&&JSON.stringify(outputs)===JSON.stringify(r.fast.outputs)))fail('加工產出錯誤');
   if(quantity(b.inventory)+quantity(outputs)>buildings[b.type].capacity)fail('輸出預留空間不足');
  }
 }
 if(!['depot','process','inspection','dispatch','utility'].every(t=>s.buildings.some(b=>b.type===t)))fail('缺少必要設備');
 const actorIds=new Set();
 for(const a of s.actors){if(!['player','worker'].includes(a.kind)||!['idle','logistics','operator'].includes(a.role)||a.capacity!==3||!finite(a.stepTimer)||a.stepTimer>.5||!integer(a.moveSerial)||a.stepInterval!==(a.kind==='worker'?.48:.30))fail('角色狀態錯誤');position(a);inventory(a,a.capacity);const key=`${a.q},${a.r}`;if(occupiedCells.has(key)||actorIds.has(key))fail('角色佔格錯誤');actorIds.add(key);if(a.goal)position(a.goal);Object.assign(a,hexToWorld(a.q,a.r));}
 if(s.actors.filter(a=>a.kind==='player').length!==1||s.actors.filter(a=>a.kind==='worker').length!==content.map.workers.length)fail('角色種類錯誤');
 const taskWorkers=new Set(),sourceReservations=new Map(),destReservations=new Map();
 for(const t of s.tasks){
  const w=s.actors.find(a=>a.id===t.workerId&&a.kind==='worker'),source=s.buildings.find(b=>b.id===t.source),dest=s.buildings.find(b=>b.id===t.destination);
  if(!w||!source||!dest||w.taskId!==t.id||w.role!=='logistics'||taskWorkers.has(w.id)||t.quantity!==1||!['reserved','carrying'].includes(t.status)||!content.routes.some(r=>r.material===t.material&&r.from===source.type&&r.to===dest.type))fail('物流任務錯誤');
  taskWorkers.add(w.id);const key=`${source.id}:${t.material}`;
  if(t.status==='reserved')sourceReservations.set(key,(sourceReservations.get(key)??0)+1);else if(w.inventory[t.material]!==1)fail('搬運物料遺失');
  destReservations.set(dest.id,(destReservations.get(dest.id)??0)+1);
 }
 for(const a of s.actors)if(a.taskId&&!s.tasks.some(t=>t.id===a.taskId&&t.workerId===a.id))fail('遺留的工人任務');
 for(const [key,n]of sourceReservations){const split=key.lastIndexOf(':'),b=s.buildings.find(b=>b.id===key.slice(0,split));if((b.inventory[key.slice(split+1)]??0)<n)fail('重複預約同一物料');}
 for(const [id,n]of destReservations){const b=s.buildings.find(b=>b.id===id);if(quantity(b.inventory)+(b.job?quantity(b.job.outputs):0)+n>buildings[b.type].capacity)fail('目的地重複預約空間');}
 if(!Array.isArray(s.research)||new Set(s.research).size!==s.research.length||s.research.some(id=>!technologies[id]))fail('研究錯誤');
 if(!Array.isArray(s.claimedOrders)||new Set(s.claimedOrders).size!==s.claimedOrders.length||s.claimedOrders.some(id=>!content.orders.some(o=>o.id===id&&s.delivered>=o.target)))fail('訂單錯誤');
 if(s.researchJob){const t=technologies[s.researchJob.id];if(!t||s.research.includes(t.id)||s.researchJob.duration!==t.duration||!finite(s.researchJob.remaining)||s.researchJob.remaining>t.duration)fail('研究進度錯誤');}
 if(!s.stats||Object.values(s.stats).some(v=>!finite(v))||!Array.isArray(s.events)||s.events.length>12)fail('統計或事件錯誤');
 const serials=[...s.buildings,...s.tasks].map(x=>Number(x.id.match(/-(\d+)$/)?.[1]??0));
 for(const event of s.events){if(!integer(event.id)||!finite(event.at)||event.at>s.elapsed||typeof event.text!=='string')fail('事件錯誤');serials.push(event.id);}
 if(s.nextId<=Math.max(0,...serials))fail('流水號不能重複');
 s.grid=makeGrid();
 for(const b of s.buildings)if(occupied(s,entrance(b),null,false)||!findPath(player(s),entrance(b),s.grid,p=>occupied(s,p,null,false)))fail('設備入口無法到達');
 if(powerUsed(s)>powerCapacity(s))fail('用電超過供電');
 s.paused=true;s.notice='存檔已載入，按「繼續運轉」恢復；沒有離線收益。';return s;
}
