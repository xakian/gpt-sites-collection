import {assembly,wafer,defs,temporary} from './primitives.js';
import {route} from './layouts.js';
import {pads,progress,clamp} from './topic.js';
const attr=(el,key,value)=>el.setAttribute(key,value);
const move=(el,p)=>attr(el,'transform',`translate(${p[0]} ${p[1]})`);
const show=(el,yes)=>attr(el,'visibility',yes?'visible':'hidden');
const corners=(w,h)=>`M${-w/2+16} ${-h/2}H${-w/2}V${-h/2+16} M${w/2-16} ${-h/2}H${w/2}V${-h/2+16} M${-w/2} ${h/2-16}V${h/2}H${-w/2+16} M${w/2} ${h/2-16}V${h/2}H${w/2-16}`;
export class PackagingScene{
 constructor(svg,onSelect){
 this.svg=svg;
 svg.innerHTML=`<defs>${defs()}<clipPath id="source-clip"><rect id="source-rect"/></clipPath><clipPath id="frame-clip"><rect id="frame-rect"/></clipPath><clipPath id="piece-clip"><rect id="piece-rect"/></clipPath><clipPath id="die-source-clip"><rect id="die-source-rect"/></clipPath><clipPath id="scrap-clip"><rect id="scrap-rect"/></clipPath></defs>
 <g id="routes">${Array.from({length:5},()=>'<path class="route"/>').join('')}</g>
 ${Array.from({length:6},(_,i)=>`<g data-station="${i}"><path d="${corners(i===0?192:154,i===0?192:154)}" class="fine"/><g class="fixture">${i===0?'<path d="M-42 91H42" class="fine"/>':i===1?'<path d="M-70-68H-48M48-68H70M-70 68H-48M48 68H70" class="fine"/>':i===2?'<path d="M-70-48H-64V48H-70M70-48H64V48H70" class="equipment"/>':i===3?'<rect x="-35" y="-43" width="70" height="86" rx="7" class="fine"/><path d="M-73 0H-36" stroke="#a7b1b7" stroke-width="5"/>':i===4?'<path d="M-72-55V55M72-55V55" stroke="#a7b1b7" stroke-width="5"/>':'<rect x="-67" y="-51" width="134" height="102" rx="8" class="equipment"/><path d="M-36-43H36V43H-36Z" fill="#f7f9fa" stroke="#c3cdd2"/>'}</g><rect x="-100" y="-95" width="200" height="210" class="station-hit" data-select="${i}"/></g>`).join('')}
 <g id="ports"><g id="source-port"><path d="M-88-103H88" class="fine"/><text x="0" y="-115" text-anchor="middle">新晶圓 ↓</text><path d="M-104-22V22" class="fine"/><text x="-117" y="0" text-anchor="middle" transform="rotate(-90 -117 0)">待續處理 ←</text></g><g id="frame-port"><path d="M-55-95H55" class="fine"/><text x="0" y="-106" text-anchor="middle">預鍍導線架 ↓</text></g><g id="scrap-port"><path d="M-58 85H58" class="fine"/><text x="77" y="97" text-anchor="start">↓ 框料回收</text></g><g id="exit-port"><path id="exit-line" class="fine"/><text id="exit-text" y="-58" text-anchor="middle">成品出口</text></g></g>
 <g clip-path="url(#source-clip)"><g id="wafer">${wafer()}</g></g>
 <g id="test-contacts">${pads.map(p=>`<path data-contact="${p.side}" d="M${p.side*48} ${p.finger[1]}h${p.side*17}" stroke="#74818a" stroke-width="5"/>`).join('')}</g>
 <g clip-path="url(#piece-clip)"><g id="workpiece">${assembly()}<path id="carrier" d="M-68-28V-42H-60M68-28V-42H60M-68 28V42H-60M68 28V42H60" class="fine"/></g></g>
 <g clip-path="url(#scrap-clip)"><g id="scrap">${temporary()}</g></g>
 <g id="saw"><path d="M-9-5H9V5H-9Z" class="equipment"/><path d="M0-8V8" stroke="#59636a" stroke-width="2"/></g>
 <g id="pickup"><rect x="-18" y="-22" width="36" height="17" rx="3" class="equipment"/><path d="M-9-5V0M9-5V0" class="outline" fill="none"/></g>
 <g id="dispenser"><path d="M-8-28H8L4-7H-4Z" class="equipment"/><path d="M0-7V0" class="outline"/></g>
 <g id="bond-tool"><circle r="4" fill="#e9eef0" stroke="#59636a" stroke-width="1.4"/><path d="M0-4V-17" class="outline"/></g>
 <g id="trim-tool"><path d="M-49-38V38M49-38V38" stroke="#59636a" stroke-width="3"/><path d="M-56-38H-44M44-38H56" class="outline"/></g>
 <g id="test-indicator"><path d="M-35 66H35" stroke="#d6dfe3" stroke-width="3"/><path id="test-progress" d="M-35 66H35" stroke="#59636a" stroke-width="3" pathLength="1" stroke-dasharray="1"/><g id="pass"><path d="M55-67l5 5 10-13" stroke="var(--pass)" stroke-width="2.4" fill="none"/><text x="75" y="-63" style="fill:var(--pass)">通過</text></g></g>`;
 // Waste metal travels behind the opaque package; clipped support ends stop at EMC.
 const scrapLayer=svg.querySelector('#scrap').parentElement;
 svg.insertBefore(scrapLayer,svg.querySelector('#workpiece').parentElement);
 svg.querySelector('#scrap .support').setAttribute('d','M-2-56H2V-38H-2Z M-2 38H2V56H-2Z');
 this.el=Object.fromEntries([...svg.querySelectorAll('[id]')].map(e=>[e.id,e]));
 this.wires=[...svg.querySelectorAll('#wires [data-wire]')];this.bonds=[...svg.querySelectorAll('#wires [data-bond]')];this.ends=[...svg.querySelectorAll('#wires [data-end]')];this.cuts=[...svg.querySelectorAll('#wafer [data-saw]')];this.dambars=[...svg.querySelectorAll('#temporary .dambar')];this.fingers=[...svg.querySelectorAll('#fingers .finger')];
 svg.querySelectorAll('[data-select]').forEach(e=>e.addEventListener('click',()=>onSelect(+e.dataset.select)));
 }
 setLayout(layout){
 this.layout=layout;const a=layout.anchors;attr(this.svg,'viewBox',`0 0 ${layout.width} ${layout.height}`);
 [...this.svg.querySelectorAll('[data-station]')].forEach((g,i)=>move(g,a[i]));
 [...this.svg.querySelectorAll('#routes path')].forEach((p,i)=>attr(p,'d',route(layout,i).d));
 move(this.el['source-port'],a[0]);move(this.el['frame-port'],a[1]);move(this.el['scrap-port'],a[4]);move(this.el['exit-port'],a[5]);const exitX=layout.id==='wide'?-110:110;attr(this.el['exit-line'],'d','M'+exitX+' -45V45' );attr(this.el['exit-text'],'x',exitX);this.el['exit-text'].textContent=layout.id==='wide'?'← 成品出口':'成品出口 →';
 const rect=(id,x,y,w,h)=>{const e=this.el[id];[['x',x],['y',y],['width',w],['height',h]].forEach(([k,v])=>attr(e,k,v));};
 rect('source-rect',a[0][0]-100,a[0][1]-98,200,196);
 rect('piece-rect',-100,-100,layout.width+200,layout.height+200);
 rect('scrap-rect',a[4][0]-77,a[4][1]-75,154,160);
 }
 render(f){
 const e=this.el,a=this.layout.anchors,t=f.t;
 const exitSide=this.layout.id==='wide'?-1:1;
 attr(e['piece-rect'],'x',t>=17.4&&exitSide<0?a[5][0]-110:-100);
 attr(e['piece-rect'],'width',t>=17.4?(exitSide<0?this.layout.width+100-a[5][0]+110:a[5][0]+210):this.layout.width+200);
 move(e.wafer,f.waferPos);show(e.wafer,f.waferVisible);show(e.hole,f.sourceHole);
 this.cuts.forEach((p,i)=>attr(p,'stroke-dashoffset',1-f.waferCutProgress[i]));
 move(e.workpiece,f.assemblyPos);show(e['inner-die'],f.dieVisible);move(e['inner-die'],[f.diePos[0]-f.assemblyPos[0],f.diePos[1]-f.assemblyPos[1]]);
 // The same die node is visible before attachment, during transfer and under EMC.
 attr(e['die-source-rect'],'x',a[0][0]-100-f.diePos[0]);attr(e['die-source-rect'],'y',a[0][1]-98-f.diePos[1]);attr(e['die-source-rect'],'width',200);attr(e['die-source-rect'],'height',196);
 attr(e['inner-die'],'clip-path',t<=1.7?'url(#die-source-clip)':'none');
 attr(e['frame-rect'],'x',a[1][0]-76-f.assemblyPos[0]);attr(e['frame-rect'],'y',a[1][1]-95-f.assemblyPos[1]);attr(e['frame-rect'],'width',152);attr(e['frame-rect'],'height',190);
 for(const id of ['fingers','temporary','paddle']){show(e[id],f.assemblyVisible&&(id!=='temporary'||t<12.95));attr(e[id],'clip-path',t<3?'url(#frame-clip)':'none');}
 this.dambars.forEach((p,i)=>show(p,f.trimProgress<i/6+.12));
 const tip=56-8*f.formed;
 this.fingers.forEach((p,i)=>{const s=pads[i].side,y=pads[i].finger[1];attr(p,'d',`M${s*24} ${y-4}H${s*tip}V${y+4}H${s*24}Z`);});
 show(e.glue,f.assemblyVisible&&f.adhesive>0);attr(e.glue,'transform',t<4.25?`scale(${.2+.8*f.adhesive})`:'');
 this.wires.forEach((p,i)=>{attr(p,'stroke-dashoffset',1-f.wireProgress[i]);show(p,f.wireProgress[i]>0&&f.assemblyVisible);show(this.bonds[i],t>=6.2+i*.24+.015&&f.assemblyVisible);show(this.ends[i],f.wireProgress[i]===1&&f.assemblyVisible);});
 attr(e.body,'height',76*f.encapsulantCoverage);show(e.body,f.assemblyVisible);show(e['pin-one'],f.encapsulantCoverage===1&&f.assemblyVisible);
 show(e.carrier,t>=4.25&&t<14.4);
 show(e.scrap,t>=12.95&&t<13.55);move(e.scrap,[a[4][0],a[4][1]+170*f.scrapProgress]);[...e.scrap.querySelectorAll('.dambar')].forEach(p=>show(p,false));
 show(e.saw,f.toolPoses.saw);
 if(f.toolPoses.saw){const z=clamp((t-.5)/.15),i=Math.min(7,Math.floor((t-.5)/.15)),p=((t-.5)/.15)%1,v=[-39,-13,13,39][i%4];move(e.saw,[f.waferPos[0]+(i<4?v:-65+130*p),f.waferPos[1]+(i<4?-65+130*p:v)]);show(e.saw,p>.12&&p<.88);}
 show(e.pickup,f.toolPoses.pickup);let head=f.diePos;if(t>=4.25)head=[a[1][0],a[1][1]-155*progress(t,4.25,4.6)];move(e.pickup,head);attr(e.pickup,'opacity',t>=4.25?1-progress(t,4.4,4.6):1);
 move(e.dispenser,a[1]);show(e.dispenser,f.toolPoses.dispenser);
 show(e['bond-tool'],f.toolPoses.bond);if(f.toolPoses.bond){const z=(t-6.2)/.24,i=Math.min(7,Math.floor(z)),p=clamp((z-i-.2)/.6),pad=pads[i];const q=1-p;move(e['bond-tool'],[f.assemblyPos[0]+q*q*pad.pad[0]+2*q*p*pad.side*17+p*p*pad.finger[0],f.assemblyPos[1]+q*q*pad.pad[1]+2*q*p*pad.finger[1]*.82+p*p*pad.finger[1]]);show(e['bond-tool'],z%1<.8&&t<8.12);}
 move(e['trim-tool'],a[4]);show(e['trim-tool'],f.toolPoses.trim);
 move(e['test-contacts'],a[5]);[...e['test-contacts'].children].forEach(p=>attr(p,'transform',`translate(${+p.dataset.contact*(12-12*f.contact)} 0)`));
 move(e['test-indicator'],a[5]);show(e['test-indicator'],t>=15.4&&t<17.9);attr(e['test-progress'],'stroke-dashoffset',1-f.testProgress);show(e.pass,f.testStatus==='pass');
 }
}




