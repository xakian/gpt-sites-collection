// One timestamp and one RAF for every topic. Times are milliseconds.
export class PlayerClock {
  constructor({durationMs,onFrame,now=()=>performance.now(),request=fn=>requestAnimationFrame(fn),cancel=id=>cancelAnimationFrame(id),hidden=false,reduced=false,overviewMs=1700}) {
    if (!(durationMs>0)) throw new TypeError('durationMs must be positive');
    Object.assign(this,{durationMs,onFrame,now,request,cancel,hidden});
    this.anchorSimMs=reduced?Math.min(durationMs,Math.max(0,overviewMs)):0;
    this.anchorWallMs=now();this.userWantsPlaying=!reduced;this.rate=1;this.raf=null;this.panelOpen=false;this.destroyed=false;
    this.tick=this.tick.bind(this);this.emit();this.schedule();
  }
  get effectivePlaying(){return !this.destroyed&&this.userWantsPlaying&&!this.hidden&&!this.panelOpen;}
  time(){return this.anchorSimMs+(this.effectivePlaying?this.now()-this.anchorWallMs:0)*this.rate;}
  commit(){this.anchorSimMs=this.time();this.anchorWallMs=this.now();}
  emit(){const total=this.time(),remainder=total%this.durationMs;this.onFrame({total,local:!this.effectivePlaying&&total>0&&remainder===0?this.durationMs:remainder,cycleId:Math.floor(total/this.durationMs),playing:this.effectivePlaying,wantsPlaying:this.userWantsPlaying,rate:this.rate});}
  stop(){if(this.raf!==null)this.cancel(this.raf);this.raf=null;}
  schedule(){if(this.effectivePlaying&&this.raf===null)this.raf=this.request(this.tick);}
  tick(){this.raf=null;this.emit();this.schedule();}
  pause(){this.commit();this.userWantsPlaying=false;this.stop();this.emit();}
  play(){this.commit();if(this.anchorSimMs===this.durationMs)this.anchorSimMs=0;this.panelOpen=false;this.userWantsPlaying=true;this.anchorWallMs=this.now();this.emit();this.schedule();}
  setRate(rate){if(![.5,1,1.5,2].includes(rate))return;this.commit();this.rate=rate;this.emit();}
  openPanel(){this.commit();this.userWantsPlaying=false;this.panelOpen=true;this.stop();this.emit();}
  closePanel(){this.commit();this.panelOpen=false;this.emit();}
  seek(ms){this.commit();this.anchorSimMs=Math.min(this.durationMs,Math.max(0,Number(ms)||0));this.userWantsPlaying=false;this.stop();this.emit();}
  replay(){this.stop();this.anchorSimMs=0;this.anchorWallMs=this.now();this.panelOpen=false;this.userWantsPlaying=true;this.emit();this.schedule();}
  setHidden(hidden){if(this.hidden===hidden)return;this.commit();this.hidden=hidden;this.anchorWallMs=this.now();if(hidden)this.stop();else this.schedule();this.emit();}
  destroy(){this.commit();this.stop();this.userWantsPlaying=false;this.destroyed=true;}
}
