import {mount,txt,rect,path,ramp,lerp} from './view.js';import {topic,state,particles} from './model.js';
function part(t,font){let g=rect(-52,-36,104,10,'fixture')+rect(-52,26,104,10,'fixture')+rect(-52,-26,10,52,'fixture')+rect(42,-26,10,20,'fixture')+rect(42,6,10,20,'fixture');g+=txt(-13,-47,'A',font);for(const p of particles(t))g+=`<circle cx="${p.x}" cy="${p.y}" r="3.8" fill="#a18cb5" opacity="${p.opacity}"/>`;return g;}
mount(topic,(t,{w,h,small})=>{const s=state(t),ww=small?360:720,hh=small?600:330,scale=Math.min((w-16)/ww,(h-55)/hh,1.5),font=(small?15:16)/scale,ox=(w-ww*scale)/2,oy=(h-hh*scale)/2+14,fs=small?15:16;
 const b=small?{x:20,y:55,w:320,h:180,cx:180,cy:155}:{x:20,y:65,w:200,h:190,cx:120,cy:165};const v=small?{x:20,y:355,w:205,h:180,cx:122,cy:445}:{x:320,y:65,w:200,h:190,cx:420,cy:165};const d=small?{x:265,y:405,w:82,h:80}:{x:575,y:125,w:120,h:80};const travel=w/scale+ww;
 let out=txt(w/2,24,t<3?'校正與背景確認':t<12?'外部氦加壓 → 漏路 → 空腔':t<17?'外表清理 · 轉移時間影響存量':t<25?'空腔 → 同一漏路 → 真空腔':'保存總訊號，不能直接定位漏點',fs);out+=`<g transform="translate(${ox} ${oy}) scale(${scale})">`;
 const bombDoor=t<32?1-ramp(t,12,13):ramp(t,33,34),vacDoor=t<30?ramp(t,17,18):1-ramp(t,30,31);
 out+=rect(b.x,b.y,b.w,b.h,'','fill="none" stroke-dasharray="4 3"')+rect(v.x,v.y,v.w,v.h,'','fill="none" stroke-dasharray="4 3"');
 // The emphasized solid boundary is the closed chamber; dashed frames remain as location guides during transfer.
 out+=rect(b.x,b.y,b.w,b.h,'',`fill="none" opacity="${bombDoor}"`)+rect(v.x,v.y,v.w,v.h,'',`fill="none" opacity="${vacDoor}"`);
 out+=txt(b.x+b.w/2,b.y-14,'加壓腔',font)+txt(v.x+v.w/2,v.y-14,'真空腔',font);
 out+=rect(b.cx-60,b.cy+36,120,b.y+b.h-b.cy-36,'fixture')+rect(v.cx-60,v.cy+36,120,v.y+v.h-v.cy-36,'fixture');
 for(let i=0;i<12;i++){const gx=b.x+20+(i%6)*(b.w-40)/5,gy=b.y+(i<6?25:b.h-25);out+=`<circle cx="${gx}" cy="${gy}" r="3.8" fill="#a18cb5" opacity="${s.bombGas}"/>`;}
 out+=path(`M${v.x+v.w},${v.cy} H${d.x}`,'guide')+rect(d.x,d.y,d.w,d.h,'fixture')+txt(d.x+d.w/2,d.y+38,'氦檢漏',font);
 out+=rect(d.x+8,d.y+d.h-20,d.w-16,7,'','fill="#e8edef"')+`<rect x="${d.x+8}" y="${d.y+d.h-20}" width="${(d.w-16)*s.signal}" height="7" fill="#9a86ae"/>`+path(`M${d.x+8+(d.w-16)*.1},${d.y+d.h-24} V${d.y+d.h-8}`,'guide');
 let px=small?lerp(b.cx,64,ramp(t,12,14))+(v.cx-64)*ramp(t,16,17):lerp(b.cx,v.cx,s.transfer),py=small?lerp(b.cy,v.cy,ramp(t,14,16)):lerp(b.cy,v.cy,s.transfer);out+=`<g transform="translate(${px-travel*s.exit} ${py})">`+part(t,font);if(t>=12&&t<14)for(const dx of [-60,62])out+=`<circle cx="${dx}" cy="-40" r="4" fill="#a18cb5" opacity="${1-ramp(t,12,14)}"/>`;out+='</g>';
 if(t>=32)out+=`<g transform="translate(${b.cx-travel*(1-s.incoming)} ${b.cy})">`+part(0,font)+'</g>';
 if(t>=19&&t<25)for(let i=0;i<3;i++){const p=((t-19)*.5+i/3)%1;out+=`<circle cx="${lerp(v.cx+90,d.x+5,p)}" cy="${v.cy}" r="3.5" fill="#a18cb5"/>`;}
 if(small)out+=txt(230,295,'清理／轉移',font);else out+=txt(270,285,'清理／轉移',font);
 if(t>=25&&t<30){const ry=small?555:275;out+=`<g transform="translate(0 ${-100*s.recordExit})" opacity="${1-s.recordExit}">`+txt(ww/2,ry,small?'紀錄：曾高於背景':'紀錄：曾高於背景 · 漏路仍存在',font)+(small?txt(ww/2,585,'漏路仍存在',font):'')+'</g>';}
 out+='</g>';return out;});


