import {createShell,ObserverPlayer} from './shared/observer.js';
import {DURATION_MS,PHASES,KEYFRAMES,stateAt,TOPIC_VERSION} from './topic-model.js';
import {WaferScene} from './scene.js';

const shell=createShell({title:'晶圓探針測試',sceneLabel:'未切割晶圓的探針接觸、電性測試與位置紀錄'});
shell.root.dataset.topicVersion=TOPIC_VERSION;
const scene=new WaferScene(shell.svg);
let player,lastState;
const localQA=['localhost','127.0.0.1','terminal.local'].includes(location.hostname)&&new URLSearchParams(location.search).has('qa');
let audit,lastAuditKey='',lastAuditWall=-1e9;const auditEntries=[];
if(localQA){audit=document.createElement('output');audit.id='qa-trace';audit.hidden=true;shell.root.append(audit);}
function trace(frame,state){
  if(!audit)return;const wall=performance.now(),key=[frame.cycleId,state.phaseIndex,state.step,frame.playing,frame.rate,document.hidden].join('|');
  if(key===lastAuditKey&&wall-lastAuditWall<250)return;
  lastAuditKey=key;lastAuditWall=wall;
  auditEntries.push({wall:Math.round(wall),total:Math.round(frame.total),local:Math.round(frame.local),cycle:frame.cycleId,phase:state.phase.id,step:state.step,playing:frame.playing,rate:frame.rate,hidden:document.hidden,contact:state.contact,z:+state.z.toFixed(4),x:+state.position.x.toFixed(4),y:+state.position.y.toFixed(4),tested:state.counts.tested,reset:+state.cycleReset.opacity.toFixed(4)});
  if(auditEntries.length>3000)auditEntries.shift();audit.textContent=JSON.stringify(auditEntries);
}
const notes=[
  ['對準同一個位置','晶圓仍是一整片。工作台先做 XY 位移，讓目標晶粒的金屬焊墊對準固定的探針。','俯視圖以晶圓為參考，位置外框隨接觸區移動；放大圖則顯示基板在固定探針下移動。'],
  ['焊墊碰到針尖','工作台向上，四個示意焊墊與針尖建立暫時電接觸。探針沒有穿透矽基板，也沒有焊在晶粒上。','看金色焊墊與灰色針尖之間的間隙如何閉合。只有接觸後才開始施加測試。'],
  ['施加與量測','測試機經探針卡施加測試訊號，再透過接點讀回晶粒的電性反應。藍色與紫色線段分別提示施加與讀回。','線段不是移動中的晶粒，也不代表電子的真實速度。真正的測試會包含不同供電、電性與功能項目。'],
  ['判讀，然後記入座標','測試機將回應與設定的判定條件比較，再把通過結果寫在同一片晶圓、同一個晶粒索引的位置。','這裡的相對值 0.96 落在示意允許範圍 0.90–1.10。綠色與勾號屬於數位紀錄，實體晶粒沒有變色。'],
  ['另一顆，另一個結果','工作台先下降讓針尖分離，才橫移到下一顆，重新接觸並測試。這顆示意量測值 1.28 超出示意範圍，記為未通過。','× 表示本次判定未通過；不等於已證明缺陷種類。實務中也可能需要檢查接觸、重測或進一步分析。'],
  ['相同動作，逐顆巡測','接觸、施加、量測、比較、紀錄與分離依序重複。35 顆的巡測時間被壓縮，讓你看到晶圓圖逐步填入結果。','本版採單顆逐測；真實探針卡也能同時測多顆。移動路徑、晶粒數、結果分布與速度皆為示意。'],
  ['測完了，晶圓還沒切開','探針已分離，晶圓保持完整，晶圓圖保留每個位置的結果。圖中的 31 個勾、6 個叉來自本示範的虛構資料。','通過代表符合已執行項目與條件，不代表所有情況下都不會故障。後續封裝與其他階段仍可能再測試。'],
  ['重新觀看示範','這一輪觀察結束。遮幕後重新觀看同一段示意，不是在真實設備中抹掉紀錄或倒轉測試。','拖曳底部進度或在此定位，可以比較前後狀態；定位後保持暫停。']
];
function note(index){const n=notes[index];shell.get('note-title').textContent=n[0];shell.get('note-body').textContent=n[1];shell.get('note-detail').textContent=n[2];}
const select=shell.get('phase-select');
for(const [i,p]of PHASES.entries()){const o=document.createElement('option');o.value=String(i);o.textContent=`${String(i+1).padStart(2,'0')}　${p.title}`;select.append(o);}
select.addEventListener('change',()=>note(Number(select.value)));
shell.get('locate-phase').addEventListener('click',()=>{player.seek(PHASES[Number(select.value)].keyframe);player.closePanel();});
const keys=document.createElement('details');keys.innerHTML='<summary>全部關鍵幀</summary><div class="keyframe-grid"></div>';
for(const k of KEYFRAMES){const b=document.createElement('button');b.className='quiet';b.textContent=`${(k.time/1000).toFixed(1)} 秒 · ${k.title}`;b.addEventListener('click',()=>{player.seek(k.time);player.closePanel();});keys.querySelector('div').append(b);}
shell.get('locate-phase').after(keys);
const precise=document.createElement('div');precise.className='precise-seek';
precise.innerHTML='<label for="seek-seconds">精確定位（秒）</label><div><input id="seek-seconds" type="number" min="0" max="54" step="0.01" value="0"><button class="quiet" id="seek-exact">定位時間</button></div>';
keys.append(precise);
precise.querySelector('button').addEventListener('click',()=>{player.seek(Number(precise.querySelector('input').value)*1000);player.closePanel();});
function resize(){scene.resize(shell.host.clientWidth,shell.host.clientHeight);}
resize();
player=new ObserverPlayer({shell,durationMs:DURATION_MS,overviewMs:47000,restartFromOverview:true,
  qa:localQA,
  render:frame=>{lastState=stateAt(frame.local);scene.render(lastState);trace(frame,lastState);return{title:`${String(lastState.phaseIndex+1).padStart(2,'0')}　${lastState.title}`,index:lastState.phaseIndex,count:PHASES.length};},
  onInfo:()=>{select.value=String(lastState.phaseIndex);note(lastState.phaseIndex);player.openPanel();}
});
const resizeObserver=new ResizeObserver(()=>{resize();player.redraw();});resizeObserver.observe(shell.host);
note(0);
