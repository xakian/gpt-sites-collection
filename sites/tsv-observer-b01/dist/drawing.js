import{C,rect,line,text,circle,path,clamp,mix}from'./svg.js';
export function draw(s,{W,H,t}){
 const w=Math.min(W-100,640),x=(W-w)/2,top=H*.25,full=H*.44,D=full*.70,depth=D*s.etch,T=full*(1-.30*s.thin),hw=Math.min(70,w*.26),hx=W/2-hw/2,cw=hw-27,cb=top+depth-13.5,back=top+T,fp=x+w*.22,bp=x+w*.78;
 const shift=s.fresh?-W*1.5*(1-s.entry):W*1.5*s.exit;
 let g=text(W/2,18,'被動矽中介層 · 同一孔位剖面','small');
 g+=`<g transform="translate(${shift},0)">`;
 g+=rect(x,top,w,T,C.si)+text(x-9,top+6,'前側','label','end')+text(x-9,back+5,'背側','label','end')+text(x+w*.18,top+Math.min(T*.6,68),'矽','material');
 if(s.etch<1){g+=rect(x,top-5,(w-hw)/2,5,C.purple)+rect(hx+hw,top-5,(w-hw)/2,5,C.purple);}
 if(depth>0){g+=rect(hx,top,hw,depth,C.paper,'style="stroke:none"')+path(`M${hx},${top} V${top+depth} H${hx+hw} V${top}`,C.ink,1.2);}
 const coat=(offset,width,col,p)=>p>0?path(`M${hx+offset},${top} V${top+depth-offset} H${hx+hw-offset} V${top}`,col,width*p):'';
 g+=coat(4,8,C.oxide,s.liner)+coat(9,3,C.purple,s.barrier)+coat(12,3,C.gold,s.seed);
 if(s.fill>0){const hh=(depth-13.5)*s.fill;g+=rect(hx+13.5,cb-hh,cw,hh,C.copper,'style="stroke:none"');const excess=8*s.fill*(1-s.planar);if(excess>0)g+=rect(x,top-excess,w,excess,C.copper);if(s.fill>.8)g+=text(W/2,top+Math.max(25,(depth-13.5)/2+5),'Cu','label');}
 if(s.front>0){g+=`<g opacity="${s.front}">`+rect(x,top-7,w,7,C.oxide)+rect(W/2-cw/2,top-10,cw,13,C.copper,'style="stroke:none"')+path(`M${fp},${top-10} H${W/2}`,C.copper,6)+rect(fp-16,top-14,32,7,C.copper)+'</g>';}
 if(s.thin>.01&&!s.connected){g+=line(x,top+full,x+w*.28,top+full,C.metal,'stroke-dasharray="4 5"')+line(x+w*.72,top+full,x+w,top+full,C.metal,'stroke-dasharray="4 5"')+text(x+w,top+full+17,'原背側','minor','end');}
 if(s.backDie>0)g+=rect(x,back,w,6*s.backDie,C.oxide);
 if(s.open>0)g+=rect(W/2-cw*s.open/2,cb,cw*s.open,back+6-cb,C.paper,'style="stroke:none"');
 if(s.backMetal>0){g+=`<g opacity="${s.backMetal}">`+rect(W/2-cw/2,cb,cw,back+10-cb,C.copper,'style="stroke:none"')+path(`M${W/2},${back+10} H${bp}`,C.copper,6)+rect(bp-16,back+7,32,8,C.copper)+'</g>';}
 if(s.holder>0){const off=(1-s.holder)*24;g+=`<g opacity="${s.holder}">`+path(`M${x-8},${back+38+off} V${back+19+off} H${x+14} V${back+6+off} M${x+w+8},${back+38+off} V${back+19+off} H${x+w-14} V${back+6+off}`,C.metal,8)+text(W/2,back+39+off,'背側承托','small')+'</g>';}
 if(s.carrier>0&&s.debond<1){let yy=top-42-(1-s.carrier)*55-s.debond*H*.45;g+=`<g opacity="${s.carrier*(1-s.debond)}">`+rect(x-8,yy,w+16,20,C.metal)+rect(x,yy+20,w,9,'#E7DCC1')+text(W/2,yy+15,'臨時載板','label')+'</g>';}
 if(s.etching){for(let i=0;i<5;i++){let q=(t*.8+i/5)%1;g+=circle(hx+10+(i%3)*(hw-20)/2,mix(top+depth,top-25,q),2.5,C.si,`opacity="${1-q}"`);}}
 if(s.plating){for(let i=0;i<4;i++){let q=(t*.8+i/4)%1;g+=circle(hx+15+(i%3)*(hw-30)/2,mix(top-25,cb-(depth-13.5)*s.fill,q),2.5,C.copper,`opacity="${1-q*.6}"`);}}
 if(s.polishing)g+=rect(x-5,top-15+7*s.planar,w+10,6,C.metal)+text(W/2,top-23,'平坦化','small');
 if(s.grinding){g+=rect(x-5,back+7,w+10,10,C.metal)+text(W/2,back+31,'背側減薄工具','small');for(let i=0;i<5;i++){let q=(t+i*.2)%1;g+=circle(x+w*(i+1)/6,back+18+q*23,2,C.si,`opacity="${1-q}"`);}}
 if(s.connected)g+=path(`M${fp},${top-10} H${W/2} V${back+10} H${bp}`,C.on,3,`opacity="${.65+.15*Math.sin(t*3)}"`);
 g+='</g>';
 g+=text(W/2,H-41,s.fresh?'新矽原料進場':s.caption,'small');
 for(const[i,label,col]of[[0,'SiO₂',C.oxide],[1,'阻障',C.purple],[2,'種子',C.gold],[3,'銅',C.copper]]){const xx=W/2-150+i*78;g+=rect(xx,H-25,12,12,col)+text(xx+17,H-14,label,'label','start');}
 return g;
}
