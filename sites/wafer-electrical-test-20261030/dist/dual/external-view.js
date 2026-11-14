import topic from './topic.js';
import {buildTiming,splitPosition,makePlan,frameAt} from './timing.js';
import {createScene,esc} from './flow/overview-scene.js';
import {describe} from './semantic.js';
export const BRIDGE_VERSION='1.1.0-b29-local';

function safeUrl(url){try{const u=new URL(url,location.href);return ['https:','http:'].includes(u.protocol)?u.href:'#';}catch{return '#';}}
export function makeBridge(shell,originalInfo) {
  const timing=buildTiming(topic),plan=makePlan(topic,timing);
  const b={mode:'schematic',shell,timing,plan,sourceFrame:null,rawFrame:null,state:null,originalInfo,player:null,selected:topic.start};
  const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('./style.css',import.meta.url).href;document.head.append(link);
  const controls=document.createElement('div');controls.className='dual-mode-switch';controls.setAttribute('role','group');controls.setAttribute('aria-label','動畫觀看模式');
  controls.innerHTML='<button type="button" data-mode="schematic" aria-pressed="true">示意<span>動畫</span></button><button type="button" data-mode="flow" aria-pressed="false">流程<span>動畫</span></button>';
  shell.root.querySelector('.observer-head').insertBefore(controls,shell.root.querySelector('.observer-head').lastElementChild);
  const host=document.createElement('div');host.className='dual-flow-view';host.hidden=true;host.setAttribute('aria-label','流程動畫');
  shell.host.append(host);
  const shadow=host.attachShadow({mode:'open'});
  shadow.innerHTML='<link rel="stylesheet" href="'+new URL('./flow/flow.css',import.meta.url).href+'"><style>:host{font-family:inherit}*{box-sizing:border-box}[hidden]{display:none!important}.flow-stage,.flow-wrap{position:absolute;inset:0;width:100%;height:100%}svg{display:block;width:100%;height:100%;font-family:inherit;overflow:visible}#station-buttons{position:absolute;inset:0;pointer-events:none}.node-hit{font:inherit}.flow-meta{font-size:12px}.overview-caption{font-size:11px}</style><div class="flow-stage"><div class="flow-wrap"><svg id="flow-svg" role="img"></svg><div id="station-buttons"></div></div></div>';
  const flowShell={root:host,host:shadow.querySelector('.flow-stage'),wrap:shadow.querySelector('.flow-wrap'),svg:shadow.querySelector('svg'),get:id=>shadow.getElementById(id)};
  const flowScene=createScene(flowShell,topic,(id,trigger)=>{b.showNode(id);b.player.openPanel(trigger);});
  b.host=host;b.flowShell=flowShell;b.flowScene=flowScene;b.controls=controls;
  controls.addEventListener('click',e=>{const button=e.target.closest('[data-mode]');if(button)b.player.setMode(button.dataset.mode);});
  function ensureNotes(){
    if(b.notes?.isConnected)return;
    b.notes=document.createElement('section');b.notes.className='dual-flow-notes';b.notes.hidden=true;
    shell.get('panel-content').append(b.notes);
  }
  b.showNotes=()=>{
    ensureNotes();
    for(const child of shell.get('panel-content').children){
      if(child===b.notes)child.hidden=b.mode!=='flow';
      else if(b.mode==='flow'){if(!child.hasAttribute('data-dual-original-hidden'))child.dataset.dualOriginalHidden=String(child.hidden);child.hidden=true;}
      else if(child.hasAttribute('data-dual-original-hidden')){child.hidden=child.dataset.dualOriginalHidden==='true';delete child.dataset.dualOriginalHidden;}
    }
  };
  b.showNode=id=>{
    b.selected=id;ensureNotes();b.showNotes();
    const n=topic.nodes.find(n=>n.id===id);
    b.notes.innerHTML='<p class="eyebrow">'+esc(topic.title)+' · 流程動畫</p><label for="dual-step-choice">流程步驟</label><select id="dual-step-choice">'+topic.nodes.map(x=>'<option value="'+x.id+'" '+(x.id===id?'selected':'')+'>'+x.id+' '+esc(x.title)+'</option>').join('')+'</select><h2>'+esc(n.title)+'</h2><h3>正在看什麼</h3><p>'+esc(n.operation)+'</p><dl><dt>步驟意義</dt><dd>'+esc(n.purpose)+'</dd><dt>材料或資訊變化</dt><dd>'+esc(n.material)+'</dd><dt>值得注意的細節</dt><dd>'+esc(n.parameters)+'</dd></dl><button class="primary" data-dual-seek="'+id+'">定位此步並暫停</button><p class="pause-note">選步驟只閱讀；定位才改變播放位置。切換模式保留目前階段。</p><details><summary>階段對照與簡化</summary><p>對應原示意：'+esc(topic.majorStages[n.majorStage-1].title)+'。兩種模式的時間表示各自的觀看節奏。</p><p>'+esc(topic.intro)+'</p>'+topic.notes.map(s=>'<p>'+esc(s)+'</p>').join('')+'<p>'+esc(topic.restartNote)+'</p></details><details><summary>科學來源</summary><ul>'+topic.sources.map(s=>'<li><a target="_blank" rel="noopener noreferrer" href="'+esc(safeUrl(s.url))+'">'+esc(s.title)+'</a></li>').join('')+'</ul></details>';
    b.notes.querySelector('#dual-step-choice').addEventListener('change',e=>b.showNode(e.target.value));
    b.notes.querySelector('[data-dual-seek]').addEventListener('click',()=>{const anchor=timing.anchorFor(id,b.sourceFrame?.local||0);b.player.seekView(timing.toFlow(anchor)/1000);b.player.closePanel();});
  };
  b.info=()=>{
    b.showNotes();
    if(b.mode==='flow'){b.showNode(b.state?.focus.id||topic.start);b.player.openPanel();}
    else originalInfo();
  };
  b.draw=(frame,renderOriginal)=>{
    const pos=splitPosition(frame.total,b.mode==='flow'?timing.duration:topic.sourceDuration,frame.playing,b.positionHint);
    const local=pos.local;
    b.rawFrame={...frame,local};
    const sourceTime=b.mode==='flow'?timing.toSource(local):local;
    const previous=b.sourceFrame?{local:b.sourceFrame.local,total:b.sourceFrame.total,cycleId:b.sourceFrame.cycleId}:null;
    const sourceFrame={...frame,local:Math.min(sourceTime,topic.sourceDuration-.001),total:pos.run*topic.sourceDuration+sourceTime,cycleId:pos.run,recordEvent:{kind:b.cause||'preview',previous}};
    b.sourceFrame=sourceFrame;
    const original=renderOriginal(sourceFrame);
    b.semantic=describe(sourceFrame);
    b.state=frameAt(plan,b.mode==='flow'?local:timing.toFlow(sourceTime));
    Object.assign(shell.root.dataset,{mode:b.mode,dualVersion:BRIDGE_VERSION,sourceMs:sourceTime.toFixed(6),viewingRun:String(pos.run),flowStep:b.state.focus.id,majorStage:String(timing.atSource(sourceTime).majorStage),localMs:String(local)});
    if(b.mode!=='flow')return original;
    const result=flowScene.draw(b.state,plan);
    flowShell.get('flow-context').textContent=b.semantic.label+' · 示意 '+b.state.progress+'%';
    flowShell.get('flow-relation').textContent=topic.relationNote||'箭頭表步驟順序 · 進度為觀看示意';
    return result;
  };
  b.snapshot=()=>({
    mode:b.mode,frame:b.rawFrame,sourceFrame:b.sourceFrame,sourceDuration:topic.sourceDuration,flowDuration:timing.duration,
    step:b.state?.focus.id,visit:b.state?.focus.visit,context:b.state?.context,semantic:b.semantic,majorStage:b.sourceFrame?timing.atSource(b.sourceFrame.local).majorStage:1,
    flowProgress:b.state?.progress,steps:topic.nodes.map(n=>({id:n.id,title:n.title,majorStage:n.majorStage,source:n.source,anchor:n.anchor})),
    visibility:document.visibilityState,mediaReduced:matchMedia('(prefers-reduced-motion: reduce)').matches,
    clock:b.player?{duration:b.player.clock.durationMs,scheduled:b.player.clock.raf!==null,wantsPlaying:b.player.clock.userWantsPlaying}:null,
    flowGeometry:b.mode==='flow'?{
      width:flowShell.host.clientWidth,height:flowShell.host.clientHeight,
      text:[...flowShell.svg.querySelectorAll('text')].map(el=>{const r=el.getBBox();return{text:el.textContent,x:r.x,y:r.y,w:r.width,h:r.height,font:parseFloat(getComputedStyle(el).fontSize)};}),
      nodes:[...flowShell.svg.querySelectorAll('.flow-node')].map(el=>({id:el.id,status:el.getAttribute('class')})),
      currentEdges:[...flowShell.svg.querySelectorAll('.flow-edge.feeding,.flow-edge.current')].map(el=>el.id)
    }:null
  });
  return b;
}

