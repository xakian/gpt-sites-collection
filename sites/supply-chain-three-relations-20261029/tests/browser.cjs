// Optional browser acceptance suite. Set PLAYWRIGHT_MODULE to an installed Playwright module.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.QA_URL||'http://127.0.0.1:4173';
const out=path.resolve(process.env.QA_OUTPUT||'qa-local');fs.mkdirSync(out,{recursive:true});
const log=[];const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function record(name,data={}){log.push({name,...data});console.log(JSON.stringify({name,...data}));fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(log,null,2));}
const launch={headless:true,...(process.env.QA_BROWSER?{executablePath:process.env.QA_BROWSER}:{})};
(async()=>{
 const browser=await chromium.launch(launch);
 async function make(viewport={width:1440,height:900},reducedMotion='no-preference'){
  const ctx=await browser.newContext({viewport,reducedMotion});
  const p=await ctx.newPage();p.on('pageerror',e=>record('PAGE_ERROR',{error:String(e)}));
  await p.addInitScript(()=>{
   window.qaRaf={active:new Set(),max:0};const request=window.requestAnimationFrame,cancel=window.cancelAnimationFrame;
   window.requestAnimationFrame=function(cb){let id;const owned=cb.name==='frame';id=request.call(window,now=>{if(owned)qaRaf.active.delete(id);cb(now);});if(owned){qaRaf.active.add(id);qaRaf.max=Math.max(qaRaf.max,qaRaf.active.size);}return id;};
   window.cancelAnimationFrame=function(id){qaRaf.active.delete(id);return cancel.call(window,id);};
  });
  await p.goto(base);await p.waitForFunction(()=>!!window.SCPlayer);return {ctx,p};
 }
 async function snapshot(p){return p.evaluate(()=>({model:SCPlayer.state().model,svg:document.querySelector('#scene').outerHTML,lot:document.querySelector('#lot_A').getAttribute('transform')}));}
 async function fullCycle(width,height,speed){
  const {ctx,p}=await make({width,height});const tag=`${width}-${speed}x`;
  await p.selectOption('#speed',String(speed));await p.evaluate(()=>{SCPlayer.seek(0);SCPlayer.play();});
  const start=Date.now();const times=[3,4.5,6,8.5,10.5,13.5,17.5,20,22,24,26,29,31.2,31.5,31.8];
  for(const target of times){await p.waitForFunction(t=>SCPlayer.state().t>=t,target,{polling:25,timeout:70000});const s=await p.evaluate(()=>SCPlayer.state());await p.screenshot({path:path.join(out,`${tag}-${target}.png`)});assert.equal(s.nodeCount,width<760?126:127);assert.equal(await p.locator('#lot_A').count(),1);}
  await p.waitForFunction(()=>SCPlayer.state().cycles>=1,null,{polling:20,timeout:5000});await p.evaluate(()=>SCPlayer.pause());
  const elapsed=(Date.now()-start)/1000;assert.ok(Math.abs(elapsed-32/speed)<1.5,`cycle duration ${elapsed}`);
  const fit=await p.evaluate(()=>({horizontal:document.documentElement.scrollWidth<=innerWidth,controls:document.querySelector('#play').getBoundingClientRect().bottom<=innerHeight,rafMax:qaRaf.max}));assert.ok(fit.horizontal&&fit.controls);assert.equal(fit.rafMax,1);
  record('AC18 complete real-time cycle',{viewport:[width,height],speed,elapsed,...fit});await ctx.close();
 }
 async function stability(){
  const {ctx,p}=await make();await p.selectOption('#speed','2');for(let i=0;i<6;i++)await p.click('#replay');
  const n=await p.evaluate(()=>SCPlayer.state().nodeCount);
  for(let i=1;i<=10;i++){await p.waitForFunction(i=>SCPlayer.state().cycles>=i,i,{polling:100,timeout:20000});const s=await p.evaluate(()=>({n:SCPlayer.state().nodeCount,max:qaRaf.max,lot:document.querySelectorAll('#lot_A').length}));assert.equal(s.n,n);assert.equal(s.max,1);assert.equal(s.lot,1);record('AC21/22 cycle',{cycle:i,...s});}
  await p.evaluate(()=>SCPlayer.destroy());const a=await p.evaluate(()=>SCPlayer.state());await sleep(1100);const b=await p.evaluate(()=>SCPlayer.state());assert.equal(a.t,b.t);assert.equal(b.rafPending,false);await p.click('#replay');assert.equal((await p.evaluate(()=>SCPlayer.state())).t,b.t);
  await p.reload();assert.ok((await p.evaluate(()=>SCPlayer.state())).playing);assert.equal(await p.evaluate(()=>qaRaf.max),1);record('AC22 cleanup and re-entry',{pass:true});await ctx.close();
 }
 async function controls(){
  const {ctx,p}=await make();await p.evaluate(()=>SCPlayer.pause());
  const times=[0,3,4.5,6,8.5,10.5,13.5,16,17.5,19,20,22,24,24.75,26,29,31.2,31.5,31.8,32];
  for(const t of times){await p.evaluate(t=>SCPlayer.seek(t),t);const actual=await p.evaluate(()=>{const s=SCPlayer.state(),vis=id=>getComputedStyle(document.getElementById(id)).display!=='none';return {s,lotCount:document.querySelectorAll('[data-lot-id="A"]').length,docs:['specD','specO','reportD','reportO','releaseD','releaseO','spec-transit','report-transit','release-transit'].map(id=>[id,vis(id)]),opacity:Number(document.getElementById('dynamic').getAttribute('opacity'))};});assert.equal(actual.lotCount,1);assert.equal(actual.opacity,actual.s.model.opacity);for(const [id,visible]of actual.docs){const parts=id.match(/^(spec|report|release)(D|O|-transit)$/);assert.equal(visible,actual.s.model[parts[1]][parts[2]==='-transit'?'transit':parts[2]]);}const one=await snapshot(p);await p.evaluate(()=>SCPlayer.seek(0));await p.evaluate(t=>SCPlayer.seek(t),t);assert.deepEqual(await snapshot(p),one);}
  record('AC01/02/04-10/12/15 direct frames and DOM',{times});
  // Adjacent boundary snapshots include invisible internal reset state.
  const boundaries=[4,10,12,15,16,19,21,23,24.5,25,27.5,31.35,31.5,31.65,32];
  for(const boundary of boundaries)for(const dt of [-.001,0,.001]){const t=Math.max(0,Math.min(32,boundary+dt));await p.evaluate(t=>SCPlayer.seek(t),t);assert.equal((await p.evaluate(()=>SCPlayer.state())).t,t);}
  record('AC15 adjacent boundaries',{boundaries,offsets:[-.001,0,.001]});
  await Promise.all([3,13.5,17.5].map(async t=>{const {ctx:c,p:q}=await make();await q.evaluate(t=>SCPlayer.seek(t),t);const before=await snapshot(q);await sleep(5100);assert.deepEqual(await snapshot(q),before);await c.close();}));record('AC13 five-second pauses',{times:[3,13.5,17.5]});
  for(const speed of [.5,1,1.5,2]){await p.evaluate(()=>{SCPlayer.seek(8);SCPlayer.play();});const phase=await p.evaluate(v=>{const before=SCPlayer.state().t,lot=document.getElementById('lot_A').getAttribute('transform');document.getElementById('speed').value=String(v);document.getElementById('speed').dispatchEvent(new Event('change',{bubbles:true}));return {before,after:SCPlayer.state().t,lot,sameLot:document.getElementById('lot_A').getAttribute('transform')===lot};},speed);assert.equal(phase.before,phase.after);assert.ok(phase.sameLot);const a=await p.evaluate(()=>SCPlayer.state().t);await sleep(1000);const b=await p.evaluate(()=>SCPlayer.state().t);assert.ok(Math.abs((b-a)-speed)<.17);await p.evaluate(()=>SCPlayer.pause());await p.selectOption('#speed',String(speed));assert.equal((await p.evaluate(()=>SCPlayer.state())).playing,false);}
  record('AC14 speeds preserve phase and pause',{speeds:[.5,1,1.5,2]});
  await p.focus('#play');await p.keyboard.press('Space');assert.ok((await p.evaluate(()=>SCPlayer.state())).playing);
  await p.focus('#explain');await p.keyboard.press('Enter');assert.equal((await p.evaluate(()=>SCPlayer.state())).playing,false);assert.equal(await p.evaluate(()=>document.activeElement.id),'close-panel');const panelT=(await p.evaluate(()=>SCPlayer.state())).t;
  await p.locator('summary').filter({hasText:'三題理解檢查'}).focus();await p.keyboard.press('Enter');assert.equal((await p.evaluate(()=>SCPlayer.state())).t,panelT);
  await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>document.activeElement.id),'explain');assert.equal((await p.evaluate(()=>SCPlayer.state())).playing,false);
  await p.keyboard.press('Enter');await p.locator('[data-seek="22"]').focus();await p.keyboard.press('Enter');assert.equal((await p.evaluate(()=>SCPlayer.state())).t,22);
  await p.focus('#panel-play');await p.keyboard.press('Enter');assert.equal(await p.locator('#explanation').isHidden(),true);assert.equal(await p.evaluate(()=>document.activeElement.id),'play');
  await p.focus('#timeline');await p.keyboard.press('ArrowRight');assert.equal((await p.evaluate(()=>SCPlayer.state())).playing,false);
  await p.focus('#speed');await p.keyboard.press('Home');await p.keyboard.press('ArrowDown');await p.keyboard.press('Tab');
  record('AC16/19 keyboard, panel, focus and timeline',{pass:true});
  await p.evaluate(()=>SCPlayer.seek(22));const before=await p.evaluate(()=>SCPlayer.state());await p.setViewportSize({width:390,height:844});await sleep(100);let after=await p.evaluate(()=>SCPlayer.state());assert.equal(after.t,before.t);assert.equal(after.speed,before.speed);assert.deepEqual(after.model,before.model);await p.setViewportSize({width:844,height:390});await sleep(100);after=await p.evaluate(()=>SCPlayer.state());assert.equal(after.t,before.t);assert.deepEqual(after.model,before.model);record('AC17 responsive and orientation state',{pass:true});
  await p.setViewportSize({width:390,height:844});for(const t of [6,22,29]){await p.evaluate(t=>SCPlayer.seek(t),t);await p.screenshot({path:path.join(out,`mobile-final-${t}.png`)});}await p.addStyleTag({content:'html{filter:grayscale(1)}'});await p.evaluate(()=>SCPlayer.seek(6));await p.screenshot({path:path.join(out,'mobile-grayscale-6.png')});record('AC03/11 grayscale and route captures',{pass:true});await ctx.close();
 }
 async function reduced(){
  const {ctx,p}=await make({width:390,height:844},'reduce');let s=await p.evaluate(()=>SCPlayer.state());assert.equal(s.t,29);assert.equal(s.playing,false);await p.click('#play');s=await p.evaluate(()=>SCPlayer.state());assert.ok(s.t<.3&&s.playing);await p.reload();await p.evaluate(()=>SCPlayer.seek(22));await p.click('#play');s=await p.evaluate(()=>SCPlayer.state());assert.ok(s.t>=22&&s.t<22.3);await p.emulateMedia({reducedMotion:'no-preference'});assert.equal((await p.evaluate(()=>SCPlayer.state())).playing,false);await p.click('#play');await sleep(300);await p.emulateMedia({reducedMotion:'reduce'});assert.equal((await p.evaluate(()=>SCPlayer.state())).playing,false);const t=(await p.evaluate(()=>SCPlayer.state())).t;await p.emulateMedia({reducedMotion:'no-preference'});await sleep(200);assert.equal((await p.evaluate(()=>SCPlayer.state())).t,t);record('AC20 reduced motion all branches',{pass:true});await ctx.close();
 }
 const results=await Promise.allSettled([fullCycle(1440,900,1),fullCycle(1440,900,.5),fullCycle(390,844,1),fullCycle(390,844,.5),stability(),controls(),reduced()]);
 results.forEach((r,i)=>{if(r.status==='rejected')record('FAIL',{suite:i,error:r.reason.stack||String(r.reason)});});
 await browser.close();record('suite complete',{passed:results.filter(r=>r.status==='fulfilled').length,total:results.length});if(results.some(r=>r.status==='rejected'))process.exitCode=1;
})().catch(e=>{record('FATAL',{error:e.stack});process.exitCode=1;});
