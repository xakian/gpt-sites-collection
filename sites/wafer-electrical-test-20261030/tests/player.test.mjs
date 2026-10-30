import test from 'node:test';import assert from 'node:assert/strict';import {Player} from '../dist/player.mjs';
test('PLAY-01..10 & VIEW-05: clock lifecycle with deterministic host events',()=>{
 let queue=new Map(),next=1;const listeners=new Map(),motion={matches:false,addEventListener:(n,fn)=>listeners.set('motion',fn),removeEventListener:()=>listeners.delete('motion')};
 globalThis.document={hidden:false,addEventListener:(n,fn)=>listeners.set(n,fn),removeEventListener:n=>listeners.delete(n)};globalThis.matchMedia=()=>motion;
 globalThis.requestAnimationFrame=fn=>{const id=next++;queue.set(id,fn);return id};globalThis.cancelAnimationFrame=id=>queue.delete(id);
 const frame=t=>{const entries=[...queue.values()];queue.clear();entries.forEach(fn=>fn(t));assert.equal(queue.size,1)};
 let shown;const p=new Player({onFrame:t=>shown=t});frame(0);frame(1000);assert.equal(p.t,1);p.pause();frame(6000);assert.equal(p.t,1);
 p.seek(10.6);const original=shown;frame(11000);assert.equal(shown,original);p.setSpeed(.5);assert.equal(p.playing,false);p.play();frame(12000);frame(14000);assert.equal(p.t,11.6);
 for(const rate of[.5,1,1.5,2]){const old=p.t;p.setSpeed(rate);assert.equal(p.t,old);frame(15000);frame(16000);assert.equal(p.t,old+rate)}
 for(let i=0;i<10;i++)p.replay();assert.equal(queue.size,1);p.setSpeed(1);frame(17000);frame(22000);assert.equal(p.t,5);
 document.hidden=true;listeners.get('visibilitychange')();frame(52000);assert.equal(p.t,5);document.hidden=false;listeners.get('visibilitychange')();frame(53000);frame(54000);assert.equal(p.t,6);
 p.pause();document.hidden=true;listeners.get('visibilitychange')();frame(84000);document.hidden=false;listeners.get('visibilitychange')();frame(85000);assert.equal(p.t,6);assert.equal(p.playing,false);
 p.seek(40);frame(90000);assert.equal(p.t,40);p.play();frame(91000);assert.equal(p.t,0);
 let now=91000;for(let i=0;i<4000;i++){now+=100;frame(now)}assert.equal(p.loops,10);assert.ok(p.t<.000001);
 listeners.get('motion')({matches:true});assert.equal(p.playing,false);listeners.get('motion')({matches:false});assert.equal(p.playing,false);p.destroy();assert.equal(queue.size,0);assert.equal(listeners.size,0);
 motion.matches=true;const r=new Player({onFrame:()=>{}});assert.equal(r.t,35);assert.equal(r.playing,false);r.destroy();
});
