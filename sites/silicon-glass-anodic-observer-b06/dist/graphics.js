import {C,rect,text,line,arrow,swap} from './svg.js';import {layout} from './layout.js';
export function draw(s,size){const {w,h,mobile,font:f,x,width:bw,y,k}=layout(size),sw=swap(s.t,28,32,w),q=sw.fresh?0:s.migration,bond=sw.fresh?0:s.bond,field=!sw.fresh&&s.field,gap=(1-(sw.fresh?0:s.contact))*20,unload=sw.fresh?0:s.unload,gy=y-100*k-gap,by=y+70*k;let out=text(w/2,26,s.caption,f,C.muted);
out+=`<g transform="translate(${sw.x} 0)">${rect(x,gy,bw,100*k,'#D6E5E7', 'data-material="glass"')}`;
if(q>0){out+=rect(x,y-32*k*q-gap,bw*.30,32*k*q,'#CDC5DC','opacity=".8"')+rect(x+bw*.70,y-32*k*q-gap,bw*.30,32*k*q,'#CDC5DC','opacity=".8"');}
out+=`<path data-material="silicon" d="M${x} ${y}H${x+bw*.32}V${y+24*k}H${x+bw*.68}V${y}H${x+bw}V${by}H${x}Z" fill="${C.silicon}" stroke="${C.line}" stroke-width="1.3"/>`;
out+=text(x+bw/2,gy+48*k,'含鹼玻璃',f)+text(x+bw/2,y+54*k,'矽基底',f)+text(x+bw/2,y+18*k,'空腔',Math.min(f,15));
let id=0;for(const a of [.10,.23,.77,.90])for(let row=0;row<2;row++){const yy=y-gap-(row===0?54+9*q:18+24*q)*k;out+=`<g data-ion="${id++}"><circle cx="${x+bw*a}" cy="${yy}" r="${Math.min(10,9*k)}" fill="#F7F9FA" stroke="#759DB4" stroke-width="1.2"/>${text(x+bw*a,yy+4,'+',13,'#446F89')}</g>`;}
out+=rect(x-6,gy-14-unload*15,bw+12,14,C.tool)+text(x+bw/2,gy-3-unload*15,field?'玻璃外側 −':s.t>=24&&!sw.fresh?'外電極已斷電':'玻璃外側電極',13);
out+=rect(x-6,by,bw+12,14,C.tool)+text(x+bw/2,by+11,field?'矽端 +':'下方承托電極',13);
if(field){out+=arrow(x-15,y-5,x-15,gy+8,'#6590A8',2)+arrow(x+bw+15,y-5,x+bw+15,gy+8,'#6590A8',2);}
if(field&&q>.3&&s.t<17){for(const pos of [.15,.85]){const xx=x+bw*pos;out+=text(xx-12,y-8*k,'−',14,'#74638C')+text(xx-12,y+17*k,'+',14,'#74638C')+arrow(xx+8,y-20*k,xx+8,y-3*k,'#8C789C',1.5)+arrow(xx+8,y+23*k,xx+8,y+5*k,'#8C789C',1.5);}}
for(let side=0;side<2;side++){for(let i=0;i<6;i++){const p=(i+1)/6;if(bond>=p){const xx=x+bw*(side===0?.03+i*.048:.73+i*.048);out+=`<g data-bond="${side}-${i}">${line(xx,y-6,xx,y+6,'#AA795B',2)}<circle cx="${xx}" cy="${y}" r="2.6" fill="#D6AD8E"/></g>`;}}}
out+='</g>';
out+=text(w/2,Math.min(h-15,by+54),q>0&&!sw.fresh?'淡紫區：離子耗盡，玻璃仍在':'圓圈＋：Na⁺ · 中央空腔不貼合',mobile?14:16);
return out;}
