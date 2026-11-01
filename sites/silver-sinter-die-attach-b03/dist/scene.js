import {rect,text,line,circle,path,legend} from './svg.js';
export function draw(s,l){const {width:W,height:H,x,w,y,k,ix,iy,iw}=l,lh=s.thickness*k,dx=x+w*.2,dw=w*.6,db=y-10*k-lh-(1-s.place)*67*k,shift=-(1-s.entry)*(W+w)+s.exit*(W+w);
let out=`<defs><clipPath id="work"><rect y="68" width="${l.stacked?W:W*.55}" height="${H-80}"/></clipPath></defs>`+legend([['die','晶粒'],['silver','銀'],['organic','有機載體'],['copper','銅墊'],['ceramic','陶瓷'],['tool','承托／壓頭']],W);
let a=rect(x-7,y+38*k,w+14,15*k,'tool')+rect(x,y+15*k,w,23*k,'ceramic')+rect(x+5,y,w-10,15*k,'copper')+rect(x+5,y-10*k,w-10,10*k,'silver');
if(s.print>0){a+=rect(dx,y-10*k-lh,dw*s.print,lh,'organic',`opacity="${s.organic}"`);for(let i=0;i<12;i++){if(i/12>s.print)continue;const xx=dx+(i+.5)*dw/12;for(let j=0;j<2;j++)a+=circle(xx,y-10*k-lh*(.28+j*.44),Math.min(4.4*k,lh*.22),'silver');if(s.neck>0&&i<11)a+=line(xx,y-10*k-lh*.5,xx+dw/12,y-10*k-lh*.5,'neck',`stroke-width="${s.neck*lh*.6}"`);}}
a+=rect(dx,db-35*k,dw,30*k,'die')+rect(dx,db-5*k,dw,5*k,'silver')+path(`M${dx+6} ${db-30*k}h8l-8 8Z`,'mark');
if(s.t>=11&&s.t<27){const py=db-35*k-16*k-(1-s.pressure)*20*k;a+=rect(dx,py,dw,16*k,'tool');if(s.pressure>0)a+=line(dx+dw*.5,py-18*k,dx+dw*.5,py-2*k,'force')+path(`M${dx+dw*.5-4} ${py-7*k}l4 6l4 -6`,'force');}
if(s.t<6&&s.print<1)a+=rect(dx+dw*s.print-8,y-10*k-lh-18*k,16,18*k,'tool');
if(s.hot){for(const xx of [x-13,x+w+13])a+=path(`M${xx} ${y+10*k}q-10 -12 0 -24t0 -24`,'heat');}
if(s.t>=6&&s.t<24&&s.organic>.01)for(let i=0;i<3;i++){const v=(s.t*.6+i*.3)%1;a+=line(dx+dw*(.2+i*.3),y-lh-16-v*20,dx+dw*(.2+i*.3)-6,y-lh-22-v*20,'vapor',`opacity="${s.organic*(1-v)}"`);}
a+=rect(dx+dw*.45,y-10*k-lh,dw*.1,lh,'selection')+text(dx+dw*.5,y+78*k,'A 接合層');
if(s.connected){a+=path(`M${dx+dw*.44} ${db-16*k}V${y+7*k}H${x+w-5}`,'electric');a+=path(`M${dx+dw*.57} ${db-16*k}V${y+3*k}H${x+w-5}`,'heatflow');}
out+=`<g clip-path="url(#work)"><g transform="translate(${shift} 0)">${a}</g></g>`;
let b=rect(ix,iy,iw,145,'inset')+text(ix+iw/2,iy+22,'A · 同一接合層放大');const cx=ix+iw/2,cy=iy+82,span=Math.min(iw-36,240),cols=7,spacing=span/cols,rad=Math.min(12,spacing*.35),dy=19-3*s.dry-4*s.neck;
b+=rect(ix+12,cy-dy-rad,iw-24,2*(dy+rad),'organic',`opacity="${s.organic*s.print}"`);b+=rect(ix+12,cy+dy+rad,iw-24,5,'silver');if(s.t>=11)b+=rect(ix+12,cy-dy-rad-5-(1-s.place)*15,iw-24,5,'silver');
if(s.print>0)for(let row=0;row<2;row++)for(let i=0;i<cols;i++){if(i/cols>s.print)continue;const xx=cx+(i-(cols-1)/2)*spacing,yy=cy+(row?1:-1)*dy;b+=circle(xx,yy,rad,'silver');if(s.neck>0){if(i<cols-1)b+=line(xx,yy,xx+spacing,yy,'neck',`stroke-width="${s.neck*rad*1.1}"`);if(row===0)b+=line(xx,yy,xx,cy+dy,'neck',`stroke-width="${s.neck*rad*.9}"`);}}
b+=text(ix+iw/2,iy+141,s.neck>0?'固態連結 · 孔隙仍存在':s.dry>0?'乾燥顆粒 · 尚未燒結':'濕膏中的固態銀顆粒','small');out+=`<g opacity="${(1-s.exit)*s.entry}">${b}</g>`;
const cap=['印刷：顆粒與載體並存','預乾燥：揮發成分離開','加熱置晶：背面金屬相接','熱＋壓力：成頸與緻密化','冷卻卸載：接合層保留','綠虛線：電；橙實線：熱'];out+=text(W/2,H-16,cap[s.index]);return out;}
