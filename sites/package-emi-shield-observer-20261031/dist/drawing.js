import {R,P,T,C} from './svg.js';import {colors as c} from './materials.js';
export function draw(s,w,h){
const wide=w>=700,mw=wide?w-210:w,mh=wide?h:h-100,sx=Math.min((mw-30)/570,1.4),sy=Math.min(sx*1.5,(mh-100)/320),ox=(mw-570*sx)/2,oy=90+(mh-100-320*sy)/2,shift=-(1-s.enter)*(w+500)+s.exit*(w+500),st=`stroke="${c.line}" stroke-width="1.3"`,b=[];
b.push(P('M90 60L140 25H500V155L450 190H90Z',c.mold,st),P('M450 60L500 25V155L450 190Z','#BECAB9',st),R(90,60,360,90,c.mold,st),R(90,150,360,50,c.substrate,st),P('M450 150L500 115V165L450 200Z',c.substrate,st),R(90,176,360,8,c.ground),P('M450 176L500 141V149L450 184Z',c.ground));
// The signal via antipads keep the signal paths clear of the ground layer.
for(const x of [220,320])b.push(R(x-13,168,26,24,c.insulator),R(x-4,143,8,65,c.signal),R(x-16,200,32,6,c.signal),C(x,219,13,c.signal,st));
b.push(R(210,111,120,32,c.chip,st),R(116,180,8,28,c.ground),R(104,200,32,6,c.ground),C(120,219,13,c.ground,st));
if(s.top>0)b.push(P('M86 57L137 21H504L453 57Z',c.copper,`opacity="${s.top}" ${st}`));
if(s.sides>0){const y=60+136*s.sides;b.push(R(84,57,6,y-57,c.copper),R(450,57,6,y-57,c.copper),P(`M456 57L504 24V${y-35}L456 ${y}Z`,c.copper,`opacity=".75" ${st}`));}
if(s.t<9)for(const x of [170,280,390])b.push(C(x,43,2.5,'#8B9293',`opacity="${1-s.clean}"`));
if(s.t>=6&&s.t<9)b.push(P(`M${100+350*s.clean} 20v30`,'none',`stroke="#9CB9C8" stroke-width="12" opacity=".6"`));
if(s.t>=3&&s.unmask<1){const my=200+60*(1-s.seat)+60*s.unmask;b.push(R(65,my,410,44,c.mask,`opacity="${1-s.unmask}" ${st}`),R(65,my+44,20,14,c.mask),R(455,my+44,20,14,c.mask));}
if(s.t<6||s.t>=18&&s.t<25)b.push(R(70,110,20,20,'#E2E8EB',st),R(450,110,20,20,'#E2E8EB',st));
if(s.board>0){const by=235+55*(1-s.board);b.push(R(75,by,400,17,'#DEE7E1',st),R(114,232,12,by-232,c.ground));for(const x of [220,320])b.push(R(x-7,232,14,by-232,c.signal));b.push(P(`M120 ${by+8}H40V${by+30}m-14 0h28m-23 6h18m-13 6h8`,'none',`stroke="${c.ground}" stroke-width="4"`));}
if(s.field){for(let i=0;i<3;i++){let yy=8-i*8;b.push(P(`M190 ${yy}Q270 ${yy-10} 350 ${yy}`,'none',`stroke="${c.field}" stroke-width="2" opacity="${s.shield?.15:.6}"`));}if(s.shield)b.push(P('M270 206q-15 10 0 20t0 20','none',`stroke="${c.field}" stroke-width="2" opacity=".45"`));}
let out=`<g transform="translate(${ox+shift} ${oy}) scale(${sx} ${sy})">${b.join('')}</g>`+T(w/2,27,s.stage.title,18);const notes=['露出地層 · 信號各自分離','底面遮住 · 側邊地層外露','先做表面準備','銅膜連到側邊地層','去遮蔽 · 底部仍分開','銅殼有實際接地路徑','場線淡化 ≠ 完全阻隔','完整銅殼隨成品退出'];out+=T(w/2,53,notes[s.index],14);
if(s.enter===1&&s.exit===0){if(s.t<3||s.t>=25)out+=T(ox+120*sx,oy+280*sy,'接地端',14)+T(ox+285*sx,oy+280*sy,'信號端',14);out+=T(ox+270*sx,oy+91*sy,'局部剖切',14);}
const px=wide?w-155:w/2-55,py=wide?Math.max(115,h*.45):h-78;out+=`<g opacity="${s.enter*(1-s.exit)}">`+R(px,py,110,44,c.mold,st)+R(px+4,py+4,102,36,c.copper,`opacity="${s.top*.75}"`)+P(`M${px} ${py}H${px+110}V${py+44}H${px}Z`,'none',`stroke="${c.copper}" stroke-width="6" opacity="${s.sides}"`)+T(px+55,py-15,'同件 · 覆蓋資訊圖',14)+T(px+55,py+67,s.sides===1?'頂面與四側連續':s.t<3?'頂面與四側待鍍':'底面保留遮蔽',14)+'</g>';return out;
}




