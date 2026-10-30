import {content,buildings,materials,technologies,recipes} from './content/index.js';
import {validateContent} from './content/validate.js';
import {Input} from './core/input.js';
import {createRuntime} from './core/runtime.js';
import {browserStorage} from './core/storage.js';
import {initFullscreen} from './core/fullscreen.js';
import {createGameState,player,building,entrance,onEntrance,footprint,quantity,emit,at} from './game/state.js';
import {stepGame,applyIntent,actionsFor,contextBuilding} from './game/rules.js';
import {canPlace} from './game/construction.js';
import {powerUsed,powerCapacity} from './game/production.js';
import {serialize,deserialize,SAVE_KEY} from './game/save.js';
import {FactoryRenderer} from './game/renderer.js';
validateContent(content);
const $=id=>document.getElementById(id),canvas=$('game'),renderer=new FactoryRenderer(canvas),storage=browserStorage(SAVE_KEY),autosave=browserStorage(SAVE_KEY+':auto');
let state=createGameState(),ui={selected:state.buildings[0].id,mode:'equipment',placement:null,hover:null,placementValid:false},lastUI=0,lastAuto=0,resumeModal=false,sound=false,audioContext=null,lastSoundId=0,lastPanelBody='';
const frameWork=[];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmtInventory=e=>Object.entries(e.inventory).filter(([,n])=>n>0).map(([id,n])=>`${materials[id].name} ×${n}`).join('、')||'空手';
function setPause(p){state.paused=p;input.clear();runtime?.reset();if(!p)canvas.focus({preventScroll:true});renderUI();}
const input=new Input(canvas,{isPlaying:()=>!state.paused&&!$('modal').open,cancel:()=>{ui.placement=null;renderUI();},blur:()=>{resumeModal=false;state.paused=true;input.clear();runtime?.reset();renderUI();}});
function send(intent){if(state.paused){emit(state,'請先點「開始運轉／繼續運轉」。');renderUI();return false;}const result=applyIntent(state,intent);renderUI();return result;}
function select(id){ui.selected=id;ui.mode='equipment';$('panel').hidden=false;renderUI();}
function row(label,value){return `<div class="row"><span>${label}</span><strong>${value}</strong></div>`;}
function invRows(e){return Object.entries(e.inventory).map(([id,n])=>row(`<span class="materials-row"><i class="material-dot" style="background:${materials[id].color}"></i>${materials[id].name}</span>`,n)).join('')||'<p class="empty">尚無物料</p>';}
function renderPanel(){
 let body='',kicker='設備';
 if(ui.mode==='build'){
  kicker='基地建設';body='<h2>配置設備</h2><p>選擇設備後點地面預覽，再確認。右側箭頭是唯一互動入口，必須保留通道。</p>';
  for(const b of content.buildings)body+=`<div class="section"><div class="row"><strong>${b.name}</strong><span>${b.cost} 經費</span></div><p>${b.footprint.length} 格 · 容量 ${b.capacity}${b.power?` · ${b.power} 電力起`:''}${b.unlock?' · 穩定化研究解鎖':''}</p><button data-build="${b.id}" ${b.unlock&&!state.research.includes(b.unlock)?'disabled':''}>配置${b.name}</button></div>`;
 }else if(ui.mode==='workers'){
  kicker='人員分工';body='<h2>基地人員</h2><p>搬運員預約並取送物料；操作員在設備入口啟動加工與提交交付。兩種工作可隨時重新分配，搬運途中須先完成當趟。</p>';
  for(const w of state.actors.filter(a=>a.kind==='worker'))body+=`<div class="section"><div class="row"><strong>工人 ${w.id.endsWith('1')?'01':'02'}</strong><select aria-label="${w.id} 分工" data-worker="${w.id}" ${state.delivered<1?'disabled':''}>${[['idle','待命'],['logistics','搬運員'],['operator','操作員']].map(([id,name])=>`<option value="${id}" ${w.role===id?'selected':''}>${name}</option>`).join('')}</select></div><p>${esc(w.status)}<br>攜帶：${esc(fmtInventory(w))}</p></div>`;
  body+=row('進行中物流',`${state.tasks.length} 趟`)+row('累計走行',`${state.stats.steps} 格`)+row('累計搬運占用',`${Math.round(state.stats.logisticsSeconds)} 秒`);
 }else if(ui.mode==='research'){
  kicker='廠務與研究';const t=technologies.stable;
  body=`<h2>廠務中心</h2><p>設備與研究共用供電。超出容量時拒絕新加工，已開始的批次會持續到完成。</p>${row('廠務等級',state.utilityLevel)}${row('目前用電',`${powerUsed(state)} / ${powerCapacity(state)}`)}<div class="actions"><button data-upgrade>升級廠務 · 經費 ${state.utilityLevel*20} → 電力 +4</button></div><h3>${t.name}</h3><p>${t.description}</p><p>累計交付 ${t.delivered} 片 · 經費 ${t.cost} · 12 秒 · 電力 2</p>${state.research.includes(t.id)?'<span class="chip">研究已完成</span>':state.researchJob?`<progress value="${state.researchJob.duration-state.researchJob.remaining}" max="${state.researchJob.duration}"></progress><p>研究中 · 剩 ${Math.ceil(state.researchJob.remaining)} 秒</p>`:'<button data-research="stable">開始研究</button>'}<h3>科學與遊戲簡化</h3><p>速度、異常批次與電力點都是示例規則；沒有模擬真實製程參數。</p><button data-science>開啟知識說明</button>`;
 }else if(ui.mode==='equipment-list'){
  kicker='基地設備';body='<h2>設備清單</h2><p>可用此清單選取設備，再按「前往入口」，無需點選地圖。</p>'+state.buildings.map(b=>`<div class="section"><div class="row"><strong>${buildings[b.type].name}</strong><span class="micro">${b.q}, ${b.r}</span></div><button data-select="${b.id}">選取${buildings[b.type].name}</button></div>`).join('');
 }else{
  const b=building(state,ui.selected);if(!b){body='<h2>選取設備</h2><p>點地圖上的設備，或開啟設備清單。</p>';}
  else{
   const def=buildings[b.type],e=entrance(b),ready=onEntrance(player(state),b),actions=actionsFor(state,b);
   body=`<h2>${def.name}</h2><span class="chip">${b.job?'運轉中':quantity(b.inventory)?'有料':'待料'}${def.behavior==='process'?` · ${b.mode==='fast'?'快速':'穩定'}`:''}</span><p>位置 ${b.q}, ${b.r} · 入口 ${e.q}, ${e.r}<br>${ready?'你已在入口，可按空白鍵互動。':'請先前往右側箭頭入口。'}</p>${b.job?`<progress value="${Math.round((b.job.duration-b.job.remaining)*10)/10}" max="${b.job.duration}"></progress><p>剩餘 ${Math.ceil(b.job.remaining)} 秒 · 用電 ${b.job.power}</p>`:''}<div class="actions">${!ready?`<button class="primary" data-goto="${b.id}">前往入口</button>`:''}${actions.map(a=>`<button ${ready?'':'disabled'} data-action="${a.action}" data-material="${a.material??''}">${a.label}</button>`).join('')}</div>`;
   const processRecipe=def.recipes.map(id=>recipes[id]).find(r=>r.fast);
   if(processRecipe){const f=processRecipe.fast;body+=`<div class="segmented"><button data-mode="stable" aria-pressed="${b.mode==='stable'}">穩定 · ${processRecipe.duration} 秒 / ${processRecipe.power} 電</button><button data-mode="fast" aria-pressed="${b.mode==='fast'}">快速 · ${processRecipe.duration*f.durationMultiplier} 秒 / ${processRecipe.power*f.powerMultiplier} 電</button></div><p>快速模式每第 ${state.research.includes(f.technology)?f.improvedEvery:f.every} 批為異常片；此數值是教學簡化。模式切換不影響進行中的批次。</p>`;}
   if(def.behavior==='inspection')body+='<p>合格片 → 合格交付；異常片 → 不合格片。檢測不會修復缺陷。</p>';
   if(def.behavior==='supply')body+='<p>每次取放 1 片，最多攜帶 3 片。不合格片可在此回收換取 2 經費。</p>';
   if(def.behavior==='utility')body+='<button data-panel="research">查看廠務與研究</button>';
   body+=`<h3>緩衝庫存 · ${quantity(b.inventory)} / ${def.capacity}</h3>${invRows(b)}<div class="actions"><button data-move="${b.id}">搬動設備</button><button data-science>科學與簡化說明</button></div>`;
  }
 }
 $('panel-kicker').textContent=kicker;
 // Avoid replacing a focused native select while a worker status updates.
 if(!document.activeElement?.matches('[data-worker]')&&body!==lastPanelBody){$('panel-content').innerHTML=body;lastPanelBody=body;}
}
function renderUI(){
 const p=player(state),current=content.orders.find(o=>state.delivered<o.target),order=current??content.orders.at(-1),index=content.orders.indexOf(order);
 $('chapter').textContent=`0${index+1} / 03`;$('order-title').textContent=current?order.name:'試驗線已建立';$('order-description').textContent=current?order.description:'已完成示例訂單，繼續配置基地與研究。正式內容待內容 Word 補齊。';
 $('order-fill').style.width=`${Math.min(100,state.delivered/order.target*100)}%`;$('order-count').textContent=`${state.delivered} / ${order.target} 片`;$('order-unlock').textContent=current?`完成 +${order.reward} 經費`:'自由經營';
 $('credits').textContent=state.credits;$('power').textContent=`${powerUsed(state)} / ${powerCapacity(state)}`;$('carry-count').textContent=`${quantity(p.inventory)} / ${p.capacity}`;$('carrying').textContent=fmtInventory(p);
 $('clock').textContent=`${String(Math.floor(state.elapsed/60)).padStart(2,'0')}:${String(Math.floor(state.elapsed%60)).padStart(2,'0')}`;
 $('run-status').textContent=state.paused?'已暫停':'運轉中';$('pause').textContent=state.paused?(state.elapsed===0?'開始運轉':'繼續運轉'):'暫停';$('pause-badge').hidden=!state.paused;
 $('notice').textContent=state.notice;$('zoom-level').textContent=`${Math.round(renderer.zoom*100)}%`;$('follow').textContent=renderer.follow?'跟隨玩家':'回到玩家';
 const b=contextBuilding(state,ui.selected),ready=b&&onEntrance(p,b),a=b?actionsFor(state,b)[0]:null;
 $('interact').textContent=ready?(a?`空白 · ${a.label}`:b.job?'設備運轉中':'目前無互動'):b?'前往選取設備入口':'選取設備';$('interact').disabled=Boolean(ready&&!a);
 if(ui.placement&&ui.hover){const valid=canPlace(state,ui.placement.type,ui.hover.q,ui.hover.r,ui.placement.movingId);ui.placementValid=valid.ok;$('placement-message').textContent=`${buildings[ui.placement.type].name} · ${valid.reason}`;$('confirm-placement').disabled=!valid.ok;}else{$('placement-message').textContent='點選地面預覽設備位置';$('confirm-placement').disabled=true;}
 $('placement-bar').hidden=!ui.placement;renderPanel();
}
function openModal(title,body){if(!$('modal').open)resumeModal=!state.paused;state.paused=true;input.clear();runtime.reset();$('modal-title').textContent=title;$('modal-body').innerHTML=body;if(!$('modal').open)$('modal').showModal();$('modal').scrollTop=0;renderUI();}
function guide(){openModal('操作與生產循環',`<p class="tag">示例版 / 正式內容 Word 尚未提供</p><p>這一版使用交接文件的最小示例：試驗晶圓 → 製程示意站 → 檢測 → 交付。不是完整晶片製造流程。</p><ol><li>關閉說明，點「開始運轉」。你站在物料庫入口，按空白或下方按鈕取 1 片晶圓。</li><li>選取製程示意站，按「前往入口」。抵達後空白放料，再按一次啟動加工。</li><li>等進度圈完成，空白取出試驗片。前往檢測站入口，依序放料、啟動檢測、取出合格片。</li><li>前往交付站，放入合格片，再提交。首批完成後解鎖兩名工人。</li><li>「人員」中安排一名搬運員、一名操作員；離開入口，讓工人通行。小量驗證完成後研究穩定化。</li></ol><h3>地圖操作</h3><p><kbd>E</kbd> 左上 <kbd>I</kbd> 右上 <kbd>J</kbd> 右 <kbd>N</kbd> 右下 <kbd>C</kbd> 左下 <kbd>D</kbd> 左。每次按下走一格；舊戰鬥組合鍵、R 與 V 已停用。</p><p>點空地自動尋路；點設備選取。拖曳平移、滾輪縮放，「回到玩家」恢復跟隨。設備清單可替代地圖點選。身旁三格表示攜帶量，設備圓弧表示進度，箭頭表示入口。</p><h3>建造與保存</h3><p>建造先預覽，確認才扣經費；取消或 Esc 不扣款。入口不能封死，物流或加工中的設備不能移動。供電不足會阻止新加工，廠務升級可增加容量。</p><p>暫停、失焦、閱讀說明與存檔選單都會停止時間。不計離線收益。每 15 秒另存自動存檔，可手動保存及匯出 JSON；所有存檔只在此瀏覽器，與原遊戲隔離。</p><div class="button-row"><button data-science>閱讀科學與遊戲簡化</button></div>`);}
function science(){openModal('科學事實與遊戲簡化',content.knowledge.map(k=>`<section><h3>${k.name}</h3><p><strong>科學事實</strong>　${k.fact}</p><p><strong>可觀察結果</strong>　${k.observe}</p><p><strong>遊戲簡化</strong>　${k.simplification}</p><p><a href="${k.source}" target="_blank" rel="noopener">${k.sourceName} ↗</a></p></section>`).join('')+'<p>本版只驗證底層與示例循環，沒有將示意產物稱為完整晶片。待正式遊戲內容 Word 提供後，再替換或擴充內容。</p>');}
function saveMenu(){openModal('獨立存檔',`<p>只保存到目前瀏覽器；讀取時保持暫停。匯出檔案可移到其他裝置，遊戲格式與原 HexBase 完全分開。</p><div class="button-row"><button data-save class="primary">手動保存</button><button data-load="manual">讀取手動存檔</button><button data-load="auto">讀取自動存檔</button></div><div class="button-row"><button data-export>匯出存檔 JSON</button><button data-import>匯入存檔 JSON</button></div><p id="save-status" role="status"></p><h3>重新開始</h3><p>建立新的示例基地，現有手動存檔保留，可隨時讀取。</p><button data-new>開始新基地</button>`);}
function restore(text){const next=deserialize(text);state=next;input.clear();lastAuto=state.elapsed;ui.selected=state.buildings[0].id;ui.placement=null;renderer.resetPresentation();runtime.reset();resumeModal=false;renderUI();}
function status(message){const el=$('save-status');if(el)el.textContent=message;else emit(state,message);renderUI();}
document.addEventListener('click',e=>{
 const target=e.target.closest('button');if(!target)return;const d=target.dataset;
 if(d.panel){ui.mode=d.panel==='equipment'?'equipment-list':d.panel;$('panel').hidden=false;renderUI();}
 if(d.select)select(d.select);
 if(d.goto){const b=building(state,d.goto);send({type:'moveTo',target:entrance(b)});}
 if(d.action)send({type:'interact',buildingId:ui.selected,action:d.action,material:d.material||null});
 if(d.mode)send({type:'setMode',buildingId:ui.selected,mode:d.mode});
 if(d.build){ui.placement={type:d.build};ui.hover=null;$('panel').hidden=true;renderUI();}
 if(d.move){const b=building(state,d.move);ui.placement={type:b.type,movingId:b.id};ui.hover={q:b.q,r:b.r};$('panel').hidden=true;renderUI();}
 if('upgrade'in d)send({type:'upgradeUtility'});
 if(d.research)send({type:'research',id:d.research});
 if('science'in d)science();
 try{
  if('save'in d){storage.write(serialize(state));status('手動存檔已保存。');}
  if(d.load){const data=(d.load==='manual'?storage:autosave).read();if(!data)throw new Error('此位置尚無存檔。');restore(data);status('已讀取，關閉選單後按繼續運轉。');}
  if('export'in d){const blob=new Blob([serialize(state)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='semiconductor-foundry-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status('已匯出獨立存檔。');}
  if('import'in d)$('import-file').click();
  if('new'in d){state=createGameState();input.clear();lastAuto=0;ui.selected=state.buildings[0].id;renderer.resetPresentation();runtime.reset();resumeModal=false;status('新基地已建立；舊手動存檔保留。');}
 }catch(error){status(error.message);}
 if(!['INPUT','SELECT'].includes(document.activeElement?.tagName)&&!$('modal').open&&target.id!=='guide')canvas.focus({preventScroll:true});
});
$('panel-content').addEventListener('change',e=>{if(e.target.dataset.worker){send({type:'assignTask',workerId:e.target.dataset.worker,role:e.target.value});canvas.focus({preventScroll:true});renderUI();}});
$('import-file').addEventListener('change',async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>2_000_000)throw new Error('存檔超過大小限制。');restore(await file.text());status('匯入成功，舊的手動存檔未被覆寫。');}catch(error){status(error.message);}finally{e.target.value='';}});
$('pause').onclick=()=>setPause(!state.paused);$('guide').onclick=guide;$('save-menu').onclick=saveMenu;$('close-modal').onclick=()=>$('modal').close();
$('modal').addEventListener('close',()=>{const resume=resumeModal&&!document.hidden;resumeModal=false;setPause(!resume);});
$('close-panel').onclick=()=>{$('panel').hidden=true;};
$('interact').onclick=()=>{const b=contextBuilding(state,ui.selected);if(b&&!onEntrance(player(state),b))send({type:'moveTo',target:entrance(b)});else send({type:'interact',buildingId:b?.id});};
$('zoom-in').onclick=()=>{renderer.setZoom(renderer.zoom+.15);renderUI();};$('zoom-out').onclick=()=>{renderer.setZoom(renderer.zoom-.15);renderUI();};$('follow').onclick=()=>{renderer.follow=true;renderUI();};
$('cancel-placement').onclick=()=>{ui.placement=null;renderUI();};$('confirm-placement').onclick=()=>{if(ui.placement&&ui.hover&&send({type:'placeBuilding',buildingType:ui.placement.type,movingId:ui.placement.movingId,...ui.hover})){ui.placement=null;renderUI();}};
let drag=null;
canvas.addEventListener('pointerdown',e=>{canvas.focus();drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>6)drag.moved=true;if(drag.moved){renderer.pan(dx,dy);drag.x=e.clientX;drag.y=e.clientY;}}});
canvas.addEventListener('pointerup',e=>{if(!drag)return;const moved=drag.moved;drag=null;if(moved){renderUI();return;}const rect=canvas.getBoundingClientRect(),p=renderer.pick(e.clientX-rect.left,e.clientY-rect.top);
 if(ui.placement){ui.hover=p;renderUI();return;}
 const b=state.buildings.find(b=>footprint(b).some(t=>at(t,p)));if(b)select(b.id);else send({type:'moveTo',target:p});
});
canvas.addEventListener('pointercancel',()=>{drag=null;});canvas.addEventListener('wheel',e=>{e.preventDefault();renderer.setZoom(renderer.zoom*Math.exp(-e.deltaY*.001));renderUI();},{passive:false});
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'音效開':'音效關';$('sound').setAttribute('aria-pressed',String(sound));if(sound){audioContext??=new AudioContext();audioContext.resume();}};
function updateSound(){const event=state.events.at(-1);if(!event||event.id===lastSoundId)return;lastSoundId=event.id;if(!sound||!audioContext||!event.text.includes('完成'))return;const o=audioContext.createOscillator(),g=audioContext.createGain();o.frequency.value=620;g.gain.setValueAtTime(.025,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.15);o.connect(g).connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+.16);}
initFullscreen({arena:$('arena'),canvas,button:$('fullscreen'),status:$('display-status'),onTransition:()=>{input.clear();renderer.resize();}});
const runtime=createRuntime({getState:()=>state,step:dt=>{for(const i of input.intents)if(i.type==='interact'&&!i.buildingId)i.buildingId=ui.selected;stepGame(state,input,dt);},metrics:ms=>{frameWork.push(ms);if(frameWork.length>300)frameWork.shift();},draw:dt=>{
 ui.panelOpen=!$('panel').hidden;renderer.draw(state,ui,dt);updateSound();const now=performance.now();if(now-lastUI>180){lastUI=now;renderUI();if(renderer.frameSamples.length){const samples=[...renderer.frameSamples].sort((a,b)=>a-b);canvas.dataset.renderP95Ms=samples[Math.floor(samples.length*.95)].toFixed(2);canvas.dataset.renderMeanMs=(samples.reduce((n,t)=>n+t,0)/samples.length).toFixed(2);canvas.dataset.entities=String(state.actors.length+state.buildings.length);}}
 if(!state.paused&&state.elapsed-lastAuto>=15){lastAuto=state.elapsed;try{autosave.write(serialize(state));}catch(error){emit(state,error.message);}}
 if(frameWork.length){const samples=[...frameWork].sort((a,b)=>a-b);canvas.dataset.frameWorkP95Ms=samples[Math.floor(samples.length*.95)].toFixed(2);canvas.dataset.frameWorkMeanMs=(samples.reduce((n,t)=>n+t,0)/samples.length).toFixed(2);}
}});
renderUI();
