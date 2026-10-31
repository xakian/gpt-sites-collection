import {createShell,ObserverPlayer} from './shared/observer.js';
import {DURATION,STAGES,stateAt,siteState,reactionTime,clamp} from './model.js';
import {layout,linePath,surfacePoint} from './layout.js';
const shell=createShell({title:'原子層沉積（ALD）：薄膜怎麼沿著凹槽長出來？',sceneLabel:'氧化鋁 ALD 凹槽剖面，依序觀察 TMA、清除、水蒸氣、清除與薄膜累積'});
const ns='http://www.w3.org/2000/svg';
const make=(tag,attrs,parent=shell.svg)=>{const el=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);parent.append(el);return el;};
const set=(el,attrs)=>{for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);};
const label=(parent,x,y,text,cls='svg-text',anchor='start')=>{const el=make('text',{x,y,class:cls,'text-anchor':anchor},parent);el.textContent=text;return el;};
const defs=make('defs',{});
defs.innerHTML='<pattern id="substrate-hatch" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 10L10 0" stroke="#9eafb8" stroke-width=".65" opacity=".22"/></pattern>';
const head=make('g',{}),specimen=make('g',{}),gas=make('g',{}),annotations=make('g',{});
let g,siteEls=[],filmEls=[],gasEls=[],inletLabel,cycleLabel,notice,filmOutline,player;
function molecule(parent,type){
 const group=make('g',{},parent);
 if(type==='tma'){
  for(const [x,y] of [[-5,-4],[5,-4],[0,6]]){make('path',{d:`M0 0L${x} ${y}`,stroke:'#9d769b','stroke-width':1.4},group);make('circle',{cx:x,cy:y,r:2.8,fill:'#d9bbc6',stroke:'#ad879a','stroke-width':.6},group);}
  make('circle',{r:3.7,fill:'#af85b3',stroke:'#765c85','stroke-width':.8},group);
 }else if(type==='water'){
  make('path',{d:'M-4 -3L0 1L4 -3',fill:'none',stroke:'#6a9eac','stroke-width':2.3,'stroke-linecap':'round'},group);make('circle',{cy:1,r:3.2,fill:'#93bfca',stroke:'#598d9c','stroke-width':.7},group);
 }else{
  make('path',{d:'M0 -6V6M-6 0H6',stroke:'#95a0a7','stroke-width':1.5},group);make('circle',{r:3,fill:'#f7f9fa',stroke:'#8c99a2','stroke-width':1.1},group);
 }
 return group;
}
function rebuild(){
 const rect=shell.host.getBoundingClientRect();g=layout(rect.width,rect.height);set(shell.svg,{viewBox:`0 0 ${g.w} ${g.h}`});
 [head,specimen,gas,annotations].forEach(el=>el.replaceChildren());
 inletLabel=label(head,g.x,26,'');cycleLabel=label(head,g.x+g.width,26,'','svg-caption','end');
 make('path',{d:`M${g.x} 68H${g.x+40}m-7 -4l7 4-7 4`,class:'svg-line'},head);
 make('path',{d:`M${g.outlet[0]-25} 68H${g.outlet[0]+12}m-7 -4l7 4-7 4`,class:'svg-line'},head);
 label(head,g.outlet[0]+10,52,'排氣','svg-small','end');
 const d=linePath([...g.points,[g.x+g.width,g.base],[g.x,g.base]])+'Z';
 make('path',{d,fill:'#dbe4e9',stroke:'#91a3ae','stroke-width':1.2},specimen);make('path',{d,fill:'url(#substrate-hatch)'},specimen);
 filmEls=g.vertices.slice(1).map(()=>make('path',{fill:'#c4afd6',stroke:'#c4afd6','stroke-width':.5},specimen));
 filmOutline=make('path',{fill:'none',stroke:'#8e78a7','stroke-width':1.3},specimen);
 siteEls=g.sites.map(site=>{
  const el=make('g',{},specimen),oh=make('g',{},el),al=make('g',{},el);
  make('path',{d:`M0 0L${site.nx*9} ${site.ny*9}`,stroke:'#689ba8','stroke-width':1.5},oh);make('circle',{cx:site.nx*9,cy:site.ny*9,r:2.4,fill:'#a8ced6',stroke:'#689ba8','stroke-width':.65},oh);
  make('path',{d:`M0 0L${site.nx*7} ${site.ny*7}`,stroke:'#8d6c9e','stroke-width':1.6},al);make('circle',{cx:site.nx*7,cy:site.ny*7,r:3.6,fill:'#b08cb9',stroke:'#7c608e','stroke-width':.8},al);
  for(const k of [-1,1])make('circle',{cx:site.nx*13+site.ny*k*3.3,cy:site.ny*13-site.nx*k*3.3,r:2.4,fill:'#d8bac7',stroke:'#ad879a','stroke-width':.6},al);
  return{el,oh,al};
 });
 label(specimen,g.x+12,g.base-10,'基板','svg-text');
 label(annotations,(g.left+g.right)/2,g.top-22,'凹槽','svg-caption','middle');
 notice=label(annotations,g.w/2,Math.max(g.base+22,g.h-11),'','surface-label','middle');
 gasEls=[];
 for(let i=0;i<g.sites.length;i++)gasEls.push({a:molecule(gas,'tma'),b:molecule(gas,'water'),byA:molecule(gas,'methane'),byB:molecule(gas,'methane')});
 for(let i=0;i<8;i++)gasEls.push({a:molecule(gas,'tma'),b:molecule(gas,'water')});
 if(player)player.redraw();
}
function pos(el,x,y,opacity=1){set(el,{transform:`translate(${x} ${y})`,opacity:clamp(opacity)});}
function pathPoint(points,f){const p=clamp(f)*(points.length-1),i=Math.min(points.length-2,Math.floor(p)),q=p-i;return[points[i][0]+(points[i+1][0]-points[i][0])*q,points[i][1]+(points[i+1][1]-points[i][1])*q];}
function incoming(el,site,p,r,layer){
 const f=(p-(r-1.0))/1.0;
 if(f<0||f>1){set(el,{opacity:0});return;}
 const pt=surfacePoint(site,layer,g),target=[pt[0]+site.nx*8,pt[1]+site.ny*8],cx=(g.left+g.right)/2;
 const approach=site.depth>.05?[cx+(site.index%2?12:-12),g.top-15]:[target[0],g.top-40];
 const route=[g.inlet,[cx-30,82],approach,[target[0]+site.nx*14,target[1]+site.ny*14],target];
 pos(el,...pathPoint(route,f),Math.min(1,f*8));
}
function byproduct(el,site,p,r,layer){
 const f=(p-r-.12)/2.35;
 if(f<0||f>=1){set(el,{opacity:0});return;}
 const pt=surfacePoint(site,layer,g),start=[pt[0]+site.nx*12,pt[1]+site.ny*12],cx=(g.left+g.right)/2;
 const route=[start,[site.depth>.05?cx:start[0]+15,start[1]-18],[cx+30,g.top-40],g.outlet];
 pos(el,...pathPoint(route,f),Math.min(1,f*12,(1-f)*10));
}
rebuild();
function render(frame){
 const s=stateAt(frame.local);set(specimen,{transform:`translate(${s.shift*(g.w+g.width)} 0)`});
 const states=g.vertices.map(v=>siteState(s,v)),offsets=g.vertices.map((v,i)=>[v.x+v.nx*states[i].thickness*g.layer,v.y+v.ny*states[i].thickness*g.layer]);
 filmEls.forEach((el,i)=>set(el,{d:linePath([[g.vertices[i].x,g.vertices[i].y],[g.vertices[i+1].x,g.vertices[i+1].y],offsets[i+1],offsets[i]])+'Z',opacity:states[i].thickness+states[i+1].thickness>0?1:0}));
 set(filmOutline,{d:linePath(offsets),opacity:s.completed||s.phase===2||s.phase===3?1:0});
 siteEls.forEach((els,i)=>{const v=g.sites[i],state=siteState(s,v),pt=surfacePoint(v,state.thickness*g.layer,g);set(els.el,{transform:`translate(${pt[0]} ${pt[1]})`});set(els.al,{opacity:state.al});set(els.oh,{opacity:state.oh});});
 gasEls.forEach(els=>Object.values(els).forEach(el=>set(el,{opacity:0})));
 if(s.kind==='react'){
  // Each gas and its byproduct persist into their own purge, never the next pulse.
  const isA=s.phase<2,p=isA?s.u:s.u-7;
  g.sites.forEach((site,i)=>{const els=gasEls[i],r=reactionTime(site);incoming(isA?els.a:els.b,site,p,r,s.completed*g.layer);byproduct(isA?els.byA:els.byB,site,p,r,(s.completed+(isA?0:.5))*g.layer);});
  for(let i=0;i<8;i++){
   const f=(p-(2.8+i*.23))/2.5;
   if(f<0||f>=1)continue;
   const cx=(g.left+g.right)/2,depth=(i%3)/3;
   const route=[g.inlet,[cx-25,90],[cx+(i%2?12:-12),g.top+depth*(g.bottom-g.top)-20],[cx+30,90],g.outlet];
   pos(isA?gasEls[g.sites.length+i].a:gasEls[g.sites.length+i].b,...pathPoint(route,f),Math.min(1,f*10,(1-f)*10));
  }
 }
 const names=['TMA · 三甲基鋁','N₂ · 清除','H₂O · 水蒸氣','N₂ · 清除'];
 inletLabel.textContent=s.kind==='react'?names[s.phase]:s.kind==='intro'?'準備好的表面':s.kind==='hold'?'氧化鋁 Al₂O₃':s.kind==='exit'?'完成基板退場':'新基板進場';
 cycleLabel.textContent=s.kind==='entry'||s.kind==='intro'?'3 循環示範':`循環 ${Math.min(3,s.cycle+1)} / 3`;
 notice.textContent=s.kind==='react'?(s.phase===1?'已結合的含鋁物種留下':s.phase===3?'薄膜留下 · 準備下一循環':s.p>4.1?'表面已飽和':s.phase===0?'氣體到達 → 表面結合':'表面反應 → 氧化鋁生成'):s.kind==='hold'?'沿平面、側壁與底部覆蓋':s.kind==='intro'?'–OH 反應端基 · 膜厚與分子放大':'';
 shell.svg.dataset.phase=String(s.phase);shell.svg.dataset.cycle=String(s.cycle);shell.svg.dataset.time=String(frame.local);
 return{title:s.kind==='react'?`${s.cycle+1}/3 · ${['TMA 表面反應','清除多餘氣體','水蒸氣表面反應','再次清除'][s.phase]}`:s.kind==='intro'?'基板就位':s.kind==='hold'?'三循環完成':s.kind==='exit'?'完成基板退場':'新基板進場',index:s.stage,count:STAGES.length};
}
player=new ObserverPlayer({shell,durationMs:DURATION,overviewMs:45000,restartFromOverview:true,render,onInfo:()=>{chooseStep(stateAt(player.lastFrame.local).stage);player.openPanel();},qa:location.hostname==='127.0.0.1'||location.hostname==='localhost'});
new ResizeObserver(rebuild).observe(shell.host);
const select=shell.get('step-select');STAGES.forEach((s,i)=>{const option=document.createElement('option');option.value=i;option.textContent=s.title;select.append(option);});
function chooseStep(i){select.value=String(i);shell.get('step-what').textContent=STAGES[i].what;shell.get('step-detail').textContent=STAGES[i].detail;}
select.addEventListener('change',()=>chooseStep(Number(select.value)));
shell.get('seek-step').addEventListener('click',()=>{player.seek(STAGES[Number(select.value)].time);player.closePanel();});
chooseStep(0);
