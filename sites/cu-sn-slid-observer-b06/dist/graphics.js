import {C,rect,text,line,swap} from './svg.js';import {layout} from './layout.js';
const phase3='#A9A3BD',phase6='#ABC5BB';
export function draw(s,size){const L=layout(size),{w,h,mobile,font:f,x,y,width:bw,scale:k,legendX:lx}=L,sw=swap(s.t,30,34,w),q=sw.fresh?0:s.reaction,contact=sw.fresh?0:s.contact,gap=(1-contact)*30,cu=(60-12*q)*k,a=48*q*.22*k,b=48*q*.78*k,sn=72*(1-q)*k,liquid=!sw.fresh&&s.liquid;
let out=text(w/2,26,s.temperature,f,C.muted);let layers=[{y:y-gap,h:cu,c:C.copper,n:'Cu-top'},{y:y+cu,h:a,c:phase3,n:'Cu3Sn-top'},{y:y+cu+a,h:b,c:phase6,n:'Cu6Sn5-top'},{y:y+cu+a+b,h:sn,c:C.tin,n:'Sn'},{y:y+cu+a+b+sn,h:b,c:phase6,n:'Cu6Sn5-bottom'},{y:y+cu+a+2*b+sn,h:a,c:phase3,n:'Cu3Sn-bottom'},{y:y+2*a+2*b+cu+sn,h:cu,c:C.copper,n:'Cu-bottom'}];
out+=`<g transform="translate(${sw.x} 0)" data-joint="CuSnCu">${rect(x-10,y-gap-18-(sw.fresh?0:s.unload*32),bw+20,14,C.tool)}${rect(x-10,y+192*k+4,bw+20,15,C.tool)}`;
for(const l of layers){if(l.h>.01)out+=rect(x,l.y,bw,l.h,l.c,`data-phase="${l.n}"`);}
if(liquid&&sn>2){const sy=y+cu+a+b;for(let j=0;j<3;j++){const yy=sy+sn*(j+1)/4;out+=`<path d="M${x+6} ${yy}q${bw/8} -3 ${bw/4} 0t${bw/4} 0t${bw/4} 0t${bw/4-12} 0" fill="none" stroke="#7D9DAF" stroke-width="1.3"/>`;}}
if(q>0){for(let j=0;j<5;j++){const xx=x+(j+.5)*bw/5;out+=line(xx,y+cu+2,xx+5,y+cu+a+b-2,'#617D80',1);out+=line(xx,y+cu+a+b+sn+2,xx+5,y+cu+2*a+2*b+sn-2,'#617D80',1);}}
if(s.t>=10&&s.t<22){const atom=s.t%2/2;for(let j=0;j<3;j++)out+=`<circle cx="${x+bw*(j+1)/4}" cy="${y+cu-9+atom*(a+b+8)}" r="2.8" fill="#A37355" stroke="#fff" stroke-width=".5"/>`;}
out+='</g>';
[['Cu',C.copper],['Cu₃Sn',phase3],['Cu₆Sn₅',phase6],['游離 Sn',C.tin]].forEach(([label,col],i)=>{const yy=Math.max(95,y+16)+i*(mobile?35:40);out+=rect(lx,yy-13,12,12,col)+text(lx+19,yy-2,label,f,C.ink,'start');});
out+=text(w/2,Math.min(h-14,y+192*k+52),q>=1&&!sw.fresh?(s.t<25?'無游離錫 · 已等溫固化':'固態接合保留'):liquid?'波紋：液態錫 · 原子點為淨反應示意':'固態層與接合工具',mobile?14:16);
return out;}
