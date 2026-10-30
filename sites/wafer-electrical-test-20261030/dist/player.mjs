export class Player {
 constructor({duration=40,onFrame,onState=()=>{}}){this.duration=duration;this.onFrame=onFrame;this.onState=onState;this.motion=matchMedia('(prefers-reduced-motion: reduce)');this.t=this.motion.matches?35:0;this.playing=!this.motion.matches;this.speed=1;this.last=null;this.frames=0;this.loops=0;
 this.tick=(stamp)=>{if(this.playing&&!document.hidden&&this.last!==null){this.t+=(stamp-this.last)/1000*this.speed;if(this.t>this.duration){this.loops+=Math.floor(this.t/this.duration);this.t%=this.duration;}}this.last=stamp;this.onFrame(this.t);this.frames++;this.raf=requestAnimationFrame(this.tick)};
 this.visibility=()=>{this.last=null};this.reduce=e=>{if(e.matches)this.pause()};
 document.addEventListener('visibilitychange',this.visibility);this.motion.addEventListener('change',this.reduce);this.raf=requestAnimationFrame(this.tick);this.onFrame(this.t);}
 pause(){this.playing=false;this.last=null;this.onState()}
 play(){if(this.t>=this.duration)this.t=0;this.playing=true;this.last=null;this.onState()}
 seek(t){this.t=Math.max(0,Math.min(this.duration,Number(t)));this.pause();this.onFrame(this.t)}
 replay(){this.t=0;this.play();this.onFrame(0)}
 setSpeed(speed){this.speed=Number(speed);this.last=null;this.onState()}
 destroy(){cancelAnimationFrame(this.raf);document.removeEventListener('visibilitychange',this.visibility);this.motion.removeEventListener('change',this.reduce)}
}
