import {rect,text,line,circle,path,legend} from './svg.js';import {coord,isDefect,total} from './model.js';
export function draw(s,l){const {width:W,height:H,x,w,y,depth:d,skew:z,mx,my,mw,ch}=l,shift=-(1-s.entry)*(W+w)+s.exit*(W+w),px=x+w*(s.posCol+.5)/8+z*(s.posRow+.5)/6,py=y-d*(s.posRow+.5)/6,probeY=py-(l.short?34:l.compact?44:54),ifaceY=py+14,bodyH=34,waterY=Math.max(63,y-d-83),waterH=y+44-waterY;
let out=`<defs><clipPath id="work"><rect x="0" y="60" width="${l.stacked?W:W*.57}" height="${H-80}"/></clipPath></defs>`+legend([['water','耦合水'],['mold','封裝'],['interface','選定界面'],['defect','既有分層']],W);out+=rect(x-15,waterY,w+z+30,waterH,'water');
let a=path(`M${x} ${y}h${w}v${bodyH}h${-w}Z`,'side outline')+path(`M${x+w} ${y}l${z} ${-d}v${bodyH}l${-z} ${d}Z`,'side2 outline')+path(`M${x} ${y}l${z} ${-d}h${w}l${-z} ${d}Z`,'mold outline');
a+=path(`M${x+9} ${y-5}l8 -2l-6 -5Z`,'mark');
if(s.cut>0){a+=`<g opacity="${s.cut}">`+path(`M${x+2} ${y+14}l${z} ${-d}h${w-4}l${-z} ${d}Z`,'interface outline');const fx=x+w*4/8+z*2/6,fy=y-d*2/6+14;a+=path(`M${fx} ${fy}h${w*2/8}l${z*2/6} ${-d*2/6}h${-w*2/8}Z`,'defect outline')+'</g>';}
let probe=rect(px-11,probeY-25,22,25,'probe')+path(`M${px-11} ${probeY}Q${px} ${probeY+6} ${px+11} ${probeY}`,'lens');
if(s.active){probe+=line(px,probeY+3,px,ifaceY,'beam');const u=s.pulse<.4?s.pulse/.4:s.pulse<.8?1-(s.pulse-.4)/.4:0,yy=probeY+3+(ifaceY-probeY-3)*u;probe+=path(`M${px-7} ${yy}q7 ${s.pulse<.4?5:-5} 14 0`,'pulse',`stroke-width="${s.defect&&s.pulse>=.4?4:2}"`)+circle(px,py,3,'cursor');if(s.gate)probe+=rect(px-18,probeY-29,36,32,'gate');}
out+=`<g clip-path="url(#work)"><g transform="translate(${shift} 0)">${a}</g>${probe}</g>`;
const label=s.index===0?'既有分層 · 教學剖切':s.active?`封裝 #${s.cycle+1} · 座標 ${s.col+1},${s.row+1}`:`封裝 #${s.cycle+1} · 缺陷原樣保留`;out+=text(x+(w+z)/2,y+64,label,l.compact?'small':'');
let b=text(mx,my,'C 掃描 · 選定界面','','start')+text(mx,my+20,`已測 ${s.count} / ${total}`,'small','start'),gy=my+34,cw=mw/8;
for(let i=0;i<total;i++){const c=coord(i),filled=i<s.count,xx=mx+c.col*cw,yy=gy+c.row*ch;b+=rect(xx+1,yy+1,cw-2,ch-2,filled?(isDefect(c.col,c.row)?'amplitude-high':'amplitude-low'):'unmeasured',`data-cell="${i}" data-measured="${filled}"`);}
if(s.active&&s.t>=14)b+=rect(mx+s.col*cw,gy+s.row*ch,cw,ch,'gate');if(s.review)b+=rect(mx+4*cw,gy+2*ch,2*cw,2*ch,'review');
const ly=gy+6*ch+18;b+=rect(mx,ly-10,12,10,'amplitude-low')+text(mx+17,ly,'參考','small','start')+rect(mx+65,ly-10,12,10,'amplitude-high')+text(mx+82,ly,'高幅值','small','start')+rect(mx+145,ly-10,12,10,'unmeasured')+text(mx+162,ly,'未測','small','start');
b+=text(mx,ly+19,s.saved?`已留存 #${s.saved} · 結果副本`:s.review?'差異區待判讀':s.t<14?'單點示範，尚未開始成圖':s.gate?'時間窗回波已接收':'發送／接收，等待入窗','small','start');
if(s.saved){const ax=mx+mw-52,ay=my-15;b+=rect(ax-3,ay-3,54,41,'saved');for(let row=0;row<6;row++)for(let col=0;col<8;col++)b+=rect(ax+col*6,ay+row*5,5,4,isDefect(col,row)?'amplitude-high':'amplitude-low');}
out+=`<g data-sample-count="${s.count}" data-column="${s.col}" data-row="${s.row}">${b}</g>`;const cap=['水耦合，缺陷早已存在','正常參考：選取同深度回波','分層位置：較強反射','探頭與圖格同步，未測保持空白','訊號圖，需與正常參考比較','檢測不修補缺陷'];if(!l.compact)out+=text(W/2,H-16,cap[s.index]);return out;}
