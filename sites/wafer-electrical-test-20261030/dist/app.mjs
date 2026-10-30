import {config} from './config.mjs';
import {sampleTopic} from './model.mjs';
import {Player} from './player.mjs';
const $=id=>document.getElementById(id);
const symbol=v=>v===null?'—':v?'✓':'×';
const status=v=>v===null?'waiting':v?'pass':'fail';
const result=v=>v===null?'待判定':v?'通過':'未通過';
const text=(id,v)=>{const el=$(id);if(el.textContent!==String(v))el.textContent=v};
const html=(id,v)=>{const el=$(id);if(el.innerHTML!==v)el.innerHTML=v};
const layout=matchMedia('(max-width:700px)');
const resize=()=>{$('apparatus-svg').setAttribute('viewBox',layout.matches?'86 67 248 252':'0 0 720 385');$('apparatus-svg').setAttribute('preserveAspectRatio',layout.matches?'none':'xMidYMid meet')};
resize();layout.addEventListener('change',resize);
$('keyframes').innerHTML=config.keyframes.map(([t,label],i)=>`<button data-time="${t}" data-index="0${i+1}" aria-label="定位此步：${label}">${label}</button>`).join('');
$('wafer-map').innerHTML=Array.from({length:9},(_,i)=>`<div class="map-cell" ${i===4?'id="map-A"':i===5?'id="map-B"':''}><small>${i===4?'A':i===5?'B':''}</small><span>—</span></div>`).join('');
let lastPhase=-1,player;
function render(t){
 const s=sampleTopic(t);window.lastTopicState=s;
 $('presentation').style.opacity=s.presentationOpacity;
 $('reset-note').hidden=!s.isResetPresentation;
 $('reset-note').style.opacity=s.time>39.5?Math.max(0,(40-s.time)*2):1;
 text('die-badge',s.phaseIndex===9||s.isResetPresentation?'A·B':s.alignedDieId??'→');
 text('phase-name',s.phase[2]);text('phase-note',s.phase[3]);
 text('contact-label',s.contactState?'已接觸':s.stageZ>0?'台面移動中':s.alignedDieId?'已分離':'平移中・無接觸');
 text('vdd',s.supplyEnabled?'1.8 V':'停用');text('input',s.inputDriveState===null?'—':`${s.inputDriveState}`);
 $('channel-power').classList.toggle('active',s.supplyEnabled);$('channel-input').classList.toggle('active',s.inputDriveState!==null);$('channel-output').classList.toggle('active',s.supplyEnabled&&s.measurementMode==='功能測試');
 $('power-wire').style.opacity=s.supplyEnabled?1:0;
 $('stage').setAttribute('transform',`translate(${s.stageX} ${-30*s.stageZ})`);
 $('contact-dots').style.opacity=s.contactState?1:0;
 text('condition',s.displayAsRecorded?'施加已停止・數據已記錄':s.measurementMode==='建立靜態條件'||s.measurementMode==='等待穩定'||s.measurementMode==='電流已取樣'?`${s.measurementMode} · X = 0`:s.supplyEnabled?`VDD = 1.8 V · X = ${s.inputDriveState}`:s.inputDriveState===0?'X = 0 · 供電停用':'尚未施加');
 const id=s.activeDieId,d=s.dies[id];text('table-die',id);text('function-caption',d.functional!==null?'兩圖樣已記錄':s.measurementMode==='功能測試'?'取樣 → 比較':'尚未取樣');
 html('logic-rows',d.rows.map((r,i)=>`<tr><td>${i}</td><td>${r.expected??'—'}</td><td>${r.logic??'—'}</td><td class="${status(r.result)}" aria-label="${result(r.result)}">${r.result===null?'—':r.result?'✓ 符合':'× 不符'}</td></tr>`).join(''));
 for(const key of ['A','B']){
   const die=s.dies[key],row=$(`current-${key}`),point=row.querySelector('.point');
   point.hidden=die.current===null;point.style.left=`${100*(die.current??0)/config.conditions.currentMax}%`;point.style.opacity=die.currentOpacity;point.dataset.value=die.current===null?'':String(die.current);
   const value=die.current===null?'—':`${die.current} <small>μA</small>`;if(row.querySelector('.current-value').innerHTML!==value)row.querySelector('.current-value').innerHTML=value;
   row.querySelector('.current-value').style.opacity=die.current===null?1:die.currentOpacity;
   row.classList.toggle('comparing',(key==='A'&&s.effectiveTime>=12&&s.effectiveTime<13)||(key==='B'&&s.effectiveTime>=28&&s.effectiveTime<29));
   const cell=$(`map-${key}`);cell.dataset.state=die.map;cell.className=`map-cell ${s.mapSelection===key?'selected':''} ${die.map==='pass'?'pass':die.map==='fail'?'fail':''}`;cell.querySelector('span').textContent=die.map==='pass'?'✓':die.map==='fail'?'×':die.map==='testing'?'…':'—';
 }
 html('summary-rows',['A','B'].map(key=>{const d=s.dies[key];return `<tr><td>${key}</td><td class="${status(d.functional)} symbol" aria-label="功能${result(d.functional)}">${symbol(d.functional)}</td><td class="${status(d.electrical)} symbol" aria-label="電流${result(d.electrical)}">${symbol(d.electrical)}</td><td class="${status(d.total)}">${d.total===null?'待判定':`${symbol(d.total)} ${result(d.total)}`}</td></tr>`}).join(''));
 text('record-caption',s.displayAsRecorded?'已記錄':'判定進度');
 $('wafer-map').setAttribute('aria-label',`晶圓結果圖：A ${s.dies.A.map==='untested'?'未測':s.dies.A.map==='testing'?'測試中':result(s.dies.A.total)}，B ${s.dies.B.map==='untested'?'未測':s.dies.B.map==='testing'?'測試中':result(s.dies.B.total)}，其餘七格未測。`);
 $('timeline').value=t;$('timeline').setAttribute('aria-valuetext',`${t.toFixed(2)} 秒，${s.phase[2]}`);text('time-display',`${t.toFixed(1).padStart(4,'0')} / 40`);
 document.querySelectorAll('#keyframes button').forEach(b=>b.classList.toggle('active',Math.abs(t-Number(b.dataset.time))<.05));
 if(lastPhase!==s.phaseIndex){text('live-status',`${s.phase[2]}，晶粒 ${s.alignedDieId??'移交中'}`);lastPhase=s.phaseIndex;}
}
function syncControls(){if(!player)return;$('play').innerHTML=player.playing?'Ⅱ <span>暫停</span>':'▶ <span>播放</span>';$('play').setAttribute('aria-label',player.playing?'暫停':'播放');}
player=new Player({duration:config.duration,onFrame:render,onState:syncControls});syncControls();
function closeInfo(focus=true){$('explanation').hidden=true;$('info').setAttribute('aria-expanded','false');if(focus)$('info').focus();}
function play(){closeInfo(false);player.play();$('play').focus();}
$('play').addEventListener('click',()=>player.playing?player.pause():play());
$('replay').addEventListener('click',()=>{closeInfo(false);player.replay();text('live-status','重新示範，從零秒開始')});
$('speed').addEventListener('change',e=>player.setSpeed(e.target.value));
$('timeline').addEventListener('input',e=>player.seek(e.target.value));
$('keyframes').addEventListener('click',e=>{const b=e.target.closest('[data-time]');if(b)player.seek(b.dataset.time)});
const sections={
 '本例':`<h3>從回應到判定</h3><p>A、B 是同一設計的兩顆示意 CMOS 非反相緩衝器。測試系統建立連接、施加已知輸入，取得回應後才與規格比較。</p><p>兩者在輸入 0、1 時都符合預期。但在相同靜態條件下，A 的供電電流是 2 μA，B 是 14 μA。本例上限為 10 μA，因此只有 A 通過本例兩項。</p><p>晶粒始終留在晶圓上；結果圖是位置對應的測試紀錄。</p><button data-seek="35">定位此步：兩顆對照</button>`,
 '設備角色':`<h3>誰施加、誰連接、誰定位？</h3><p><b>ATE 自動測試設備</b>：控制供電與輸入、讀取輸出與電流，執行比較。</p><p><b>Probe card 探針卡</b>：提供儀器與 DUT 待測元件間的電性介面。示意圖將四個接點攤開排列，不是真實版圖。</p><p><b>Prober 晶圓探針機</b>：控制承載台定位與接觸。先停止施加、下降分離，再平移到 B。</p><p><b>Wafer map 晶圓結果圖</b>：按晶粒位置保存結果，並不代表晶粒被移走。</p><button data-seek="16.75">定位此步：解除接觸後平移</button>`,
 '條件與數據':`<h3>全部數字均為教學設定</h3><table><tbody><tr><th>條件</th><th>本例</th></tr><tr><td>供電／參考</td><td>VDD = 1.8 V；GND = 0 V</td></tr><tr><td>固定溫度</td><td>25 °C</td></tr><tr><td>輸入 0／1</td><td>0 V／1.8 V；邏輯 1 並非 1 V</td></tr><tr><td>輸出低窗口</td><td>0–0.4 V（含端點）</td></tr><tr><td>輸出高窗口</td><td>1.4–1.8 V（含端點）</td></tr><tr><td>其他輸出電壓</td><td>無有效邏輯</td></tr><tr><td>輸出負載</td><td>無外接負載；量測為理想高阻抗</td></tr><tr><td>電流條件</td><td>X = 0，等待穩定；量測 VDD 支路 I<sub>DD</sub></td></tr><tr><td>本例上限</td><td>I<sub>DD</sub> ≤ 10 μA，等號算通過</td></tr></tbody></table><table><thead><tr><th>晶粒</th><th>X=0 的 VY</th><th>X=1 的 VY</th><th>靜態電流</th></tr></thead><tbody><tr><td>A</td><td>0.05 V</td><td>1.75 V</td><td>2 μA</td></tr><tr><td>B</td><td>0.05 V</td><td>1.75 V</td><td>14 μA</td></tr></tbody></table><p>兩個圖樣都符合才通過功能項。功能與電流項全部完成比較後，才揭示總結果；尚未量測使用「—」，並非 0。</p>`,
 '模型限制':`<h3>這輪示範能說明的範圍</h3><p>這是預設案例資料與確定性規則的動畫，不是實測、SPICE 或電晶體求解。電流上限與電壓窗口皆非通用產品規格，也不代表 TI SN74LVC1G34 的晶圓測試。</p><p>靜態供電電流不同於輸入漏電流、輸出負載電流或切換尖峰；14 μA 只表示本例超限，不指認特定缺陷。</p><p>假設接觸有效、儀器校正且讀值穩定。忽略噪聲、接觸電阻、不確定度、保護限流與重測。本例僅檢查兩個靜態圖樣和一個電流條件，不能保證所有溫度、速度、負載或使用壽命下零缺陷。</p><p>兩顆是刻意選取的案例，不能推算整片良率。40 秒是教學步驟慢放，不能估算產線產能。每輪明示重設同一案例，不是修復或新批晶圓。</p><p>此處展開切割前產品晶粒測試；不展開封裝後測試、WAT／PCM、速度分級或可靠度試驗。真實測試可在失敗後跳過測項，本例的完整順序是教學安排。</p>`,
 '看完想一想':`<details><summary>B 的輸出都正確，為什麼仍未通過？</summary><p>功能只是一類測項。B 的靜態供電電流是 14 μA，高於本例 10 μA 上限。</p></details><details><summary>結果圖上的叉號，代表晶粒被切掉或變色了嗎？</summary><p>叉號代表對應位置的測試紀錄。這輪沒有切割、挑料或修復，晶粒仍在原晶圓上。</p></details><details><summary>A 通過，是否代表任何情況都不會故障？</summary><p>不能。只能說 A 通過本例選定的測項與條件，未檢查所有情境或所有故障。</p></details>`,
 '來源':`<p><a href="./source-project.zip" download>下載完整原始專案與驗收記錄</a></p><p>以下是任務檔提供的官方來源；用於裝置角色與量測原理，動畫數字另行自訂。</p><ul><li><a href="https://www.advantest.com/en/about/business/" target="_blank" rel="noopener">Advantest · Semiconductor Test</a><br>測試階段、功能檢查與比較原理。</li><li><a href="https://www.tek.com/en/component-solutions/wafer-test" target="_blank" rel="noopener">Tektronix · Wafer Test</a><br>探針機、晶圓定位與數位結果圖。</li><li><a href="https://www.ti.com/lit/an/szza036c/szza036c.pdf" target="_blank" rel="noopener">TI · Understanding and Interpreting Standard-Logic Data Sheets</a><br>供電電流、固定輸入與無負載條件。</li><li><a href="https://www.ti.com/lit/ds/symlink/sn74lvc1g34.pdf" target="_blank" rel="noopener">TI · SN74LVC1G34 datasheet</a><br>非反相緩衝器與各類電流量的區別。</li><li><a href="https://www.ni.com/docs/en-US/bundle/teststand-semiconductor-module/page/test-steps-and-flow.html" target="_blank" rel="noopener">NI · Test Steps and Flow</a><br>取得量測、功能／參數測試與流程控制。</li><li><a href="https://www.nxp.com/company/about-nxp/smarter-world-blog/BL-ECONOMICS-TEST-YIELD-COST-LATE-DETECTION" target="_blank" rel="noopener">NXP · Test, Yield, and the Cost of Late Detection</a><br>測試準則、測試逃逸及非零缺陷保證。</li></ul>`
};
function showSection(name){$('info-content').innerHTML=sections[name];document.querySelectorAll('#info-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===name)));}
$('info-tabs').innerHTML=Object.keys(sections).map((name,i)=>`<button aria-pressed="${i===0}">${name}</button>`).join('');showSection('本例');
$('info-tabs').addEventListener('click',e=>{if(e.target.tagName==='BUTTON')showSection(e.target.textContent)});
$('info').addEventListener('click',()=>{player.pause();$('explanation').hidden=false;$('info').setAttribute('aria-expanded','true');$('close-info').focus()});
$('close-info').addEventListener('click',()=>closeInfo());$('panel-play').addEventListener('click',play);
$('info-content').addEventListener('click',e=>{const b=e.target.closest('[data-seek]');if(b){player.seek(b.dataset.seek);closeInfo();}});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('explanation').hidden){closeInfo();return;}if(e.code==='Space'&&!e.target.closest('button,input,select,textarea,summary,a,[contenteditable]')&&$('explanation').hidden){e.preventDefault();player.playing?player.pause():play();}});
window.addEventListener('pagehide',()=>player.destroy(),{once:true});
// Explicit QA surface: all seeking still uses the same production player and pure model.
window.__wafer={player,sampleTopic,config,seek:t=>player.seek(t),getState:()=>sampleTopic(player.t)};
