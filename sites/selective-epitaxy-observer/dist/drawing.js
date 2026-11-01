import {rect,path,text,circle,group,arrow} from './svg.js';
export function draw(s,w,h){
 const fs=w<600?15:17,small=w<600?13:15,L=w*.10,R=w*.88,sx=w*.36,sw=w*.28,Y=h*(h<320?.59:.63),th=Math.min(90,h*.18),mh=Math.min(85,h*.24),gh=mh*.74*s.growth,top=Math.max(45,h*.16),outY=Math.max(72,h*.30);
 let v=`<defs><clipPath id="frame"><rect width="${w}" height="${h}"/></clipPath></defs>`;
 v+=text(w*.5,Math.max(25,h*.075),'DCS／HCl／H₂',small,'middle','#5B6B75');
 v+=path(`M${w*.88} ${outY}H${w*.98}`,'#8B9BA6',1.4)+text(w*.89,outY-12,'排出',small);
 const wafer=(shift,fresh)=>{
  const growth=fresh?0:gh,prep=fresh?0:s.prep;
  let a=rect(L,Y,R-L,th,'#CAD6DE','stroke="#6C808D"')+rect(L,Y-mh,sx-L,mh,'#DBE9EF','stroke="#7D9AA9"')+rect(sx+sw,Y-mh,R-sx-sw,mh,'#DBE9EF','stroke="#7D9AA9"');
  a+=text((L+sx)/2,Y+th*.65,'單晶矽',fs)+text((L+sx)/2,Y-mh*.5+5,'SiO₂',fs)+text((sx+sw+R)/2,Y-mh*.5+5,'SiO₂',fs);
  if(growth>.01)a+=rect(sx,Y-growth,sw,growth,'#AFC7CF','stroke="#708E9C" stroke-width="1"');
  if(prep<1)a+=rect(sx,Y-4*(1-prep),sw,4*(1-prep),'#DBC9B6');
  for(let i=0;i<6;i++){const x=sx+sw*(i+.5)/6;a+=path(`M${x} ${Y-growth}V${Y+th-12}`,'#7C96A4',.8,'opacity=".55"');for(let k=-6;k<6;k++){const y=Y+k*17;if(y>=Y-growth+3&&y<Y+th-13)a+=circle(x,y,1.6,'#6D8797');}}
  for(let k=-6;k<6;k++){const y=Y+k*17;if(y>=Y-growth&&y<Y+th-12)a+=path(`M${sx+5} ${y}H${sx+sw-5}`,'#7C96A4',.8,'opacity=".45"');}
  a+=path(`M${sx} ${Y}H${sx+sw}`,'#526D7D',1.3,'stroke-dasharray="5 4"');
  a+=text(w*.49,Y+th+24,'虛線：原始矽表面',small,'middle','#5B6B75');
  if(growth>14)a+=text(w*.50,Y-growth-13,'新增矽',fs);else if(prep===1)a+=text(w*.50,Y-14,'暴露矽面',fs);else a+=text(w*.50,Y-14,'表面薄層',fs);
  return group(a,`transform="translate(${shift} 0)"`);
 };
 v+=group(s.newWafer?wafer((s.incoming-1)*w*1.2,true):wafer(s.out*w*1.2,false),`clip-path="url(#frame)"`);
 if(s.gas){for(let i=0;i<5;i++){const p=((s.t-7)*.25+i*.2)%1,x=w*(.18+i*.15),inWindow=x>sx&&x<sx+sw,hitY=inWindow?Y-gh-6:Y-mh-6;let px=x,py=top+p*(hitY-top);if(!inWindow&&p>.55){const q=(p-.55)/.45;px=x+(w*.98-x)*q;py=top+.55*(hitY-top)+(outY-top-.55*(hitY-top))*q;}v+=circle(px,py,5,'none','stroke="#A4B7A5" stroke-width="1.4"');}v+=arrow(w*.17,top-8,0,24,'#A2B7A4')+arrow(w*.50,top-8,0,24,'#A2B7A4');}
 if(s.t>=2&&s.t<6){for(let i=0;i<3;i++){const p=((s.t-2)*.35+i/3)%1;v+=circle(w*.5+(w*.48)*p,Y-9+(outY-Y+9)*p,3,'#CCB69B');}}
 if(s.t>=11&&s.t<25){const p=((s.t-11)*.32)%1;v+=circle(w*.64+w*.34*p,Y-gh-18+(outY-Y+gh+18)*p,3,'none','stroke="#A8B7BF"');}
 v+=text(w*.5,h-13,s.t<7?'先準備晶面，再開始成長':s.t<24?'氣體可到達遮罩；晶向由矽延續':s.t<26?'新晶體保留':s.t<28?'完成件 →':'← 新開窗晶圓',small,'middle','#5B6B75');
 return v;
}
