import {createShell,ObserverPlayer} from './shared/observer.js';
import {DURATION,OVERVIEW,STEPS,evaluate} from './topic.js';
import {createScene} from './scene.js';
const shell=createShell({title:'微影到蝕刻：圖案怎麼留下來',sceneLabel:'微影到蝕刻的固定局部剖面動畫。空白鍵暫停或播放，說明可選七個步驟。'});
const scene=createScene(shell.svg),select=shell.get('step-select');
STEPS.forEach((s,i)=>select.add(new Option(`${String(i+1).padStart(2,'0')} · ${s.title}`,String(i))));
let selected=0,current=0,player;
const notes=i=>{selected=i;select.value=String(i);shell.get('note-title').textContent=STEPS[i].title;shell.get('note-main').textContent=STEPS[i].main;shell.get('note-points').replaceChildren(...STEPS[i].points.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));};
const qa=['127.0.0.1','localhost'].includes(location.hostname)&&new URLSearchParams(location.search).has('qa');
player=new ObserverPlayer({shell,durationMs:DURATION,overviewMs:OVERVIEW,restartFromOverview:true,qa,render:frame=>{const s=evaluate(frame.local);current=s.index;scene.render(s,Math.max(280,shell.host.clientWidth),Math.max(180,shell.host.clientHeight));return{title:s.title,index:s.index,count:STEPS.length};},onInfo:()=>{notes(current);player.openPanel();}});
select.addEventListener('change',()=>notes(Number(select.value)));
shell.get('seek-step').addEventListener('click',()=>player.seek(STEPS[selected].key));
new ResizeObserver(()=>player.redraw()).observe(shell.host);notes(current);
if(qa){const form=document.createElement('form');form.className='qa-controls';form.innerHTML='<label for="qa-time">驗收時間 ms</label><input id="qa-time" type="number" min="0" max="32000" step="1" value="0"><button class="primary">定位驗收時間</button>';form.addEventListener('submit',e=>{e.preventDefault();player.seek(Number(form.querySelector('input').value));});shell.get('panel-content').append(form);}
