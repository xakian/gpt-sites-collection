import test from 'node:test';
import assert from 'node:assert/strict';
import {stateAt,DURATION_MS,DIES,ORDER,CYCLES,CYCLE,BOUNDARIES} from '../dist/topic-model.js';

const almost=(actual,expected,tol=1e-9)=>assert.ok(Math.abs(actual-expected)<=tol,`${actual} != ${expected}`);

test('37 distinct physical positions map one-to-one to a serpentine visit order',()=>{
  assert.equal(DIES.length,37);assert.equal(ORDER.length,37);
  assert.equal(new Set(ORDER.map(d=>d.id)).size,37);
  assert.deepEqual(new Set(ORDER.map(d=>d.id)),new Set(DIES.map(d=>d.id)));
  assert.equal(ORDER[0].id,'-1,-3');assert.equal(ORDER[1].id,'0,-3');
  for(let i=1;i<ORDER.length;i++)assert.ok(ORDER[i].y>=ORDER[i-1].y);
});

test('every physical XY movement occurs with the stage fully lowered',()=>{
  for(let t=1;t<45_000;t+=7.13){
    const a=stateAt(t-.001),b=stateAt(t+.001);
    const moving=Math.abs(a.position.x-b.position.x)+Math.abs(a.position.y-b.position.y)>1e-10;
    if(moving){almost(a.z,0);almost(b.z,0);assert.equal(a.contact,false);assert.equal(b.contact,false);}
  }
});

test('every result is recorded only after an actual contact, stimulus, response and comparison',()=>{
  for(const cycle of CYCLES){
    const during=f=>stateAt(cycle.start+cycle.duration*f);
    for(const [f,mode] of [[.42,'stimulus'],[.58,'response'],[.72,'compare']]){
      const frame=during(f);assert.equal(frame.current.id,cycle.die.id);
      assert.equal(frame.contact,true);assert.equal(frame.signalMode,mode);
      assert.equal(frame.records.find(r=>r.id===cycle.die.id).status,'untested');
    }
    assert.equal(stateAt(cycle.writeAt-.001).records.find(r=>r.id===cycle.die.id).status,'untested');
    const written=stateAt(cycle.writeAt+.001);
    assert.equal(written.contact,true);assert.notEqual(written.records.find(r=>r.id===cycle.die.id).status,'untested');
    assert.equal(written.counts.tested,cycle.index+1);
  }
});

test('all map records persist, preserve coordinates and finish at 31 passes plus 6 failures',()=>{
  let previous=new Map();
  for(let t=0;t<=DURATION_MS;t+=97){
    const s=stateAt(t);
    assert.equal(s.counts.total,s.counts.pass+s.counts.fail+s.counts.untested);
    for(const r of s.records){
      assert.equal(r.id,`${r.x},${r.y}`);
      const prior=previous.get(r.id);if(prior&&prior!=='untested')assert.equal(r.status,prior);
    }
    previous=new Map(s.records.map(r=>[r.id,r.status]));
  }
  const final=stateAt(47_000);assert.deepEqual(final.counts,{pass:31,fail:6,untested:0,tested:37,total:37});
  assert.equal(stateAt(11_200).result,'pass');assert.equal(stateAt(21_200).result,'fail');
});

test('signals only exist while electrical contact is established; compare limits agree with results',()=>{
  for(let t=0;t<=DURATION_MS;t+=31.17){
    const s=stateAt(t);
    if(s.signalMode!=='idle')assert.equal(s.contact,true);
    if(s.recordWritten){
      const inRange=s.measurement.value>=s.measurement.limits[0]&&s.measurement.value<=s.measurement.limits[1];
      assert.equal(s.result,inRange?'pass':'fail');
    }
  }
});

test('all transition boundaries are position and height continuous',()=>{
  for(const time of BOUNDARIES.filter(t=>t>0&&t<DURATION_MS)){
    const a=stateAt(time-.0001),b=stateAt(time+.0001);
    almost(a.position.x,b.position.x,1e-5);almost(a.position.y,b.position.y,1e-5);almost(a.z,b.z,1e-5);
  }
});

test('seek results do not depend on call order or mutated previous records',()=>{
  const reference=[...BOUNDARIES,21_200,8_900,47_000].map(t=>[t,stateAt(t)]);
  for(const [t,expected]of reference.reverse())assert.deepEqual(stateAt(t),expected);
  const old=stateAt(21_200);old.records[0].status='invented';old.measurement.limits[0]=-999;
  assert.equal(stateAt(21_200).records[0].status,'pass');assert.equal(stateAt(21_200).measurement.limits[0],.9);
});

test('loop reset happens behind a fully opaque seam, without undoing visible test results',()=>{
  const end=stateAt(DURATION_MS),start=stateAt(0);
  assert.equal(end.cycleReset.opacity,1);assert.equal(start.cycleReset.opacity,1);
  assert.equal(end.waferOpacity,0);assert.equal(start.waferOpacity,0);
  assert.equal(end.counts.tested,37);assert.equal(start.counts.tested,0);
  assert.equal(start.contact,false);assert.equal(end.contact,false);
  assert.equal(stateAt(53_600).cycleReset.opacity,1);
  assert.equal(stateAt(600).cycleReset.opacity,0);
});

test('invalid input is bounded and every sampled state is finite',()=>{
  assert.equal(stateAt(-1).tMs,0);assert.equal(stateAt(Infinity).tMs,0);
  assert.equal(stateAt(1e20).tMs,DURATION_MS);
  for(const t of BOUNDARIES){const s=stateAt(t);assert.ok(Number.isFinite(s.position.x+s.position.y+s.z));assert.ok(s.z>=0&&s.z<=1);}
});
