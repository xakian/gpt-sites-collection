import {createShell,ObserverPlayer} from './shared/observer.js';
import {DURATION,stages,stateAt} from './model.js';
import {createScene} from './scene.js';
const shell=createShell({title:'銅互連與 CMP',sceneLabel:'同一段結構的局部剖面：溝槽填銅，再以 CMP 留下槽內互連'});
const scene=createScene(shell);
const select=shell.get('note-stage');
select.innerHTML=stages.map((s,i)=>`<option value="${i}">${i+1} · ${s.title}</option>`).join('');
function showNote(i){select.value=String(i);shell.get('note-what').textContent=stages[i].what;shell.get('note-detail').textContent=stages[i].detail;shell.get('note-seek').textContent=`定位此步 · ${stages[i].key.toFixed(1)} 秒`;}
let player;
player=new ObserverPlayer({shell,durationMs:DURATION,overviewMs:37000,restartFromOverview:true,qa:location.hostname==='127.0.0.1'||location.hostname==='localhost',
 render:frame=>{const s=stateAt(frame.local/1000);scene.render(s);shell.svg.dataset.stage=String(s.stage);shell.svg.dataset.cycle=String(frame.cycleId);return {title:stages[s.stage].title,index:s.stage,count:stages.length};},
 onInfo:()=>{showNote(stateAt(player.lastFrame.local/1000).stage);player.openPanel();}});
select.addEventListener('change',()=>showNote(Number(select.value)));
shell.get('note-seek').addEventListener('click',()=>player.seek(stages[Number(select.value)].key*1000));
new ResizeObserver(()=>{scene.resize();player.redraw();}).observe(shell.host);
showNote(0);
