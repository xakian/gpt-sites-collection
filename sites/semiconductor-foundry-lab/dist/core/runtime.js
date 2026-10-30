// Extracted HexBase frame accumulator / lifecycle. No simulation catch-up after pause or focus loss.
import {CONFIG} from './config.js';
export function createRuntime({getState,step,draw,metrics}){
 let previous=performance.now(),accumulator=0,handle;
 function frame(now){
  const started=performance.now();
  const dt=Math.min(CONFIG.MAX_FRAME_DELTA,Math.max(0,(now-previous)/1000));previous=now;
  if(!getState().paused){accumulator+=dt;while(accumulator>=CONFIG.FIXED_STEP){step(CONFIG.FIXED_STEP);accumulator-=CONFIG.FIXED_STEP;}}
  else accumulator=0;
  draw(dt);metrics?.(performance.now()-started);handle=requestAnimationFrame(frame);
 }
 handle=requestAnimationFrame(frame);
 return {reset(){previous=performance.now();accumulator=0;},stop(){cancelAnimationFrame(handle);}};
}
