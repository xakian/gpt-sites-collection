import {createShell,ObserverPlayer} from './shared/observer.js';
import {topic,stages,stateAt} from './model.js';
import {draw} from './graphics.js';
const shell=createShell({title:topic.title,sceneLabel:topic.question});
shell.wrap.style.width='100%';shell.wrap.style.height='100%';
let size={w:innerWidth,h:innerHeight-136};let player;
shell.get('panel-content').innerHTML=`<p class="eyebrow">批次 06 · 01 · 32 秒觀察</p><h2>${topic.question}</h2><label for="note-step">選擇觀察步驟</label><select id="note-step">${stages.map((s,i)=>`<option value="${i}">${i+1}. ${s.title}</option>`).join('')}</select><h3>正在看什麼</h3><p id="explain"></p><h3>值得注意的細節</h3><p id="detail"></p><button id="seek-step" class="primary">定位此步</button><p class="pause-note">選擇說明不改變動畫；定位後保持暫停。</p><details><summary>後續流程圖</summary><p>三層固晶 → 外露焊墊打線 → 模封 → 後續測試</p><p>本動畫止於固晶。金色焊墊尚未接線，層間 DAF 是非導電黏著材料。</p></details><details><summary>簡化與來源</summary><p>${topic.simplification}</p><ul>${topic.sources.map(s=>`<li><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>：${s.claim}</li>`).join('')}</ul><p>主題 1.0.0 · 共用規格 v1.0 · 共用範本 1.0.0</p></details>`;
function notes(){let s=stages[Number(shell.get('note-step').value)];shell.get('explain').textContent=s.explain;shell.get('detail').textContent=s.detail;}
notes();shell.get('note-step').addEventListener('change',notes);shell.get('seek-step').addEventListener('click',()=>player.seek(stages[Number(shell.get('note-step').value)].key*1000));
player=new ObserverPlayer({shell,durationMs:32000,overviewMs:26000,restartFromOverview:true,qa:location.hostname==='127.0.0.1',render:f=>{let s=stateAt(f.local/1000);shell.svg.setAttribute('viewBox',`0 0 ${size.w} ${size.h}`);shell.svg.innerHTML=draw(s,size);shell.svg.dataset.time=String(f.local);shell.svg.dataset.cycle=String(f.cycleId);return{title:s.title,index:s.index,count:stages.length};},onInfo:()=>player.openPanel()});
new ResizeObserver(([e])=>{size={w:e.contentRect.width,h:e.contentRect.height};player.redraw();}).observe(shell.host);
