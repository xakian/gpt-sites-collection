import {dopants,smooth,clamp} from './state.js';
const f=n=>Number(n.toFixed(2));
const text=(x,y,s,cls='label',anchor='middle')=>`<text x="${f(x)}" y="${f(y)}" class="${cls}" text-anchor="${anchor}">${s}</text>`;
const circle=(x,y,r,cls,extra='')=>`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" class="${cls}" ${extra}/>`;
const line=(x,y,a,b,cls,extra='')=>`<path d="M${f(x)} ${f(y)}L${f(a)} ${f(b)}" class="${cls}" ${extra}/>`;
const mix=(a,b,p)=>a+(b-a)*p;
export function drawScene(s,W,H){
 const narrow=W<600,short=H<300;
 const sw=Math.max(1,Math.min(W-32,1040)),x=(W-sw)/2;
 const top=Math.min(narrow?170:130,Math.max(short?94:120,H*.28));
 const sh=Math.max(100,H-top-64);
 const bottom=top+sh,rad=Math.max(6,Math.min(narrow?10:15,sw/34,sh*.175*.42));
 const gx=c=>x+sw*(.06+.088*c),gy=r=>top+sh*(.13+.175*r);
 const mx=x+sw*.33,mw=sw*.34,maskH=short?25:34;
 const out=[];
 out.push(`<defs><clipPath id="scene-clip"><rect width="${W}" height="${H}"/></clipPath><linearGradient id="silicon" x2="0" y2="1"><stop stop-color="#edf2f4"/><stop offset="1" stop-color="#dce7ec"/></linearGradient></defs><g clip-path="url(#scene-clip)">`);
 out.push(text(x,22,'矽的剖面 · 原子尺度示意','micro','start'));
 if(!narrow)out.push(text(W-x,22,'Si 矽　　P 磷　　− 電子','micro','end'));
 const active=s.local>=3&&s.local<12;
 let message=s.local<3?'光阻保護兩側，中央開窗':active?'磷離子束 ↓':s.local<16?'去光阻與清洗 ↑':s.local<25?'熱處理 · 修復晶格，活化磷':s.local<28?'冷卻至室溫':'室溫 · 磷留在原位，電子可移動';
 if(s.t>=35)message=s.fresh?'另一塊新材料進場 →':'完成材料離開 →';
 out.push(text(W/2,short?48:53,message,'headline'));
 const offset=s.shift*(W+sw+60);
 out.push(`<g id="material" transform="translate(${f(offset)} 0)">`);
 out.push(`<rect x="${x}" y="${top}" width="${sw}" height="${sh}" rx="6" fill="url(#silicon)" class="outline"/>`);
 out.push(`<rect x="${mx}" y="${top+2}" width="${mw}" height="${sh*.84}" rx="14" class="doped-zone" opacity="${s.repair*.38}"/>`);
 out.push(`<rect x="${x}" y="${top}" width="${sw}" height="${sh}" rx="6" fill="#e5bb8a" opacity="${s.heat*.28}"/>`);
 const nodes=[];
 for(let r=0;r<5;r++)for(let c=0;c<11;c++){
   const di=dopants.findIndex(d=>d.c===c&&d.r===r),near=dopants.findIndex(d=>d.c===c-1&&d.r===r);
   let px=gx(c),py=gy(r),vacancy=false;
   if(di>=0){const damage=s.damage[di];vacancy=damage>.01;px+=sw*.088*.4*damage;py+=sh*.175*.4*damage;const sink=smooth((s.local-19-di*.35)/4);px=mix(px,gx(c)+rad*1.7,sink);py=mix(py,top-rad*.35,sink);}
   else if(near>=0){const p=s.damage[near]*(1-s.repair);px+=rad*.8*p;py-=rad*.7*p;}
   nodes.push({r,c,px,py,di,vacancy});
 }
 for(const n of nodes){for(const nb of nodes.filter(a=>(a.r===n.r&&a.c===n.c+1)||(a.c===n.c&&a.r===n.r+1))){
   const a=n.di>=0?[gx(n.c),gy(n.r)]:[n.px,n.py],b=nb.di>=0?[gx(nb.c),gy(nb.r)]:[nb.px,nb.py];
   const damaged=(n.di>=0?s.damage[n.di]:0)||(nb.di>=0?s.damage[nb.di]:0);
   out.push(line(...a,...b,'bond',`opacity="${f(1-damaged*(1-s.repair)*.85)}"`));
 }}
 nodes.forEach(n=>{if(n.vacancy)out.push(circle(gx(n.c),gy(n.r),rad,'vacancy',`opacity="${f(s.damage[n.di]*(1-s.repair))}"`));out.push(circle(n.px,n.py,rad,n.di>=0&&s.damage[n.di]>.1?'si displaced':'si'));});
 dopants.forEach((d,i)=>{if(s.local<d.launch)return;
   const p=s.arrivals[i],startY=short?61:70,tx=gx(d.c)-sw*.088*.4,ty=gy(d.r)+sh*.175*.35;
   const stop=smooth((p-.55)/.45);let px=gx(d.c)+Math.sin(p*Math.PI)*rad*.7-sw*.088*.4*stop,py=mix(startY,ty,p);
   if(p===1){px=mix(tx,gx(d.c),s.repair);py=mix(ty,gy(d.r),s.repair);}
   if(p<1)out.push(line(px,py-17,px,py-7,'beam'));
   out.push(circle(px,py,rad+1,'phosphorus'));
   out.push(text(px,py+4,p<1||s.electrons>.5?'P⁺':'P','atom'));
   if(s.electrons>0){const et=Math.max(0,s.local-28),q=s.electrons;const ex=mix(gx(d.c),mx+mw*(.5+.38*Math.sin(et*1.1+i*2.1)),q),ey=mix(gy(d.r),top+sh*(.45+.25*Math.sin(et*.8+i*1.7)),q);out.push(circle(ex,ey,Math.max(5,rad*.55),'electron',`opacity="${q}"`));out.push(text(ex,ey+4,'−','electron-sign'));}
 });
 if(s.mask>0){out.push(`<g id="mask" opacity="${s.mask}" transform="translate(0 ${-s.strip*52})">`);
   out.push(`<path d="M${x} ${top-maskH}h${sw*.33}v${maskH}H${x}Z M${mx+mw} ${top-maskH}h${sw*.33}v${maskH}H${mx+mw}Z" class="mask"/>`);
   out.push(text(x+sw*.12,top-maskH/2+5,'光阻','mask-label'));out.push(text(x+sw*.88,top-maskH/2+5,'光阻','mask-label'));
   [2,8].forEach((c,i)=>{const p=clamp((s.local-4.2-i*2)/1.8);if(p>0){const px=gx(c),py=mix(short?61:70,top-maskH*.62,p);out.push(circle(px,py,rad*.7,'phosphorus'));if(p<1)out.push(line(px,py-18,px,py-8,'beam'));}});
   out.push('</g>');
 }
 out.push(text(x+12,bottom-10,'Si','silicon-label','start'));
 if(s.local>=20&&s.local<28)out.push(text(W/2,top-17,'位移矽 → 表面缺陷匯','micro'));
 if(s.local<12)out.push(text(W/2,top-12,'開口','micro'));
 out.push('</g>');
 let caption=s.local<3?'同一塊矽 · 從已開窗的光阻開始':s.local<12?'離子停在矽內，附近原子偏離晶格位置':s.local<16?'遮罩帶走攔下的磷；矽內的磷留下':s.local<25?'磷進入晶格位置；局部缺陷減少':s.local<28?'熱色消退，磷仍留在矽中':'P⁺ 固定在晶格 · 青色電子可移動';
 if(s.t>=35)caption=s.fresh?'新材料開始下一輪':'成品保留摻雜狀態，整塊退場';
 out.push(text(W/2,bottom+28,caption,'caption'));
 if(narrow&&H>460)out.push(text(W/2,bottom+54,'灰藍：矽　橙色：磷　青色：電子','micro'));
 out.push('</g>');return out.join('');
}
