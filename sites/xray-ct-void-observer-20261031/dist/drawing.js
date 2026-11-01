import {R,P,T,C} from './svg.js';import {colors as c} from './materials.js';import {joints,voidPoint,rotate,transmission,sliceAt} from './model.js';
function projection(x,y,w,h,a,n=24,m=16){let o=R(x,y,w,h,'#F4F4F4');for(let j=0;j<m;j++)for(let i=0;i<n;i++){let u=(i+.5)/n*110-55,v=35-(j+.5)/m*70,g=Math.round(244*transmission(u,v,a));o+=R(x+i*w/n,y+j*h/m,w/n+.1,h/m+.1,`rgb(${g},${g},${g})`);}return o;}
function sliceImage(x,y,w,h,d){const sl=sliceAt(d),sc=Math.min(w/110,h/70),cx=x+w/2,cy=y+h/2;let o=R(x,y,w,h,'#F4F4F4');for(const j of sl.disks)o+=C(cx+j.u*sc,cy-j.v*sc,j.r*sc,'#555D63');if(sl.hole)o+=C(cx+sl.hole.u*sc,cy-sl.hole.v*sc,sl.hole.r*sc,'#F3F4F5');return o;}
export function draw(s,w,h){const wide=w>=700,iw=wide?w*.55:w,ih=wide?h-120:Math.min(150,(h-175)*.51),ix=0,iy=wide?75:78,sc=Math.min((iw-32)/370,ih/190),cx=iw/2,cy=iy+ih*.45,shift=-(1-s.enter)*(iw+160)+s.exit*(iw+200);let o=T(w/2,27,s.stage.title,18);const note=s.t<8?'不同深度可重疊在同一張圖':s.t<20?'只選幾個角度 · 非完整掃描':s.t<23?'預製示意體積 · 未做 CT 運算':s.t<31?'資料切片 · 試件沒有被切開':'影像另存 · 孔洞仍在原件';o+=T(w/2,53,note,14);
const frame=(x,y,ww,hh,col)=>R(x,y,ww,hh,col,`stroke="${c.line}"`),xs=cx-160*sc,xd=cx+160*sc;
o+=frame(xs-14*sc,cy-30*sc,28*sc,60*sc,c.source)+frame(xd,cy-48*sc,12*sc,96*sc,c.detector);
if(s.beam)for(const k of [-1,0,1])o+=P(`M${xs+14*sc} ${cy+k*26*sc}H${xd}`,'none',`stroke="${c.beam}" opacity=".3"`);
o+=T(xs,cy+64*sc,'光源',14)+T(xd,cy+64*sc,'偵測器',14);
const pt=(p)=>{const r=rotate(p,s.angle);return [cx+(r.d+.45*r.u)*sc,cy+shift+(.28*r.u-r.v)*sc];};const quad=(a)=>'M'+a.map(p=>pt(p).join(' ')).join('L')+'Z';
o+=`<defs><clipPath id="instrument-exit"><rect x="0" y="${iy}" width="${iw}" height="${ih}"/></clipPath></defs><g clip-path="url(#instrument-exit)"><g transform="translate(0 ${shift})">`+frame(cx-25*sc,cy+22*sc,50*sc,26*sc,c.platform)+frame(cx-52*sc,cy+48*sc,104*sc,12*sc,c.platform)+frame(cx-15*sc,cy+60*sc,30*sc,22*sc,c.platform)+'</g>';
o+=P(quad([{d:-55,u:-32,v:-22},{d:55,u:-32,v:-22},{d:55,u:32,v:-22},{d:-55,u:32,v:-22}]),c.package,`stroke="${c.line}" opacity=".45"`);
for(const j of joints){const [x,y]=pt(j);o+=C(x,y,j.r*sc,c.metal,`stroke="${c.line}" opacity=".8"`)+T(x,y-24*sc,j.name,14);}
const [vx,vy]=pt(voidPoint);o+=C(vx,vy,voidPoint.r*sc,c.hole,`stroke="${c.line}" stroke-width=".7"`);
for(const u of [-32,32])for(const d of [-55,55]){const [x,y]=pt({d,u,v:-22}),[xx,yy]=pt({d,u,v:22});o+=P(`M${x} ${y}L${xx} ${yy}`,'none',`stroke="${c.line}" opacity=".5"`);}
o+=P(quad([{d:-55,u:-32,v:22},{d:55,u:-32,v:22},{d:55,u:32,v:22},{d:-55,u:32,v:22}]),'none',`stroke="${c.line}" opacity=".5"`);
o+='</g>'+T(cx,iy+ih+18,`半透明定位圖 · ${Math.round(s.angle)}°`,14);
const pw=wide?Math.min(290,w*.36,(h-150)*11/7):Math.min(230,w-70,(h-ih-180)*11/7),ph=pw*7/11,px=wide?w*.76-pw/2:(w-pw)/2,py=wide?Math.max(105,(h-ph)/2):iy+ih+57;
o+=T(px+pw/2,py-15,s.reconstruct?'多角投影 → 示意體積':s.slice?`資料切片 ${s.depth===-24?'A':s.depth===24?'B':'C'}`:`透射投影 · ${Math.round(s.angle)}°`,16);
if(s.reconstruct){for(let i=0;i<3;i++){const a=[0,75,120][i];o+=projection(px+i*pw/3,py,pw/3-4,ph*.45,a,12,8)+T(px+(i+.5)*pw/3,py+ph*.45+17,a+'°',13);}o+=P(`M${px+pw*.35} ${py+ph*.72}l${pw*.12} -10h${pw*.2}v${ph*.2}h${-pw*.2}l${-pw*.12} 10Z`,c.data,`stroke="${c.line}"`);}else o+=s.slice?sliceImage(px,py,pw,ph,s.depth):projection(px,py,pw,ph,s.angle);
o+=R(px,py,pw,ph,'none',`stroke="${c.line}" stroke-width=".7"`)+T(px+pw/2,py+ph+22,s.reconstruct?'預製資料 · 非真正重建':s.saved?'示意影像已存 · 待判讀':s.slice?(s.depth===24?'此深度與孔洞相交':'此深度沒有孔洞截面'):'較暗：金屬路徑較長',14);
return o;}

