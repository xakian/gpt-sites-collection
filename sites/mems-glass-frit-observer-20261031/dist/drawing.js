import {R,P,T,C} from './svg.js';import {colors as c} from './materials.js';
export function draw(s,w,h){
const wide=w>=700,mw=wide?w-220:w,mh=wide?h:h-107,sx=Math.min((mw-40)/510,1.35),sy=Math.min(sx*1.4,(mh-85)/350),ox=(mw-510*sx)/2,oy=72+(mh-85-350*sy)/2,shift=-(1-s.enter)*(w+400)+s.exit*(w+400),cy=40+180*s.lower+3*s.wet,thick=10-3*s.wet,b=[],stroke=`stroke="${c.line}" stroke-width="1.5"`;
b.push(R(10,337,490,13,c.support,stroke),R(40,330,45,7,c.support),R(425,330,45,7,c.support),R(30,300,450,30,c.silicon,stroke),R(145,270,25,30,c.silicon,stroke),R(340,270,25,30,c.silicon,stroke));
b.push(P(`M170 270Q190 ${270+s.motion} 210 ${270+s.motion}M300 ${270+s.motion}Q320 ${270+s.motion} 340 270`,'none',`stroke="${c.moving}" stroke-width="4"`),R(210,265+s.motion,90,10,c.moving,stroke));
b.push(`<g transform="translate(0 ${cy+35}) scale(1 ${Math.cos(Math.PI*s.flip)}) translate(0 -35)">`,P('M30 0H90V50H420V0H480V70H30Z',c.cap,stroke));
if(s.print>0){for(const [x,q] of [[40,Math.min(1,s.print*2)],[430,Math.max(0,s.print*2-1)]])b.push(R(x,-thick,40,thick,s.pre>0?c.glass:c.paste,`opacity="${q}" ${stroke}`));}
if(s.t>=3&&s.t<7){const x=30+450*s.print;b.push(P('M25 -15H485','none',`stroke="${c.line}" stroke-width="1" stroke-dasharray="3 3"`),R(x-8,-35,16,20,c.support,stroke));}b.push('</g>');
if(s.burn)for(let i=0;i<8;i++){const f=((s.t*0.45+i*.13)%1),x=i%2===0?60:450;b.push(C(x+(i%3-1)*8,cy-8-45*f,3,c.gas,`opacity="${1-f}"`));}
if(s.pressure>0)for(const x of [60,450])b.push(R(x-24,cy-32,48,12,c.support,stroke),P(`M${x} ${cy-19}V${cy-2}m-7 -8l7 8 7 -8`,'none',`stroke="${c.line}" stroke-width="2" opacity="${s.pressure}"`));
if(s.heat>0)for(const x of [110,400])b.push(P(`M${x} ${s.t<14?cy+85:145}q-7 8 0 15t0 15`,'none',`stroke="${c.heat}" opacity="${s.heat}" stroke-width="2"`));
let out=`<g transform="translate(${ox+shift} ${oy}) scale(${sx} ${sy})">${b.join('')}</g>`+T(w/2,27,s.stage.title,18);
const notes=['中央懸空 · 周邊承載','釉膏只留在蓋片周邊','先排氣，後封合','玻璃釉環預處理','受控乾燥氮氣 · 非真空','外圍施壓 · 中央留空','微幅活動僅示意間隙','整件退出 · 下一輪換新件'];out+=T(w/2,53,notes[s.index],14);
if(s.enter===1&&s.exit===0){if(s.t<14)out+=T(ox+255*sx,oy+(cy+42)*sy,'凹槽蓋片',14);if(s.t>=20)out+=T(ox+255*sx,oy+cy*sy-14,'空腔保留',14);}
const px=wide?w-155:w/2-55,py=wide?Math.max(115,h*.45):h-87;
out+=`<g opacity="${s.enter*(1-s.exit)}">`+R(px-8,py-7,126,62,c.cap,`stroke="${c.line}"`)+R(px+15,py+8,80,32,'#F7F9FB')+P(`M${px} ${py}H${px+110}V${py+47}H${px}Z`,'none',`stroke="${s.pre>0?c.glass:c.paste}" stroke-width="7" pathLength="1" stroke-dasharray="${s.print} 1"`)+T(px+55,py-17,'同一蓋片 · 俯視',14)+P(`M${px-6} ${py+24}H${px+116}`,'none',`stroke="${c.line}" stroke-dasharray="3 3" opacity=".45"`)+T(px+55,py+70,s.print>=1?'釉環閉合 · 中央無釉':'釉膏印刷區',14)+'</g>';return out;
}

