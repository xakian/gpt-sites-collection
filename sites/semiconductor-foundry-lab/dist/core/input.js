// HexBase explicit-tap input and newest-only buffer; old construction / combat chords removed.
import {CONFIG,KEY_BINDINGS} from './config.js';
const keys=new Map(KEY_BINDINGS.move.map((k,i)=>[k,i]));
export class IntentInput {
 constructor(){this.queued=null;this.intents=[];}
 push(intent){if(intent.type==='move')this.queued={direction:intent.direction,remaining:CONFIG.INPUT_BUFFER};else this.intents.push(intent);}
 advance(dt){if(this.queued){this.queued.remaining-=dt;if(this.queued.remaining<0)this.queued=null;}}
 direction(){const direction=this.queued?.direction??null;this.queued=null;return direction;}
 clear(){this.queued=null;this.intents=[];}
}
export class Input extends IntentInput {
 constructor(canvas,callbacks={}){
  super();this.pressed=new Set();this.abort=new AbortController();this.callbacks=callbacks;
  const on=(target,type,fn)=>target.addEventListener(type,fn,{signal:this.abort.signal});
  on(window,'keydown',e=>{
   if(e.ctrlKey||e.metaKey||e.altKey||e.isComposing||/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(e.target?.tagName)||e.target?.isContentEditable)return;
   if(e.code==='Escape'){callbacks.cancel?.();return;}
   if(!keys.has(e.code)&&e.code!==KEY_BINDINGS.interact)return;
   e.preventDefault();if(e.repeat||this.pressed.has(e.code)||callbacks.isPlaying?.()===false)return;
   this.pressed.add(e.code);this.push(keys.has(e.code)?{type:'move',direction:keys.get(e.code)}:{type:'interact'});
  });
  on(window,'keyup',e=>this.pressed.delete(e.code));
  on(window,'blur',()=>{this.clear();callbacks.blur?.();});
  on(document,'visibilitychange',()=>{if(document.hidden){this.clear();callbacks.blur?.();}});
 }
 clear(){super.clear();this.pressed?.clear();}
 destroy(){this.clear();this.abort.abort();}
}
