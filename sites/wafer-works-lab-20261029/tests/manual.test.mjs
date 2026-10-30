import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine,validateWorld,metrics,clone} from '../dist/core.mjs';
import {port,distance} from '../dist/navigation.mjs';
import {setup,supplies,manualLot,fetch,command,approach,walk} from './helpers.mjs';
test('M0 content and initial invariants',()=>{const e=new Engine();assert.ok(validateWorld(e.w));assert.equal(e.w.cash,2000);});
test('T01 T02 T03 T17 T23 T24 movement pickup drop capacity placement',()=>{
 const e=setup(),i=Object.values(e.w.items).find(i=>i.kind==='wafer_lot');assert.equal(e.dispatch({type:'pickup',item:i.id}).code,'OUT_OF_REACH');
 fetch(e,'wafer');assert.equal(e.w.actors.player.carried,i.id);assert.equal(e.dispatch({type:'pickup',item:'I0001'}).code,'HANDS_FULL');
 command(e,{type:'drop'});assert.equal(i.location.type,'ground');command(e,{type:'pickup',item:i.id});assert.equal(e.w.actors.player.carried,i.id);
 const cash=e.w.cash;assert.equal(e.dispatch({type:'place',definition:'dep',x:1,y:1,rotation:0}).ok,false);assert.equal(e.w.cash,cash);
 const p=e.w.actors.player;walk(e,{x:5.5,y:7.5});e.advance(180,{x:0,y:-1});assert.ok(p.y>=7.25-1e-6);walk(e,{x:10.5,y:14.5});let a={x:p.x,y:p.y};e.advance(60,{x:1,y:1});assert.ok(Math.abs(distance(a,p)-3)<1e-6);assert.ok(validateWorld(e.w));
});
test('M2 T04 T05 T06 T07 T09 T19 T21 T22 exact single deposit',()=>{
 const e=setup(),i=fetch(e,'wafer'),m=e.w.machines.M0001;approach(e,m);command(e,{type:'load',target:m.id});const cash=e.w.cash;
 assert.equal(e.dispatch({type:'start',target:m.id}).code,'MATERIAL_SHORTAGE');assert.equal(e.w.cash,cash);
 fetch(e,'dep');approach(e,m);command(e,{type:'refill',target:m.id});assert.equal(m.tanks.filmA,5);command(e,{type:'start',target:m.id,commandId:'once'});assert.equal(e.dispatch({type:'start',target:m.id,commandId:'once'}).code,'ALREADY_APPLIED');assert.equal(m.tanks.filmA,4);assert.equal(e.w.cash,cash-6);
 assert.equal(e.dispatch({type:'moveMachine',target:m.id,x:5,y:10,rotation:0}).code,'BUSY');const j=e.w.jobs[m.job];e.advance(1500);assert.equal(e.w.lots[i.lotId].cursor,1);assert.equal(e.w.lots[i.lotId].history.length,1);assert.equal(e.completeJob(j).code,'ALREADY_APPLIED');command(e,{type:'unload',target:m.id,item:i.id});approach(e,e.w.machines.M0003);assert.equal(e.dispatch({type:'load',target:'M0003'}).code,'WRONG_STAGE');assert.ok(validateWorld(e.w));
});
test('M3 T10 T16 T20 T28 manual command end-to-end from new resources',()=>{
 const e=setup();supplies(e);const l=manualLot(e);assert.equal(e.w.cash,540);assert.equal(l.productionCost,100);assert.equal(l.history.length,5);assert.equal(l.inspection.good,20);assert.equal(l.disposition,'shipped');assert.equal(e.w.machines.M0002.tool,'I0001');assert.equal(e.w.shipments[0].income,300);assert.equal(e.dispatch({type:'ship',item:l.itemId,confirm:true}).ok,false);assert.equal(e.w.cash,540);assert.ok(validateWorld(e.w));
});
