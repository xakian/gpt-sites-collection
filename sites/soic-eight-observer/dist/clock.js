// A single timestamp clock; changing controls first commits the old phase.
export class PlayerClock{
 constructor({durationMs,onFrame,now=()=>performance.now(),request=fn=>requestAnimationFrame(fn),cancel=id=>cancelAnimationFrame(id),hidden=false,reduced=false}){Object.assign(this,{durationMs,onFrame,now,request,cancel,hidden});this.anchorSimMs=reduced?1700:0;this.anchorWallMs=now();this.userWantsPlaying=!reduced;this.rate=1;this.raf=null;this.panelOpen=false;this.tick=this.tick.bind(this);this.emit();this.schedule();}
 get effectivePlaying(){return this.userWantsPlaying&&!this.hidden&&!this.panelOpen;}
 time(){return this.anchorSimMs+(this.effectivePlaying?this.now()-this.anchorWallMs:0)*this.rate;}
 commit(){this.anchorSimMs=this.time();this.anchorWallMs=this.now();}
 emit(){const total=this.time();this.onFrame({total,local:total%this.durationMs,cycleId:Math.floor(total/this.durationMs),playing:this.effectivePlaying,wantsPlaying:this.userWantsPlaying,rate:this.rate});}
 stop(){if(this.raf!==null)this.cancel(this.raf);this.raf=null;}
 schedule(){if(this.effectivePlaying&&this.raf===null)this.raf=this.request(this.tick);}
 tick(){this.raf=null;this.emit();this.schedule();}
 pause(){this.commit();this.userWantsPlaying=false;this.stop();this.emit();}
 play(){this.commit();this.panelOpen=false;this.userWantsPlaying=true;this.anchorWallMs=this.now();this.emit();this.schedule();}
 setRate(rate){if(![.5,1,1.5,2].includes(rate))return;this.commit();this.rate=rate;this.emit();}
 openPanel(){this.commit();this.userWantsPlaying=false;this.panelOpen=true;this.stop();this.emit();}
 closePanel(){this.commit();this.panelOpen=false;this.emit();}
 seek(ms){this.commit();this.anchorSimMs=ms;this.userWantsPlaying=false;this.stop();this.emit();}
 replay(){this.stop();this.anchorSimMs=0;this.anchorWallMs=this.now();this.panelOpen=false;this.userWantsPlaying=true;this.emit();this.schedule();}
 setHidden(hidden){this.commit();this.hidden=hidden;this.anchorWallMs=this.now();if(hidden)this.stop();else this.schedule();this.emit();}
 destroy(){this.stop();this.userWantsPlaying=false;}
}
