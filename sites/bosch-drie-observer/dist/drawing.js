import {rect,path,text,circle,group,arrow} from './svg.js';
export function draw(s,w,h){
 const fs=w<600?15:17,sm=w<600?13:15,c=w/2,L=w*.09,R=w*.91,ww=Math.min(110,w*.26),a=c-ww/2,b=c+ww/2,Y=h*.22,d0=h*.06,step=h*.16,amp=Math.min(10,ww*.08),base=h*.88,mask=15;
 let v=`<defs><clipPath id="frame">${rect(0,0,w,h,'white')}</clipPath></defs>`;
 const label=s.phase==='coat'?'C₄F₈ → 氟碳膜':s.phase==='open'?'方向性離子開底膜':s.phase==='etch'?'SF₆ → 含氟活性物種':s.phase==='stop'?'側壁殘膜，待後續清理':'已有短槽與開口';v+=text(c,Math.max(24,h*.075),label,sm);
 const wafer=(dx,fresh)=>{const q=fresh?{...s,depths:[0,0,0],phase:'idle',coat:0,open:0,etch:0,k:0}:s;
 const pts=(side,j,p=1)=>{const x=side<0?a:b,start=Y+d0+j*step;let arr=[];for(let n=0;n<=20;n++){const u=p*n/20;arr.push([x+side*amp*Math.sin(Math.PI*u),start+step*u]);}return arr;};
 let lp=[[a,Y],[a,Y+d0]],rp=[[b,Y],[b,Y+d0]];for(let j=0;j<3;j++)if(q.depths[j]>0){lp.push(...pts(-1,j,q.depths[j]).slice(1));rp.push(...pts(1,j,q.depths[j]).slice(1));}
 const last=lp.at(-1),right=rp.at(-1),bottom=last[1],lines=p=>p.map(([x,y])=>`L${x} ${y}`).join('');
 let d=`M${L} ${Y}H${a}${lines(lp.slice(1))}Q${c} ${bottom+amp*2} ${right[0]} ${bottom}${lines(rp.slice(0,-1).reverse())}H${R}V${base}H${L}Z`;
 let z=`<path d="${d}" fill="#CAD6DE" stroke="#6D8491" stroke-width="1.3"/>`;
 z+=rect(L,Y-mask,a-L,mask,'#BCD0DA','stroke="#7E9BAA"')+rect(b,Y-mask,R-b,mask,'#BCD0DA','stroke="#7E9BAA"');
 const thickness=j=>{if(q.phase==='idle')return 0;if(j===q.k)return 0;const prev=j<q.k-1||j===-1&&q.k>0?5:0;return q.phase==='coat'?prev+(7-prev)*q.coat:7-.5*q.open-1.5*q.etch;};
 for(const side of [-1,1]){const x=side<0?a:b;for(let j=-1;j<3;j++){const tt=thickness(j);if(tt<=0)continue;const ps=j<0?[[x,Y],[x,Y+d0]]:pts(side,j,q.depths[j]);if(j>=0&&q.depths[j]===0)continue;z+=path(`M${ps[0][0]-side*tt/2} ${ps[0][1]}${ps.slice(1).map(([xx,yy])=>`L${xx-side*tt/2} ${yy}`).join('')}`,'#C5B9D8',tt);}}
 const bt=q.phase==='coat'?7*q.coat:q.phase==='open'?7*(1-q.open):0;if(bt>0)z+=path(`M${last[0]} ${bottom-bt/2}Q${c} ${bottom+amp*2-bt/2} ${right[0]} ${bottom-bt/2}`,'#C5B9D8',bt);
 const topFilm=thickness(-1);if(topFilm>0){z+=rect(L,Y-mask-topFilm,a-L,topFilm,'#C5B9D8')+rect(b,Y-mask-topFilm,R-b,topFilm,'#C5B9D8');}
 z+=text((L+a)/2,base-25,'矽',fs)+text((b+R)/2,base-25,'矽',fs)+text((L+a)/2,Y-mask-15,'硬遮罩',sm);
 if(!fresh&&s.t>=3&&s.t<30){const pos=Math.min(Y+d0*.6,bottom-15);z+=text(R,pos+25,'氟碳膜',sm,'end')+path(`M${b-4} ${pos}L${R-30} ${pos+8}`,'#A395B7',1);}
 if(!fresh&&s.t>=11&&s.t<30){z+=path(`M${a-amp} ${Y+d0+step*.5}H${L+25}`,'#6D8491',1)+text(L,Y+d0+step*.5-10,'波紋',sm,'start');}
 return group(z,`transform="translate(${dx} 0)"`);};
 v+=group(s.newWafer?wafer((s.incoming-1)*w*1.2,true):wafer(s.out*w*1.2,false),'clip-path="url(#frame)"');
 const dep=d0+step*s.depths.reduce((a,b)=>a+b,0),end=Y+dep;
 if(s.phase==='coat'||s.phase==='open'||s.phase==='etch'){for(let i=0;i<3;i++){const p=((s.t-3)*.4+i/3)%1,x=a+ww*(i+1)/4,y=40+p*(end-48);if(s.phase==='coat')v+=circle(x,y,4,'none','stroke="#B6A7C7"');else if(s.phase==='open')v+=arrow(x,y,0,18,'#AD9AC3');else v+=`<path d="M${x} ${y-4}l4 4l-4 4l-4-4Z" fill="#AEC6B4"/>`;}
 if(s.phase!=='coat'){const p=((s.t-3)*.3)%1;v+=circle(c+(R-c)*p,end+(h*.14-end)*p,3,'none','stroke="#98AFBC"')+text(R,h*.14-10,s.phase==='etch'?'SiF₄等 → 排氣':'去膜產物 → 排氣',sm,'end');}}
 v+=text(c,h-13,s.t<3?'固定追蹤同一矽槽':s.t<27?`第${s.k+1}輪／3輪 · 深度只在開底膜後增加`:s.t<30?'上段有殘膜；最末新壁尚未再覆膜':s.t<32?'完成深槽 →':'← 新開口短槽',sm,'middle','#5B6B75');return v;
}
