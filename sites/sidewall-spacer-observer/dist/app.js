import {createShell,ObserverPlayer} from './shared/observer.js';
import {info,duration,stages,state} from './model.js';
import {draw} from './drawing.js';
const tpl=document.querySelector('#topic-notes');
tpl.innerHTML=`<label for="step-select">選擇觀察步驟</label><select id="step-select"></select><div id="step-note"></div><button id="seek-step" class="primary">定位此步</button>${info.supplement||''}<details><summary>簡化與來源</summary><p>${info.summary}</p><ul>${info.sources.map(s=>`<li><a href="${s.url}" target="_blank" rel="noreferrer">${s.title}</a>：${s.note}</li>`).join('')}</ul><p class="source-intro">查閱 2026-10-31 · 主題 1.0.0 · 共用規格 v1.0 · 範本 1.0.0</p></details>`;
document.title=info.title;
const shell=createShell({title:info.shortTitle,sceneLabel:info.label});
shell.wrap.style.width='100%';shell.wrap.style.height='100%';
const note=shell.get('step-note'),select=shell.get('step-select');
select.innerHTML=stages.map((s,i)=>`<option value="${i}">${i+1} · ${s.title}</option>`).join('');
function explain(i){const s=stages[i];note.innerHTML=`<h2>正在看什麼</h2><p>${s.what}</p><h2>值得注意的細節</h2><p>${s.detail}</p>`;shell.get('seek-step').dataset.time=String(s.key*1000);}
select.addEventListener('change',()=>explain(+select.value));explain(0);
let player=new ObserverPlayer({shell,durationMs:duration*1000,overviewMs:info.overview*1000,restartFromOverview:true,qa:location.hostname==='127.0.0.1'&&location.search.includes('qa'),render:frame=>{const s=state(frame.local/1000),w=shell.host.clientWidth,h=shell.host.clientHeight;shell.svg.setAttribute('viewBox',`0 0 ${w} ${h}`);shell.svg.innerHTML=draw(s,w,h);shell.svg.dataset.time=String(frame.local);shell.svg.dataset.stage=String(s.index);return{title:stages[s.index].title,index:s.index,count:stages.length};},onInfo:()=>{select.value=String(state(player.lastFrame.local/1000).index);explain(+select.value);player.openPanel();}});
shell.get('seek-step').addEventListener('click',e=>player.seek(+e.currentTarget.dataset.time));
new ResizeObserver(()=>player.redraw()).observe(shell.host);
