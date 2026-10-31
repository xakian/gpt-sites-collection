import {C,rect,line,text,circle,path,arrow,electron,hole,clamp} from './svg.js';
export function draw(s,{W,H,t}){
 const bw=Math.min(W-48,820),x=(W-bw)/2,c=W/2,short=H<390,h=Math.min(150,H*(short?.25:.30)),y=H*(short?.23:.29),dw=bw*s.width,L=c-dw/2,R=c+dw/2,sy=y+h+(short?68:92);
 let g=text(c,26,s.current==='zero'?'零偏壓 · 位障維持平衡':s.current==='forward'?'正向偏壓 · 位障降低':'反向偏壓 · 位障提高','label');
 g+=rect(x,y,bw/2,h,'#ECDAD7')+rect(c,y,bw/2,h,'#D5E4EC')+rect(L,y,dw,h,'#F7F0D8','stroke-dasharray="4 3"')+text(x+bw*.18,y-12,'P 區','material')+text(x+bw*.82,y-12,'N 區','material');
 for(let j=0;j<16;j++){const xx=x+bw*(j+.5)/16;g+=`<g opacity="${xx>=L&&xx<=R?1:.18}">`+rect(xx-5,y+h*.5-5,10,10,'none')+text(xx,y+h*.5+4,j<8?'−':'+','minor')+'</g>';}
 g+=rect(x-8,y+h*.25,8,h*.5,C.metal)+rect(x+bw,y+h*.25,8,h*.5,C.metal);
 // Reservoir carriers wander at equilibrium; bias adds clearly directed injection.
 for(let i=0;i<8;i++){const xx=x+15+(bw*.5-dw*.5-30)*(i+.5)/8,yy=y+h*(i%2?.76:.24)+Math.sin(t*2+i)*3;g+=hole(xx+Math.sin(t+i)*3,yy)+electron(W-xx-Math.sin(t+i)*3,yy);}
 if(s.forward>.03){for(let i=0;i<4;i++){let p=((t*.38+i/4)%1),alpha=clamp(p*12)*clamp((1-p)*8)*s.forward;const xe=x+bw-12-p*(bw*.70),xh=x+12+p*(bw*.70);g+=`<g opacity="${alpha}">`+electron(xe,y+h*.34)+hole(xh,y+h*.69)+'</g>';}}
 if(s.reverse>.03){let p=(t*.16)%1;g+=`<g opacity="${s.reverse*clamp(p*12)*clamp((1-p)*8)}">`+electron(x+bw*.25+p*bw*.58,y+h*.33)+hole(x+bw*.75-p*bw*.58,y+h*.70)+'</g>';}
 g+=line(L,y+h+6,R,y+h+6)+line(L,y+h+2,L,y+h+10)+line(R,y+h+2,R,y+h+10)+text(c,y+h+26,'空乏區','small');
 g+=arrow(c+25,y+h+(short?40:46),c-25,y+h+(short?40:46),C.gold,2)+text(c-36,y+h+(short?44:50),'內建場','minor','end');
 g+=path(`M${x-8},${y+h/2} H${x-16} V${sy} H${c-62} M${c+62},${sy} H${x+bw+16} V${y+h/2} H${x+bw+8}`)+rect(c-62,sy-19,124,38,'#EFF2F4','rx="5"')+text(c,sy+5,s.current==='zero'?'電源 0 V':s.current==='forward'?'+  電源  −':'−  電源  +','small');
 const iy=sy+(short?28:40);
 if(s.current==='zero'){g+=arrow(c-50,iy,c-8,iy,C.ink)+arrow(c+50,iy,c+8,iy,C.ink)+text(c,iy+22,'漂移與擴散電流相抵','small');}
 else {g+=s.current==='forward'?arrow(c-62,iy,c+62,iy,C.on,2.4):arrow(c+62,iy,c-62,iy,C.on,1);g+=text(c,iy+22,s.current==='forward'?'傳統電流 I：P → N':'微小反向 I：N → P','small');}
 if(H>520){g+=hole(c-95,H-38)+text(c-80,H-33,'電洞','small','start')+electron(c+2,H-38)+text(c+18,H-33,'電子','small','start')+text(c,H-10,'方格正負號：固定離子','minor');}
 return g;
}
