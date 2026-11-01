import {mount,txt,rect,path,ramp} from './view.js';import {topic,state,bubbles} from './model.js';
function joint(t){const s=state(t);let g=rect(60,70,360,35,'silicon')+rect(60,103,360,3,'metal')+rect(60,105,360,40,'',`fill="${s.melt<1?'#c5c9cc':s.cool>.9?'#b8bdc2':'#c9d9df'}"`)+rect(40,145,400,5,'metal')+rect(40,150,400,30,'resin');
 if(s.melt<1)for(let i=0;i<14;i++)g+=`<circle cx="${74+i*25}" cy="${i%2?131:119}" r="7" fill="#a7afb6" opacity="${1-s.melt}"/>`;
 for(const b of bubbles(t))g+=`<circle cx="${b.x}" cy="${b.y}" r="${b.r}" fill="#f7f9fa" stroke="#9c8185" stroke-width="1.4" opacity="${b.opacity}"/>`;
 return g;}
function movingJoint(t,travel){const s=state(t);return `<g transform="translate(${travel*s.exit} 0)">`+joint(t)+'</g>'+(t>=30?`<g transform="translate(${-travel*(1-s.incoming)} 0)">`+joint(0)+'</g>':'');}
mount(topic,(t,{w,h,small})=>{const s=state(t),short=h<300,fs=small?15:16,top=short?12:48;let out=txt(short?12:w/2,24,t<10?'升溫 · 焊料由固到液':t<22?'液態焊料 · 受控降壓排氣':t<28?'惰性氣體回填 · 冷卻凝固':'完成件帶著殘餘空洞離場',fs,short?'start':'middle');
 const main=small?{x:12,y:65,w:w-24,h:h*.35}:{x:18,y:top+15,w:w*.44,h:h-top-25};const zoom=small?{x:12,y:h*.54,w:w-24,h:h*.34}:{x:w*.49,y:top+15,w:w*.49-12,h:h-top-25};
 const ms=Math.min(main.w/520,main.h/285),mx=main.x+(main.w-520*ms)/2,my=main.y+(main.h-285*ms)/2;
 out+=`<g transform="translate(${mx} ${my}) scale(${ms})"><defs><clipPath id="main-clip"><rect x="20" y="90" width="390" height="115"/></clipPath></defs>`+path('M20,30 H410 V80 H470','guide')+path('M20,235 V30','guide',`opacity="${1-s.open}"`)+path('M410,80 V235 H20','guide',`opacity="${1-s.open}"`)+rect(455,55,55,50,'fixture')+txt(482,125,'抽氣',fs/ms)+rect(65,203,310,12,'fixture');
 out+=`<g clip-path="url(#main-clip)"><g transform="translate(70 95) scale(.6)">`+movingJoint(t,1300)+'</g></g>';
 if(t>=19&&t<22)out+=path('M99,108 V80 H450 m-8,-5 8,5 -8,5','', 'fill="none" stroke="#a08399" stroke-width="1.3" stroke-dasharray="3 4"')+path('M329,108 V80','', 'fill="none" stroke="#a08399" stroke-width="1.3" stroke-dasharray="3 4"');
 if(t>10&&t<22)for(let i=0;i<5;i++){const p=((t-10)*.35+i/5)%1;out+=`<circle cx="${365+110*p}" cy="${80}" r="3.5" fill="#a08399" opacity="${.8}"/>`;}
 if(t>=22&&t<25)out+=path('M65,55 H145 m-8,-5 8,5 -8,5','signal');
 out+=rect(75,252,190,8,'fixture')+`<rect x="75" y="252" width="${190*(1-.8*s.vacuum)}" height="8" fill="#87a7b7"/>`+txt(320,267,'腔壓',fs/ms)+'</g>';
 const zs=Math.min(zoom.w/520,zoom.h/270),zx=zoom.x+(zoom.w-520*zs)/2,zy=zoom.y+(zoom.h-270*zs)/2;
 out+=`<g transform="translate(${zx} ${zy}) scale(${zs})"><defs><clipPath id="zoom-clip"><rect x="0" y="40" width="520" height="145"/></clipPath></defs>`+txt(240,35,'同一接合層 · 放大',fs/zs)+'<g clip-path="url(#zoom-clip)">'+movingJoint(t,1400)+'</g>'+txt(240,210,t<8?'晶粒／焊膏／金屬化基板':t<24?'液態焊料中的氣泡':s.cool>.9?'固態焊料 · 殘餘空洞':'回填後冷卻',fs/zs)+'</g>';
 if(!short)out+=txt(w/2,h-8,'氣體沿邊緣離開；不穿過晶粒或基板',fs);return out;});

