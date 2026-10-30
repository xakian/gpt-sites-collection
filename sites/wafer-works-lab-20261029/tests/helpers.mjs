import assert from 'node:assert/strict';
import {Engine,createWorld,validateWorld} from '../dist/core.mjs';
import {port} from '../dist/navigation.mjs';
export const positions=[[5,5],[9,5],[13,5],[17,5],[17,10]];
export function command(e,q){const r=e.dispatch(q);assert.ok(r.ok,`${q.type}: ${r.message}`);if(r.pending)e.advance(15);return r;}
export function walk(e,p){assert.ok(e.go('player',p).ok);let n=0;while(e.paths.player&&n++<12000)e.tick();assert.ok(n<12000,'path completes');}
export function approach(e,m){walk(e,port(m));}
export function setup(){const e=new Engine();command(e,{type:'accept',template:'tutorial'});for(const [n,definition] of ['dep','litho','etch','clean','inspect'].entries())command(e,{type:'place',definition,x:positions[n][0],y:positions[n][1],rotation:0});for(const definition of ['dep','litho','etch','clean'])command(e,{type:'purchase',definition,quantity:5});command(e,{type:'purchase',definition:'wafer'});e.advance(600);return e;}
export function fetch(e,definition){walk(e,{x:2.5,y:3.5});const i=Object.values(e.w.items).find(i=>i.definitionId===definition&&i.location.type==='storage'&&i.location.id==='warehouse');assert.ok(i,'item available '+definition);command(e,{type:'pickup',item:i.id});return i;}
export function supplies(e){for(const type of ['dep','litho','etch','clean']){fetch(e,type);const m=Object.values(e.w.machines).find(m=>m.definitionId===type);approach(e,m);command(e,{type:'refill',target:m.id});}fetch(e,'mask');const m=Object.values(e.w.machines).find(m=>m.definitionId==='litho');approach(e,m);command(e,{type:'install',target:m.id});}
export function manualLot(e,fast=false){const i=fetch(e,'wafer');for(const m of Object.values(e.w.machines)){approach(e,m);command(e,{type:'load',target:m.id});if(m.definitionId==='litho')command(e,{type:'selectRecipe',target:m.id,recipe:fast?'litho.fast':'litho.standard'});command(e,{type:'start',target:m.id});e.advance(e.w.jobs[m.job].remaining);assert.equal(m.phase,'DONE');command(e,{type:'unload',item:i.id,target:m.id});validateWorld(e.w,e.c);}walk(e,{x:20.5,y:3.5});command(e,{type:'ship',item:i.id,confirm:true});return e.w.lots[i.lotId];}
