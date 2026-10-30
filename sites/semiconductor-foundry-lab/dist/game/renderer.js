import {TerrainRenderer} from '../core/terrain-renderer.js';
import {Presentation} from '../core/presentation.js';
import {PALETTE,CONFIG,terrainOffset} from '../core/config.js';
import {visibleTiles,hexToWorld,worldToHex} from '../core/hex.js';
import {buildings,materials} from '../content/index.js';
import {player,footprint,entrance,quantity} from './state.js';
export class FactoryRenderer extends TerrainRenderer {
 constructor(canvas){super(canvas);this.presentation=new Presentation();this.zoom=1.2;this.follow=true;this.motionPreference=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');this.frameSamples=[];}
 resetPresentation(){this.presentation.reset();}
 screen(p){return {x:(p.x-this.camera.x)*this.zoom+this.width/2,y:(p.y-this.camera.y)*this.zoom+this.height/2};}
 pick(x,y){return worldToHex((x-this.width/2)/this.zoom+this.camera.x,(y-this.height/2)/this.zoom+this.camera.y);}
 pan(dx,dy){this.follow=false;this.camera.x-=dx/this.zoom;this.camera.y-=dy/this.zoom;}
 setZoom(v){this.zoom=Math.max(.55,Math.min(2.2,v));}
 mark(p,color,alpha=.22){const c=this.ctx,w=hexToWorld(p.q,p.r);this.hex(w.x,w.y,CONFIG.HEX_SIZE-1);c.fillStyle=color;c.globalAlpha=alpha;c.fill();c.globalAlpha=1;c.strokeStyle=color;c.lineWidth=1.4;c.stroke();}
 draw(s,ui,dt){
  const begin=performance.now(),c=this.ctx;this.resize();this.presentation.update(s,dt,this.motionPreference?.matches);
  if(this.follow){const p=this.presentation.position(player(s),s.grid);this.cameraUpdate({x:p.x,y:p.y+(ui.panelOpen&&this.width<=680?this.height*.16/this.zoom:0)});}
  c.setTransform(this.dpr,0,0,this.dpr,0,0);c.fillStyle=PALETTE.background;c.fillRect(0,0,this.width,this.height);
  c.save();c.translate(this.width/2,this.height/2);c.scale(this.zoom,this.zoom);
  this.boardBackdrop(s.grid);
  const tiles=visibleTiles(s.grid,{left:this.camera.x-this.width/this.zoom/2-80,right:this.camera.x+this.width/this.zoom/2+80,top:this.camera.y-this.height/this.zoom/2-80,bottom:this.camera.y+this.height/this.zoom/2+80});
  this.drawTerrain(tiles,s.grid);
  for(const t of s.tasks){const a=s.actors.find(a=>a.id===t.workerId),b=s.buildings.find(b=>b.id===(t.status==='reserved'?t.source:t.destination));if(!a||!b)continue;const p=this.presentation.position(a,s.grid),q=hexToWorld(entrance(b).q,entrance(b).r);c.beginPath();c.setLineDash([3,5]);c.moveTo(p.x-this.camera.x,p.y-this.camera.y);c.lineTo(q.x-this.camera.x,q.y-this.camera.y);c.strokeStyle='#ae643c55';c.lineWidth=1;c.stroke();c.setLineDash([]);}
  this.mark(player(s),PALETTE.player,.09);
  if(player(s).goal)this.mark(player(s).goal,PALETTE.player,.12);
  for(const b of s.buildings){if(ui.selected===b.id)footprint(b).forEach(p=>this.mark(p,PALETTE.player,.15));const e=entrance(b),w=hexToWorld(e.q,e.r);c.save();c.translate(w.x-this.camera.x,w.y-this.camera.y);c.strokeStyle=ui.selected===b.id?'#087d91':'#80938588';c.lineWidth=1.5;c.beginPath();c.moveTo(6,-4);c.lineTo(-2,0);c.lineTo(6,4);c.stroke();c.restore();}
  const entities=[...s.buildings,...s.actors].sort((a,b)=>hexToWorld(a.q,a.r).y-hexToWorld(b.q,b.r).y);
  for(const e of entities)e.kind==='equipment'?this.equipment(e,s,ui):this.actor(e,s);
  if(ui.placement&&ui.hover){const preview={...ui.hover,type:ui.placement.type};footprint(preview).forEach(p=>this.mark(p,ui.placementValid?'#087d91':'#b56c56',.32));this.mark(entrance(preview),'#a18c57',.2);}
  c.restore();const time=performance.now()-begin;this.frameSamples.push(time);if(this.frameSamples.length>300)this.frameSamples.shift();
 }
 equipment(b,s,ui){
  const c=this.ctx,p=hexToWorld(b.q,b.r),x=p.x-this.camera.x,y=p.y-this.camera.y,def=buildings[b.type];
  c.save();c.translate(x,y);c.fillStyle='#4d604522';c.beginPath();c.ellipse(2,7,25,14,0,0,Math.PI*2);c.fill();
  if(def.shape==='utility'){c.fillStyle='#abb89f';c.fillRect(-15,-8,30,58);c.fillStyle='#d3dbc9';c.fillRect(-15,-20,30,50);for(let i=0;i<3;i++){c.fillStyle='#65775f';c.fillRect(-9,-13+i*13,18,5);}}
  else{
   c.fillStyle=def.shape==='depot'?'#b2a485':def.shape==='dispatch'?'#91aaa1':'#a0b2a6';c.beginPath();c.moveTo(-22,-5);c.lineTo(0,5);c.lineTo(22,-5);c.lineTo(22,12);c.lineTo(0,23);c.lineTo(-22,12);c.closePath();c.fill();
   c.fillStyle=def.shape==='depot'?'#e6d9b8':def.shape==='dispatch'?'#c9ded5':'#e9eee4';c.beginPath();c.moveTo(-22,-5);c.lineTo(0,-17);c.lineTo(22,-5);c.lineTo(0,7);c.closePath();c.fill();c.strokeStyle='#7f9185';c.lineWidth=.8;c.stroke();
   if(def.shape==='process'){c.fillStyle='#7c968c';c.fillRect(-11,-21,22,19);c.fillStyle='#d6e5dd';c.fillRect(-7,-18,14,8);c.fillStyle='#087d91';c.fillRect(-5,-16,10*(b.job?1-b.job.remaining/b.job.duration:0),4);}
   if(def.shape==='inspection'){c.strokeStyle='#4b807b';c.lineWidth=3;c.beginPath();c.moveTo(-11,-5);c.lineTo(-11,-23);c.lineTo(9,-23);c.lineTo(9,-17);c.stroke();c.fillStyle='#8ca6a0';c.beginPath();c.ellipse(2,-3,11,5,0,0,Math.PI*2);c.fill();c.strokeStyle='#d5eee8';c.lineWidth=1;c.beginPath();c.moveTo(9,-17);c.lineTo(2,-6);c.stroke();}
   if(def.shape==='depot'||def.shape==='dispatch'){c.strokeStyle='#778b7c';c.lineWidth=1.4;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-8+i*6,-8);c.lineTo(4+i*6,-2);c.stroke();}}
  }
  if(b.job){c.strokeStyle='#087d91';c.lineWidth=2.5;c.beginPath();c.arc(0,-8,28,-Math.PI/2,-Math.PI/2+Math.PI*2*(1-b.job.remaining/b.job.duration));c.stroke();}
  else if(quantity(b.inventory)){c.fillStyle='#087d91';c.beginPath();c.arc(20,-20,3,0,Math.PI*2);c.fill();}
  c.textAlign='center';c.font='500 9px system-ui';c.fillStyle='#536351';c.fillText(def.label,0,39);
  const items=Object.entries(b.inventory).filter(([,n])=>n>0);if(items.length){c.font='8px system-ui';c.fillStyle='#687966';c.fillText(items.map(([id,n])=>`${materials[id].short}${n}`).join(' · '),0,51);}
  c.restore();
 }
 actor(a,s){
  const c=this.ctx,p=this.presentation.position(a,s.grid),color=a.kind==='player'?PALETTE.player:PALETTE.worker;
  c.save();c.translate(p.x-this.camera.x,p.y-this.camera.y);c.fillStyle=PALETTE.actorShadow;c.beginPath();c.ellipse(1,5,13,7,0,0,Math.PI*2);c.fill();
  c.fillStyle=color;c.beginPath();a.kind==='player'?c.arc(0,-6,11,0,Math.PI*2):(c.moveTo(0,-18),c.lineTo(12,-6),c.lineTo(0,6),c.lineTo(-12,-6));c.closePath();c.fill();c.strokeStyle=PALETTE.actorEdge;c.lineWidth=1.5;c.stroke();
  c.fillStyle='#eef5e9';c.beginPath();c.arc(0,-8,4,0,Math.PI*2);c.fill();
  for(let i=0;i<a.capacity;i++){c.fillStyle=i<quantity(a.inventory)?color:'#edf0e9';c.strokeStyle=color;c.lineWidth=.8;c.fillRect(-8+i*6,-28,4,4);c.strokeRect(-8+i*6,-28,4,4);}
  if(a.kind==='player'){c.fillStyle=color;c.font='9px system-ui';c.textAlign='center';c.fillText('你',0,20);}else if(a.role!=='idle'){c.fillStyle=color;c.font='8px system-ui';c.textAlign='center';c.fillText(a.role==='logistics'?'搬運':'操作',0,20);}
  c.restore();
 }
}
