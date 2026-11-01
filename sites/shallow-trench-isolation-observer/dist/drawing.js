import {rect,path,text,circle,group,arrow} from './svg.js';
export function draw(s,w,h){
 const fs=w<600?15:17,sm=w<600?13:15,L=.08*w,R=.92*w,c=w/2,tw=Math.min(300,.40*w),a=c-tw/2,b=c+tw/2,Y=h*.44,D=Math.min(70,w*.12,h*.22),base=Math.min(90,h*.22,h-Y-D-62),ph=6,nh=18,mt=Y-ph-nh;
 const frame=rect(0,0,w,h,'white'),outY=Math.max(40,h*.12);
 let v=`<defs><clipPath id="frame">${frame}</clipPath></defs>`+text(c,Math.max(22,h*.07),s.t<8?'開口內矽 → 氣態產物':s.t<12?'熱氧化：同時消耗矽':s.t<19?'O₃-TEOS SACVD':s.t<24?'CMP':s.t<27?'選擇性去SiN':'保留槽內氧化物',sm);
 const wafer=(dx,fresh)=>{const q=fresh?{etch:0,liner:0,fill:0,cmp:0,strip:0,pad:0}:s,d=D*q.etch,ll=9*q.liner,cl=a-.44*ll,cr=b+.44*ll,cb=Y+d+.44*ll,il=a+.56*ll,ir=b-.56*ll,ib=Y+d-.56*ll;
 let z=`<path d="M${L} ${Y}H${cl}V${cb}H${cr}V${Y}H${R}V${Y+D+base}H${L}Z" fill="#CAD6DE" stroke="#718691" stroke-width="1.3"/>`;
 if(ll>0)z+=path(`M${a+.06*ll} ${Y}V${Y+d-.06*ll}H${b-.06*ll}V${Y}`,'#B7D9E5',ll);
 if(q.fill>0){const r=(D+ph+nh+15)*q.fill,top=mt-r,cut=top+r*q.cmp+ph*q.pad;let shape=`M${L} ${top}H${R}V${mt}H${b}V${Y}H${ir}V${ib}H${il}V${Y}H${a}V${mt}H${L}Z`;
 const vl=a+r,vr=b-r,vb=ib-r;if(vl<vr&&vb>top)shape+=`M${vl} ${top-1}V${vb}H${vr}V${top-1}Z`;
 z+=`<defs><clipPath id="fillcut">${rect(q.cmp===1?a:0,cut,q.cmp===1?b-a:w,h,'white')}</clipPath></defs><path d="${shape}" fill="#DBEAF0" fill-rule="evenodd" stroke="#86A5B6" stroke-width="1" clip-path="url(#fillcut)"/>`;
 }
 const pH=ph*(1-q.pad),nH=nh*(1-q.strip);
 for(const [x,ww] of [[L,a-L],[b,R-b]]){if(pH>0)z+=rect(x,Y-pH,ww,pH,'#B7D9E5');if(nH>0)z+=rect(x,Y-ph-nH,ww,nH,'#C6BEDB','stroke="#8C84A3"');}
 z+=text((L+a)/2,Y+D+base*.65,'矽',fs)+text((b+R)/2,Y+D+base*.65,'矽',fs);
 if(q.strip<1){if(q.strip<.25)z+=text((L+a)/2,Y-ph-nH/2+5,'SiN',fs);z+=path(`M${R+5} ${Y-ph/2}H${R+15}V${Y+24}`,'#8CA9B7',1)+text(R-3,Y+42,'墊氧化層',sm,'end');}
 if(q.liner>0&&q.fill===0)z+=text(c,Y+d+30,'熱襯層 SiO₂',fs);
 if(q.fill>.6)z+=text(c,Y+d*.65,'SiO₂',fs);
 if(!fresh&&s.t>=8&&s.t<12)z+=path(`M${a} ${Y}V${Y+D}H${b}V${Y}`,'#526D7D',1,'stroke-dasharray="4 4"');
 z+=text(c,Y+D+base+24,'底部矽保持連續',sm,'middle','#5B6B75');
 if(!fresh&&s.t>=19&&s.t<24){const rr=D+ph+nh+15,ty=mt-rr*(1-q.cmp)-8;z+=rect(L,ty-7,R-L,7,'#D1D9DE','rx="3"')+arrow(c-25+18*Math.sin(s.t*2),ty-17,50,0,'#7D8D97');}
 return group(z,`transform="translate(${dx} 0)"`);};
 v+=group(s.newWafer?wafer((s.incoming-1)*w*1.2,true):wafer(s.out*w*1.2,false),'clip-path="url(#frame)"');
 if(s.t>=3&&s.t<8){for(let i=0;i<3;i++){const p=((s.t-3)*.35+i/3)%1;v+=circle(c+(R-c)*p,Y+D*s.etch+(outY-Y-D*s.etch)*p,3,'none','stroke="#A5B4BD"');}v+=text(R,outY-10,'排出',sm,'end');}
 if(s.t>=12&&s.t<19){for(let i=0;i<4;i++){const p=((s.t-12)*.35+i*.25)%1;v+=circle(w*(.2+i*.2),30+p*Math.max(1,mt-45-(D+ph+nh+15)*s.fill),4,'none','stroke="#A3B9A7"');}}
 if(s.t>=24&&s.t<29){for(let i=0;i<3;i++){const p=((s.t-24)*.4+i/3)%1;v+=circle(w*.25+(w*.68)*p,mt-8+(outY-mt+8)*p,3,'none',`stroke="${s.t<27?'#B1A4C5':'#A7C5D2'}"`);}}
 v+=text(c,h-13,s.t<8?'移除局部矽，保留底部基板':s.t<12?'虛線為原槽輪廓':s.t<24?'從同一槽持續形成絕緣區':s.t<32?'去遮罩與整平分開進行':s.t<34?'完成件 →':'← 新圖案化基板',sm,'middle','#5B6B75');return v;
}
