import {allowedGalleryParent,validGalleryControl} from './gallery-protocol.mjs';
/* Opt-in, origin-checked gallery controls; standalone behavior stays unchanged. */
(() => {
 const params=new URLSearchParams(location.search),parentOrigin=params.get('parent'),id=params.get('gallery');
 if(parent===window||id!=='wafer-test'||!allowedGalleryParent(parentOrigin,location.origin))return;
 const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('./gallery-embed.css',import.meta.url).href;document.head.append(style);
 let player,internal=false,active=false;
 const announce=(type,extra={})=>parent.postMessage({type,id,...extra},parentOrigin);
 const guarded=fn=>{internal=true;try{return fn();}finally{internal=false;}};
 function snapshot(){
  const c=player.clock;c.commit();
  const fields=[...document.querySelectorAll('select[id],input[id]')].filter(e=>!['timeline','speed'].includes(e.id)).map(e=>({id:e.id,value:e.value,checked:e.checked,type:e.type}));
  return {mode:player.dual.mode,total:c.anchorSimMs,rate:c.rate,positionHint:player.dual.positionHint,initialOverview:player.initialOverview,settings:player.galleryGetSettings?structuredClone(player.galleryGetSettings()):null,caseLabel:document.getElementById('current-case')?.textContent,fields};
 }
 function restore(saved){
  if(!saved)return;
  guarded(()=>{
   const c=player.clock;c.setHidden(true);player.pause();
   for(const field of saved.fields||[]){const e=document.getElementById(field.id);if(!e)continue;e.value=field.value;if(field.type==='checkbox'||field.type==='radio')e.checked=field.checked;e.dispatchEvent(new Event('change',{bubbles:true}));}
   if(saved.settings&&player.galleryGetSettings)Object.assign(player.galleryGetSettings(),saved.settings);
   if(saved.caseLabel&&document.getElementById('current-case'))document.getElementById('current-case').textContent=saved.caseLabel;
   player.setMode(saved.mode||'schematic');c.stop();c.anchorSimMs=Number(saved.total)||0;c.anchorWallMs=c.now();c.rate=saved.rate||1;c.userWantsPlaying=false;c.panelOpen=false;player.initialOverview=!!saved.initialOverview;
   player.dual.positionHint=saved.positionHint||null;
   const speed=document.getElementById('speed');if(speed)speed.value=String(c.rate);
   player.closePanel(false);c.emit();
  });
 }
 function setActive(value,wantsPlaying){
  active=!!value;
  guarded(()=>{
   const c=player.clock;
   c.setHidden(!active||document.hidden);
   if(!active||!wantsPlaying){if(c.userWantsPlaying)player.pause();}
   else if(!c.userWantsPlaying)player.play();
  });
 }
 function command(action){
  guarded(()=>{
   if(action==='play')player.play();
   else if(action==='pause')player.pause();
   else if(action==='replay')player.replay();
   else if(action==='flow'||action==='schematic')player.setMode(action);
   player.clock.setHidden(!active||document.hidden);
  });
 }
 function ready(){
  player=window.__galleryPlayer||window.__wafer?.player;
  if(!player?.clock||!player.dual)return false;
  guarded(()=>{player.clock.setHidden(true);player.pause();});
  window.galleryEmbed=Object.freeze({snapshot,restore,setActive,command,inspect:()=>({id,active,playing:player.clock.effectivePlaying,scheduled:player.clock.raf!==null,total:player.clock.time(),local:player.dual.rawFrame?.local,run:player.dual.sourceFrame?.cycleId,mode:player.dual.mode,rate:player.clock.rate,wantsPlaying:player.clock.userWantsPlaying,settings:player.galleryGetSettings?.()})});
  const userAction=e=>{
   if(internal||!e.isTrusted)return;
   queueMicrotask(()=>{
    if(!active||document.hidden)guarded(()=>player.clock.setHidden(true));
    announce('gallery-user',{wantsPlaying:player.clock.userWantsPlaying});
   });
  };
  for(const kind of ['click','input','change','keydown'])document.addEventListener(kind,userAction);
  // The source listener runs first; enforce the gallery's off-screen gate afterward.
  document.addEventListener('visibilitychange',()=>guarded(()=>player.clock.setHidden(!active||document.hidden)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!player.shell?.panel?.open&&!(!document.getElementById('explanation')?.hidden&&document.getElementById('explanation')))announce('gallery-escape');});
  const report=type=>announce(type,{snapshot:snapshot(),state:window.galleryEmbed.inspect()});
  addEventListener('message',e=>{
   if(!validGalleryControl(e,parent,parentOrigin))return;
   const methods={restore,setActive,command};methods[e.data.method](...e.data.args);report('gallery-state');
  });
  // One independent frame sends at most ten small clock snapshots per second.
  // Offscreen clocks stop; snapshots let the parent restore after unloading.
  const heartbeat=setInterval(()=>{if(active&&!document.hidden)report('gallery-state');},100);
  addEventListener('pagehide',()=>{setActive(false,false);clearInterval(heartbeat);},{once:true});
  report('gallery-ready');return true;
 }
 let attempts=0;
 const check=()=>{if(ready())return;if(++attempts<500)setTimeout(check,20);else announce('gallery-error',{message:'動畫載入未完成'});};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check,{once:true});else check();
})();
