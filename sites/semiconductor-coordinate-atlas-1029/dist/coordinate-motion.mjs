export const AXIS_DURATION=650;
export const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

export function framePositions(from,targets,progress){
 const t=ease(Math.max(0,Math.min(1,progress)));
 return targets.map(p=>{const start=from.get(p.id)||p;return {...p,x:start.x+(p.x-start.x)*t,y:start.y+(p.y-start.y)*t};});
}

// A single cancellable timeline; repeated axis changes start at the displayed frame.
export function createCoordinateMotion({request=requestAnimationFrame,cancel=cancelAnimationFrame,now=()=>performance.now()}={}){
 let handle=0,version=0,active=false;
 const stop=()=>{version++;if(handle)cancel(handle);handle=0;active=false;};
 return {
  get active(){return active;},stop,
  start(from,targets,update,complete,{duration=AXIS_DURATION}={}){
   stop();const token=version,start=now();
   if(!duration){update(targets);complete();return;}
   active=true;update(framePositions(from,targets,0));
   const tick=time=>{if(token!==version)return;const progress=Math.min(1,(time-start)/duration);update(framePositions(from,targets,progress));if(progress<1)handle=request(tick);else{active=false;handle=0;complete();}};
   handle=request(tick);
  }
 };
}
