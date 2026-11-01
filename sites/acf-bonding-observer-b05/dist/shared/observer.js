import {PlayerClock} from './player-clock.js';
export const TEMPLATE_VERSION='1.0.0';
const icons={play:'M8 5 L19 12 L8 19 Z',pause:'M8 5 V19 M16 5 V19'};
export function createShell({title,sceneLabel,notesTemplate='topic-notes'}) {
  const root=document.querySelector('#observer');
  root.dataset.templateVersion=TEMPLATE_VERSION;
  root.innerHTML=`<main class="observer">
    <header class="observer-head"><div class="identity"><svg class="brand-mark" viewBox="0 0 22 28" aria-hidden="true"><path d="M1 1H21V27H1Z M7 1V27 M14 1V27"/></svg><h1 id="topic-title"></h1></div>
      <nav class="transport" aria-label="動畫播放控制">
        <button id="play" class="icon-button play-button" aria-label="暫停動畫" title="暫停"><svg viewBox="0 0 24 24" aria-hidden="true"><path id="play-icon" d="${icons.pause}"/></svg><span id="play-label" class="sr-only">暫停</span></button>
        <button id="replay" class="icon-button" aria-label="重播動畫" title="重播"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8 A8 8 0 1 1 4 15 M5 3V9H11"/></svg><span class="sr-only">重播</span></button>
        <button id="info" class="icon-button" aria-label="說明" title="說明" aria-expanded="false" aria-controls="inspector"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 10V17 M12 6.5V7"/></svg><span class="sr-only">說明</span></button>
      </nav>
    </header>
    <section id="scene-host" class="scene-host" tabindex="0"><div id="scene-wrap"><svg id="scene" role="img"></svg><div id="station-buttons"></div></div></section>
    <footer class="observer-footer" aria-label="動畫進度與速度"><div class="status-row"><div class="stage"><span id="stage-index" class="sr-only"></span><h2 id="stage-title" aria-live="polite"></h2></div><div class="time-speed"><output id="time" for="timeline"></output><label><span class="sr-only">播放速度</span><select id="speed" aria-label="播放速度"><option value="0.5">0.5 倍</option><option value="1" selected>1 倍</option><option value="1.5">1.5 倍</option><option value="2">2 倍</option></select></label></div></div><p id="motion-note" role="status" hidden></p>
      <div class="timeline-row"><label for="timeline" class="sr-only">動畫時間定位，單位秒</label><input id="timeline" type="range" min="0" step="0.01" value="0"></div>
    </footer>
  </main>
  <dialog id="inspector" aria-labelledby="panel-heading"><div class="panel-top"><h2 id="panel-heading">觀察筆記</h2><div class="panel-actions"><button id="panel-play" class="quiet">播放接續</button><button id="close-panel" class="icon-button" aria-label="關閉說明" title="關閉說明"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6L18 18 M18 6L6 18"/></svg></button></div></div><div id="panel-content" class="panel-scroll"></div></dialog><p id="announcement" class="sr-only" role="status" aria-live="polite"></p>`;
  root.querySelector('#topic-title').textContent=title;
  const host=root.querySelector('#scene-host');host.setAttribute('aria-label',sceneLabel);root.querySelector('#scene').setAttribute('aria-label',sceneLabel);
  const template=document.getElementById(notesTemplate);if(template)root.querySelector('#panel-content').append(template.content.cloneNode(true));
  return {root,host,wrap:root.querySelector('#scene-wrap'),svg:root.querySelector('#scene'),panel:root.querySelector('#inspector'),get:id=>root.querySelector('#'+id)};
}

export class ObserverPlayer {
  constructor({shell,durationMs,overviewMs=0,restartFromOverview=false,render,onInfo=()=>{},qa=false}) {
    Object.assign(this,{shell,durationMs,render,onInfo,restartFromOverview});
    this.abort=new AbortController();this.disposed=false;this.lastFrame=null;
    const on=(el,type,fn)=>el.addEventListener(type,fn,{signal:this.abort.signal});
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const reduced=motion.matches||(qa&&new URLSearchParams(location.search).get('motion')==='reduce');
    this.initialOverview=reduced;this.reduced=reduced;
    shell.get('timeline').max=String(durationMs/1000);
    this.clock=new PlayerClock({durationMs,overviewMs,reduced,hidden:document.hidden,onFrame:frame=>this.draw(frame)});
    on(shell.get('play'),'click',()=>this.toggle());on(shell.get('replay'),'click',()=>this.replay());
    on(shell.get('info'),'click',()=>{if(shell.panel.open)this.closePanel();else this.onInfo();});
    on(shell.get('close-panel'),'click',()=>this.closePanel());on(shell.get('panel-play'),'click',()=>this.play());
    on(shell.panel,'cancel',e=>{e.preventDefault();this.closePanel();});
    on(shell.get('speed'),'change',e=>{this.clock.setRate(Number(e.target.value));this.announce(`速度 ${e.target.value} 倍`);});
    on(shell.get('timeline'),'pointerdown',()=>this.pause());
    on(shell.get('timeline'),'keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(e.key))this.pause();});
    on(shell.get('timeline'),'input',e=>this.seek(Number(e.target.value)*1000));
    on(shell.host,'keydown',e=>{if(e.code==='Space'&&e.target===shell.host){e.preventDefault();this.toggle();}});
    on(document,'visibilitychange',()=>this.clock.setHidden(document.hidden));
    on(window,'pagehide',()=>this.clock.setHidden(true));on(window,'pageshow',()=>this.clock.setHidden(document.hidden));
    on(motion,'change',e=>{this.reduced=e.matches;if(e.matches){this.initialOverview=false;this.pause();}});
  }
  draw(frame){
    this.lastFrame=frame;const {shell,durationMs}=this,t=frame.local/1000,d=durationMs/1000;
    const state=this.render({...frame,local:Math.min(frame.local,durationMs-.001)})||{};
    if(state.title&&shell.get('stage-title').textContent!==state.title)shell.get('stage-title').textContent=state.title;
    if(state.index!==undefined)shell.get('stage-index').textContent=`${state.index+1} / ${state.count}`;
    const slider=shell.get('timeline');slider.value=String(t);slider.style.setProperty('--progress',`${t/d*100}%`);slider.setAttribute('aria-valuetext',`${t.toFixed(1)} 秒，共 ${d} 秒`);
    const time=`${t.toFixed(1).padStart(4,'0')} / ${d} 秒`;if(shell.get('time').textContent!==time)shell.get('time').textContent=time;
    const label=frame.playing?'暫停':'播放';shell.get('play').setAttribute('aria-label',label+'動畫');shell.get('play').title=label;shell.get('play-label').textContent=label;shell.get('play-icon').setAttribute('d',frame.playing?icons.pause:icons.play);
    const note=shell.get('motion-note');note.hidden=!this.initialOverview;note.textContent=this.initialOverview?'減少動態模式 · 可按播放開始':'';
    shell.root.dataset.playing=String(frame.playing);
  }
  redraw(){if(this.lastFrame)this.draw(this.lastFrame);}
  announce(text){this.shell.get('announcement').textContent=text;}
  pause(){this.clock.pause();}
  seek(ms){this.initialOverview=false;this.clock.seek(ms);}
  play(){if(this.initialOverview&&this.restartFromOverview)this.clock.seek(0);this.initialOverview=false;this.closePanel(false);this.clock.play();}
  toggle(){if(this.clock.effectivePlaying)this.pause();else this.play();}
  replay(){this.initialOverview=false;this.closePanel(false);this.clock.replay();this.announce('已從頭開始重播');}
  openPanel(trigger=this.shell.get('info')){this.trigger=trigger;this.clock.openPanel();if(!this.shell.panel.open)this.shell.panel.showModal();this.shell.get('info').setAttribute('aria-expanded','true');this.shell.get('close-panel').focus();}
  closePanel(focus=true){if(!this.shell.panel.open)return;this.shell.panel.close();this.shell.get('info').setAttribute('aria-expanded','false');this.clock.closePanel();if(focus)(this.trigger||this.shell.get('info')).focus();}
  destroy(){if(this.disposed)return;this.disposed=true;this.clock.destroy();this.abort.abort();}
}
