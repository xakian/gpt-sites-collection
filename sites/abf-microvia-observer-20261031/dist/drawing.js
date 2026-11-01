import {colors as c} from './materials.js';
const rect=(x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="${Math.max(0,h)}" fill="${fill}" ${extra}/>`;
const path=(d,fill,extra='')=>`<path d="${d}" fill="${fill}" ${extra}/>`;
const text=(x,y,s,size=16,extra='')=>`<text x="${x}" y="${y}" text-anchor="middle" fill="${c.ink}" font-size="${size}" ${extra}>${s}</text>`;
export function draw(s,w,h){
 const scale=Math.min((w-60)/560,1.6),sy=Math.min(scale*1.3,(h-160)/321),ox=(w-560*scale)/2,oy=95+65*sy+(h-160-321*sy)/2,shift=-(1-s.enter)*(w+200)+s.exit*(w+200),fy=-100*(1-s.film),depth=80*s.hole,body=[];
 body.push(rect(0,156,560,62,c.base,`stroke="${c.line}"`),rect(155,140,115,16,c.copper,`stroke="${c.line}"`),rect(395,140,95,16,c.copper,`stroke="${c.line}"`));
 if(s.film>0){body.push(`<g transform="translate(0 ${fy})">`,rect(0,60,560,80,c.abf,`stroke="${c.line}"`));body.push(rect(0,140,155,16,c.abf),rect(270,140,125,16,c.abf),rect(490,140,70,16,c.abf));if(s.hole>0)body.push(path(`M174 59H250L${250-15*s.hole} ${60+depth}H${174+15*s.hole}Z`,c.paper,`stroke="${c.line}"`));body.push('</g>');}
 if(s.hole===1&&s.clean<1)body.push(rect(189,137,46,3,c.residue,`opacity="${1-s.clean}"`));
 if(s.t>=6.3&&s.t<9.7)body.push(rect(188,-56,48,28,'#E0E7EA',`stroke="${c.line}"`),path(`M212 -28V${60+depth-3}`,'none',`stroke="${c.laser}" stroke-width="3" stroke-dasharray="7 3"`));
 if(s.t>=10.3&&s.t<12.6){for(let i=0;i<5;i++){let p=(s.t*1.5+i*.2)%1;body.push(path(`M${201+i*5} ${-15+p*140}l-4 8`,'none',`stroke="${c.liquid}" stroke-width="2"`));}body.push(path('M230 134Q300 90 315 30','none',`stroke="${c.liquid}" stroke-width="2" stroke-dasharray="5 5"`));}
 if(s.seed>0){body.push(path('M0 60H174L189 140H235L250 60H560','none',`stroke="${c.seed}" stroke-width="5" stroke-linejoin="round" pathLength="1" stroke-dasharray="${s.seed} 1" opacity="${1-s.etch}"`));if(s.etch>0)body.push(path('M144 60H174L189 140H235L250 60H282 M392 60H494','none',`stroke="${c.seed}" stroke-width="5"`));}
 if(s.resist>0)body.push(`<g opacity="${s.resist}">`,rect(0,27,144,30,c.resist),rect(282,27,110,30,c.resist),rect(494,27,66,30,c.resist),'</g>');
 if(s.fill>0){const yy=140-80*s.fill,xx=189-15*s.fill;body.push(path(`M${xx} ${yy}H${235+15*s.fill}L235 140H189Z`,c.copper));}
 if(s.pad>0)body.push(rect(144,60-25*s.pad,138,25*s.pad,c.copper),rect(392,60-25*s.pad,102,25*s.pad,c.copper));
 if(s.t>=20&&s.t<25)body.push(path('M0 60H-14V-50H60','none',`stroke="${c.line}" stroke-width="2"`),rect(60,-65,74,30,'#EBF0F2',`stroke="${c.line}"`),`<text x="97" y="-45" text-anchor="middle" font-size="17" fill="${c.ink}">−　＋</text>`,path('M134 -50H490V-8','none',`stroke="${c.line}" stroke-width="2"`),rect(460,-8,60,12,c.copper));
 if(s.isolated&&s.t<31.5)body.push(path('M212 45V148','none',`stroke="${c.connection}" stroke-width="3" stroke-dasharray="6 4"`));
 const label=(x,y,tx,ty,str)=>path(`M${ox+x*scale} ${oy+y*sy}L${tx} ${ty-18}`,'none',`stroke="${c.line}" stroke-width="1"`)+text(tx,ty,str,15);
 let out=`<g transform="translate(${ox+shift} ${oy}) scale(${scale} ${sy})" stroke-width="1.3">${body.join('')}</g>`+text(w/2,30,s.stage.title,18);
 const caption=s.t<2?'同一載板・局部剖視':s.t<6?'ABF 覆蓋原有銅墊':s.t<10?'孔底停在捕捉墊':s.t<13?'清除殘膠・露出銅面':s.t<17?'化學鍍銅・不接電源':s.t<20?'只在開口內鍍厚':s.t<25?'電鍍・連續薄銅供電':s.t<28?'先去膜，再移除外露薄銅':s.t<31.5?'中央上下接通・鄰圖形隔離':'完成件退出 → 新原料進場';
 out+=text(w/2,58,caption,14);
 if(s.enter===1&&s.exit===0){out+=label(210,152,ox+185*scale,oy+256*sy,'捕捉墊');out+=label(442,153,ox+450*scale,oy+256*sy,'相鄰銅墊');}
 [['銅',c.copper],['絕緣樹脂',c.abf],['抗鍍層',c.resist]].forEach(([name,col],i)=>{const xx=(i+.5)*w/3;out+=rect(xx-40,h-29,12,12,col)+text(xx+6,h-18,name,14);});return out;
}
