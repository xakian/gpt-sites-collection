import {createShell,ObserverPlayer} from './shared/observer.js';
import {duration,steps,stateAt} from './model.js';import {layout} from './layout.js';import {draw} from './scene.js';
const shell=createShell({title:'暫時接合與薄晶圓搬運',sceneLabel:'同一片晶圓的支撐交接剖視動畫'});
const selector=shell.get('step-select');selector.innerHTML=steps.map((s,i)=>`<option value="${i}">${i+1} ${s.title}</option>`).join('');
const showNote=()=>{const s=steps[Number(selector.value)];shell.get('step-what').textContent=s.what;shell.get('step-detail').textContent=s.detail;};showNote();selector.addEventListener('change',showNote);
let dims=layout(shell.host.clientWidth,shell.host.clientHeight),player;
player=new ObserverPlayer({shell,durationMs:duration*1000,overviewMs:32000,restartFromOverview:true,render:frame=>{const s=stateAt(frame.local/1000);shell.svg.setAttribute('viewBox',`0 0 ${dims.width} ${dims.height}`);shell.svg.innerHTML=draw(s,dims);shell.svg.dataset.phase=String(s.index);shell.svg.dataset.support=s.supportedBy;shell.svg.dataset.cycle=String(frame.cycleId);return{title:s.step.title,index:s.index,count:steps.length};},onInfo:()=>{selector.value=String(stateAt(player.lastFrame.local/1000).index);showNote();player.openPanel();}});
new ResizeObserver(()=>{dims=layout(shell.host.clientWidth,shell.host.clientHeight);player.redraw();}).observe(shell.host);
shell.get('seek-step').addEventListener('click',()=>{player.seek(steps[Number(selector.value)].key*1000);player.closePanel();});
