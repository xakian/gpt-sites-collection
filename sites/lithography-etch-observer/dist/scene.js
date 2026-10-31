import {layoutFor} from './layout.js';
const NS='http://www.w3.org/2000/svg';
export function createScene(svg){
 let L,nodes={},previousSize='';
 const add=(tag,attrs={},parent=svg)=>{const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);parent.append(n);if(attrs.id)nodes[attrs.id]=n;return n;};
 const attrs=(id,values)=>{for(const [k,v] of Object.entries(values))nodes[id].setAttribute(k,String(v));};
 const visible=(id,a)=>{attrs(id,{opacity:a});nodes[id].style.visibility=a>.001?'visible':'hidden';};
 const label=(id,text,x,y,cls='fine-label',parent=svg,anchor='start')=>{const n=add('text',{id,x,y,class:cls,'font-size':cls==='fine-label'?L.small:L.font,'text-anchor':anchor},parent);n.textContent=text;return n;};
 function build(width,height){
  L=layoutFor(width,height);svg.replaceChildren();nodes={};svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
  const title=add('title');title.textContent='微影到蝕刻：追蹤同一個晶圓局部剖面';const desc=add('desc');desc.textContent='灰色矽基板、淡藍二氧化矽與淡紫正型光阻。曝光改變光阻性質，顯影開出窗口，蝕刻移除窗口下方薄膜，去膠後薄膜圖案仍在。';
  const defs=add('defs'),pattern=add('pattern',{id:'latent-dots',width:8,height:8,patternUnits:'userSpaceOnUse'},defs);add('circle',{cx:2,cy:2,r:1,fill:'#7D6E9A'},pattern);
  const grain=add('pattern',{id:'silicon-grain',width:18,height:18,patternUnits:'userSpaceOnUse'},defs);add('path',{d:'M0 18L18 0',stroke:'#B9C4C9','stroke-width':.45,opacity:.5},grain);
  label('view-label','晶圓局部剖面 · 示意比例',L.x,20);
  const sample=add('g',{id:'sample'});
  add('rect',{id:'silicon',x:L.x,y:L.siliconY,width:L.w,height:L.siliconH,class:'silicon outline'},sample);
  add('rect',{x:L.x,y:L.siliconY,width:L.w,height:L.siliconH,fill:'url(#silicon-grain)'},sample);
  add('path',{id:'sample-mark',d:`M${L.x+8} ${L.siliconY+L.siliconH-12}h16v-7`,class:'lead'},sample);
  for(const [id,x,w] of [['film-left',L.x,L.left-L.x],['film-center',L.left,L.gap],['film-right',L.right,L.x+L.w-L.right]])add('rect',{id,x,y:L.filmY,width:w,height:L.filmH,class:'film'},sample);
  add('path',{id:'film-outline',class:'outline',fill:'none'},sample);
  for(const [id,x,w] of [['resist-left',L.x,L.left-L.x],['resist-center',L.left,L.gap],['resist-right',L.right,L.x+L.w-L.right]])add('rect',{id,x,y:L.filmY,width:w,height:0,class:'resist'},sample);
  add('path',{id:'resist-outline',class:'outline',fill:'none'},sample);
  add('rect',{id:'latent-area',x:L.left,y:L.resistY,width:L.gap,height:L.resistH,fill:'url(#latent-dots)'},sample);
  const materialLabels=add('g',{id:'material-labels'},sample);
  for(const [id,text,y] of [['silicon-label','矽基板',L.siliconY+L.siliconH/2],['film-label','二氧化矽',L.filmY+L.filmH/2],['resist-label','正型光阻',L.resistY+L.resistH/2]]){
   label(id,text,L.labelX,y+6,'material-label',materialLabels);
   if(!L.compact)add('path',{id:id+'-lead',d:`M${L.x+L.w+6} ${y}h12`,class:'lead'},materialLabels);
  }
  const optical=add('g',{id:'optical'}),maskGap=L.gap*1.45,maskLeft=L.cx-maskGap/2;
  add('rect',{x:L.x,y:L.maskY,width:L.w,height:13,fill:'#E4ECF0',class:'outline'},optical);
  add('rect',{x:L.x,y:L.maskY+7,width:maskLeft-L.x,height:6,fill:'#73828E'},optical);
  add('rect',{x:L.cx+maskGap/2,y:L.maskY+7,width:L.x+L.w-L.cx-maskGap/2,height:6,fill:'#73828E'},optical);
  add('ellipse',{cx:L.cx,cy:L.maskY+L.lensOffset,rx:maskGap*.7,ry:7,fill:'#E7F0F4','fill-opacity':.6,stroke:'#94A7B3','stroke-width':1},optical);
  label('mask-label','光罩',L.x+L.w,L.maskY-10,'tool-label',optical,'end').setAttribute('font-size',L.font);
  label('optics-label','簡化投影',L.compact?L.x:L.cx+maskGap*.7+18,L.maskY+L.lensOffset+5,'fine-label',optical);
  const light=add('g',{id:'light-field'},optical);
  add('path',{d:`M${maskLeft} ${L.maskY+14}H${maskLeft+maskGap}L${L.right} ${L.resistY}H${L.left}Z`,class:'light',opacity:.28},light);
  for(let i=0;i<5;i++){const u=(i+.5)/5;add('path',{d:`M${maskLeft+maskGap*u} ${L.maskY+14}L${L.left+L.gap*u} ${L.resistY}`,stroke:'#D4AE53','stroke-width':1,opacity:.65},light);}
  label('latent-label','受光區',L.cx,L.resistY-12,'tool-label',svg,'middle');
  const nozzle=add('g',{id:'nozzle'}),nozzleY=Math.max(28,L.resistY-111);add('path',{d:`M${L.cx-15} ${nozzleY}h30v28l-11 12h-8l-11-12z`,fill:'#E2EAF0',class:'outline'},nozzle);add('path',{id:'coat-stream',d:`M${L.cx} ${nozzleY+41}V${L.resistY-3}`,stroke:'#C7BDD9','stroke-width':5,'stroke-linecap':'round'},nozzle);label('coat-label','塗佈',L.cx+28,nozzleY+33,'tool-label',nozzle);
  const bake=add('g',{id:'bake'});for(let i=0;i<3;i++)add('path',{d:`M${L.cx-22+i*22} ${L.resistY-20}q-8 -12 0 -24t0 -24`,stroke:'#B79B75',fill:'none','stroke-width':1.5},bake);label('bake-label','軟烤',L.cx+54,L.resistY-37,'tool-label',bake);
  add('path',{id:'fluid',class:'fluid','fill-opacity':.38,stroke:'#A2BDC9','stroke-width':1});
  label('developer-label','顯影、沖洗',L.cx,L.resistY-63,'tool-label',svg,'middle');
  const plasma=add('g',{id:'plasma'}),plasmaY=Math.max(55,L.resistY-90);add('ellipse',{cx:L.cx,cy:plasmaY,rx:Math.min(L.w*.35,280),ry:17,fill:'#D6DCEB','fill-opacity':.5},plasma);label('plasma-label','乾式蝕刻',L.cx,plasmaY-31,'tool-label',plasma,'middle').setAttribute('font-size',L.font);
  for(let i=0;i<7;i++)add('path',{id:'reaction-'+i,class:'reaction'},plasma);
  const output=add('g',{id:'outflow'});for(let i=0;i<7;i++)add('path',{id:'output-'+i,stroke:'#98ACB9','stroke-width':1.3,'stroke-linecap':'round'},output);
  const stripGroup=add('g',{id:'strip-tool'});label('strip-label','去除剩餘光阻',L.cx,L.resistY-65,'tool-label',stripGroup,'middle').setAttribute('font-size',L.font);add('path',{d:`M${L.x+12} ${L.resistY-30}H${L.x+L.w-12}`,stroke:'#C8BCCF','stroke-width':1,'stroke-dasharray':'3 7'},stripGroup);
  label('window-label','薄膜仍完整',L.cx,L.resistY+L.resistH*.5,'tool-label',svg,'middle');
  label('result-label','圖案留在薄膜中',L.cx,L.resistY-36,'tool-label',svg,'middle').setAttribute('font-size',L.font);
  label('exit-label','完成樣品 →',L.width-16,Math.min(L.height-15,L.siliconY+L.siliconH+30),'fine-label',svg,'end');
 }
 function render(state,width,height){
  if(previousSize!==width+'x'+height){build(width,height);previousSize=width+'x'+height;}
  const s=state,shift=s.offset*(L.width+80),h=L.resistH*s.resist,ch=L.resistH*s.centerResist,fh=L.filmH*s.filmCenter;
  attrs('sample',{transform:`translate(${shift} 0)`,'data-sample-visible':s.sampleVisible,'data-sample-phase':s.exit>0?'out':s.entry<1?'in':'processing'});
  attrs('film-center',{y:L.siliconY-fh,height:fh});
  attrs('film-outline',{d:`M${L.x} ${L.siliconY}V${L.filmY}H${L.left}V${L.siliconY-fh}H${L.right}V${L.filmY}H${L.x+L.w}V${L.siliconY}`});
  attrs('resist-left',{y:L.filmY-h,height:h});attrs('resist-right',{y:L.filmY-h,height:h});attrs('resist-center',{y:L.filmY-ch,height:ch});
  attrs('resist-outline',{d:h>.01?`M${L.x} ${L.filmY}V${L.filmY-h}H${L.left}V${L.filmY-ch}H${L.right}V${L.filmY-h}H${L.x+L.w}V${L.filmY}`:''});
  attrs('latent-area',{y:L.filmY-ch,height:ch});visible('latent-area',s.latent);
  visible('resist-label',h>15?1:0);if(!L.compact)visible('resist-label-lead',h>15?1:0);
  attrs('resist-label',{y:L.filmY-h/2+6});if(!L.compact)attrs('resist-label-lead',{d:`M${L.x+L.w+6} ${L.filmY-h/2}h12`});
  visible('optical',s.optical);visible('light-field',s.light);visible('latent-label',s.expose>.05&&s.develop<.1&&s.t<12000?1:0);
  visible('nozzle',s.nozzle);attrs('coat-stream',{d:`M${L.cx} ${Math.max(28,L.resistY-111)+41}V${L.filmY-h-2}`});visible('bake',s.bake);
  visible('fluid',s.developer);attrs('fluid',{d:`M${L.x} ${L.resistY-43}Q${L.cx} ${L.resistY-49+Math.sin(s.t/450)*3} ${L.x+L.w} ${L.resistY-43}V${L.filmY}H${L.x}Z`});
  visible('developer-label',s.developer);visible('plasma',s.plasma);visible('strip-tool',s.stripper);
  for(let i=0;i<7;i++){const x=L.x+L.w*(i+1)/8,start=L.resistY-67+(s.t/60+i*9)%29;attrs('reaction-'+i,{d:`M${x} ${start}v14m-3 -4 3 4 3 -4`});}
  const moving=(s.develop>.001&&s.develop<.999)||(s.etch>.001&&s.etch<.999)||(s.strip>.001&&s.strip<.999);visible('outflow',moving?1:0);
  for(let i=0;i<7;i++){const p=((s.t/1000+i*.17)%1),side=i%2?1:-1,origin=s.index===4?L.siliconY-fh:s.index===5?L.filmY-h:L.filmY-ch;
   const originX=s.index===5?L.cx+side*(L.gap/2+(L.w-L.gap)*.2):L.cx;
   const x=originX+side*(L.gap*.1+p*L.gap*.2),y=origin-p*(L.resistH+L.filmH+25);attrs('output-'+i,{d:`M${x} ${y}l${side*5} -3`,opacity:(1-p)*.75});}
  visible('window-label',s.develop>.99&&s.etch<.001?1:0);visible('result-label',s.t>=27000&&s.t<30200?1:0);visible('exit-label',s.exit>0?1:0);
  return L;
 }
 return{render};
}
