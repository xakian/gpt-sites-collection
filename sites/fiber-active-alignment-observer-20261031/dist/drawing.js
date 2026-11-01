import {R,P,T,C} from './svg.js';import {colors as c} from './materials.js';
export function draw(s,w,h){
const sx=Math.min((w-32)/590,1.6),sy=Math.min(sx*1.7,(h-155)/280),ox=(w-590*sx)/2,oy=80+(h-155-280*sy)/2,shift=-(1-s.enter)*(w+400)+s.exit*(w+400),fy=150+s.offset,b=[],st=`stroke="${c.line}" stroke-width="1.3"`;
b.push(R(20,220,550,18,c.support,st),R(140,195,75,25,c.fixture,st),R(310,170,220,50,c.chip,st),P('M310 95H530L551 79H331Z',c.chip,st),R(310,95,220,75,'#DCE4E9',st),P('M530 95L551 79V205L530 220Z','#AEBEC9',st));
// Inverse taper geometry and the larger entrance mode are different shapes.
b.push(P('M310 148.5L400 145H500V155H400L310 151.5Z',c.wave),P('M310 134Q350 134 400 146H500V154H400Q350 166 310 166Z',c.light,`opacity="${.12+.48*s.power}"`),R(500,138,25,24,'#829CA7',st));
b.push(`<g transform="translate(0 ${s.offset})">`,P('M25 136H258Q280 150 258 164H25Z',c.fiber,st),P('M25 148H261V152H25Z',c.core),P('M25 150H265','none',`stroke="${c.light}" stroke-width="2"`),'</g>');
b.push(`<ellipse cx="288" cy="${fy}" rx="24" ry="14" fill="${c.light}" opacity=".22"/>`,`<ellipse cx="310" cy="150" rx="9" ry="16" fill="none" stroke="${c.wave}" stroke-dasharray="3 3"/>`);
for(const sign of [-1,1])b.push(P(`M270 ${fy}Q288 ${fy+sign*22} 305 ${fy+sign*35}`,'none',`stroke="${c.loss}" stroke-width="2" stroke-dasharray="4 4" opacity="${s.loss*.65}"`));
if(s.glue>0)b.push(P(`M145 195V${fy+14}Q173 ${fy+5} 210 ${fy+14}V195Z`,s.cure===1?c.solid:c.glue,`opacity="${s.glue*(.55+.35*s.cure)}" ${st}`));
if(s.t>=15&&s.t<18){const x=145+60*s.glue;b.push(P(`M${x} 75v35l-7 15h14l-7 -15`,'none',`stroke="${c.line}" stroke-width="3"`),C(x,135,3,c.glue));}
if(s.release<1){const x=65-65*s.release;b.push(R(x,fy-30-30*s.release,45,16,c.fixture,st),R(x,fy+14+30*s.release,45,16,c.fixture,st),R(x,fy+30+30*s.release,14,220-(fy+30+30*s.release),c.fixture,st));}
if(s.uv){b.push(R(151,65,52,14,'#C5B9D2',st));for(const x of [156,177,198])b.push(P(`M${x} 83L${x} 135`,'none','stroke="#B8A3C9" stroke-width="2" stroke-dasharray="4 5"'));}
// Fixed receiver and electrical measurement wire; dashed feedback is informational.
b.push(P('M525 150H566V255H440','none',`stroke="${c.line}" stroke-width="2"`));if(s.feedback)b.push(P('M440 265H90V215m-6 8l6 -8 6 8','none',`stroke="${c.core}" stroke-width="1.6" stroke-dasharray="4 4"`));
let out=`<g transform="translate(${ox+shift} ${oy}) scale(${sx} ${sy})">${b.join('')}</g>`+T(w/2,27,s.stage.title,18);const notes=['模場偏離 · 部分光未耦入','位置搜尋 · 收光同步改變','逐步細調 · 保留光學間隙','膠在後方固定區','仍可調時補償偏移','停止調位 · 完成固化','已固化 · 鬆夾重測','固定關係保留至退出'];out+=T(w/2,53,notes[s.index],14);
if(s.enter===1&&s.exit===0){out+=T(ox+125*sx,oy+45*sy,'光纖／纖芯',14)+T(ox+422*sx,h<300?oy+70*sy-8:oy+117*sy,'晶片波導',14)+(h>=300?T(ox+510*sx,oy+199*sy,'接收器',14):'');if(s.glue>0&&!s.feedback&&h>=300)out+=T(ox+177*sx,oy+238*sy+23,s.cure===1?'固化固定膠':'固定膠',14);}
const bw=Math.min(175,w-80),bx=(w-bw)/2;out+=T(w/2,h-61,`收光 ${s.power.toFixed(2)} · 相對示意`,14)+R(bx,h-48,bw,9,'#E2E9ED','rx="4"')+R(bx,h-48,bw*s.power,9,c.core,'rx="4"')+T(w/2,h-17,s.cure===1?'固定後重測 · 非百分之百耦合':'固定接收路徑 · 光場非比例',14);return out;
}


