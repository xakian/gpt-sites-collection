import {createShell,ObserverPlayer} from './shared/observer.js';
import {DURATION,steps,sceneState} from './state.js';
import {drawScene} from './scene.js';
const shell=createShell({title:'離子佈植與退火：怎麼改變矽的導電特性？',sceneLabel:'追蹤同一塊矽的剖面：選區磷佈植、晶格損傷、去光阻、退火活化、冷卻後的電子'});
shell.wrap.style.width='100%';shell.wrap.style.height='100%';
let width=1,height=1,player;
const select=shell.get('step-select');
select.innerHTML=steps.map((s,i)=>`<option value="${i}">${i+1} · ${s.title}</option>`).join('');
function showNote(i){const s=steps[i];select.value=String(i);shell.get('note-title').textContent=s.title;shell.get('note-body').textContent=s.body;shell.get('note-detail').textContent=s.detail;shell.get('seek-step').dataset.time=String(s.key*1000);}
player=new ObserverPlayer({shell,durationMs:DURATION*1000,overviewMs:31000,restartFromOverview:true,qa:location.hostname==='127.0.0.1'&&new URLSearchParams(location.search).has('qa'),render:frame=>{const s=sceneState(frame.local/1000);shell.svg.innerHTML=drawScene(s,width,height);shell.root.dataset.phase=String(s.index);return {title:steps[s.index].title,index:s.index,count:steps.length};},onInfo:()=>{showNote(sceneState(player.lastFrame.local/1000).index);player.openPanel();}});
new ResizeObserver(entries=>{const r=entries[0].contentRect;width=r.width;height=r.height;shell.svg.setAttribute('viewBox',`0 0 ${width} ${height}`);player.redraw();}).observe(shell.host);
select.addEventListener('change',()=>showNote(Number(select.value)));
shell.get('seek-step').addEventListener('click',e=>{player.seek(Number(e.currentTarget.dataset.time));player.closePanel();});
showNote(0);
