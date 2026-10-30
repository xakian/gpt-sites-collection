import test from 'node:test';
import assert from 'node:assert/strict';
import {topic,stages,pads} from '../dist/topic.js';
import {layouts,route} from '../dist/layouts.js';
import {PlayerClock} from '../dist/clock.js';
const near=(a,b,epsilon=.02)=>assert.ok(Math.abs(a-b)<epsilon,`${a} ~ ${b}`);
for(const layout of Object.values(layouts)){
 test(`${layout.id}: six scientific keyframes and retained identity`,()=>{
  const frames=stages.map(s=>topic.evaluate(s.time,layout,7));
  assert.ok(frames[0].waferCutProgress.every(x=>x>.99999));assert.equal(frames[0].sourceHole,false);
  assert.equal(frames[1].attached,true);assert.equal(frames[1].bondCount,0);
  assert.equal(frames[2].bondCount,8);assert.equal(frames[2].encapsulantCoverage,0);
  assert.equal(frames[3].hasEncapsulant,true);assert.equal(frames[3].temporaryMetal,true);
  assert.equal(frames[4].formed,1);assert.equal(frames[4].temporaryMetal,false);
  assert.equal(frames[5].testStatus,'pass');assert.equal(frames[5].bondCount,8);
  for(const f of frames)assert.equal(f.ids.dieId,'7:die');
  for(const key of ['wireProgress','encapsulantCoverage','trimProgress','formed'])assert.deepEqual(frames[4][key],frames[5][key]);
  assert.equal(pads.length,8);for(const p of pads){assert.ok(Math.abs(p.pad[0])<13);assert.equal(Math.abs(p.finger[0]),24);assert.ok(Math.abs(p.pad[0])<16&&Math.abs(p.finger[0])>16);}
 });
 test(`${layout.id}: direct seeking equals sequential evaluation; +/-1ms joins are continuous`,()=>{
  const wanted=[1700,5300,8300,11300,14300,17300,2999,3000,3001,5999,6000,6001,8999,9000,9001,11999,12000,12001,14999,15000,15001,17999,18000,18001];
  const snapshots=new Map();for(let ms=0;ms<=18001;ms++){const f=topic.evaluate(ms,layout);if(wanted.includes(ms))snapshots.set(ms,f);}
  for(const ms of wanted)assert.deepEqual(topic.evaluate(ms,layout),snapshots.get(ms));
  for(const ms of [3000,6000,9000,12000,15000]){const before=topic.evaluate(ms-1,layout),after=topic.evaluate(ms+1,layout);for(const k of ['diePos','assemblyPos'])for(let i=0;i<2;i++)near(before[k][i],after[k][i]);assert.equal(before.ids.dieId,after.ids.dieId);}
  for(const ms of [0,17950,18000]){const f=topic.evaluate(ms,layout);assert.equal(f.dieVisible,false);assert.equal(f.assemblyVisible,false);assert.equal(f.waferVisible,false);assert.equal(f.testStatus,'idle');}
 });
 test(`${layout.id}: transfer bounds and permanent bonds`,()=>{
  for(let i=1;i<5;i++){const r=route(layout,i);for(let d=0;d<=r.length;d+=2){const p=r.at(d);assert.ok(p[0]>=65&&p[0]<=layout.width-65);assert.ok(p[1]>=65&&p[1]<=layout.height-65);}}
  for(let ms=8300;ms<17900;ms+=13)assert.equal(topic.evaluate(ms,layout).bondCount,8);
 });
}
function harness(reduced=false){let wall=0,id=0;const scheduled=new Map();let frame;const clock=new PlayerClock({durationMs:18000,onFrame:f=>frame=f,now:()=>wall,request:fn=>{scheduled.set(++id,fn);return id;},cancel:i=>scheduled.delete(i),reduced});return {clock,scheduled,advance:ms=>wall+=ms,get frame(){return frame;}};}
test('pause freezes all state, speeds preserve phase, replay keeps one schedule',()=>{
 const h=harness(),c=h.clock;h.advance(6745);c.pause();const time=c.time();h.advance(5000);assert.equal(c.time(),time);
 for(const rate of [.5,1,1.5,2]){c.setRate(rate);assert.equal(c.time(),time);assert.equal(h.scheduled.size,0);}
 c.play();for(const rate of [.5,1,1.5,2]){const before=c.time();c.setRate(rate);assert.equal(c.time(),before);h.advance(18000/rate);near(c.time()-before,18000);}
 for(let i=0;i<10;i++)c.replay();assert.equal(h.scheduled.size,1);assert.equal(c.time(),0);
 c.openPanel();assert.equal(h.scheduled.size,0);h.advance(1000);c.closePanel();assert.equal(c.userWantsPlaying,false);assert.equal(c.time(),0);
});
test('30 second background freeze preserves both playing and paused intentions',()=>{
 const h=harness(),c=h.clock;h.advance(8000);c.setHidden(true);const old=c.time();assert.equal(h.scheduled.size,0);h.advance(30000);c.setHidden(false);assert.equal(c.time(),old);assert.equal(h.scheduled.size,1);h.advance(200);near(c.time(),old+200);
 c.pause();c.setHidden(true);h.advance(30000);const paused=c.time();c.setHidden(false);assert.equal(c.time(),paused);assert.equal(h.scheduled.size,0);
});
test('reduced motion starts at 1.70s and requires explicit play; seek is paused',()=>{
 const h=harness(true),c=h.clock;assert.equal(c.time(),1700);assert.equal(c.userWantsPlaying,false);assert.equal(h.scheduled.size,0);c.seek(11300);assert.equal(h.frame.local,11300);assert.equal(h.scheduled.size,0);c.play();assert.equal(h.scheduled.size,1);c.pause();assert.equal(c.userWantsPlaying,false);
});
