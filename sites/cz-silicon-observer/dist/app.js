import {createShell,ObserverPlayer} from './shared/observer.js';
import {DURATION,stateAt,stages} from './model.js';
import {createScene,drawScene} from './scene.js';
import {layout} from './layout.js';
const shell=createShell({title:'單晶矽拉晶｜一顆晶種怎麼長成整根晶棒？',sceneLabel:'CZ 拉晶固定剖視：追蹤同一根晶棒與固液界面'});
shell.wrap.style.width='100%';shell.wrap.style.height='100%';createScene(shell.svg);
let currentLayout=layout(shell.host.clientWidth,shell.host.clientHeight),player;
player=new ObserverPlayer({shell,durationMs:DURATION,overviewMs:27000,restartFromOverview:true,
 render:frame=>{const s=stateAt(frame.local/1000);drawScene(shell.svg,s,currentLayout);return {title:s.stage.title,index:s.index,count:stages.length};},
 onInfo:()=>{select.value=String(stateAt(player.lastFrame.local/1000).index);updateNotes();player.openPanel();}});
const resize=new ResizeObserver(()=>{const w=shell.host.clientWidth,h=shell.host.clientHeight;shell.svg.setAttribute('viewBox',`0 0 ${w} ${h}`);currentLayout=layout(w,h);player.redraw();});resize.observe(shell.host);
const select=shell.get('step-select');stages.forEach((s,i)=>{const option=document.createElement('option');option.value=i;option.textContent=`${i+1} · ${s.title}`;select.append(option);});
function updateNotes(){const s=stages[Number(select.value)];shell.get('step-what').textContent=s.what;shell.get('step-detail').textContent=s.detail;shell.get('seek-step').textContent=`定位此步 · ${s.key.toFixed(1)} 秒`;}
select.addEventListener('change',updateNotes);updateNotes();shell.get('seek-step').addEventListener('click',()=>{player.seek(stages[Number(select.value)].key*1000);player.closePanel();});
