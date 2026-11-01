import {rect,text,line,path,legend} from './svg.js';
export function draw(s,l){const {width:W,height:H,x,w,y,short}=l,off=(1-s.entry)*(-W)+s.exit*W,bondY=y+24,pw=Math.max(26,w*.12),xs=[x+w*.3,x+w*.68],upperY=y-(short?40:76)+s.approach*(short?44:80),dx=w*.09*(1-s.align),sy=-Math.cos(Math.PI*s.flip),recess=4*(1-s.anneal);let out=legend([['si','晶圓本體'],['oxide','SiO₂'],['cu','Cu 接點']],W)+`<defs><clipPath id="proc"><rect x="0" y="50" width="${W}" height="${H-80}"/></clipPath></defs><g clip-path="url(#proc)"><g transform="translate(${off} 0)">`;
// Lower wafer and embedded copper. Recess is exposed air, not insulating film.
out+=rect(x,bondY+20,w,34,'si')+rect(x,bondY,w,20,'oxide');for(const X of xs){out+=rect(X-pw/2,bondY,pw,recess,'air')+rect(X-pw/2,bondY+recess,pw,20-recess,'cu')+path(`M${X} ${bondY+20}v17h${w*.08}`,'trace');}
out+=path(`M${x+7} ${bondY+24}l9 0v9Z`,'mark');
out+=`<g transform="translate(${dx} ${upperY}) scale(1 ${sy})">`+rect(x,-34,w,34,'si')+rect(x,0,w,20,'oxide');for(const X of xs){out+=rect(X-pw/2,0,pw,20-recess,'cu')+rect(X-pw/2,20-recess,pw,recess,'air')+path(`M${X} 0v-17h${w*.08}`,'trace');}out+=path(`M${x+7} -24l9 0v9Z`,'mark')+'</g>';
if(s.index===0){for(let i=0;i<5;i++){const X=x+w*(.1+.2*i);out+=line(X,bondY-8,X+5,bondY-13,'active')+line(X+dx,upperY-27,X+dx+5,upperY-32,'active');}}
if(s.index<3){out+=text(W/2,short?H-39:bondY+90,s.index===0?'清潔與活化 · 凹陷放大':s.index===1?'上片繞水平軸翻面':'對位標記與銅墊對準','caption');}
if(s.index===2){for(const X of xs)out+=line(X,upperY+21,X,bondY-2,'align');}
if(s.bond>0){const a=W/2-w*s.bond/2,b=W/2+w*s.bond/2,segments=[[x,xs[0]-pw/2],[xs[0]+pw/2,xs[1]-pw/2],[xs[1]+pw/2,x+w]];for(const [lo,hi]of segments){const p=Math.max(lo,a),q=Math.min(hi,b);if(q>p)out+=line(p,bondY,q,bondY,'joined');}}
if(s.index===3)out+=text(W/2,Math.min(H-40,bondY+90),'SiO₂ 預接合 · Cu 尚未接通','caption');
if(s.index===4){for(const xx of [x-17,x+w+17])out+=path(`M${xx} ${bondY+42}q-8 -10 0 -20t0 -20t0 -20`,'heat');out+=text(W/2,Math.min(H-40,bondY+90),'退火 · 銅保持固態','caption');}
if(s.connected){const X=xs[0];out+=path(`M${X+w*.08} ${upperY-17}H${X}V${bondY+37}h${w*.08}`,'flow');out+=text(W/2,Math.min(H-40,bondY+90),'介電固定＋金屬連通','caption');}
out+='</g></g>';if(s.exit>.99)out+=text(W/2,H/2,'新的一對晶圓進場','caption');return out+text(W/2,H-13,'固定局部剖視 · 凹陷與時間非實際比例','small');}
