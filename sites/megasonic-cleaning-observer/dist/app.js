import {createShell,ObserverPlayer} from './shared/observer.js';
import {duration,stages,state} from './model.js';
import {draw} from './drawing.js';
const shell=createShell({title:'兆聲波晶圓清洗',sceneLabel:'兆聲波清洗中微粒脫附並隨液流排出的表面剖視'});
shell.wrap.style.width='100%';shell.wrap.style.height='100%';
const note=shell.get('step-note'),select=shell.get('step-select');
select.innerHTML=stages.map((s,i)=>`<option value="${i}">${i+1} · ${s.title}</option>`).join('');
function explain(i){const s=stages[i];note.innerHTML=`<h2>正在看什麼</h2><p>${s.what}</p><h2>值得注意的細節</h2><p>${s.detail}</p>`;shell.get('seek-step').dataset.time=String(s.key*1000);}
select.addEventListener('change',()=>explain(Number(select.value)));explain(0);
let player=new ObserverPlayer({shell,durationMs:duration*1000,overviewMs:16000,restartFromOverview:true,qa:location.hostname==='127.0.0.1'&&location.search.includes('qa'),render:frame=>{const s=state(frame.local/1000),w=shell.host.clientWidth,h=shell.host.clientHeight;shell.svg.setAttribute('viewBox',`0 0 ${w} ${h}`);shell.svg.innerHTML=draw(s,w,h);shell.svg.dataset.time=String(frame.local);shell.svg.dataset.stage=String(s.index);return {title:stages[s.index].title,index:s.index,count:stages.length};},onInfo:()=>{select.value=String(state(player.lastFrame.local/1000).index);explain(Number(select.value));player.openPanel();}});
shell.get('seek-step').addEventListener('click',e=>player.seek(Number(e.currentTarget.dataset.time)));
new ResizeObserver(()=>player.redraw()).observe(shell.host);

import './qa-status.js';
