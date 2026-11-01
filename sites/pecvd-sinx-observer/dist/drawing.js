import {rect,path,text,circle,group,arrow} from './svg.js';
const C={si:'#CCD7DE',film:'#A4BEB1',active:'#AE9BC6',gas:'#C7D1D9',line:'#788C97',muted:'#5B6B75'};
export function draw(s,w,h){
 const fs=w<600?15:17,small=w<600?13:15,ty=Math.max(58,h*.18),Y=h*(h<320?.62:.68),st=Math.min(70,h*.14),th=Math.min(46,h*.10),L=w*.15,R=w*.82,sx=w*.42,sw=w*.18,f=18*s.film,side=f*.55;
 let v=`<defs><clipPath id="frame"><rect width="${w}" height="${h}"/></clipPath></defs>`;
 v+=text(w*.5,Math.max(25,h*.07),'SiH₄ · NH₃ · N₂ 入口',small,'middle',C.muted);
 v+=path(`M${w*.5} ${Math.max(28,h*.07)+8}V${ty}`,C.line,2);
 v+=rect(w*.20,ty,w*.60,22,'#D8DDE7','stroke="#788C97"')+text(w*.5,ty+16,s.plasma?'RF 噴淋頭　～':'噴淋頭／上電極',fs);
 for(let i=0;i<9;i++)v+=circle(w*(.25+i*.0625),ty+22,1.8,'#788C97');
 v+=path(`M${w*.08} ${ty-8}V${Y+th+10}H${w*.12}M${w*.92} ${ty-8}V${Y+th+10}H${w*.97}`,C.line,1.4);
 v+=rect(L-8,Y+th+3,R-L+16,10,'#DCCDBA','rx="3"')+text(w*.48,Y+th+29,'加熱載台',small);
 v+=text(w*.89,Y+th+29,'排氣',small);
 const base=`M${L} ${Y}H${sx}V${Y-st}H${sx+sw}V${Y}H${R}V${Y+th}H${L}Z`;
 const film=`M${L} ${Y-f}H${sx-side}V${Y-st-f}H${sx+sw+side}V${Y-f}H${R}V${Y}H${sx+sw}V${Y-st}H${sx}V${Y}H${L}Z`;
 const wafer=(shift,coated)=>group(`<path d="${base}" fill="${C.si}" stroke="#657985" stroke-width="1.3"/>`+(coated&&f>.01?`<path d="${film}" fill="${C.film}" stroke="#698478" stroke-width="1"/>`:'')+text(w*.5,Y+th*.65,'矽基板',fs)+(coated&&f>5?text(w*.26,Y-f-13,'SiNₓ',fs,'middle','#597B69'):''),`transform="translate(${shift} 0)"`);
 v+=group(s.newWafer?wafer((s.incoming-1)*w*1.2,false):wafer(s.out*w*1.2,true),`clip-path="url(#frame)"`);
 const ptop=ty+40,pbottom=Y-st-20;
 if(s.plasma){v+=rect(w*.18,ptop,w*.64,Math.max(5,pbottom-ptop),'#EFEAF5','opacity=".45" rx="20"');for(let i=0;i<3;i++){const ex=w*(.28+i*.19)+Math.sin(s.t*2+i)*6,ey=ptop+(pbottom-ptop)*(.3+.25*(i%2));v+=circle(ex,ey,2.6,'#6E87A4')+text(ex-5,ey-8,'e⁻',12,'end');}v+=circle(w*.69,ptop+(pbottom-ptop)*.6,7,C.active)+text(w*.69,ptop+(pbottom-ptop)*.6+4,'+',13);}
 if(s.gas||s.t>=23&&s.t<25){for(let i=0;i<4;i++){let p=(s.t*.26+i*.25)%1,x=w*(.25+i*.15),end=i===1||i===2?Y-st-f-14:Y-f-14,y=ty+26+p*(end-ty-26);if(s.t<7||s.t>=23)v+=circle(x,y,5,'none',`stroke="${C.gas}" stroke-width="1.2"`);}}
 if(s.t>=7&&s.t<24){for(let i=0;i<4;i++){const baseT=7+i*.6;if(s.t<baseT)continue;let n=Math.min(4,Math.floor((s.t-baseT)/3.0)),start=baseT+n*3,age=s.t-start;if(age>=3)continue;const p=age/3,x=w*(.26+i*.15),end=(i===1||i===2?Y-st:Y)-f,y=ty+28+p*(end-ty-28);v+=`<path d="M${x} ${y-5}l5 5l-5 5l-5-5Z" fill="${i%2?C.film:C.active}" stroke="#7B8291" stroke-width=".8"/>`+circle(x+7,y-4,1.3,'#6F7883');}}
 if(s.t>=10&&s.t<25){for(let i=0;i<3;i++){const p=((s.t-10)*.24+i/3)%1;let x=w*.66+p*w*.30,y=Y-st*.25+Math.sin(p*Math.PI)*-20;v+=circle(x,y,4,'none','stroke="#A8B7BE"');}v+=arrow(w*.84,Y+th+10,w*.12,0,'#A8B7BE');}
 v+=text(w*.5,h-13,s.t<7?'供氣 → 活化 → 表面反應':s.t<23?'· 活性物種　+ 離子　e⁻ 電子':s.t<26?'停氣後，固體膜保留':s.t<28?'完成件 →':'← 新基板',small,'middle',C.muted);
 return v;
}
