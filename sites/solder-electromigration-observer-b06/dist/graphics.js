import {C,rect,text,line,arrow,swap,clamp} from './svg.js';import {layout} from './layout.js';
export function draw(s,size){const{w,h,mobile,f,bw,x,y,k}=layout(size),sw=swap(s.t,30,34,w),d=sw.fresh?0:s.damage,power=s.power&&!sw.fresh,xx=x-bw/2,top=y-60*k,bot=y+65*k;let out=text(w/2,25,s.caption,f,C.muted);out+=`<g transform="translate(${sw.x} 0)">`;
out+=rect(xx-18,y-99*k,bw*.62,12*k,C.tool)+rect(xx+bw*.10,y-99*k,bw*.13,25*k,C.tool)+text(xx+bw*.22,y-99*k-7,'Al 薄導線',13);
out+=rect(xx,top-14*k,bw,14*k,C.copper)+text(x+bw*.19,top-24,'Cu UBM · 陰極端',f);
out+=`<path data-material="solder" d="M${xx} ${top}Q${xx-12} ${y} ${xx+9} ${bot}H${xx+bw-9}Q${xx+bw+12} ${y} ${xx+bw} ${top}Z" fill="${C.tin}" stroke="${C.line}" stroke-width="1.5"/>`;
out+=rect(xx,bot,bw,14*k,C.copper)+text(x,bot+34,'Cu · 陽極端',f);
if(d>0){for(let i=0;i<4;i++){let growth=clamp(d*1.6-i*.14),cx=xx+bw*(.08+i*.145);out+=`<ellipse data-void="${i}" cx="${cx}" cy="${top+4*k}" rx="${bw*(.018+.081*growth)}" ry="${(1+14*growth)*k}" fill="${C.paper}" stroke="none"/>`;}}
out+=text(xx+bw*.40,y+8*k,'SAC 固態焊料',mobile?13:f);
if(d>0){out+=rect(xx+8,bot-4*k-8*d*k,bw-16,(4+8*d)*k,'#D5B795','opacity=".85"');for(let i=0;i<3;i++){let q=clamp((s.t-10-i*3)/5),ax=xx+bw*(.47+.12*i),ay=top+25*k+(bot-top-35*k)*q;out+=`<rect data-atom="${i}" x="${ax-4}" y="${ay-4}" width="8" height="8" fill="#B98257" stroke="#79573F"/>`;}}
if(power){for(let i=0;i<6;i++){const q=(s.t*1.5+i/6)%1,ex=xx+bw*(.55+d*.26),ey=top-8*k+q*(bot-top+20*k);out+=`<circle data-electron="${i}" cx="${ex}" cy="${ey}" r="3" fill="#477F9E"/>`;}out+=arrow(xx+bw*.86,top+25*k,xx+bw*.86,bot-15*k,'#477F9E',1.6)+arrow(xx-25,bot-5,xx-25,top+12,'#4B636F',2);out+=text(xx-38,y+6,'I',15,C.ink)+text(xx+bw*.9,y+6,'e⁻',13,'#477F9E');}
out+='</g>';out+=text(w/2,Math.min(h-31,bot+62),mobile?'● 電子  ■ 原子  白色缺口：空洞':'● 電子（快）　■ 原子淨輸運（慢）　白色缺口：空洞',mobile?13:15,C.muted);out+=text(w/2,Math.min(h-10,bot+84),d>.4&&!sw.fresh?'剩餘金屬仍連通 · 非斷路':'上 Al ／ Cu UBM ／ SAC ／ 下 Cu',mobile?13:14,C.muted);return out;}
