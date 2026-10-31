import './model.js';
import {createShell,ObserverPlayer} from './shared/observer.js';
import {createSupplyScene} from './supply-scene.js';
const M=window.SupplyChain,shell=createShell({title:'供應鏈：區分物料、服務與資訊',sceneLabel:'同一委託，三種關係。實物、服務與資訊的移交動畫。'});
const scene=createSupplyScene(shell.svg);let player;
const steps=[...M.keyframes,...[[1,0],[13.5,4],[24,7],[31.5,10]].map(([time,index])=>[time,M.stages[index][2],M.stages[index][3]])].sort((a,b)=>a[0]-b[0]);
shell.get('steps').innerHTML=steps.map(([time,title,caption])=>`<div class="step"><strong>${title}<span>${time} 秒</span></strong><p>${caption}</p><button data-seek="${time}" aria-label="定位此步：${title}，${time} 秒">定位此步</button></div>`).join('');
const qaMode=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).has('qa');
const selector=shell.get('station-select');selector.innerHTML=steps.map(([time,title],i)=>`<option value="${i}">${String(i+1).padStart(2,'0')} · ${title}</option>`).join('');
function updateNotes(index){selector.value=String(index);shell.get('observation-title').textContent=steps[index][1];shell.get('stage-caption').textContent=steps[index][2];}
selector.addEventListener('change',()=>updateNotes(+selector.value));shell.get('seek-step').addEventListener('click',()=>player.seek(steps[+selector.value][0]*1000));
player=new ObserverPlayer({shell,durationMs:32000,overviewMs:29000,restartFromOverview:true,qa:qaMode,render:c=>{const s=scene.renderAt(c.local);if(!shell.panel.open){shell.get('observation-title').textContent=s.title;shell.get('stage-caption').textContent=s.caption;}return{title:s.title,index:s.phase,count:M.stages.length};},onInfo:()=>{updateNotes(scene.state.phase);player.openPanel();}});
shell.get('steps').addEventListener('click',e=>{const button=e.target.closest('[data-seek]');if(button)player.seek(Number(button.dataset.seek)*1000);});
window.SCPlayer={seek:value=>player.seek(value*1000),pause:()=>player.pause(),play:()=>player.play(),state:()=>({t:player.lastFrame.local/1000,playing:player.lastFrame.playing,speed:player.lastFrame.rate,cycles:player.lastFrame.cycleId,hidden:document.hidden,model:scene.state,nodeCount:shell.svg.querySelectorAll('*').length,renderCount:scene.renderCount}),destroy:()=>{scene.destroy();player.destroy();}};
