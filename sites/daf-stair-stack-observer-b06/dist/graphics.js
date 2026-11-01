import {layout} from './layout.js';import {ease} from './model.js';
const C={die:'#AFC4D1',track:'#7CA4BD',film:'#BFA9C9',cure:'#9C86AF',tape:'#DCEAF2',board:'#C9D9CB',ink:'#253039',muted:'#5B6B75',pad:'#DCC78E',tool:'#E3E8EB'};
const rect=(x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${fill}" stroke="#657783" stroke-width="1.2" ${extra}/>`;
const text=(x,y,s,f=16,fill=C.ink,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${f}" fill="${fill}">${s}</text>`;
function chip(x,y,w,h,i,cured,highlight=false){return `<g data-die="${i+1}">${rect(x,y,w,h,i===1?C.track:C.die)}${rect(x,y+h,w,5,cured?C.cure:C.film)}${[0,1,2].map(k=>rect(x+5,y+3+k*7,13,4,C.pad)).join('')}${text(x+w*.55,y+h*.7,['①','②','③'][i],16)}${highlight?`<rect x="${x+1}" y="${y-3}" width="22" height="${h+5}" rx="4" fill="none" stroke="#AA8426" stroke-width="2.5"/>`:''}</g>`;}
export function draw(s,size){const L=layout(size),{w,h,chipW:cw,chipH:ch,offset:o,source:a,target:b,font:f,mobile}=L;let out='';
const oldShift=s.exit*(w+cw),newShift=(1-s.enter)*(-w-cw);const cycle=s.t>=30.3;const shift=cycle?newShift:oldShift;const a2={x:a.x+shift,y:a.y},b2={x:b.x+shift,y:b.y};
out+=`<defs><clipPath id="tape-window"><rect x="${a2.x-20}" y="${a.y-115}" width="${cw+40}" height="180"/></clipPath></defs>`;
out+=`<g>${rect(a2.x-20,a.y+ch+6,cw+40,11,C.tape)}${rect(a2.x-30,a.y+ch+17,cw+60,13,C.tool)}${text(a2.x+cw/2,a.y+ch+54,'切割膠帶 · 留在框架',f)}</g>`;
out+=rect(b2.x-25,b.y+ch+5,cw+o*2+50,18,C.board)+rect(b2.x-18,b.y+ch+23,cw+o*2+36,12,C.tool)+text(b2.x+cw/2+o,b.y+ch+58,'封裝基板與承托',f);
if(!cycle){for(const c of s.chips){if(c.p===0){if(s.t>=c.i*7&&s.t<=2+c.i*7)out+=`<g clip-path="url(#tape-window)">${chip(a2.x-(1-c.feed)*(cw+50),a.y,cw,ch,c.i,false)}</g>`;continue;}const start={x:a2.x,y:a.y},end={x:b2.x+c.i*o,y:b.y-c.i*(ch+5)};let x,y;
if(c.p<.24){x=start.x;y=start.y-(start.y-Math.max(85,start.y-60))*ease(c.p/.24);}else if(c.p<.65){x=start.x+(end.x-start.x)*ease((c.p-.24)/.41);y=Math.max(85,start.y-60)+(Math.max(85,Math.min(start.y,end.y)-65)-Math.max(85,start.y-60))*ease((c.p-.24)/.41);}else{x=end.x;y=Math.max(85,Math.min(start.y,end.y)-65)+(end.y-Math.max(85,Math.min(start.y,end.y)-65))*ease((c.p-.65)/.35);}
out+=chip(x,y,cw,ch,c.i,s.cured,s.t>=26&&s.t<29&&Math.floor(s.t-26)===c.i);
if(c.p<1){out+=rect(x+cw*.25,y-24,cw*.5,24,C.tool)+`<path d="M${x+cw*.5} ${y-24}v-24" stroke="#81939D" stroke-width="5"/>`;if(c.p<.24)out+=rect(a2.x+cw*.35,a.y+ch+30,cw*.3,10,C.tool);}}}
else out+=chip(a2.x,a.y,cw,ch,0,false);
if(s.t>=23&&s.t<26)out+=`<path d="M${b2.x-40} ${b.y+ch+18}v-${ch*3+45}h${cw+o*2+80}v${ch*3+45}" fill="none" stroke="#C29E83" stroke-width="5" stroke-dasharray="5 4"/>`;
out+=text(w/2,mobile?22:28,s.t>=23&&s.t<26?'爐固化 · 時間壓縮':s.t>=26&&s.t<29?'外露焊墊：等待後續打線':'紫色 DAF 非導電 · 正面朝上',f);

return out;}




