const rect=(x,y,w,h,c,extra='')=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="${Math.max(0,h)}" rx="2" class="${c} outline" ${extra}/>`;
const line=(x,y,X,Y,c='guide',extra='')=>`<path d="M${x} ${y}L${X} ${Y}" class="${c}" ${extra}/>`;
const text=(x,y,s,c='',anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" class="${c}">${s}</text>`;
export function draw(s,l){const {width:W,height:H,x,w,y,compact}=l,cy=y+35,front=y+12,thickness=64-46*s.thin,wy=front-thickness-30*(1-s.bond),bottom=front-30*(1-s.bond),tapeY=front-26-(y+90)*(1-s.tape),off=(1-s.entry)*(-W)+s.exit*W;let out='';
 const legends=[['silicon','矽晶圓'],['glass','玻璃載板'],['adhesive','接合膠'],['release','釋放層'],['tape','框架膠帶']],cols=compact?3:5,colW=compact?Math.min(112,(W-20)/3):125,base=(W-colW*cols)/2;
 legends.forEach(([c,n],i)=>{const xx=base+(i%cols)*colW,yy=22+Math.floor(i/cols)*27;out+=rect(xx,yy-10,13,10,c)+text(xx+19,yy,n,'material','start');});out+=`<defs><clipPath id="process"><rect x="0" y="${W<600?76:45}" width="${W}" height="${H-(W<600?108:77)}"/></clipPath></defs><g clip-path="url(#process)"><g transform="translate(${off} 0)">`;
 const gc=cy+s.separate*(H+10);
 if(s.separate<1){out+=rect(x-12,gc,w+24,26,'glass')+rect(x-20,gc+26,36,13,'tool')+rect(x+w-16,gc+26,36,13,'tool')+rect(x+w*s.release,cy-6+s.separate*(H+10),w*(1-s.release),6,'release');if(s.index<3)out+=text(W/2,cy+64,'載板邊緣承托','small');}
 if(s.index===4)out+=text(W/2,Math.min(H-38,y+105),'載板 → 清潔回用','caption');
 if(s.clean<1)out+=rect(x+s.clean*w,y+19,w*(1-s.clean),10,'adhesive');out+=rect(x,wy,w,thickness,'silicon')+rect(x,bottom,w,7,'device');for(let i=0;i<6;i++)out+=rect(x+w*(i+.25)/6,bottom+1,w*.07,5,'gold');out+=`<path d="M${x+5} ${bottom-12}l9 0l0 10Z" class="gold"/>`;
 if(s.index<2)out+=text(x,wy-12,'背面','small','start')+line(x-5,bottom+3,x-12,bottom+22)+text(x-13,bottom+37,'正面 ▴','small');else if(s.index>=4)out+=text(x+9,bottom+30,'▴ 同一元件面','small','start');
 if(s.t<5){const ty=wy-19-(y+100)*Math.max(0,s.t-4);out+=rect(W/2-44,ty,88,16,'tool')+line(W/2,ty,W/2,ty-21)+text(W/2+60,ty+12,'吸持工具','small','start');}
 if(s.index===1){const gx=x+w*(.12+.76*((s.t-5)/7)),gy=wy-12;out+=rect(gx-26,gy-12,52,24,'tool')+line(gx-22,gy+12,gx+22,gy+12)+text(W/2,wy-58,'背磨 · 移除矽','caption');for(let i=0;i<8;i++){const p=(s.t*1.4+i/8)%1;out+=rect(gx+20+p*42,wy+p*28,3,3,'silicon',`opacity="${1-p}"`);}out+=text(x+w+7,wy+36,'廢矽','small');}
 if(s.t>=12){out+=rect(x-30,tapeY,w+60,8,'tape')+rect(x-37,tapeY-9,23,28,'tool')+rect(x+w+14,tapeY-9,23,28,'tool')+line(x-26,tapeY-9,x-26,tapeY-30)+line(x+w+26,tapeY-9,x+w+26,tapeY-30)+text(W/2,tapeY-28,s.tape<1?'框架連同膠帶貼合背面':'框架支撐薄晶圓','caption');}
 if(s.index===3){const lx=x+w*s.release;out+=`<path d="M${lx-9} ${cy+(H<300?50:82)}L${lx} ${cy-3}L${lx+9} ${cy+(H<300?50:82)}" fill="#E6BD8D" opacity=".55"/>`+rect(lx-15,cy+(H<300?44:76),30,18,'tool')+text(W/2,Math.min(H-38,cy+118),'雷射 ↑ 穿玻璃，止於釋放層','small');}
 if(s.index===5){const q=x+w*s.clean;out+=rect(q-8,y+57,16,21,'tool');for(let i=-2;i<=2;i++)out+=line(q,y+57,q+i*4,y+24);out+=text(W/2,Math.min(H-38,y+112),'殘膠隨清洗液排出','caption');for(let i=0;i<5;i++)out+=rect(q-18-i*6,y+48+i*7,4,3,'adhesive');}
 if(s.index===6&&s.exit<.2)out+=text(W/2,y+90,'薄晶圓＋框架 → 後續作業','caption');out+='</g></g>';if(s.exit>.99)out+=text(W/2,H/2,'下一片厚晶圓準備進場','caption');return out+text(W/2,H-15,'固定剖視 · 薄層厚度放大 · 時間壓縮','small');
}
