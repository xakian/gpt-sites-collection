import {C,rect,text,line,arrow,swap} from './svg.js';import{layout}from'./layout.js';
function spring(x,y,length,k){let p=`M${x} ${y}L${x} ${y+5*k}`;for(let i=0;i<10;i++)p+=`L${x+(i%2?10:-10)} ${y+5*k+(length-10*k)*(i+1)/11}`;p+=`L${x} ${y+length-5*k}L${x} ${y+length}`;return`<path d="${p}" stroke="${C.line}" stroke-width="2" fill="none"/>`;}
export function draw(s,size){const{w,h,mobile,f,bw,cx,cy,k}=layout(size),sw=swap(s.t,27,30,w),travel=sw.fresh?0:s.travel,load=sw.fresh?0:s.frameLoad,py=cy+(-100+travel)*k,baseY=cy+90*k,x=cx-bw/2,frameTop=cy-6*k,cw=Math.min(125,bw*.24);let out=text(w/2,25,s.caption,mobile?13:f,C.muted);out+=`<g transform="translate(${sw.x} 0)">`;
out+=rect(x-15,cy-115*k,8,220*k,C.tool)+rect(x+bw+7,cy-115*k,8,220*k,C.tool)+rect(x-20,baseY+20*k,bw+40,15*k,C.tool);
for(const fx of[x+5,x+bw-27])out+=rect(fx,frameTop,22,baseY-frameTop,'#D7D1DF');
out+=rect(x,baseY,bw,14*k,C.copper)+text(cx,baseY+12*k,'共用下電極',13);
out+=rect(x-5,py,bw+10,14*k,C.tool)+text(cx,py-9,'外夾持壓板',f);
for(let i=0;i<2;i++){const px=x+bw*(i===0?.31:.69),support=(i===0?4:14)*k,chipTop=baseY-support-20*k,sy=py+14*k,tipBottom=Math.min(sy+82*k,chipTop),length=tipBottom-sy-20*k,compression=62*k-length,contact=sy+82*k>=chipTop-.001;out+=rect(px-cw/2,baseY-support,cw,support,C.tool)+rect(px-cw/2,chipTop,cw,20*k,C.silicon,`data-chip="${i}"`);out+=spring(px,sy,length,k)+rect(px-11,sy+length,22,20*k,C.copper);if(contact){out+=line(px-14,chipTop,px+14,chipTop,'#4F8FA6',4)+line(px-cw*.35,baseY,px+cw*.35,baseY,'#4F8FA6',3);if(compression>.1)out+=arrow(px+25,sy+12*k,px+25,tipBottom-4*k,C.heat,1.4+compression/(16*k));}out+=text(px,baseY+55*k,i===0?'晶粒 A':'晶粒 B',f);}
if(travel>0){for(const fx of[x+16,x+bw-16])out+=arrow(fx,Math.max(40,py-43*k),fx,py-4*k,C.heat,2+2*load);}
if(load>0){for(const fx of[x+16,x+bw-16])out+=arrow(fx,frameTop+15*k,fx,baseY-8*k,C.heat,2+load);}
out+=text(cx,baseY+79*k,'橙箭頭：力 · 藍接面：電接觸',mobile?13:15,C.muted);out+='</g>';out+=text(w/2,h-12,load>0?'絕緣框架已到位 · 各自彈簧保持壓縮':'獨立彈簧壓針 · 紫色為絕緣框架',mobile?13:15,C.muted);return out;}
