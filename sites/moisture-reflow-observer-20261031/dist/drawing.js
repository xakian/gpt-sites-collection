import {R,P,T,C} from './svg.js';import {colors as c} from './materials.js';import {waterPoints,ramp,smooth} from './model.js';
const line=(d,color,width=1,extra='')=>P(d,'none',`stroke="${color}" stroke-width="${width}" ${extra}`);
function specimen(s,id,cx,y,cw,ch){const sc=Math.min((cw-28)/360,(ch-52)/200),tx=cx-180*sc,ty=y+24,damage=id==='A'?s.delam:0,crack=id==='A'?s.crack:0,pressure=id==='A'?s.pressureA:s.pressureB,shift=-(1-s.enter)*(cw+30)+s.exit*(cw+60),dry=id==='B'?s.dry:0;let o=T(cx,y+14,id+(s.t<10?' · 相同封裝':id==='A'?' · 保留較高含水':s.t<16?' · 乾燥處理中':' · 乾燥處理後'),16);
o+=`<defs><clipPath id="cell-${id}"><rect x="${cx-cw/2}" y="${y+18}" width="${cw}" height="${ch-34}"/></clipPath></defs><g clip-path="url(#cell-${id})"><g transform="translate(${tx+shift} ${ty}) scale(${sc})">`;
o+=R(5,180,350,10,c.carrier,`stroke="${c.line}"`);
o+=P(`M40 45H320V160Q180 ${160+8*damage} 40 160Z`,c.mold,`stroke="${c.line}" stroke-width="1.2"`);
o+=R(105,110,150,12,c.metal,`stroke="${c.line}"`)+R(125,102,110,8,c.attach)+R(125,78,110,24,c.die,`stroke="${c.line}"`);
for(const side of [0,1]){const d=side?'M320 109H337V175H355V180H331V122H320Z':'M40 109H23V175H5V180H29V122H40Z';o+=P(d,c.metal,`stroke="${c.line}"`);}
o+=line('M128 80Q95 53 39 110 M232 80Q271 53 321 110',c.metal,2);
for(let i=0;i<waterPoints.length;i++){const [xx,yy]=waterPoints[i],p=smooth(ramp(s.t,3+i*.075,7+i*.075));if(!p)continue;const fromY=yy<108?27:174,fromX=xx<100?25:xx>260?335:xx;let x=fromX+(xx-fromX)*p,y0=fromY+(yy-fromY)*p,op=.8;
if(id==='B'&&i>1){x+=(fromX-xx)*dry;y0+=(fromY-yy)*dry;op*=1-dry;}else if(id==='A'){op*=1-.65*smooth(ramp(s.t,22,28));}
o+=C(x,y0,3,c.water,`opacity="${op}"`);}
if(s.t>=10&&s.t<16&&id==='B')for(let x of [78,180,282])o+=line(`M${x} 34q-6 -6 0 -12q6 -6 0 -12`,c.heat,1.8);
if(s.stored&&id==='B')o+=R(15,30,330,167,'none',`stroke="${c.water}" stroke-dasharray="5 5"`);
if(s.heat>.01)for(let x of [65,180,295])o+=line(`M${x} 30q-7 -7 0 -14q7 -7 0 -14`,c.heat,2.5,`opacity="${s.heat}"`);
if(pressure>.01){for(let i=0;i<4;i++){const x=130+i*32;o+=C(x,130,3.5+pressure*2,'none',`stroke="${c.vapor}" opacity="${Math.min(1,pressure*1.5)}"`);}o+=line('M116 127v11m-4 -4l4 4l4 -4 M244 127v11m-4 -4l4 4l4 -4',c.damage,1.5,`opacity="${pressure}"`);}
if(damage>0)o+=P(`M${180-75*damage} 123Q180 ${123+16*damage} ${180+75*damage} 123Q180 ${123+4*damage} ${180-75*damage} 123Z`,'#F6F7F8',`stroke="${c.damage}" stroke-width="1.3"`);
if(crack>0)o+=line('M255 123l13 8l-3 8l17 8l-1 8l17 9',c.damage,2.8,`pathLength="1" stroke-dasharray="${crack} 1"`);
if(crack>.7&&s.t<29)for(let i=0;i<3;i++){const f=(s.t*.65+i/3)%1;o+=C(299+f*23,160+f*13,2.5+f*3,'none',`stroke="${c.vapor}" opacity="${(1-f)*s.heat}"`);}
o+='</g></g>';
let note=s.t<3?'完整模封 · 尚未吸濕':s.t<10?'藍點：水分擴散示意':s.t<16?(id==='A'?'維持較高含水':'受控乾燥 · 水分向外'):s.t<18?(id==='A'?'較高含水':'維持乾燥保存'):s.t<22?(id==='A'?'共同升溫 · 內壓與應力':'共同升溫 · 含水較低'):s.t<27?(id==='A'?'本例：界面分層、裂紋':'本例：保持完整'):(id==='A'?'損傷保留 · 不會自行修復':'本例完整 · 並非零風險');
o+=T(cx,y+ch-3,note,14);return o;}
export function draw(s,w,h){const wide=w>=700;let o=T(w/2,27,s.stage.title,18)+T(w/2,53,s.t>=18&&s.t<27?'同一熱歷程 · 僅示意可能結果':'教學條件下的可能結果 · 非必然',14);const top=82;
if(wide){const ch=h-top-15;o+=specimen(s,'A',w*.26,top,w*.46,ch)+specimen(s,'B',w*.74,top,w*.46,ch);}else{const ch=(h-top-12)/2;o+=specimen(s,'A',w/2,top,w,ch)+specimen(s,'B',w/2,top+ch+3,w,ch);}return o;}
