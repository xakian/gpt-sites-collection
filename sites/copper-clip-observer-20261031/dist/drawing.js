import {R,P,T} from './svg.js';import {colors as c} from './materials.js';
export function draw(s,w,h){
 const sx=Math.min((w-60)/560,1.55),sy=Math.min(sx*1.5,(h-140)/300),ox=(w-560*sx)/2,oy=80+35*sy+(h-140-300*sy)/2,shift=-(1-s.enter)*(w+300)+s.exit*(w+300),dy=-80*(1-s.die),cx=(w+300)/sx*(1-s.clipEnter),cy=-65*(1-s.clipDown),b=[];
 const box=(x,y,ww,hh,color)=>R(x,y,ww,hh,color,`stroke="${c.line}" stroke-width="1"`)+P(`M${x} ${y}l16 -9h${ww}l-16 9Z`,color,`stroke="${c.line}" stroke-width=".8" opacity=".65"`);
 b.push(R(5,224,550,13,c.carrier,`stroke="${c.line}"`),R(35,210,30,14,c.carrier),R(285,210,30,14,c.carrier),R(460,210,30,14,c.carrier),box(0,190,330,20,c.frame),box(420,190,140,20,c.frame));
 if(s.bottomSolder>0)b.push(R(130,188,180,2+s.wet*2,c.solder,`opacity="${s.bottomSolder}"`));
 b.push(`<g transform="translate(0 ${dy})">`,box(130,140,180,45,c.die),R(130,135,180,5,c.metal),R(130,185,180,3,c.metal));
 if(s.topSolder>0)b.push(R(150,128,145,7,c.solder,`opacity="${s.topSolder}"`));b.push('</g>');
 if(s.topSolder>0)b.push(R(435,180,65,10,c.solder,`opacity="${s.topSolder}"`));
 if(s.t>=10){b.push(`<g transform="translate(${cx} ${cy})">`,P('M150 112H295L332 100L435 164H500V180H422L330 122L300 128H150Z',c.clip,`stroke="${c.line}" stroke-width="1.5"`),P('M150 112l16 -9h132l36 -11 103 64h79l-16 8h-65l-103 -64 -37 12Z',c.clip,`opacity=".55" stroke="${c.line}"`));if(s.toolExit<1)b.push(`<g transform="translate(0 ${-150*s.toolExit})" opacity="${1-s.toolExit}">`,R(210,59,30,53,'#DCE5E9',`stroke="${c.line}"`),R(194,46,62,13,'#DCE5E9',`stroke="${c.line}"`),'</g>');b.push('</g>');}
 if(s.wet>0){b.push(P(`M${150-4*s.wet} 135Q150 128 155 128H291Q298 128 ${300+2*s.wet} 135Z`,c.solder),P(`M${435-4*s.wet} 190Q435 180 441 180H495Q503 180 ${504+2*s.wet} 190Z`,c.solder));}
 if(s.heat>0)for(const x of [160,260,460])b.push(P(`M${x} 20q-11 11 0 22t0 22`,'none',`stroke="${c.heat}" stroke-width="2" opacity="${s.heat}"`));
 if(s.cooled&&s.exit===0)b.push(P('M210 135V120H290L332 111L435 172H470V200','none',`stroke="${c.top}" stroke-width="3" stroke-dasharray="6 4"`),P('M210 186V200H45','none',`stroke="${c.bottom}" stroke-width="3" stroke-dasharray="6 4"`));
 let out=`<g transform="translate(${ox+shift} ${oy}) scale(${sx} ${sy})">${b.join('')}</g>`+T(w/2,28,s.stage.title,18);
 const note=s.t<3?'獨立端子・上下金屬化晶粒':s.t<7?'底面電極落在焊料上':s.t<10?'頂面與右側各一處接合材料':s.t<15?'整片金屬橋・跨越側壁':s.t<18?'工具退出・承托保留':s.t<23?'三處焊料潤濕・銅夾保持形狀':s.t<27.5?'頂面 → 端子 B；底面 → 端子 A':'完成件保留焊點退出';out+=T(w/2,55,note,14);
 if(s.enter===1&&s.exit===0){out+=T(ox+70*sx,oy+237*sy+22,'端子 A',15)+T(ox+480*sx,oy+237*sy+22,'端子 B',15);if(s.t>=10&&s.clipEnter===1)out+=T(ox+330*sx,oy+92*sy-14,'銅夾',15);}
 [['銅夾',c.clip],['晶粒',c.die],['焊料',c.solder]].forEach(([txt,col],i)=>{const x=(i+.5)*w/3;out+=R(x-38,h-28,11,11,col)+T(x+8,h-18,txt,14);});return out;
}
