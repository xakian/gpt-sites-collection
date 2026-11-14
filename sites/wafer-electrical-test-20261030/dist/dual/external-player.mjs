import {PlayerClock} from './player-clock.js';
import {makeBridge} from './external-view.js';
import topic from './topic.js';
import {splitPosition} from './timing.js';
const $=id=>document.getElementById(id);
/** Preserve the original seconds-based app interface; one ms clock serves both modes. */
export class Player {
 constructor({duration,onFrame,onState=()=>{}}){
  this.duration=duration;this.onFrame=onFrame;this.onState=onState;this.frames=0;this.motion=matchMedia('(prefers-reduced-motion: reduce)');
  const root=$('player'),host=document.querySelector('.scene-wrap');root.querySelector('header').classList.add('observer-head');host.id='scene-host';host.tabIndex=0;
  const panelContent=document.createElement('div');panelContent.id='panel-content';$('info-tabs').before(panelContent);panelContent.append($('info-tabs'),$('info-content'));
  this.shell={root,host,wrap:$('presentation'),svg:$('apparatus-svg'),get:$,panel:$('explanation')};
  this.dual=makeBridge(this.shell,()=>this.openPanel());this.dual.player=this;
  this.clock=new PlayerClock({durationMs:duration*1000,overviewMs:35000,reduced:this.motion.matches,hidden:document.hidden,onFrame:f=>this.draw(f)});
  this.visibility=()=>this.clock.setHidden(document.hidden);this.reduce=e=>{if(e.matches)this.pause();};
  document.addEventListener('visibilitychange',this.visibility);this.motion.addEventListener('change',this.reduce);
  this.resize=new ResizeObserver(()=>{this.dual.flowScene.invalidate();this.clock.emit();});this.resize.observe(host);
  this.info=()=>{this.dual.showNotes();if(this.dual.mode==='flow')this.dual.showNode(this.dual.state?.focus.id||topic.start);};$('info').addEventListener('click',this.info);
  this.key=e=>{if(e.target.closest('button,input,select,textarea,summary,a,[contenteditable]')||!$('explanation').hidden)return;if(['Home','End','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const v=this.dual.rawFrame.local;this.seekView((e.key==='Home'?0:e.key==='End'?this.clock.durationMs:v+(e.key==='ArrowRight'?1000:-1000))/1000);}};window.addEventListener('keydown',this.key);
  if(['127.0.0.1','localhost','[::1]'].includes(location.hostname)&&['qa','dualqa'].some(k=>new URLSearchParams(location.search).has(k)))Object.defineProperty(window,'dualQA',{value:Object.freeze({snapshot:this.dual.snapshot}),configurable:true});
 }
 get t(){return (this.dual.sourceFrame?.local||0)/1000;}
 get playing(){return this.clock?.effectivePlaying??this.dual.rawFrame?.playing??false;}
 get speed(){return this.clock?.rate??1;}
 get loops(){return this.dual.sourceFrame?.cycleId??0;}
 draw(frame){this.dual.draw(frame,f=>this.onFrame(f.local/1000));this.frames++;const b=this.dual;
  const v=b.rawFrame.local/1000,d=(b.mode==='flow'?b.timing.duration:topic.sourceDuration)/1000;
  $('timeline').max=String(d);$('timeline').value=String(v);$('timeline').setAttribute('aria-valuetext',`${v.toFixed(2)} 秒，${b.mode==='flow'?b.state.focus.id:'示意'}，${b.semantic.label}`);$('time-display').textContent=`${v.toFixed(1).padStart(4,'0')} / ${d}`;
  this.onState();
 }
 pause(){this.clock.pause();}
 play(){this.closePanel(false);const c=this.clock;c.commit();this.dual.positionHint=null;c.userWantsPlaying=true;c.anchorWallMs=c.now();c.emit();c.schedule();}
 replay(){this.closePanel(false);this.dual.positionHint=null;this.clock.replay();}
 seek(seconds){this.seekView((this.dual.mode==='flow'?this.dual.timing.toFlow(Number(seconds)*1000):Number(seconds)*1000)/1000);}
 seekView(seconds){const c=this.clock,b=this.dual;c.commit();const p=splitPosition(c.anchorSimMs,c.durationMs,c.effectivePlaying,b.positionHint),local=Math.max(0,Math.min(c.durationMs,(Number(seconds)||0)*1000));c.anchorSimMs=p.run*c.durationMs+local;b.positionHint={total:c.anchorSimMs,run:p.run,local};c.anchorWallMs=c.now();c.userWantsPlaying=false;c.stop();c.emit();}
 setSpeed(rate){this.clock.setRate(Number(rate));}
 setMode(mode){if(!['flow','schematic'].includes(mode)||mode===this.dual.mode)return;const c=this.clock,b=this.dual;c.commit();const p=splitPosition(c.anchorSimMs,c.durationMs,c.effectivePlaying,b.positionHint),source=b.mode==='flow'?b.timing.toSource(p.local):p.local;
  b.mode=mode;const duration=mode==='flow'?b.timing.duration:topic.sourceDuration,local=mode==='flow'?b.timing.toFlow(source):source;c.durationMs=duration;c.anchorSimMs=p.run*duration+local;c.anchorWallMs=c.now();b.positionHint=c.effectivePlaying?null:{total:c.anchorSimMs,run:p.run,local};
  this.shell.wrap.style.visibility=mode==='flow'?'hidden':'';this.shell.wrap.inert=mode==='flow';this.shell.wrap.setAttribute('aria-hidden',String(mode==='flow'));b.host.hidden=mode!=='flow';b.controls.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.mode===mode)));b.showNotes();b.flowScene.invalidate();c.emit();c.schedule();if(!$('explanation').hidden)this.info();
 }
 openPanel(trigger){this.pause();if(!trigger)this.info();$('explanation').hidden=false;$('info').setAttribute('aria-expanded','true');$('close-info').focus();}
 closePanel(focus=true){$('explanation').hidden=true;$('info').setAttribute('aria-expanded','false');if(focus)$('info').focus();}
 destroy(){this.clock.destroy();this.resize.disconnect();document.removeEventListener('visibilitychange',this.visibility);this.motion.removeEventListener('change',this.reduce);$('info').removeEventListener('click',this.info);window.removeEventListener('keydown',this.key);}
}
