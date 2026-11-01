import {createShell,ObserverPlayer} from './shared/observer.js';
export const clamp=v=>Math.max(0,Math.min(1,v));
export const ramp=(t,a,b)=>clamp((t-a)/(b-a));
export const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
export const lerp=(a,b,p)=>a+(b-a)*p;
export const txt=(x,y,text,size=16,anchor='middle',cls='label')=>'<text x="'+x+'" y="'+y+'" text-anchor="'+anchor+'" font-size="'+size+'" class="'+cls+'">'+text+'</text>';
export const rect=(x,y,w,h,cls,extra='')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" class="material '+cls+'" '+extra+'/>';
export const path=(d,cls='guide',extra='')=>'<path d="'+d+'" class="'+cls+'" '+extra+'/>';
export function mount(topic,draw){
 document.title=topic.title;const template=document.querySelector('#topic-notes');
 template.innerHTML='<p class="eyebrow">批次 05 · '+topic.duration+' 秒 · 示意動畫</p><h2>'+topic.question+'</h2><p>'+topic.intro+'</p><label for="step-choice">觀察步驟</label><select id="step-choice">'+topic.steps.map((s,i)=>'<option value="'+i+'">'+(i+1)+' · '+s.title+'</option>').join('')+'</select><section id="step-note"></section><details><summary>簡化與來源</summary><p>'+topic.simplifications+'</p>'+topic.sources.map(s=>'<p><a href="'+s.url+'" target="_blank" rel="noopener noreferrer">'+s.title+'</a><br>'+s.claim+'</p>').join('')+'<p class="source-intro">查證：2026-11-01。共用規格 v1.0；程式範本 1.0.0；主題 1.0.0。</p></details>';
 const shell=createShell({title:topic.title,sceneLabel:topic.question});let width=600,height=400;
 const measure=()=>{width=shell.host.clientWidth;height=shell.host.clientHeight;shell.svg.setAttribute('viewBox','0 0 '+width+' '+height)};measure();let player;
 player=new ObserverPlayer({shell,durationMs:topic.duration*1000,overviewMs:topic.overview*1000,restartFromOverview:true,render:f=>{const t=f.local/1000;let i=topic.steps.findLastIndex(s=>t>=s.start);i=Math.max(0,i);shell.svg.innerHTML=draw(t,{w:width,h:height,small:width<650},topic.steps[i],f);return{title:topic.steps[i].title,index:i,count:topic.steps.length}},onInfo:()=>{showNote(Math.max(0,topic.steps.findLastIndex(s=>player.lastFrame.local/1000>=s.start)));player.openPanel()}});
 function showNote(i){const s=topic.steps[i];shell.get('step-choice').value=String(i);shell.get('step-note').innerHTML='<h3>正在看什麼</h3><p>'+s.what+'</p><h3>值得注意的細節</h3><p>'+s.detail+'</p><button class="primary" data-time="'+s.key+'">定位此步 · '+s.key+' 秒</button>'}
 shell.get('step-choice').addEventListener('change',e=>showNote(Number(e.target.value)));shell.get('panel-content').addEventListener('click',e=>{const b=e.target.closest('[data-time]');if(b)player.seek(Number(b.dataset.time)*1000)});showNote(0);
 new ResizeObserver(()=>{measure();player.redraw()}).observe(shell.host);
 // Read-only QA telemetry uses the same frame; no second clock and no hidden animation state.
 Object.defineProperty(window,'observerQA',{get:()=>({time:player.lastFrame.local/1000,total:player.lastFrame.total/1000,cycle:player.lastFrame.cycleId,playing:player.lastFrame.playing,rate:player.lastFrame.rate,visibility:document.visibilityState,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches})});
 return {shell,player};
}
