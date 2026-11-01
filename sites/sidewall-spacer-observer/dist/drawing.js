import {rect,path,text,circle,group,arrow} from './svg.js';
export function draw(s,w,h){
 const fs=w<600?15:17,sm=w<600?13:15,L=.08*w,R=.92*w,c=w/2,ww=Math.min(300,.28*w),a=c-ww/2,b=c+ww/2,Y=h*.68,H=Math.min(160,h*.33),T=Math.min(30,w*.075,h*.095),base=Math.min(70,h*.16),ty=Y-H;
 let v=`<defs><clipPath id="frame">${rect(0,0,w,h,'white')}</clipPath></defs>`;
 v+=text(c,Math.max(24,h*.075),s.t<10?'CVD氧化物覆膜':s.t<21?'方向性回蝕':'側壁膜保留',sm);
 const wafer=(dx,fresh)=>{const q=fresh?{coat:0,etch:0,side:0,loss:0}:s,t=T*q.coat,hf=t*(1-q.etch),sw=t*(1-.30*q.side),loss=q.loss*1.5,y=Y+loss,top=ty+loss;
 let z=`<path d="M${L} ${y}H${a-sw}V${Y}H${b+sw}V${y}H${R}V${Y+base}H${L}Z" fill="#CAD6DE" stroke="#708590"/>`+rect(a,top,ww,Y-top,'#B7C7D0','stroke="#708590"');
 if(t>.001){const cap=sw*(.45+.75*q.etch),d=q.etch===1?`M${a} ${ty}Q${a-sw} ${ty} ${a-sw} ${ty+cap}V${Y}H${a}Z M${b} ${ty}Q${b+sw} ${ty} ${b+sw} ${ty+cap}V${Y}H${b}Z`:`M${L} ${Y-hf}H${a-sw}V${ty+cap}Q${a-sw} ${ty-hf} ${a} ${ty-hf}H${b}Q${b+sw} ${ty-hf} ${b+sw} ${ty+cap}V${Y-hf}H${R}V${Y}H${b}V${ty}H${a}V${Y}H${L}Z`;
 z+=`<path d="${d}" fill="#DAE9EF" stroke="#86A5B6" stroke-width="1.2"/>`;}
 z+=text(c,top+H*.60,'多晶矽',fs)+text(c,Y+base*.66,'矽基板',fs);
 if(q.coat>.25){if(q.etch<.95)z+=text(c,top-hf-14,'SiO₂',fs);else{z+=path(`M${a-sw*.6} ${top+H*.55}L${a-sw-12} ${top+H*.35}H${L}`,'#6C8D9E',1)+text(L,top+H*.35-10,'間隔層',fs,'start');}}
 return group(z,`transform="translate(${dx} 0)"`);};
 v+=group(s.newWafer?wafer((s.incoming-1)*w*1.2,true):wafer(s.out*w*1.2,false),'clip-path="url(#frame)"');
 if(s.t>=3&&s.t<10){for(let i=0;i<5;i++){const p=((s.t-3)*.28+i*.2)%1,x=w*(.18+i*.16),end=x>a&&x<b?ty-T*s.coat:Y-T*s.coat;v+=circle(x,45+p*(end-52),4,'none','stroke="#A6BDAA"');}}
 if(s.t>=10&&s.t<20){for(let i=0;i<5;i++){const p=((s.t-10)*.40+i*.2)%1,x=w*(.18+i*.16),end=x>a&&x<b?ty-T*(1-s.etch):Y-T*(1-s.etch),y=48+p*(end-65);v+=arrow(x,y,0,18,'#A89ABB');}const p=((s.t-10)*.3)%1;v+=circle(c+(R-c)*p,ty-12+(h*.18-ty+12)*p,3,'none','stroke="#A0B6C0"')+text(R,h*.18-10,'排氣',sm,'end');}
 v+=text(c,h-13,s.t<10?'同一層膜連續覆蓋三種表面':s.t<21?'水平區較快移除，側壁也逐漸變薄':s.t<24?'保留原線條與側壁殘膜':s.t<26?'完成件 →':'← 新線條基板',sm,'middle','#5B6B75');return v;
}
