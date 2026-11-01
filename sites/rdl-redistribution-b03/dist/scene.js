import {rect,text,line,path,legend} from './svg.js';
export function draw(s,l){const {width:W,height:H,px:x,pw:w,py:y,ph:h,cx,cw,cy,mobile}=l,off=(1-s.entry)*(-W)+s.exit*W,ax=x+w*.25,bx=x+w*.82,rows=[y+h*.3,y+h*.72],viaSize=16*s.via;let holes=rows.map(Y=>`<rect x="${ax-viaSize/2}" y="${Y-viaSize/2}" width="${viaSize}" height="${viaSize}" fill="black"/>`).join(''),routes=rows.map(Y=>`<rect x="${ax-10}" y="${Y-10}" width="${bx-ax+20}" height="20" fill="black"/>`).join(''),ends=rows.map(Y=>`<rect x="${bx-12}" y="${Y-12}" width="24" height="24" fill="black"/>`).join('');
let out=legend([['die','晶粒'],['ins','介電層'],['seed','薄種子'],['resist','光阻'],['cu','厚銅線']],W)+`<defs><mask id="via"><rect width="${W}" height="${H}" fill="white"/>${holes}</mask><mask id="routes"><rect width="${W}" height="${H}" fill="white"/>${routes}</mask><mask id="ends"><rect width="${W}" height="${H}" fill="white"/>${ends}</mask><clipPath id="proc"><rect x="0" y="${mobile?76:45}" width="${W}" height="${H-(mobile?108:77)}"/></clipPath></defs><g clip-path="url(#proc)"><g transform="translate(${off} 0)">`;
out+=rect(x,y,w,h,'mold')+rect(x,y,w*.45,h,'die');rows.forEach(Y=>{out+=rect(ax-9,Y-9,18,18,'pad');});
if(s.dielectric)out+=rect(x,y,w,h,'ins',`mask="url(#via)" opacity="${s.dielectric}"`);
if(s.seed)out+=rect(x,y,w,h,'seed',`opacity="${s.seed*(1-s.etch)}"`);
if(s.resist&&s.strip<1)out+=rect(x,y,w,h,'resist',`mask="url(#routes)" opacity="${s.resist*(1-s.strip)}"`);
rows.forEach((Y,i)=>{if(s.plate>0)out+=rect(ax-10,Y-10,bx-ax+20,20,'cu',`opacity="${.35+.65*s.plate}"`);out+=text(x-12,Y+5,i?'B':'A','caption');});
if(s.cap)out+=rect(x,y,w,h,'ins',`mask="url(#ends)" opacity="${s.cap}"`);
out+=line(x+w*.45,y,x+w*.45,y+h,'boundary')+text(x+w*.22,y+16,'晶粒區','small')+text(x+w*.73,y+16,'模封區','small');
out+=text(x+w/2,y+h+26,s.isolated?'A、B 已隔離':s.seed>0?'連續種子 · 尚未隔離':'原焊墊 → 開窗','caption');
// Synchronous A-line longitudinal section: pad touches the via metal.
const vx=cx+cw*.25,ex=cx+cw*.82,base=cy+20,top=base-18,th=24*s.plate;
out+=text(cx+cw/2,cy-60,'A 線同步剖面','caption')+rect(cx,base,cw,26,'mold')+rect(cx,base,cw*.45,26,'die')+rect(vx-10,base-5,20,5,'pad');
if(s.dielectric){out+=rect(cx,top,cw,18,'ins',`opacity="${s.dielectric}"`);if(s.via)out+=rect(vx-9*s.via,top,18*s.via,18,'window');out+=rect(vx-9*s.via,base-5,18*s.via,5,'pad');}
if(s.seed){out+=rect(cx,top-4,cw,4,'seed',`opacity="${s.seed*(1-s.etch)}"`);out+=path(`M${vx-9} ${top}V${base-5}H${vx+9}V${top}`,'seedpath',`opacity="${s.seed}"`);if(s.plate>0)out+=rect(vx-10,top-4,ex-vx+20,4,'seed');}
if(s.resist&&s.strip<1)out+=rect(cx,top-32,vx-cx-11,28,'resist',`opacity="${s.resist*(1-s.strip)}"`)+rect(ex+11,top-32,cx+cw-ex-11,28,'resist',`opacity="${s.resist*(1-s.strip)}"`);
if(s.cap)out+=rect(cx,top-35,cw,35,'ins',`opacity="${s.cap}"`)+rect(ex-11,top-35,22,7,'window',`opacity="${s.cap}"`);
if(s.cap&&s.plate>0)out+=rect(vx-10,top-4,ex-vx+20,4,'seed');
if(s.plate>0)out+=rect(vx-8,base-5-(13*s.plate),16,13*s.plate,'cu')+rect(vx-10,top-4-th,ex-vx+20,th,'cu');

out+=text(cx+cw*.23,base+44,'原焊墊','small')+text(cx+cw*.81,base+44,'外移接點','small');
if(s.power){const by=y-32,bc=x+w/2;out+=rect(bc-46,by,92,25,'tool')+text(bc,by+17,'電鍍電源','small')+path(`M${bc-46} ${by+12}H${x-26}V${y+h*.5}H${x}`,'wire')+text(bc-54,by+9,'−','small')+path(`M${bc+46} ${by+12}H${x+w+10}V${y+30}`,'wire')+rect(x+w+7,y+30,6,25,'cu')+text(bc+54,by+9,'＋','small');out+=rect(x-3,y,3,h,'seed');}
out+='</g></g>';if(s.exit>.99)out+=text(W/2,H/2,'新待加工表面進場','caption');return out+text(W/2,H-14,'俯視＋A線剖面 · 薄層厚度放大','small');}
