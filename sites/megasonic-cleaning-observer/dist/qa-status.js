// Read-only diagnostics. It never changes animation state and is localhost-only.
if(location.hostname==='127.0.0.1'&&new URLSearchParams(location.search).has('qa')){
 const el=document.createElement('output');el.id='qa-status';el.style.cssText='position:fixed;left:8px;top:54px;z-index:5;font:12px monospace;background:#fffdf3;padding:4px;max-width:95vw;white-space:pre-line;pointer-events:none';document.body.append(el);
 const motion=matchMedia('(prefers-reduced-motion: reduce)');let last='尚無背景事件',hiddenAt=0,hiddenTime='',wasPlaying='';
 function show(){el.textContent=`QA visibility=${document.visibilityState} reduce=${motion.matches}\n${last}`;}
 document.addEventListener('visibilitychange',()=>{if(document.hidden){hiddenAt=performance.now();hiddenTime=document.querySelector('#time')?.textContent;wasPlaying=document.querySelector('#observer')?.dataset.playing;last=`進入背景 ${hiddenTime}`;}else{last=`背景 ${((performance.now()-hiddenAt)/1000).toFixed(1)}s | 入 ${hiddenTime}\n返 ${document.querySelector('#time')?.textContent} | playing=${document.querySelector('#observer')?.dataset.playing}`;}show();});
 motion.addEventListener('change',show);show();
}
