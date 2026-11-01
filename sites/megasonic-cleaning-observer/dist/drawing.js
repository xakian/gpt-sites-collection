import {palette as c,rect,path,text,circle,group,arrow} from './svg.js';
export function draw(s,w,h){
 const compact=w<600,fs=compact?15:17,L=w*.09,R=w*.83,Y=h*.64,th=Math.min(65,h*.16),lh=Math.min(140,h*.30),top=Y-lh;
 const raw=(shift,label)=>group(rect(L,Y,R-L,th,c.si,'stroke="#657985" stroke-width="1.3"')+text((L+R)/2,Y+th*.58,'矽晶圓',fs)+circle(w*.34,Y-8,8,c.particle,'stroke="#8B654B" stroke-width="1.3"')+text(w*.34,Y-24,'P',fs)+text((L+R)/2,Y+th+28,label,fs,'middle',c.muted),`transform="translate(${shift} 0)"`);
 let svg=`<defs><clipPath id="frame"><rect width="${w}" height="${h}"/></clipPath></defs>`;
 svg+=text(w*.5,Math.max(28,h*.09),'表面放大剖視',fs,'middle',c.muted);
 svg+=path(`M${R+10} ${top-10}V${Y+th+8}H${w*.96}`,c.line,1.5)+text(w*.90,Y+th+32,'排液',fs);
 svg+=rect(w*.15,top-48,w*.24,16,'#DDD8E7','rx="4" stroke="#9D91B5"')+text(w*.27,top-58,'換能器',fs);
 if(s.newWafer)svg+=group(raw((s.incoming-1)*w*1.15,'下一片'),`clip-path="url(#frame)"`);
 else {
 let wafer=rect(L,Y,R-L,th,c.si,'stroke="#657985" stroke-width="1.3"')+text((L+R)/2,Y+th*.58,'矽晶圓',fs);
 const lheight=lh*s.wet;
 if(lheight>.1){wafer+=rect(L,Y-lheight,R-L,lheight,c.water,'opacity=".85"')+path(`M${L} ${Y-lheight}H${R}`,'#97BECE',1.4);wafer+=text(L+12,top+24,s.t>=18?'超純水':'清洗液',fs,'start','#50788C');
 for(let i=0;i<4;i++){let f=((s.t*.21+i*.25)%1);wafer+=arrow(L+f*(R-L-35),Y-lheight*.48,28,0);}
 wafer+=path(`M${R} ${Y-lheight*.5}Q${R+18} ${Y} ${R+18} ${Y+th-10}L${w*.96} ${Y+th-10}`,'#9DBFCE',5);
 }
 if(s.acoustic){for(let i=0;i<3;i++){let f=((s.t*.55+i/3)%1);let cy=top+15+f*(lh-23);wafer+=path(`M${w*.18} ${cy}Q${w*.27} ${cy+12} ${w*.36} ${cy}`,c.energy,1.7,`opacity="${.8-f*.5}"`);}}
 if(s.t<18){let px=w*.34+(w*.96-w*.34)*s.travel;let py=Y-8-Math.min(55,lh*.45)*s.lift;
 if(s.travel>.72)py+=(Y+th-10-py)*(s.travel-.72)/.28;
 wafer+=circle(px,py,8,c.particle,'stroke="#8B654B" stroke-width="1.3"')+text(px,py-17,'P',fs);
 }else if(s.t<20)wafer+=circle(w*(.96+(s.t-18)*.06),Y+th-10,8,c.particle,'stroke="#8B654B"');
 if(s.t>=21&&s.t<23.5){wafer+=text(w*.5,top+30,'N₂ 輔助乾燥',fs);for(let i=0;i<3;i++)wafer+=arrow(w*(.35+i*.17),top+44,0,Math.min(32,lh*.3),'#A3B7AF');}
 if(s.dry)wafer+=text(w*.46,Y-23,'乾燥表面',fs,'middle','#5E7E72');
 svg+=group(group(wafer,`transform="translate(${s.out*w*1.15} 0)"`),`clip-path="url(#frame)"`);
 }
 svg+=text(w*.5,h-20,s.t<10?'先脫附，再由液流帶走':s.t<18?'同一顆微粒 P → 排液路徑':s.t<24?'沖洗 → 旋乾':s.t<26?'完成件 →':'← 新晶圓',fs,'middle',c.muted);
 return svg;
}
