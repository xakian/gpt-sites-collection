import {rect,path,text,circle,group,arrow} from './svg.js';
const C={si:'#CBD6DD',al:'#91A9B8',ar:'#C5B9DA',line:'#788A95',muted:'#5B6B75'};
export function draw(s,w,h){
 const fs=w<600?15:17,small=w<600?13:15,L=w*.12,R=w*.86,ty=Math.max(70,h*.22),wy=h*.65,ww=w*.64,wx=w*.18,th=Math.min(46,h*.10),fh=22*s.film;
 let v=`<defs><clipPath id="frame"><rect width="${w}" height="${h}"/></clipPath></defs>`;
 v+=path(`M${w*.08} ${ty-25}V${wy+th+32}H${w*.93}V${ty-25}H${w*.08}`,C.line,1.4);
 v+=rect(w*.25,ty,w*.48,24,C.al,'stroke="#657985"')+text(w*.49,ty+17,'鋁靶 Al（−）',fs);
 v+=path(`M${w*.04} ${ty+50}H${w*.19}`,C.line,2)+text(w*.13,ty+31,'Ar 入口',small);
 v+=path(`M${w*.86} ${wy+th+13}H${w*.97}`,C.line,2)+text(w*.88,wy+th+51,'排氣',small);
 v+=rect(wx-8,wy+th+4,ww+16,10,'#DCE3E7','rx="3"')+text(w*.5,wy+th+24,'承載台',small);
 v+=path(`M${R} ${ty+45}V${wy-20}`,C.line,4)+text(R-7,ty+68,'擋板',small,'end',C.muted);
 let wafer=(offset,film)=>group(rect(wx,wy,ww,th,C.si,'stroke="#657985"')+(film?rect(wx,wy-film,ww,film,C.al,'stroke="#657985" stroke-width=".8"'):'')+text(w*.5,wy+th*.62,'矽晶圓',fs)+(film>6?text(wx+ww*.6,wy-film-10,'鋁膜 Al',fs):''),`transform="translate(${offset} 0)"`);
 v+=group(s.newWafer?wafer((s.incoming-1)*w*1.2,0):wafer(s.out*w*1.2,fh),`clip-path="url(#frame)"`);
 const gap=wy-ty-40;
 if(s.t<4||s.gas||s.t>=22&&s.t<25){for(let i=0;i<4;i++){const f=(s.t*.17+i*.25)%1;const x=w*(.2+.69*f),y=ty+50+gap*.55+Math.sin(i*2)*14;v+=circle(x,y,6,'none',`stroke="${C.ar}" stroke-width="1.4"`);}v+=arrow(w*.85,wy+th+13,w*.1,0,C.ar);}
 if(s.t>=6&&s.t<7){const p=s.t-6;v+=circle(w*(.18+p*.17),ty+24+gap*.58,3,'#6E86A4')+text(w*(.18+p*.17),ty+gap*.58+6,'e⁻',small)+circle(w*.35,ty+24+gap*.58,9,'none','stroke="#9383AE"');}
 if(s.t>=7&&s.t<23.2){
  for(let i=0;i<3;i++){
   const base=7+i;if(s.t<base)continue;const n=Math.min(3,Math.floor((s.t-base)/3.8)),start=base+n*3.8;let ph=s.t-start;const hitX=w*(.35+i*.13);
   if(ph<1.2){let y=ty+24+(gap*.58)*(1-ph/1.2);v+=circle(hitX,y,9,C.ar,'stroke="#9383AE"')+text(hitX,y+5,'+',15)+(y>ty+42?text(hitX+13,y+5,'Ar⁺',small,'start'):'');}
   if(ph>=1.2&&ph<2.7){let p=(ph-1.2)/1.5,ex=i===2?R:wx+ww*(.25+i*.27),ey=i===2?wy-gap*.12:wy-fh;let x=hitX+(ex-hitX)*p,y=ty+24+(ey-ty-24)*p;v+=path(`M${hitX} ${ty+24}L${x} ${y}`,C.al,1,'stroke-dasharray="3 5"')+circle(x,y,5,C.al,'stroke="#657985"')+(y>ty+48&&y<wy-fh-35?text(x-8,y-9,'Al',small,'end'):'');
    const ax=hitX+(w*.88-hitX)*p,ay=ty+29+(gap*.38)*p;v+=circle(ax,ay,5,'none',`stroke="${C.ar}"`);
   }

  }
 }
 v+=circle(R,wy-gap*.12,5,C.al);
 v+=text(w*.5,Math.max(24,h*.08),s.plasma?'Ar⁺ 撞靶 → Al 離開靶材':s.t<7?'固定腔體剖視':s.t<26?'停止放電，固體膜留下':s.t<28?'鍍膜完成件 →':'← 下一片晶圓',fs,'middle',C.muted);
 v+=text(w*.5,h-15,'Ar⁺：提供撞擊　Al：成膜材料',small,'middle',C.muted);
 return v;
}
