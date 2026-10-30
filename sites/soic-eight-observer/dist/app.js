import {layouts} from './layouts.js';
import {topic,stages} from './topic.js';
import {PlayerClock} from './clock.js';
import {PackagingScene} from './scene.js';
import {Inspector} from './inspector.js';
const $=s=>document.querySelector(s),host=$('#scene-host'),wrap=$('#scene-wrap');
const qaMode=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).has('qa');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const reduced=motion.matches||(qaMode&&new URLSearchParams(location.search).get('motion')==='reduce');
let layout=layouts.wide,inspector,clock,lastFrame,lastClock,lastStatus='',lastTenth=-1;
let samples=[],observedFrames=0;
const buttons=stages.map((s,i)=>{const b=document.createElement('button');b.className='station-button';b.setAttribute('aria-label',`第${i+1}站 ${s.label}，開啟說明`);b.innerHTML=`<span class="number">0${i+1}</span><span>${s.label}</span>`;b.addEventListener('click',()=>openStation(i,b));$('#station-buttons').append(b);return b;});
function openStation(i,trigger){inspector.open(i,trigger||buttons[i]);}
const scene=new PackagingScene($('#scene'),i=>openStation(i));
function draw(c){const start=performance.now();lastClock=c;const f=topic.evaluate(c.local,layout,c.cycleId);lastFrame=f;scene.render(f);const tenth=Math.floor(f.t*10);if(tenth!==lastTenth){$('#time').textContent=`${f.t.toFixed(1).padStart(4,'0')} / 18 s`;lastTenth=tenth;}$('#cycle-progress').style.transform=`scaleX(${f.t/18})`;const status=`${c.playing?'':'已暫停 · '}${stages[f.stageId].label}`;if(status!==lastStatus){$('#status').textContent=status;$('#play').setAttribute('aria-label',c.playing?'暫停':'播放');$('#play').title=c.playing?'暫停':'播放';$('#play-label').textContent=c.playing?'暫停':'播放';$('#play-icon').setAttribute('d',c.playing?'M8 5v14M16 5v14':'M8 5l11 7-11 7Z');buttons.forEach((b,i)=>b.classList.toggle('active',f.t>0&&f.t<17.9&&i===f.stageId));lastStatus=status;}
 observedFrames++;samples.push(performance.now()-start);if(samples.length>2000)samples.shift();
 if(qaMode){host.dataset.frame=JSON.stringify(f);host.dataset.clock=JSON.stringify({total:c.total,local:c.local,cycleId:c.cycleId,rate:c.rate,playing:c.playing,wantsPlaying:c.wantsPlaying,hidden:document.hidden,layout:layout.id});host.dataset.metrics=JSON.stringify({nodes:$('#scene').querySelectorAll('*').length,observedFrames,p95:samples.slice().sort((a,b)=>a-b)[Math.floor(samples.length*.95)]});const output=$('#qa-output');if(output)output.textContent=`t=${f.t.toFixed(3)} · cycle=${c.cycleId} · ${layout.id} · ${c.playing?'play':'pause'} · ${f.bondCount} wires`;
 }
}
function resize(){const box=host.getBoundingClientRect();layout=box.width/box.height<1.15?layouts.tall:layouts.wide;const scale=Math.min(box.width/layout.width,box.height/layout.height);wrap.style.width=`${layout.width*scale}px`;wrap.style.height=`${layout.height*scale}px`;scene.setLayout(layout);buttons.forEach((b,i)=>{b.style.left=`${layout.anchors[i][0]/layout.width*100}%`;b.style.top=`${(layout.anchors[i][1]+110)/layout.height*100}%`;});if(lastClock)draw({...lastClock,local:clock.time()%topic.durationMs,total:clock.time()});}
scene.setLayout(layout);clock=new PlayerClock({durationMs:topic.durationMs,onFrame:draw,hidden:document.hidden,reduced});
inspector=new Inspector({clock,onSelect:i=>inspector.update(i),onClose:()=>inspector.close()});
new ResizeObserver(resize).observe(host);resize();
function playPause(){if(clock.effectivePlaying)clock.pause();else{if(inspector.dialog.open)inspector.close();clock.play();}}
$('#play').addEventListener('click',playPause);
$('#panel-play').addEventListener('click',playPause);
$('#replay').addEventListener('click',()=>{if(inspector.dialog.open)inspector.close();inspector.selected=null;clock.replay();$('#announcement').textContent='已從新晶圓開始重播。';});
$('#info').addEventListener('click',()=>openStation(inspector.selected??lastFrame.stageId,$('#info')));
$('#speed').addEventListener('change',e=>{clock.setRate(+e.target.value);$('#announcement').textContent=`速度 ${e.target.value} 倍。`;});
$('#show-labels').addEventListener('change',e=>host.classList.toggle('hide-labels',!e.target.checked));
host.addEventListener('keydown',e=>{if(e.code==='Space'&&e.target===host){e.preventDefault();playPause();}});
document.addEventListener('visibilitychange',()=>clock.setHidden(document.hidden));
motion.addEventListener('change',e=>{if(e.matches)clock.pause();});
if(reduced)$('#motion-note').textContent='減少動態模式：初始停在 1.70 秒；可選站並定位，或明確按播放開始。';
if(qaMode){const qa=document.createElement('div');qa.id='qa';qa.innerHTML='<label>驗收時間 ms <input id="qa-time" type="number" value="1700" step="1"></label> <button id="qa-seek">定位</button> <label><input id="qa-reduce" type="checkbox"> 模擬減少動態</label> <label><input id="qa-text" type="checkbox"> 200% 文字</label><output id="qa-output"></output>';document.body.append(qa);$('#qa-seek').addEventListener('click',()=>clock.seek(+( $('#qa-time').value)));$('#qa-reduce').addEventListener('change',e=>{if(e.target.checked)clock.pause();});$('#qa-text').addEventListener('change',e=>{document.documentElement.style.fontSize=e.target.checked?'200%':'';});draw(lastClock);}
window.addEventListener('pagehide',e=>{if(!e.persisted)clock.destroy();});

