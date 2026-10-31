import {DIES} from './topic-model.js';
import {M} from './materials.js';
import {sceneLayout} from './layout.js';
const NS='http://www.w3.org/2000/svg';
function element(tag,attrs={},parent){const el=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);if(parent)parent.append(el);return el;}
function set(el,attrs){for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);}
function text(parent,content,x,y,cls='label',anchor='middle'){const el=element('text',{x,y,class:cls,'text-anchor':anchor},parent);el.textContent=content;return el;}
const fmt=n=>String(n).replace('-','−');

export class WaferScene {
  constructor(svg){this.svg=svg;this.width=0;this.height=0;this.lastState=null;}
  resize(width,height){if(width===this.width&&height===this.height)return;this.width=width;this.height=height;this.build();if(this.lastState)this.render(this.lastState);}
  build(){
    const svg=this.svg,L=this.layout=sceneLayout(this.width,this.height);
    svg.replaceChildren();set(svg,{viewBox:`0 0 ${L.w} ${L.h}`,'data-layout':L.mode});
    this.defs=element('defs',{},svg);
    this.main=element('g',{'data-part':'observation'},svg);
    this.physical=this.buildWafer(L.wafer,false);
    this.recordMap=this.buildWafer(L.map,true);
    this.buildContact(L.contact);
    this.overlay=element('g',{'pointer-events':'none'},svg);
    element('rect',{x:0,y:0,width:L.w,height:L.h,fill:M.paper},this.overlay);
    text(this.overlay,'重新觀察同一段示範',L.w/2,L.h/2,'label');
    text(this.overlay,'晶圓保持完整，測試結果保存在位置紀錄中',L.w/2,L.h/2+30,'small');
  }
  buildWafer(b,isMap){
    const g=element('g',{'data-part':isMap?'wafer-map':'physical-wafer'},this.main),r=b.r;
    const titleY=b.short?b.y+18:b.cy-r-30;
    text(g,isMap?'晶圓圖':'實體晶圓',b.cx,titleY,'label');
    if(!b.short)text(g,isMap?'位置紀錄':'尚未切割 · 俯視',b.cx,titleY+19,'small');
    if(!isMap){
      element('circle',{cx:b.cx,cy:b.cy+3,r:r+3,fill:M.chuck,stroke:M.line,'stroke-width':1},g);
    }
    element('circle',{cx:b.cx,cy:b.cy,r,fill:isMap?'#FAFBFC':M.silicon,stroke:isMap?'#C8D3DA':M.line,'stroke-width':1.2},g);
    // Matching notch fixes wafer orientation in both views. It is not a cut die.
    element('path',{d:`M ${b.cx-5} ${b.cy+r-1} Q ${b.cx} ${b.cy+r-12} ${b.cx+5} ${b.cy+r-1}`,fill:M.paper,stroke:M.line,'stroke-width':1},g);
    const pitch=r*.253,sz=pitch*.88,cells=new Map();
    for(const die of DIES){
      const x=b.cx+die.x*pitch-sz/2,y=b.cy+die.y*pitch-sz/2;
      const cell=element('g',{'data-die':die.id},g);
      const rect=element('rect',{x,y,width:sz,height:sz,rx:1,fill:isMap?M.untested:M.die,stroke:isMap?'#D3DDE2':'#9EB3C1','stroke-width':.7},cell);
      if(!isMap){
        element('path',{d:`M ${x+sz*.25} ${y+sz*.25} H ${x+sz*.65} V ${y+sz*.65} H ${x+sz*.4}`,fill:'none',stroke:M.circuit,'stroke-width':.65},cell);
        for(const [px,py] of [[.12,.15],[.72,.15],[.12,.72],[.72,.72]])element('rect',{x:x+sz*px,y:y+sz*py,width:sz*.15,height:sz*.14,fill:M.pad},cell);
      }
      const mark=isMap?text(cell,'',x+sz/2,y+sz*.73,'result-mark'):null;
      if(mark)set(mark,{'font-size':Math.max(10,sz*.72)});
      cells.set(die.id,{cell,rect,mark,x,y,sz});
    }
    const cursor=element('rect',{x:0,y:0,width:sz+4,height:sz+4,rx:2,fill:'none',stroke:M.focus,'stroke-width':2},g);
    const dot=element('circle',{r:2.5,fill:M.focus},g);
    const caption=text(g,'',b.cx,b.cy+r+23,'detail numbers');
    const second=text(g,isMap?'□ 未測　✓ 通過　× 未通過':'同一片矽基板 · 37 顆示意',b.cx,b.cy+r+43,'small');
    if(b.short)set(second,{visibility:'hidden'});
    return{g,b,pitch,sz,cells,cursor,dot,caption,second,isMap};
  }
  buildContact(b){
    const L=this.layout,cx=b.x+b.w/2,compact=b.h<330;
    const top=b.y+(compact?21:Math.max(24,b.h*.07)),titleY=b.y+12;
    const testerW=Math.min(270,b.w*.65),testerH=compact?50:83,ty=compact?b.y+36:top+22;
    const cardY=compact?ty+testerH+22:b.y+b.h*.46;
    const contactY=compact?cardY+Math.max(34,b.h*.16):b.y+b.h*.68;
    const gap=compact?Math.min(18,b.h*.06):Math.min(32,b.h*.09);
    const cellW=b.w*.56,cellH=compact?22:Math.min(36,b.h*.10),pitch=cellW*1.18,rowPitch=cellH*1.25;
    this.geometry={b,cx,cardY,contactY,gap,cellW,cellH,pitch,rowPitch,testerW,testerH,ty};
    const g=this.rig=element('g',{'data-part':'probe-detail'},this.main);
    text(g,'接觸區放大',cx,titleY,'small');
    this.coordLabel=text(g,'',cx,top+10,'detail numbers');
    // ATE and card remain fixed; only wafer/chuck moves in Z, and its pattern in XY.
    element('rect',{x:cx-testerW/2,y:ty,width:testerW,height:testerH,rx:7,fill:'#EDF1F3',stroke:M.line,'stroke-width':1.2},g);
    text(g,'測試機 ATE',cx,ty+(compact?16:19),'label screen-text');
    this.testerStatus=text(g,'等待接觸',cx,ty+(compact?32:39),'detail screen-text');
    this.screenValue=text(g,'',cx,ty+(compact?46:59),'detail numbers screen-text');
    this.measureBand=element('g',{},g);
    const bw=testerW*.40,bx=cx-bw/2;
    element('line',{x1:bx,y1:ty+testerH-12,x2:bx+bw,y2:ty+testerH-12,stroke:'#AABBC4','stroke-width':1},this.measureBand);
    element('rect',{x:bx+bw/6,y:ty+testerH-17,width:bw/3,height:10,fill:M.pass,stroke:'none'},this.measureBand);
    this.valueMark=element('line',{x1:bx,y1:ty+testerH-19,x2:bx,y2:ty+testerH-5,stroke:M.focus,'stroke-width':2},this.measureBand);
    this.valueBar={x:bx,w:bw,y:ty+testerH-12};
    const leftX=cx-b.w*.37,rightX=cx+b.w*.37;
    const wireLeft=`M ${cx-testerW*.34} ${ty+testerH} V ${cardY-10} H ${leftX} V ${cardY+10}`;
    const wireRight=`M ${rightX} ${cardY+10} V ${cardY-10} H ${cx+testerW*.34} V ${ty+testerH}`;
    for(const d of [wireLeft,wireRight])element('path',{d,fill:'none',stroke:'#ACBAC3','stroke-width':1.7},g);
    this.signalIn=element('path',{d:wireLeft,fill:'none',stroke:M.stimulus,'stroke-width':3,'pathLength':100},g);
    this.signalOut=element('path',{d:wireRight,fill:'none',stroke:M.response,'stroke-width':3,'pathLength':100},g);
    element('rect',{x:leftX-14,y:cardY,width:rightX-leftX+28,height:15,rx:2,fill:M.board,stroke:M.boardEdge,'stroke-width':1.1},g);
    for(let i=0;i<7;i++)element('path',{d:`M ${leftX+12+i*(rightX-leftX-24)/6} ${cardY+3} v9`,stroke:'#B4C6BA','stroke-width':1,fill:'none'},g);
    text(g,'探針卡',leftX-13,cardY-13,'label','start');
    const clip=element('clipPath',{id:'wafer-detail-clip'},this.defs);
    element('rect',{x:b.x+7,y:contactY-cellH-7,width:b.w-14,height:cellH*2+gap+42},clip);
    this.movingStage=element('g',{'data-part':'moving-wafer','clip-path':'url(#wafer-detail-clip)'},g);
    this.substrate=element('rect',{x:b.x+8,y:contactY-cellH*.58,width:b.w-16,height:cellH*1.16,fill:M.silicon,stroke:'#91A8B8','stroke-width':1},this.movingStage);
    const surfaceClip=element('clipPath',{id:'wafer-surface-clip'},this.defs);
    this.surfaceClipRect=element('rect',{x:b.x+8,y:contactY-cellH*.58,width:b.w-16,height:cellH*1.16},surfaceClip);
    this.waferSurface=element('g',{'clip-path':'url(#wafer-surface-clip)'},this.movingStage);
    // One continuous substrate under the entire set of die outlines.
    this.largeCells=[];
    for(const d of DIES){
      const tile=element('g',{'data-physical-die':d.id},this.waferSurface);
      element('rect',{x:-cellW/2,y:-cellH/2,width:cellW,height:cellH,fill:M.die,stroke:'#9BB0BE','stroke-width':.85},tile);
      element('path',{d:`M ${-cellW*.25} ${-cellH*.18} H ${cellW*.2} V ${cellH*.20} H ${-cellW*.05} V 0`,fill:'none',stroke:M.circuit,'stroke-width':1},tile);
      for(const[px,py]of[[-.38,-.25],[.38,-.25],[-.38,.25],[.38,.25]])element('rect',{x:cellW*px-6,y:cellH*py-2.5,width:12,height:5,fill:M.pad,stroke:'#AD986A','stroke-width':.7},tile);
      this.largeCells.push({die:d,el:tile});
    }
    this.waferEdge=element('rect',{x:b.x+8,y:contactY+cellH*.58,width:b.w-16,height:7,fill:'#ADC0CF',stroke:'#91A8B8','stroke-width':1},this.movingStage);
    this.chuck=element('rect',{x:b.x+16,y:contactY+cellH*.58+8,width:b.w-32,height:18,rx:3,fill:M.chuck,stroke:M.line,'stroke-width':1},this.movingStage);
    this.chuckRule=element('line',{x1:b.x+26,y1:contactY+cellH*.58+17,x2:b.x+b.w-26,y2:contactY+cellH*.58+17,stroke:'#C3CED5','stroke-width':1},this.movingStage);
    this.probes=[];this.contactMarks=[];
    for(const [i,[px,py]]of[[-.38,-.25],[.38,-.25],[-.38,.25],[.38,.25]].entries()){
      const endX=cx+cellW*px,endY=contactY+cellH*py-2.5;
      const rootX=cx+(px<0?-1:1)*b.w*(i<2?.32:.39),rootY=cardY+15;
      const d=`M ${rootX} ${rootY} C ${rootX} ${rootY+19}, ${endX} ${endY-25}, ${endX} ${endY-5} L ${endX} ${endY}`;
      element('path',{d,fill:'none',stroke:'#7C8F9C','stroke-width':2.0,'stroke-linecap':'round'},g);
      const responseD=`M ${endX} ${endY} L ${endX} ${endY-5} C ${endX} ${endY-25}, ${rootX} ${rootY+19}, ${rootX} ${rootY}`;
      const active=element('path',{d:i%2?responseD:d,fill:'none',stroke:i%2?M.response:M.stimulus,'stroke-width':2.5,'stroke-linecap':'round','pathLength':100},g);
      this.probes.push(active);
      this.contactMarks.push(element('circle',{cx:endX,cy:endY,r:3.2,fill:M.pad,stroke:'#8D7852','stroke-width':1},g));
    }
    text(g,'探針',rightX+10,(cardY+contactY)/2+9,'label','end');
    const labelY=contactY+gap+cellH*.58+(compact?40:48);
    this.padLabel=text(g,'金屬焊墊',b.x+10,labelY,'detail','start');
    this.chuckLabel=text(g,'工作台',b.x+b.w-12,labelY,'detail','end');
    this.action=text(g,'',cx,b.y+b.h-6,'label');
    if(compact)set(this.action,{visibility:'hidden'});
    this.gapArrow=element('path',{d:`M ${b.x-1} ${contactY+3} l3 -3 3 3 M ${b.x+2} ${contactY} v${gap} m-3 -3 l3 3 3-3`,fill:'none',stroke:M.muted,'stroke-width':1.2},g);
    this.zLabel=text(g,'Z',b.x+1,contactY-7,'small');
  }
  updateWafer(view,state){
    const {b,pitch,sz}=view;
    for(const record of state.records){
      const c=view.cells.get(record.id);
      if(view.isMap){
        set(c.rect,{fill:M[record.status]});
        c.mark.textContent=record.status==='pass'?'✓':record.status==='fail'?'×':'';
        set(c.mark,{fill:record.status==='pass'?M.passInk:M.failInk});
        set(c.cell,{'data-result':record.status});
      }
    }
    const x=b.cx+state.position.x*pitch-sz/2-2,y=b.cy+state.position.y*pitch-sz/2-2;
    set(view.cursor,{x,y,opacity:state.t>=45?.35:1});
    set(view.dot,{cx:x+sz+3,cy:y,opacity:state.contact?1:0});
    const aligned=Math.abs(state.position.x-state.current.x)+Math.abs(state.position.y-state.current.y)<1e-6;
    view.caption.textContent=view.isMap?`✓ ${state.counts.pass}　× ${state.counts.fail}　未測 ${state.counts.untested}`:state.t>=45?'晶圓仍完整':aligned?state.current.label:'XY 對位中';
  }
  render(state){
    this.lastState=state;if(!this.layout)return;
    const {cx,b,cardY,contactY,gap,cellW,cellH,pitch,rowPitch,testerH,ty}=this.geometry;
    set(this.svg,{'data-time':state.tMs.toFixed(2),'data-phase':state.phase.id,'data-step':state.step,'data-contact':String(state.contact),'data-x':state.position.x.toFixed(5),'data-y':state.position.y.toFixed(5),'data-z':state.z.toFixed(5),'data-tested':state.counts.tested,'data-reset-opacity':state.cycleReset.opacity.toFixed(4)});
    this.updateWafer(this.physical,state);this.updateWafer(this.recordMap,state);
    const dz=gap*(1-state.z);
    // Clip remains fixed; stage and every surface feature rise together.
    set(this.substrate,{y:contactY-cellH*.58+dz});
    set(this.surfaceClipRect,{y:contactY-cellH*.58+dz});
    set(this.waferEdge,{y:contactY+cellH*.58+dz});
    set(this.chuck,{y:contactY+cellH*.58+8+dz});
    set(this.chuckRule,{y1:contactY+cellH*.58+17+dz,y2:contactY+cellH*.58+17+dz});
    for(const {die,el}of this.largeCells)set(el,{transform:`translate(${cx+(die.x-state.position.x)*pitch} ${contactY+(die.y-state.position.y)*rowPitch+dz})`});
    const aligned=Math.abs(state.position.x-state.current.x)+Math.abs(state.position.y-state.current.y)<1e-6;
    const contactLabel=state.contact?'已接觸':state.z>0?(state.step==='Z 下降分離'?'正在分離':'正在接近'):'未接觸';
    this.coordLabel.textContent=state.t>=45?'探針已分離':!aligned?`對位至 ${state.current.label}`:`${state.current.label} · ${contactLabel}`;
    this.action.textContent=state.phase.id==='scan'?'加快巡測 · 逐顆記錄':state.t>=45?(state.t<50?'結果留在對應位置':'本輪結束'):state.step;
    const testing=state.signalMode!=='idle',recording=state.recordWritten&&state.contact;
    const status=state.signalMode==='stimulus'?'施加測試訊號':state.signalMode==='response'?'讀回電性反應':state.signalMode==='compare'?'與示意限值比較':recording?(state.result==='pass'?'✓ 符合本次條件':'× 超出示意限值'):state.t>=45?'本輪測試完成':state.contact?'接觸已建立':'等待接觸';
    this.testerStatus.textContent=status;
    set(this.testerStatus,{fill:recording?(state.result==='pass'?M.passInk:M.failInk):M.muted});
    const measured=state.measurement.visible;
    this.screenValue.textContent=measured?(state.signalMode==='response'?'示意量測進行中':`${state.measurement.value.toFixed(2)} · 範圍 0.90–1.10`):state.signalMode==='stimulus'?'測試序列執行中':'';
    set(this.screenValue,{y:ty+(testerH<=64?46:59),'font-size':12});
    set(this.measureBand,{opacity:measured&&state.signalMode!=='response'&&testerH>64?1:0});
    const v=this.valueBar.x+Math.max(0,Math.min(1,(state.measurement.value-.8)/.6))*this.valueBar.w;
    set(this.valueMark,{x1:v,x2:v,stroke:state.measurement.value>=.9&&state.measurement.value<=1.1?M.passInk:M.failInk});
    for(const [el,mode]of[[this.signalIn,'stimulus'],[this.signalOut,'response']])set(el,{opacity:state.signalMode===mode?1:0,'stroke-dasharray':`${Math.max(1,state.signalProgress*100)} 100`});
    for(let i=0;i<this.probes.length;i++)set(this.probes[i],{opacity:state.contact&&(state.signalMode===(i%2?'response':'stimulus'))?.8:0,'stroke-dasharray':`${Math.max(1,state.signalProgress*100)} 100`});
    for(const dot of this.contactMarks)set(dot,{opacity:state.contact?1:0});
    set(this.overlay,{opacity:state.cycleReset.opacity,visibility:state.cycleReset.opacity>0?'visible':'hidden'});
    this.svg.setAttribute('aria-label',`${state.title}。${state.step}。目標晶粒 ${state.current.label}。已測 ${state.counts.tested} 顆，通過 ${state.counts.pass}，未通過 ${state.counts.fail}。`);
  }
}
