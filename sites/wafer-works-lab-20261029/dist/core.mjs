import {HZ,INFRA,DEFAULT_CONTENT,validateContent} from './content.mjs';
import {port,distance,segmentClear,move,path,placementReason,groundSpot,canStand,flood} from './navigation.mjs';
export const clone=x=>JSON.parse(JSON.stringify(x));
const ok=(extra={})=>({ok:true,...extra}),fail=(code,message)=>({ok:false,code,message});
export const id=(w,p)=>p+String(++w.nextIds[p]).padStart(4,'0');
export function event(w,type,payload={}){const e={id:id(w,'E'),tick:w.tick,type,...payload};w.events.push(e);return e;}
function ledger(w,delta,kind,ref){const e={id:id(w,'L'),tick:w.tick,kind,delta,ref};w.cash+=delta;w.ledger.push(e);return e;}
export function newItem(w,def,quantity=1,c=DEFAULT_CONTENT){
 const d=c.items[def],i={id:id(w,'I'),definitionId:def,kind:d.kind,revision:0,lifecycle:'available',location:{type:'archived',reason:'initializing'}};
 if(d.kind==='supply_box')i.contents=Object.fromEntries(Object.entries(d.contents).map(([k,n])=>[k,n*quantity]));
 if(d.kind==='tool')i.pattern=d.pattern;
 if(d.kind==='wafer_lot'){const l={id:id(w,'B'),itemId:i.id,waferCount:20,routeId:'sampleA',routeVersion:1,productId:'sample.patternA',pattern:'A',cursor:0,film:'none',resist:'none',defects:[],defectEvents:[],history:[],inspection:null,disposition:'active',productionCost:40};i.lotId=l.id;w.lots[l.id]=l;}
 w.items[i.id]=i;return i;
}
export function relocate(w,i,loc){
 const old=i.location;
 if(old.type==='actor')w.actors[old.id].carried=null;
 if(old.type==='storage')w.storages[old.id][old.slot]=null;
 if(old.type==='machine'){const m=w.machines[old.id];m.slot=null;m.phase='EMPTY';m.job=null;m.revision++;}
 if(old.type==='installed'){w.machines[old.id].tool=null;w.machines[old.id].revision++;}
 i.location=clone(loc);i.revision++;
 if(loc.type==='actor')w.actors[loc.id].carried=i.id;
 if(loc.type==='storage')w.storages[loc.id][loc.slot]=i.id;
 if(loc.type==='machine'){const m=w.machines[loc.id];m.slot=i.id;m.phase='LOADED';m.revision++;}
 if(loc.type==='installed'){w.machines[loc.id].tool=i.id;w.machines[loc.id].revision++;}
}
export function createWorld(c=DEFAULT_CONTENT){
 validateContent(c);const w={schemaVersion:1,contentVersion:1,worldId:globalThis.crypto?.randomUUID?.()||`world-${Date.now()}-${Math.random()}`,tick:0,nextIds:Object.fromEntries(['I','B','M','J','T','A','P','O','L','E','S','C'].map(k=>[k,0])),cash:2000,actors:{player:{id:'player',kind:'player',x:2.5,y:15.5,speed:3,carried:null,action:null,task:null,distance:0,loadedDistance:0,loadedTicks:0}},items:{},lots:{},machines:{},jobs:{},actions:{},tasks:{},reservations:{},purchases:{},orders:{},activeOrder:null,ledger:[],events:[],shipments:[],storages:{warehouse:Array(12).fill(null),shipping:Array(2).fill(null)},shippedCount:0,navRevision:0,rules:{enabled:false,targets:{},groundItem:null},purchased:{},processed:{}};
 const mask=newItem(w,'mask',1,c);relocate(w,mask,{type:'storage',id:'warehouse',slot:0});return w;
}
export function pointOf(w,loc){if(loc.type==='ground')return loc;if(loc.type==='actor')return w.actors[loc.id];if(loc.type==='storage')return INFRA.find(i=>i.id===loc.id)?.port;if(['machine','installed'].includes(loc.type))return w.machines[loc.id]&&port(w.machines[loc.id]);return null;}
export const locationKey=loc=>['machine','installed'].includes(loc.type)?`${loc.type}:${loc.id}`:loc.type==='storage'?`storage:${loc.id}:${loc.slot}`:loc.type==='actor'?`actor:${loc.id}`:loc.type==='ground'?`ground:${loc.x}:${loc.y}`:null;
export const itemName=(w,i,c=DEFAULT_CONTENT)=>i?.lotId?`${i.lotId} · 晶圓盒`:c.items[i?.definitionId]?.label||'—';
export function routeRecipe(w,m,l,c=DEFAULT_CONTENT){const ids=c.routes[l?.routeId]?.steps[l?.cursor]||[];return ids.map(k=>c.recipes[k]).filter(r=>r.capability===c.machines[m.definitionId].capability);}
export function recipeCheck(w,m,l,r,c=DEFAULT_CONTENT,resources=true){
 const route=c.routes[l?.routeId];if(!l||l.disposition!=='active'||!route||l.routeVersion!==route.version||l.productId!==route.product||l.pattern!==route.pattern||l.waferCount!==20)return fail('WRONG_STAGE','批次產品、路線版本或隔離狀態不符');
 if(!r||!route.steps[l.cursor]?.includes(r.id)||r.capability!==c.machines[m.definitionId].capability)return fail('WRONG_STAGE','製程順序不符，請送往下一道設備');
 for(const [k,v] of Object.entries(r.input))if(l[k]!==v)return fail('WRONG_STAGE','薄膜或光阻狀態不符合配方');
 if((r.unlock||0)>w.shippedCount)return fail('NOT_UNLOCKED','完成首單後解鎖快速微影');
 if(resources){
  if(r.tool&&(!m.tool||w.items[m.tool]?.pattern!==r.tool))return fail('WRONG_TOOL','需要安裝圖案 A 光罩');
  const missing=Object.entries(r.materials).filter(([k,n])=>(m.tanks[k]||0)<n);if(missing.length)return fail('MATERIAL_SHORTAGE','缺少 '+missing.map(([k,n])=>`${c.materials[k].label} ${n-(m.tanks[k]||0)} 單位`).join('、'));
  if(w.cash<r.fee)return fail('NO_FUNDS',`加工費不足 ${r.fee-w.cash} C`);
 }return ok();
}
export function machineStatus(w,m,c=DEFAULT_CONTENT){if(m.phase==='RUNNING')return '加工中';if(m.phase==='DONE')return '完成待取';if(m.phase==='HOLD')return '隔離待取';if(!m.slot)return '空槽';const i=w.items[m.slot],l=w.lots[i.lotId],r=c.recipes[m.recipe]||routeRecipe(w,m,l,c)[0],v=recipeCheck(w,m,l,r,c);return v.ok?'待命':v.message;}
const SHORT=new Set(['pickup','drop','store','load','unload','refill','install','removeTool','handoff']);
const MANAGEMENT=new Set(['place','moveMachine','upgrade','purchase','accept','hire','rule','cancelTask','target']);
export class Engine{
 constructor(world=createWorld(),content=DEFAULT_CONTENT){this.c=content;this.w=world;this.pause=new Set();this.paths={};this.checkpoint=clone(world);this.onChange=null;this.lastError=null;}
 setWorld(w){validateWorld(w,this.c);this.w=clone(w);this.paths={};this.pause=new Set(['manual']);this.lastError=null;}
 near(a,p){return p&&distance(a,p)<=1.1+1e-8&&segmentClear(this.w,a,p,.02);}
 freeSlot(storage,taskId){return this.w.storages[storage].findIndex((v,n)=>v===null&&!Object.values(this.w.purchases).some(p=>p.status==='receiving'&&p.slot===n&&storage==='warehouse')&&!Object.values(this.w.actions).some(a=>a.keys.includes(`storage:${storage}:${n}`)&&a.q.taskId!==taskId)&&(!this.w.reservations[`storage:${storage}:${n}`]||this.w.reservations[`storage:${storage}:${n}`]===taskId));}
 keys(q){const w=this.w,a=w.actors[q.actor||'player'],i=w.items[q.item||a?.carried],m=w.machines[q.target],keys=[`actor:${a?.id}`];if(i)keys.push(`item:${i.id}`,locationKey(i.location));if(m)keys.push(`machine:${m.id}`);if(q.type==='store')keys.push(`storage:${q.target}:${q.slot??this.freeSlot(q.target,q.taskId)}`);if(q.type==='handoff')keys.push('actor:worker');return [...new Set(keys.filter(Boolean))];}
 machineFree(m){const w=this.w;return m&&!m.slot&&!m.job&&!Object.values(w.actions).some(a=>a.keys.includes(`machine:${m.id}`))&&!w.reservations[`machine:${m.id}`];}
 check(q,ownAction=null){
 const w=this.w,c=this.c,a=w.actors[q.actor||'player'],m=w.machines[q.target],i=w.items[q.item||a?.carried];
 if(!a)return fail('INVALID','角色不存在');
 if(a.kind==='worker'&&!['pickup','unload','load','store'].includes(q.type))return fail('PERMISSION','搬運工只能運送晶圓');
 if(!MANAGEMENT.has(q.type)&&this.pause.size)return fail('PAUSED','請先恢復遊戲');
 if(!MANAGEMENT.has(q.type)){
  for(const key of this.keys(q)){const lock=Object.values(w.actions).find(v=>v.id!==ownAction&&v.keys.includes(key));if(lock)return fail('BUSY','正在裝卸，請稍候');const owner=w.reservations[key];if(owner&&owner!==q.taskId&&q.type!=='handoff')return fail('RESERVED','此物品或目的槽已由搬運任務預約');}
 }
 const near=p=>this.near(a,p)?null:fail('OUT_OF_REACH','請靠近操作點');
 const empty=()=>a.carried?fail('HANDS_FULL','一次只能攜帶一件，請先放下'):null;
 const unlock=()=>w.shippedCount<1?fail('NOT_UNLOCKED','請先完成教學訂單'):null;
 const invest=n=>w.cash<n+(w.shippedCount?100:0)?fail('NO_FUNDS',w.shippedCount?'投資後必須保留 100 C 營運金':'資金不足'):null;
 switch(q.type){
 case 'purchase':{
  const d=c.items[q.definition],n=q.quantity||1;if(!d||![1,5].includes(n)||(d.kind!=='supply_box'&&n!==1))return fail('INVALID','採購數量錯誤');
  if(this.freeSlot('warehouse')<0)return fail('SLOT_OCCUPIED','材料倉已滿或倉位已保留');
  if(d.kind==='wafer_lot'&&Object.values(w.lots).filter(l=>!['shipped','scrapped'].includes(l.disposition)).length>=(w.shippedCount?3:1))return fail('LIMIT','在途及未封存批次已達上限');
  if(!w.shippedCount&&((d.kind==='tool')||(d.kind==='supply_box'&&(w.purchased[q.definition]||0)+n>5)||(d.kind==='wafer_lot'&&(w.purchased.wafer||0)>=1)))return fail('LIMIT','首單前採購保護上限');
  if(w.cash<d.cost*n)return fail('NO_FUNDS','採購資金不足');if(d.kind==='tool'&&invest(d.cost*n))return invest(d.cost*n);return ok();}
 case 'accept':{const o=c.orders[q.template];if(!o)return fail('INVALID','訂單不存在');if(w.activeOrder)return fail('BUSY','目前訂單尚未交付，不能取消或重設期限');if(w.shippedCount<o.unlock||(!w.shippedCount&&q.template!=='tutorial')||(w.shippedCount&&q.template==='tutorial'))return fail('NOT_UNLOCKED','訂單尚未解鎖');return ok();}
 case 'place':case 'moveMachine':{
  const d=c.machines[q.definition||m?.definitionId];if(!d)return fail('INVALID','設備不存在');
  if(q.type==='moveMachine'&&!this.machineFree(m))return fail('BUSY','先取走晶圓並取消裝卸或物流預約');
  if(q.type==='place'){if(Object.keys(w.machines).length>=10)return fail('LIMIT','最多 10 台設備');if(!w.shippedCount&&Object.values(w.machines).some(x=>x.definitionId===q.definition))return fail('LIMIT','首單前每種設備限一台');const e=invest(d.cost);if(e)return e;}
  if(!Number.isInteger(q.rotation)||q.rotation<0||q.rotation>3)return fail('INVALID','方向錯誤');const reason=placementReason(w,{x:q.x,y:q.y,rotation:q.rotation},q.type==='moveMachine'?m.id:null);return reason?fail('INVALID_PLACEMENT',reason):ok();}
 case 'upgrade':if(unlock())return unlock();if(!this.machineFree(m))return fail('BUSY','設備需空槽且無預約');if(m.level!==1)return fail('LIMIT','已達最高等級');return invest(c.machines[m.definitionId].upgrade)||ok();
 case 'pickup':case 'unload':{
  if(empty())return empty();if(!i||i.lifecycle!=='available'||['actor','transit','archived','installed'].includes(i.location.type))return fail('INVALID','此物品目前不能拿取');
  if(a.kind==='worker'&&(i.kind!=='wafer_lot'||w.lots[i.lotId].disposition!=='active'))return fail('PERMISSION','工人只能搬運正常晶圓盒');
  if(i.location.type==='machine'&&w.machines[i.location.id].phase==='RUNNING')return fail('BUSY','加工中不能卸料');return near(pointOf(w,i.location))||ok();}
 case 'drop':{if(!i||a.carried!==i.id)return fail('EMPTY','手上沒有物品');const p=q.spot||groundSpot(w,a);if(!p)return fail('NO_SPACE','附近沒有合法落點');if(distance(a,p)>1.1||!canStand(w,p.x,p.y)||!segmentClear(w,a,p,.02))return fail('INVALID_PLACEMENT','此處不可放下');if(p.x%1!==.5||p.y%1!==.5||(p.x<4&&p.x>1&&p.y>13&&p.y<17)||[...INFRA.map(x=>x.port),...Object.values(w.machines).map(port)].some(x=>distance(x,p)<.1)||Object.values(w.items).some(x=>x.location.type==='ground'&&distance(x.location,p)<.1))return fail('INVALID_PLACEMENT','落點是保留區或已有物品');return ok();}
 case 'store':if(!i||a.carried!==i.id)return fail('EMPTY','手上沒有物品');if(!w.storages[q.target])return fail('INVALID','倉庫不存在');if(q.target==='shipping'&&(i.kind!=='wafer_lot'||!w.lots[i.lotId].inspection||w.lots[i.lotId].disposition!=='active'))return fail('WRONG_STAGE','出貨站只接收已檢查試片');{let n=q.slot??this.freeSlot(q.target,q.taskId);if(n<0||n>=w.storages[q.target].length||w.storages[q.target][n]||Object.values(w.purchases).some(p=>q.target==='warehouse'&&p.status==='receiving'&&p.slot===n))return fail('SLOT_OCCUPIED','沒有可用倉位');return near(INFRA.find(o=>o.id===q.target).port)||ok();}
 case 'load':if(!m||!i||a.carried!==i.id||i.kind!=='wafer_lot')return fail('INVALID','請先攜帶晶圓盒');if(m.phase!=='EMPTY'||m.slot)return fail('SLOT_OCCUPIED','設備加工槽已占用');{const r=routeRecipe(w,m,w.lots[i.lotId],c).find(r=>(r.unlock||0)<=w.shippedCount);const check=recipeCheck(w,m,w.lots[i.lotId],r,c,false);return !check.ok?check:near(port(m))||ok();}
 case 'refill':if(!m||!i||a.carried!==i.id||i.kind!=='supply_box')return fail('INVALID','請攜帶對應補給盒');if(m.phase==='RUNNING')return fail('BUSY','加工中不能補給');if(Object.keys(i.contents).some(k=>!(k in c.machines[m.definitionId].materials)))return fail('WRONG_MATERIAL','補給種類不適用此設備');if(!Object.entries(i.contents).some(([k,n])=>n>0&&(m.tanks[k]||0)<c.machines[m.definitionId].materials[k]))return fail('FULL','料槽已滿');return near(port(m))||ok();
 case 'install':if(!m||!c.machines[m.definitionId].tool||!i||i.kind!=='tool'||a.carried!==i.id)return fail('WRONG_TOOL','此設備不接受目前工具');if(m.tool||m.phase==='RUNNING')return fail('BUSY','工具槽已占用或正在加工');return near(port(m))||ok();
 case 'removeTool':if(!m||!m.tool)return fail('EMPTY','沒有已安裝工具');if(empty())return empty();if(m.phase==='RUNNING')return fail('BUSY','加工中不能取工具');return near(port(m))||ok();
 case 'selectRecipe':if(!m||m.phase==='RUNNING'||!c.recipes[q.recipe]||c.recipes[q.recipe].capability!==c.machines[m.definitionId].capability)return fail('WRONG_RECIPE','配方不適用或加工中');if((c.recipes[q.recipe].unlock||0)>w.shippedCount)return fail('NOT_UNLOCKED','完成首單後解鎖');return ok();
 case 'start':if(!m||m.phase!=='LOADED')return fail('BUSY','先投入正確批次，已開始的工作不能重複啟動');{const v=recipeCheck(w,m,w.lots[w.items[m.slot].lotId],c.recipes[m.recipe],c);return !v.ok?v:near(port(m))||ok();}
 case 'abort':if(unlock())return unlock();if(!m||m.phase!=='RUNNING')return fail('BUSY','沒有加工中工作');if(!q.confirm)return fail('CONFIRM','中止會扣留已用費料並隔離整批，需確認');return near(port(m))||ok();
 case 'scrap':if(unlock())return unlock();if(!i||a.carried!==i.id)return fail('EMPTY','先持物到材料倉');if(!q.confirm)return fail('CONFIRM','報廢不退款，需確認');return near(INFRA[0].port)||ok();
 case 'ship':{
  if(!q.confirm)return fail('CONFIRM','請確認交付');if(!i||i.kind!=='wafer_lot'||!((i.location.type==='actor'&&i.location.id==='player')||(i.location.type==='storage'&&i.location.id==='shipping')))return fail('INVALID','將晶圓盒送至出貨站或親自持盒');
  const l=w.lots[i.lotId],o=w.orders[w.activeOrder];if(!o||o.status!=='ACTIVE')return fail('NO_ORDER','請先接受訂單');
  if(l.disposition!=='active'||l.productId!=='sample.patternA'||l.pattern!=='A'||l.routeId!=='sampleA'||l.routeVersion!==1||l.cursor!==5||!l.inspection||l.inspection.good<o.minGood||l.history.filter(h=>h.status==='completed').length!==5||!l.history.filter(h=>h.status==='completed').every((h,n)=>h.before===n&&h.after===n+1&&c.routes.sampleA.steps[n].includes(h.recipeId)))return fail('WRONG_STAGE','需要完整五步履歷與符合訂單的已檢查試片');
  if(o.fresh&&l.history[0].startTick<o.acceptedTick)return fail('NOT_FRESH','急件必須於接單後開始沉積');return near(INFRA[1].port)||ok();}
 case 'hire':if(unlock())return unlock();if(w.actors.worker)return fail('LIMIT','最多一名搬運工');return invest(200)||ok();
 case 'rule':case 'target':if(!w.actors.worker)return fail('NOT_UNLOCKED','請先聘用搬運工');if(q.type==='target'&&q.machine&&(!w.machines[q.machine]||c.machines[w.machines[q.machine].definitionId].capability!==q.capability))return fail('INVALID','目標能力不符');if(q.groundItem&&w.items[q.groundItem]?.location.type!=='ground')return fail('INVALID','來源不是地面物品');return ok();
 case 'cancelTask':if(!w.actors.worker?.task)return fail('EMPTY','目前沒有搬運任務');return ok();
 case 'handoff':if(empty())return empty();if(!w.actors.worker?.carried)return fail('EMPTY','工人目前空手');if(w.actors.worker.action)return fail('BUSY','工人正在裝卸');return near(w.actors.worker)||ok();
 default:return fail('INVALID','未知命令');
 }
 }
 dispatch(input){
 const w=this.w,q={...input,actor:input.actor||'player'};
 if(q.commandId&&w.processed[q.commandId])return fail('ALREADY_APPLIED','此操作已受理');
 if(q.type==='drop'&&!q.spot)q.spot=groundSpot(w,w.actors[q.actor]);if(q.type==='store'&&q.slot===undefined)q.slot=this.freeSlot(q.target,q.taskId);
 if(q.type==='removeTool')q.item=w.machines[q.target]?.tool;if(q.type==='handoff')q.item=w.actors.worker?.carried;
 const result=this.check(q);if(!result.ok){this.lastError=result;return result;}
 q.commandId=q.commandId||id(w,'C');w.processed[q.commandId]=true;
 if(SHORT.has(q.type)){
  const item=w.items[q.item||w.actors[q.actor].carried];if(item)q.item=item.id;const act={id:id(w,'A'),q,actorId:q.actor,keys:this.keys(q),itemRevision:item?.revision,targetRevision:w.machines[q.target]?.revision,remaining:15,startTick:w.tick};w.actions[act.id]=act;w.actors[q.actor].action=act.id;return ok({pending:true,id:act.id});
 }
 this.commit(q);return ok();
 }
 commit(q){
 const w=this.w,c=this.c,a=w.actors[q.actor],m=w.machines[q.target],i=w.items[q.item||a.carried];
 switch(q.type){
 case 'purchase':{const n=q.quantity||1,d=c.items[q.definition],p={id:id(w,'P'),definition:q.definition,quantity:n,cost:d.cost*n,slot:this.freeSlot('warehouse'),dueTick:w.tick+600,status:'receiving'};const item=newItem(w,q.definition,n,c);p.itemId=item.id;relocate(w,item,{type:'transit',id:p.id});w.purchases[p.id]=p;w.purchased[q.definition]=(w.purchased[q.definition]||0)+n;ledger(w,-p.cost,'purchase',p.id);event(w,'purchased',{purchaseId:p.id,itemId:item.id});break;}
 case 'accept':{const d=c.orders[q.template],o={id:id(w,'O'),template:q.template,acceptedTick:w.tick,dueTick:d.seconds===null?null:w.tick+d.seconds*HZ,minGood:d.minGood,price:d.price,fresh:!!d.fresh,status:'ACTIVE'};w.orders[o.id]=o;w.activeOrder=o.id;event(w,'orderAccepted',{orderId:o.id});break;}
 case 'place':{const d=c.machines[q.definition],machine={id:id(w,'M'),definitionId:d.id,x:q.x,y:q.y,rotation:q.rotation,level:1,phase:'EMPTY',slot:null,tool:null,job:null,tanks:Object.fromEntries(Object.keys(d.materials).map(k=>[k,0])),recipe:Object.values(c.recipes).find(r=>r.capability===d.capability&&!(r.unlock>0)).id,revision:0,stats:{idle:0,running:0,blocked:0}};w.machines[machine.id]=machine;ledger(w,-d.cost,'equipment',machine.id);w.navRevision++;event(w,'placed',{machineId:machine.id});break;}
 case 'moveMachine':m.x=q.x;m.y=q.y;m.rotation=q.rotation;m.revision++;w.navRevision++;event(w,'movedMachine',{machineId:m.id});break;
 case 'upgrade':m.level=2;m.revision++;ledger(w,-c.machines[m.definitionId].upgrade,'upgrade',m.id);break;
 case 'pickup':case 'unload':relocate(w,i,{type:'actor',id:a.id});event(w,'pickedUp',{actorId:a.id,itemId:i.id});break;
 case 'drop':relocate(w,i,{type:'ground',...q.spot});event(w,'dropped',{itemId:i.id});break;
 case 'store':relocate(w,i,{type:'storage',id:q.target,slot:q.slot});event(w,'stored',{actorId:a.id,itemId:i.id,storage:q.target});break;
 case 'load':relocate(w,i,{type:'machine',id:m.id});m.recipe=routeRecipe(w,m,w.lots[i.lotId],c).some(r=>r.id===m.recipe)?m.recipe:routeRecipe(w,m,w.lots[i.lotId],c)[0].id;event(w,'loaded',{actorId:a.id,itemId:i.id,machineId:m.id});break;
 case 'refill':{const amounts={};for(const [k,n] of Object.entries(i.contents)){const amount=Math.min(n,c.machines[m.definitionId].materials[k]-(m.tanks[k]||0));i.contents[k]-=amount;m.tanks[k]=(m.tanks[k]||0)+amount;amounts[k]=amount;}i.revision++;m.revision++;if(Object.values(i.contents).every(n=>n===0)){relocate(w,i,{type:'archived',reason:'emptySupply'});i.lifecycle='consumed';}event(w,'refilled',{itemId:i.id,machineId:m.id,amounts});break;}
 case 'install':relocate(w,i,{type:'installed',id:m.id});event(w,'installed',{itemId:i.id,machineId:m.id});break;
 case 'removeTool':relocate(w,i,{type:'actor',id:a.id});break;
 case 'selectRecipe':m.recipe=q.recipe;m.revision++;break;
 case 'start':{const r=clone(c.recipes[m.recipe]),l=w.lots[w.items[m.slot].lotId];const j={id:id(w,'J'),machineId:m.id,lotId:l.id,recipe:r,startTick:w.tick,duration:Math.round(r.seconds*HZ*(m.level===2?.8:1)),cursor:l.cursor,status:'running',consumed:clone(r.materials),fee:r.fee};j.remaining=j.duration;w.jobs[j.id]=j;for(const [k,n] of Object.entries(r.materials))m.tanks[k]-=n;ledger(w,-r.fee,'processing',j.id);l.productionCost+=r.fee+Object.entries(r.materials).reduce((sum,[k,n])=>sum+c.materials[k].cost*n,0);m.job=j.id;m.phase='RUNNING';m.revision++;event(w,'started',{jobId:j.id,lotId:l.id});break;}
 case 'abort':{const j=w.jobs[m.job],l=w.lots[j.lotId];j.status='aborted';j.endTick=w.tick;l.disposition='quarantined';l.defects=Array.from({length:20},(_,n)=>n+1);l.defectEvents.push({reason:'ABORTED',tick:w.tick,indices:clone(l.defects)});l.history.push({jobId:j.id,recipeId:j.recipe.id,recipeVersion:j.recipe.version,machineId:m.id,startTick:j.startTick,endTick:w.tick,before:l.cursor,after:l.cursor,consumed:j.consumed,fee:j.fee,status:'aborted'});m.phase='HOLD';event(w,'aborted',{jobId:j.id});break;}
 case 'scrap':relocate(w,i,{type:'archived',reason:'scrapped'});i.lifecycle='scrapped';if(i.lotId)w.lots[i.lotId].disposition='scrapped';event(w,'scrapped',{itemId:i.id});break;
 case 'ship':{const l=w.lots[i.lotId],o=w.orders[w.activeOrder],late=o.dueTick===null?0:w.tick-o.dueTick,tier=late<=0?10:late<=120*HZ?9:8,income=Math.floor(l.inspection.good*o.price*tier/10);const s={id:id(w,'S'),orderId:o.id,lotId:l.id,good:l.inspection.good,tier,income,tick:w.tick,cost:l.productionCost};relocate(w,i,{type:'archived',reason:'shipped',id:s.id});i.lifecycle='shipped';l.disposition='shipped';o.status='FULFILLED';o.shipmentId=s.id;w.activeOrder=null;w.shipments.push(s);w.shippedCount++;ledger(w,income,'shipment',s.id);event(w,'shipped',{shipmentId:s.id});if(w.cash>=100)this.checkpoint=clone(w);break;}
 case 'hire':w.actors.worker={id:'worker',kind:'worker',x:3.5,y:15.5,speed:2.5,carried:null,action:null,task:null,distance:0,loadedDistance:0,loadedTicks:0};ledger(w,-200,'hire','worker');event(w,'hired');break;
 case 'rule':if(q.enabled&&!w.rules.enabled)w.rules.skipItems=[];w.rules.enabled=!!q.enabled;if(q.groundItem){w.rules.groundItem=q.groundItem;w.rules.skipItems=(w.rules.skipItems||[]).filter(x=>x!==q.groundItem);}if(!q.enabled&&w.actors.worker?.task)this.cancelTask();break;
 case 'target':w.rules.targets[q.capability]=q.machine||null;break;
 case 'cancelTask':this.cancelTask();break;
 case 'handoff':{const worker=w.actors.worker;this.releaseTask(worker.task,'CANCELLED');relocate(w,w.items[worker.carried],{type:'actor',id:'player'});delete this.paths.worker;event(w,'handoff',{itemId:i.id});break;}
 }
 this.lastError=null;this.onChange?.(q.type);
 }
 completeJob(j){
 const w=this.w;if(j.status!=='running')return fail('ALREADY_APPLIED','工作已完成');const m=w.machines[j.machineId],l=w.lots[j.lotId],r=j.recipe;
 if(!m||m.job!==j.id||l.cursor!==j.cursor)throw Error('工作與批次引用不一致');
 for(const [k,v] of Object.entries(r.effects))if(k!=='inspect')l[k]=v;
 if(r.defects){l.defects=[...new Set([...l.defects,...r.defects])].sort((a,b)=>a-b);l.defectEvents.push({reason:'LITHO_FAST_TRADEOFF',indices:r.defects,tick:w.tick});}
 if(r.effects.inspect){l.inspection={good:20-l.defects.length,bad:l.defects.length,tick:w.tick,jobId:j.id};if(!w.events.some(e=>e.type==='inspected'&&e.lotId===l.id))event(w,'inspected',{lotId:l.id,good:l.inspection.good,total:20});}
 l.cursor++;j.status='completed';j.endTick=w.tick;j.remaining=0;
 l.history.push({jobId:j.id,recipeId:r.id,recipeVersion:r.version,machineId:m.id,startTick:j.startTick,endTick:w.tick,before:j.cursor,after:l.cursor,consumed:clone(j.consumed),fee:j.fee,status:'completed'});m.phase='DONE';m.revision++;event(w,'completed',{jobId:j.id,lotId:l.id});return ok();
 }
 go(actorId,p){const a=this.w.actors[actorId],points=path(this.w,a,p);if(!points)return fail('PATH_BLOCKED','沒有可行路徑');this.paths[actorId]={points,target:clone(p),revision:this.w.navRevision};return ok();}
 walk(a,dx,dy){const n=Math.hypot(dx,dy);if(!n)return;const d=move(this.w,a,dx/n*a.speed/HZ,dy/n*a.speed/HZ);a.distance+=d;if(a.carried){a.loadedDistance+=d;a.loadedTicks++;}}
 follow(a){let p=this.paths[a.id];if(!p)return false;if(p.revision!==this.w.navRevision){const r=this.go(a.id,p.target);if(!r.ok){delete this.paths[a.id];return false;}p=this.paths[a.id];}const target=p.points[0];if(!target){delete this.paths[a.id];return false;}const d=distance(a,target),step=a.speed/HZ;if(d<=step+1e-8){const moved=move(this.w,a,target.x-a.x,target.y-a.y);a.distance+=moved;if(a.carried&&moved>0){a.loadedDistance+=moved;a.loadedTicks++;}p.points.shift();if(!p.points.length)delete this.paths[a.id];}else this.walk(a,target.x-a.x,target.y-a.y);return true;}
 tick(input={x:0,y:0}){
 if(this.pause.size)return;const w=this.w;w.tick++;
 for(const m of Object.values(w.machines))m.stats[m.phase==='RUNNING'?'running':m.phase==='DONE'?'blocked':'idle']++;
 if(input.x||input.y){delete this.paths.player;this.walk(w.actors.player,input.x,input.y);}else this.follow(w.actors.player);
 for(const act of Object.values(w.actions)){
  if(--act.remaining>0)continue;const i=w.items[act.q.item],target=w.machines[act.q.target];const check=(i&&i.revision!==act.itemRevision)||(target&&target.revision!==act.targetRevision)?fail('STALE','物品或設備狀態已改變，請重試'):this.check(act.q,act.id);
  delete w.actions[act.id];w.actors[act.actorId].action=null;
  if(check.ok)this.commit(act.q);else{this.lastError=check;event(w,'actionFailed',{actorId:act.actorId,reason:check.message});}
 }
 for(const j of Object.values(w.jobs))if(j.status==='running'&&--j.remaining<=0)this.completeJob(j);
 for(const p of Object.values(w.purchases))if(p.status==='receiving'&&w.tick>=p.dueTick){if(w.storages.warehouse[p.slot])throw Error('到貨保留倉位被占用');relocate(w,w.items[p.itemId],{type:'storage',id:'warehouse',slot:p.slot});p.status='received';event(w,'arrived',{purchaseId:p.id,itemId:p.itemId});}
 this.workerTick?.();
 }
 advance(n,input){for(let i=0;i<n;i++)this.tick(input);}
 // Logistics is installed separately after the manual production loop.
}
export function metrics(w){const elapsed=Math.min(300,w.tick/HZ),recent=w.events.filter(e=>e.type==='inspected'&&e.tick>w.tick-300*HZ),inspections=w.events.filter(e=>e.type==='inspected').slice(-5),good=recent.reduce((s,e)=>s+e.good,0);return{cash:w.cash,observedSeconds:elapsed,good,rate:elapsed>=60?good*60/elapsed:null,yield:inspections.length?inspections.reduce((s,e)=>s+e.good,0)/(20*inspections.length):null};}
export function validateWorld(w,c=DEFAULT_CONTENT){
 const assert=(b,msg)=>{if(!b)throw Error('存檔無效：'+msg);};
 assert(w&&w.schemaVersion===1&&w.contentVersion===1,'不支援的版本');
 assert(typeof w.worldId==='string'&&Number.isInteger(w.tick)&&w.tick>=0&&Number.isInteger(w.cash)&&w.cash>=0,'世界或資金欄位');
 for(const k of ['actors','items','lots','machines','jobs','actions','purchases','tasks','reservations','orders','nextIds','rules','processed','purchased','storages'])assert(w[k]&&typeof w[k]==='object','缺少 '+k);
 for(const k of ['ledger','events','shipments'])assert(Array.isArray(w[k]),'缺少 '+k);
 assert(w.actors.player?.kind==='player'&&Object.keys(w.actors).length<=2,'角色數量');
 for(const k of ['I','B','M','J','T','A','P','O','L','E','S','C'])assert(Number.isInteger(w.nextIds[k])&&w.nextIds[k]>=0,'ID 計數器 '+k);
 for(const [prefix,values] of [['I',Object.values(w.items)],['B',Object.values(w.lots)],['M',Object.values(w.machines)],['J',Object.values(w.jobs)],['T',Object.values(w.tasks)],['A',Object.values(w.actions)],['P',Object.values(w.purchases)],['O',Object.values(w.orders)],['L',w.ledger],['E',w.events],['S',w.shipments]])for(const entity of values)assert(typeof entity.id==='string'&&entity.id.startsWith(prefix)&&Number.isInteger(Number(entity.id.slice(1)))&&Number(entity.id.slice(1))<=w.nextIds[prefix],'ID 計數器落後於實體');
 assert(w.cash===2000+w.ledger.reduce((sum,e)=>sum+e.delta,0),'帳本餘額不符');
 assert(new Set(w.ledger.map(e=>e.id)).size===w.ledger.length&&new Set(w.events.map(e=>e.id)).size===w.events.length,'重複事件');
 assert(w.shippedCount===w.shipments.length,'出貨計數');
 assert(w.storages.warehouse.length===12&&w.storages.shipping.length===2,'倉庫容量');
 const refs=new Map(),ref=(iid,loc)=>{assert(w.items[iid],'物品引用不存在');assert(!refs.has(iid),'同一物品有兩個位置');refs.set(iid,loc);};
 for(const a of Object.values(w.actors)){assert(canStand(w,a.x,a.y),'角色位置碰撞');assert((a.kind==='player'&&a.speed===3)||(a.kind==='worker'&&a.speed===2.5),'角色速度');if(a.carried)ref(a.carried,{type:'actor',id:a.id});assert(!a.action||w.actions[a.action]?.actorId===a.id,'動作引用');assert(!a.task||w.tasks[a.task]?.workerId===a.id,'任務引用');}
 for(const [s,slots] of Object.entries(w.storages))for(let n=0;n<slots.length;n++)if(slots[n])ref(slots[n],{type:'storage',id:s,slot:n});
 for(const m of Object.values(w.machines)){assert(c.machines[m.definitionId]&&[1,2].includes(m.level)&&['EMPTY','LOADED','RUNNING','DONE','HOLD'].includes(m.phase),'設備欄位');assert(Number.isInteger(m.x)&&Number.isInteger(m.y)&&Number.isInteger(m.rotation)&&m.rotation>=0&&m.rotation<4,'設備位置');if(m.slot)ref(m.slot,{type:'machine',id:m.id});if(m.tool)ref(m.tool,{type:'installed',id:m.id});assert((m.phase==='EMPTY')===(!m.slot),'設備槽狀態');for(const [k,n] of Object.entries(m.tanks))assert(Number.isInteger(n)&&n>=0&&n<=c.machines[m.definitionId].materials[k],'料槽超限');assert(!m.job||w.jobs[m.job]?.machineId===m.id,'工作引用');if(m.phase==='RUNNING')assert(w.jobs[m.job]?.status==='running','運行工作缺失');}
 const reserved=new Set();for(const p of Object.values(w.purchases)){assert(w.items[p.itemId]&&['receiving','received'].includes(p.status),'採購引用');if(p.status==='receiving'){assert(!reserved.has(p.slot)&&w.storages.warehouse[p.slot]===null,'到貨倉位衝突');reserved.add(p.slot);ref(p.itemId,{type:'transit',id:p.id});}}
 for(const [iid,i] of Object.entries(w.items)){assert(i.id===iid&&c.items[i.definitionId]&&i.kind===c.items[i.definitionId].kind&&Number.isInteger(i.revision),'物品欄位');const loc=i.location;assert(loc&&['actor','storage','machine','installed','transit','ground','archived'].includes(loc.type),'位置種類');assert((loc.type==='archived')===(i.lifecycle!=='available'),'生命週期與位置不符');if(['ground','archived'].includes(loc.type)){assert(!refs.has(i.id),'地面或封存物有其他引用');if(loc.type==='ground')assert(canStand(w,loc.x,loc.y),'地面物品不可達');}else assert(JSON.stringify(refs.get(i.id))===JSON.stringify(loc),'物品雙向引用不符');if(i.kind==='supply_box')for(const [k,n] of Object.entries(i.contents))assert(c.materials[k]&&Number.isInteger(n)&&n>=0,'箱內數量');if(i.kind==='wafer_lot')assert(w.lots[i.lotId]?.itemId===i.id,'批次引用');if(loc.type==='machine')assert(i.kind==='wafer_lot','機台加工槽種類');if(loc.type==='installed')assert(i.kind==='tool','安裝槽種類');}
 for(const l of Object.values(w.lots)){const route=c.routes[l.routeId];assert(route&&l.routeVersion===route.version&&l.waferCount===20&&Number.isInteger(l.cursor)&&l.cursor>=0&&l.cursor<=route.steps.length,'批次路線或片數');assert(Array.isArray(l.defects)&&new Set(l.defects).size===l.defects.length&&l.defects.every(n=>Number.isInteger(n)&&n>=1&&n<=20),'缺陷片索引');assert(new Set(l.history.map(h=>h.jobId)).size===l.history.length,'重複履歷');assert(l.history.filter(h=>h.status==='completed').length===l.cursor,'履歷與游標不符');if(l.inspection)assert(l.inspection.good+l.inspection.bad===20&&l.inspection.bad===l.defects.length,'檢查片數');}
 for(const j of Object.values(w.jobs)){assert(w.lots[j.lotId]&&w.machines[j.machineId]&&j.recipe&&c.recipes[j.recipe.id],'工作引用');if(j.status==='running')assert(Number.isInteger(j.remaining)&&j.remaining>0&&j.remaining<=j.duration&&w.machines[j.machineId].job===j.id,'工作進度');}
 const locks=new Set();for(const a of Object.values(w.actions)){assert(w.actors[a.actorId]?.action===a.id&&Number.isInteger(a.remaining)&&a.remaining>0&&a.remaining<=15&&SHORT.has(a.q?.type)&&a.q.actor===a.actorId,'短動作');assert(a.keys.includes(`actor:${a.actorId}`)&&(!a.q.item||a.keys.includes(`item:${a.q.item}`)),'動作鎖缺失');for(const k of a.keys){assert(!locks.has(k),'動作鎖衝突');locks.add(k);}}
 for(const [key,tid] of Object.entries(w.reservations)){const t=w.tasks[tid];assert(t&&!['DONE','CANCELLED'].includes(t.state),'預約引用');assert(key===`item:${t.itemId}`||key===locationKey(t.destination),'預約種類或目的不符');}
 for(const t of Object.values(w.tasks)){assert(w.items[t.itemId]?.kind==='wafer_lot'&&t.workerId==='worker'&&['TO_SOURCE','TO_DESTINATION','RETURNING','BLOCKED','DONE','CANCELLED'].includes(t.state),'物流任務欄位');if(!['DONE','CANCELLED'].includes(t.state)){assert(w.actors.worker?.task===t.id&&w.reservations[`item:${t.itemId}`]===t.id,'物流持有者與預約');if(t.destination)assert(w.reservations[locationKey(t.destination)]===t.id,'目的槽預約缺失');}}
 if(w.activeOrder)assert(w.orders[w.activeOrder]?.status==='ACTIVE','訂單引用');assert(Object.values(w.orders).filter(o=>o.status==='ACTIVE').length===(w.activeOrder?1:0),'有效訂單數量');
 const reachable=flood(w);for(const p of [...INFRA.map(x=>x.port),...Object.values(w.machines).map(port),...Object.values(w.actors),...Object.values(w.items).filter(i=>i.location.type==='ground').map(i=>i.location)])assert(reachable.has(`${Math.floor(p.x)},${Math.floor(p.y)}`),'必要操作點或物品不可達');
 for(const m of Object.values(w.machines))assert(placementReason(w,m,m.id)===null,'設備配置重疊或無效');
 return true;
}
