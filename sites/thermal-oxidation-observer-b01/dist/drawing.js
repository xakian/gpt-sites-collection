import {C,rect,line,text,circle,arrow,clamp,smooth} from './svg.js';
export function draw(s,{W,H,t}){
 const narrow=W<600,bw=Math.min(W-52,780),x=(W-bw)/2,base=H*.49,depth=Math.min(H*.30,150),scale=Math.min(1,H/330),th=s.thickness*scale,inside=s.consumed*scale,out=s.outward*scale,top=base-out,inter=base+inside;
 function slab(offset,raw=false){const ti=raw?base:inter,to=raw?base:top;return `<g transform="translate(${offset},0)">`+rect(x,ti,bw,base+depth-ti,C.si)+(raw?'':rect(x,to,bw,ti-to,C.oxide))+line(x-10,base,x+bw+10,base,C.muted,'stroke-dasharray="5 5"')+text(W/2,base+depth-20,'矽 Si','material')+(!raw&&th>19?text(W/2,top-12,'氧化層 SiO₂','material'):'')+`</g>`;}
 let g=`<defs><clipPath id="scene-clip"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath></defs><g clip-path="url(#scene-clip)">`;
 g+=text(W/2,Math.max(30,H*.11),t>=25?'準備下一片基板':t>=21?'氧化處理完成':'高溫乾氧 · O₂','label');
 const exit=t>=23?smooth((t-23)/2)*(W+bw):0;
 if(t<25)g+=slab(exit);
 if(t>=25)g+=slab(-(W+bw)*(1-smooth((t-25)/3)),true);
 if(t<23){g+=text(x,base-8,'原始表面','minor','start');
 if(th>20){g+=line(x+bw-20,top,x+bw-20,inter,C.ink)+line(x+bw-25,top,x+bw-15,top)+line(x+bw-25,inter,x+bw-15,inter);g+=arrow(x+25,base+5,x+25,inter,C.ink);g+=text(W/2,base+depth+32,s.oxidizing?'Si + O₂ → SiO₂':'界面停止移動','small');}
 if(s.gas>0){for(let i=0;i<6;i++){const dur=2.7+2.3*s.u,p=((t-1+i*.43)%dur+dur)%dur/dur;const xx=i<3?x+22+(bw/2-110)*i/2:W-x-22-(bw/2-110)*(i-3)/2,yy=(H*.15)+p*(inter-H*.15);let a=s.gas*clamp((1-p)*8);g+=`<g opacity="${a}">`+circle(xx-4,yy,4.1,'#A9C2CF')+circle(xx+4,yy,4.1,'#A9C2CF')+'</g>';if(p>.88&&s.oxidizing)g+=circle(xx,inter,8*(1-(p-.88)/.12),'none',`style="stroke:#7AAB8B;opacity:${(1-p)*6}"`);}}
 }
 if(t>=23)g+=text(W/2,H*.86,t<25?'完成件 →':'→ 新基板','label');
 g+='</g>';return g;
}
