import {createShell,ObserverPlayer} from './shared/observer.js';
import {title,duration,overview,stages,stateAt} from './model.js';import {draw} from './drawing.js';
const shell=createShell({title,sceneLabel:title+'科學觀察動畫'});shell.wrap.style.width='100%';shell.wrap.style.height='100%';let width=800,height=400,player;
function render(frame){const s=stateAt(frame.local/1000);shell.svg.setAttribute('viewBox','0 0 '+width+' '+height);shell.svg.innerHTML=draw(s,width,height);shell.svg.dataset.stage=String(s.index);return {title:s.stage.title,index:s.index,count:stages.length};}
player=new ObserverPlayer({shell,durationMs:duration*1000,overviewMs:overview*1000,restartFromOverview:true,render,onInfo:()=>player.openPanel(),qa:location.hostname==='127.0.0.1'});
new ResizeObserver(([e])=>{width=e.contentRect.width;height=e.contentRect.height;player.redraw();}).observe(shell.host);
const select=shell.get('step-select'),watch=shell.get('watch'),detail=shell.get('detail'),seek=shell.get('seek-step');stages.forEach((s,i)=>select.add(new Option((i+1)+' · '+s.title,String(i))));
function notes(){const s=stages[Number(select.value)];watch.textContent=s.watch;detail.textContent=s.detail;seek.dataset.time=String(s.key*1000);}
select.addEventListener('change',notes);seek.addEventListener('click',()=>player.seek(Number(seek.dataset.time)));notes();
