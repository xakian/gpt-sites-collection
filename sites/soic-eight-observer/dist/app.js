import {layouts} from './layouts.js';
import {topic,stages} from './topic.js';
import {PackagingScene} from './scene.js';
import {Inspector} from './inspector.js';
import {createShell,ObserverPlayer} from './shared/observer.js';
const shell=createShell({title:'SOIC-8 封裝觀察',sceneLabel:'SOIC-8 六站動畫。空白鍵暫停或播放，點選站名可看說明。'}),host=shell.host,wrap=shell.wrap;
const qaMode=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).has('qa');
let layout=layouts.wide,player,inspector,lastFrame,lastClock,observedFrames=0;
const buttons=stages.map((s,i)=>{const b=document.createElement('button');b.className='station-button';b.setAttribute('aria-label',`第${i+1}站 ${s.label}，開啟說明`);b.innerHTML=`<span class="number">0${i+1}</span><span>${s.label}</span>`;b.addEventListener('click',()=>inspector.open(i,b));shell.get('station-buttons').append(b);return b;});
const scene=new PackagingScene(shell.svg,i=>inspector.open(i,buttons[i]));
function render(c){lastClock=c;const f=topic.evaluate(c.local,layout,c.cycleId);lastFrame=f;scene.render(f);observedFrames++;buttons.forEach((b,i)=>b.classList.toggle('active',f.t>0&&f.t<17.9&&i===f.stageId));if(qaMode){host.dataset.frame=JSON.stringify(f);host.dataset.clock=JSON.stringify({...c,hidden:document.hidden,layout:layout.id});host.dataset.metrics=JSON.stringify({nodes:shell.svg.querySelectorAll('*').length,observedFrames});const output=document.querySelector('#qa-output');if(output)output.textContent=`t=${f.t.toFixed(3)} · ${layout.id} · ${c.playing?'play':'pause'} · ${f.bondCount} wires`;}return{title:stages[f.stageId].label,index:f.stageId,count:stages.length};}
function resize(){const box=host.getBoundingClientRect();layout=box.width/box.height<1.15?layouts.tall:layouts.wide;host.dataset.layout=layout.id;const view=layout.view,scale=Math.min(box.width/view.width,box.height/view.height);wrap.style.width=`${view.width*scale}px`;wrap.style.height=`${view.height*scale}px`;shell.svg.style.setProperty('--port-font',`${Math.max(16,12/scale)}px`);scene.setLayout(layout);buttons.forEach((b,i)=>{b.style.left=`${(layout.anchors[i][0]-view.x)/view.width*100}%`;b.style.top=`${(layout.anchors[i][1]+(i===0?120:110)-view.y)/view.height*100}%`;});if(player)player.redraw();}
resize();player=new ObserverPlayer({shell,durationMs:topic.durationMs,overviewMs:1700,qa:qaMode,render,onInfo:()=>inspector.open(lastFrame.stageId,shell.get('info'))});
inspector=new Inspector({player});new ResizeObserver(resize).observe(host);
document.querySelector('#show-labels').addEventListener('change',e=>host.classList.toggle('hide-labels',!e.target.checked));
if(qaMode){const qa=document.createElement('div');qa.id='qa';qa.innerHTML='<label>驗收時間 ms <input id="qa-time" type="number" value="1700" step="1"></label> <button id="qa-seek">定位</button><output id="qa-output"></output>';document.body.append(qa);document.querySelector('#qa-seek').addEventListener('click',()=>player.seek(+document.querySelector('#qa-time').value));player.redraw();}
