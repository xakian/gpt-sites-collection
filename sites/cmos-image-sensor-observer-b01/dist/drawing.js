import{C,rect,line,text,circle,path,arrow,electron,clamp,mix}from'./svg.js';
export function draw(s,{W,H,t}){
 const w=Math.min(W-40,850),ox=(W-w)/2,px=ox+w*.17,tx=ox+w*.40,fd=ox+w*.60,sf=ox+w*.84,y=H*.46,py=H*.15,ry=H*.26,sy=H*.66,pw=Math.min(120,w*.27),ph=Math.min(72,H*.22),row=H-59;
 let g=text(W/2,18,'4T 像素 · 光子 → 電荷 → 電壓','small');
 g+=rect(px-pw/2,y-ph/2,pw,ph,C.si,'rx="6"')+text(px,y-ph/2-10,'光二極體','label')+text(px,y+ph/2+21,'PPD','small');
 g+=line(px+pw/2,y,tx-12,y)+line(tx+12,y,fd,y)+line(tx-12,y,tx+12,y,s.tx?C.on:C.metal,`style="stroke-width:${s.tx?5:2};stroke-dasharray:${s.tx?'none':'3 3'}"`)+line(tx-12,y-14,tx+12,y-14)+text(tx,y-23,'TX','label');
 g+=circle(fd,y,23,C.oxide)+text(fd,y+43,'FD','label');
 g+=path(`M${fd},${y-23} V${ry+11} M${fd},${ry-11} V${py} H${sf} V${y-20}`)+line(fd,ry-11,fd,ry+11,s.rst?C.on:C.metal,`style="stroke-width:${s.rst?5:2}"`)+line(fd-13,ry-11,fd-13,ry+11)+text(fd-19,ry+5,'RST','label','end')+text((fd+sf)/2,py-7,'VDD','small');
 g+=path(`M${fd+23},${y} H${sf-16}` ,C.purple)+line(sf-16,y-20,sf-16,y+20,C.purple)+line(sf,y-20,sf,y+20,C.ink,'style="stroke-width:4"')+text(sf+12,y+5,'SF','label','start');
 g+=line(sf,y+20,sf,sy-11)+line(sf,sy-11,sf,sy+11,s.sel?C.on:C.metal,`style="stroke-width:${s.sel?5:2}"`)+line(sf-13,sy-11,sf-13,sy+11)+text(sf-20,sy+5,'SEL','label','end');
 g+=path(`M${sf},${sy+11} V${row-10} H${ox+w*.27} V${row}`,C.purple,1.5);
 for(const e of s.carriers){const a={x:px-21+(e.id%4)*14,y:y-13+Math.floor(e.id/4)*13},b={x:fd-12+(e.id%4)*8,y:y-10+Math.floor(e.id/4)*10};g+=`<g opacity="${1-e.exit}">`+electron(mix(mix(a.x,b.x,e.p),fd,e.exit),mix(mix(a.y,b.y,e.p),py,e.exit))+'</g>';}
 if(s.exposure){for(let i=0;i<3;i++){const q=(t*1.4+i/3)%1,xx=px-20+i*18,yy=mix(py+14,y-ph/2-5,q);g+=path(`M${xx-5},${yy-10} l5,3 l-5,3 l5,3`,C.gold,2);}}
 g+=text(fd,y+62,`V ${s.fdVoltage.toFixed(1)}`,'small');
 const cw=w*.48,ax=ox+w*.57,aw=w*.43;
 g+=rect(ox,row,cw,52,'#EEF0F5','rx="5"')+text(ox+cw/2,row+17,'欄 CDS','label')+text(ox+cw/2,row+36,`${s.reference===null?'—':s.reference.toFixed(1)} − ${s.signal===null?'—':s.signal.toFixed(1)}${s.cds===null?'':' = 0.6'}`,'small');
 g+=arrow(ox+cw+3,row+25,ax-5,row+25,C.purple)+rect(ax,row,aw,52,'#EEF3F0','rx="5"')+text(ax+aw/2,row+17,'欄 ADC · 8 位元','label');
 if(s.code!==null){const dx=s.outputProgress*(W-ax+40),opacity=1-s.outputProgress;g+=`<g transform="translate(${dx},0)" opacity="${opacity}">`+text(ax+aw/2,row+39,'灰階 153','label')+'</g>';}else g+=text(ax+aw/2,row+39,'等待訊號','small');
 return g;
}
