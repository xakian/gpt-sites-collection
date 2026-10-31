import {createShell,ObserverPlayer} from './shared/observer.js';
import {topic} from './topic.js';
import {stateAt} from './model.js';
import {draw} from './drawing.js';
document.title=topic.title;
const shell=createShell({title:topic.shortTitle,sceneLabel:topic.sceneLabel});
shell.wrap.style.width='100%';shell.wrap.style.height='100%';
let W=800,H=500,active=0,player;
const panel=shell.get('panel-content');
panel.innerHTML=`<p class="eyebrow">科學觀察 · ${topic.duration} 秒一輪</p><h2>${topic.title}</h2><label for="step-notes">選擇觀察步驟</label><select id="step-notes">${topic.stages.map((s,i)=>`<option value="${i}">${i+1} · ${s.title}</option>`).join('')}</select><div id="step-copy"></div><details><summary>簡化與來源</summary>${topic.notes.map(t=>`<p>${t}</p>`).join('')}<p class="source-intro">閱讀日期：2026-10-31 · 共用規格 v1.0 · 範本 1.0.0 · 主題 1.0.0</p><ul>${topic.sources.map(s=>`<li><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>：${s.supports}</li>`).join('')}</ul></details>`;
const stepNotes=shell.get('step-notes');
function showStep(i){const s=topic.stages[i];stepNotes.value=String(i);shell.get('step-copy').innerHTML=`<h3>正在看什麼</h3><p>${s.what}</p><h3>值得注意的細節</h3><p>${s.detail}</p><button class="primary" data-time="${s.key*1000}">定位此步 · ${s.key.toFixed(1)} 秒</button>`;}
showStep(0);stepNotes.addEventListener('change',()=>showStep(Number(stepNotes.value)));
panel.addEventListener('click',e=>{const b=e.target.closest('[data-time]');if(b)player.seek(Number(b.dataset.time));});
player=new ObserverPlayer({shell,durationMs:topic.duration*1000,overviewMs:topic.overview*1000,restartFromOverview:true,qa:location.hostname==='127.0.0.1',render:frame=>{const t=frame.local/1000,s=stateAt(t);active=topic.stages.findLastIndex(x=>t>=x.start);shell.svg.setAttribute('viewBox',`0 0 ${W} ${H}`);shell.svg.innerHTML=draw(s,{W,H,t});return{title:topic.stages[active].title,index:active,count:topic.stages.length};},onInfo:()=>{showStep(active);player.openPanel();}});
new ResizeObserver(entries=>{const r=entries[0].contentRect;W=r.width;H=r.height;player.redraw();}).observe(shell.host);
