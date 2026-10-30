import assert from 'node:assert/strict';
import {framePositions,createCoordinateMotion,AXIS_DURATION} from '../dist/coordinate-motion.mjs';
const from=new Map([['known',{x:10,y:20}],['outside',{x:80,y:400}]]),targets=[{id:'known',x:210,y:320},{id:'outside',x:50,y:100}];
assert.deepEqual(framePositions(from,targets,0).map(p=>[p.x,p.y]),[[10,20],[80,400]]);
assert.deepEqual(framePositions(from,targets,1),targets);
const mid=framePositions(from,targets,.5);assert.deepEqual(mid.map(p=>[p.x,p.y]),[[110,170],[65,250]]);
let prior=10;for(let i=0;i<=100;i++){const x=framePositions(from,targets,i/100)[0].x;assert.ok(x>=prior);prior=x;}
let queue=new Map(),handle=0,time=0,displayed=[],done=0;
const runner=createCoordinateMotion({request:cb=>{queue.set(++handle,cb);return handle;},cancel:id=>queue.delete(id),now:()=>time});
const tick=t=>{time=t;const callbacks=[...queue.values()];queue.clear();callbacks.forEach(cb=>cb(t));};
runner.start(from,targets,p=>displayed=p,()=>done++);assert.equal(runner.active,true);tick(AXIS_DURATION/2);assert.deepEqual(displayed,mid);
const interrupted=new Map(displayed.map(p=>[p.id,p])),next=[{id:'known',x:20,y:30},{id:'outside',x:80,y:400}];
runner.start(interrupted,next,p=>displayed=p,()=>done++);assert.deepEqual(displayed.map(p=>[p.x,p.y]),mid.map(p=>[p.x,p.y]));tick(time+AXIS_DURATION);assert.deepEqual(displayed,next);assert.equal(done,1);assert.equal(runner.active,false);
runner.start(from,targets,p=>displayed=p,()=>done++,{duration:0});assert.deepEqual(displayed,targets);assert.equal(done,2);assert.equal(queue.size,0);
runner.start(from,targets,p=>displayed=p,()=>done++);runner.stop();tick(time+AXIS_DURATION);assert.equal(done,2);assert.equal(runner.active,false);
console.log('PASS easing endpoints, intermediate positions, monotonic path, unlocated transitions, interruption continuity, cancellation and reduced motion.');
