import{C,rect,line,text,circle,path,arrow,electron}from'./svg.js';
export function draw(s,{W,H,t}){
 const w=Math.min(W-40,640),x=(W-w)/2,gw=w*.44,gx=W/2-gw/2,cy=H*.30,fg=cy+43,to=fg+28,sy=to+14,sh=Math.min(55,H*.16),right=gx+gw+9;
 let g=text(W/2,18,s.erasing?'同一區塊 · 一起抹除':'NAND 串列 · 選定一格放大','small');
 const bw=Math.min(34,(W-80)/7),bx=W/2-bw*3;
 for(let i=0;i<6;i++){g+=rect(bx+i*bw,29,bw-4,17,i===2?C.gold:C.metal,`rx="2"`);if((i===2?s.charge:0)>.2)g+=circle(bx+i*bw+bw/2-2,37,2,C.electron);}
 if(s.erasing)g+=rect(bx-6,25,bw*6+8,25,'none','rx="4" style="stroke:#C58E86;stroke-dasharray:4 3"');
 g+=line(bx+2*bw+bw/2,47,W/2,cy-9,C.metal,'stroke-dasharray="3 3"');
 g+=rect(x,sy,w,sh,C.si)+text(W/2,sy+sh-8,'矽基板','material');
 g+=rect(x+5,sy,w*.18,20,C.gold)+rect(x+w*.82-5,sy,w*.18,20,C.gold)+text(x+w*.09+5,sy+15,'S','small')+text(x+w*.91-5,sy+15,'D','small');
 g+=rect(gx-8,cy-5,gw+16,sy-cy+5,C.oxide)+rect(gx,cy,gw,24,C.metal)+rect(gx,fg,gw,28,C.purple)+rect(gx,to,gw,14,C.oxide);
 g+=text(right,cy+17,'控制閘','label','start')+text(right,cy+37,'介電層','small','start')+text(right,fg+20,'浮動閘','label','start')+text(right,to+12,'穿隧層','small','start');
 for(let i=0;i<8;i++)if(s.charge>(i+.5)/8)g+=electron(gx+12+(i%4)*(gw-24)/3,fg+8+Math.floor(i/4)*12);
 if(s.programming||s.erasing){for(let i=0;i<3;i++){let q=(t*.8+i/3)%1;if(s.erasing)q=1-q;g+=electron(gx+gw*(.25+i*.25),sy+16-q*(sy+16-(fg+14)));}g+=text(gx-8,fg+16,s.programming?'寫入場':'抹除場','small','end');}
 if(s.read){g+=line(x+w*.18,sy+5,x+w*.82,sy+5,s.conduct?C.on:C.metal,`style="stroke-width:${s.conduct?5:2};stroke-dasharray:${s.conduct?'none':'4 5'}"`);if(s.conduct)for(let i=0;i<4;i++){let q=(t*.55+i/4)%1;g+=electron(x+w*.2+q*w*.6,sy+5);}g+=text(gx-8,cy+16,'V讀','label','end');}
 const base=H-38,vx=x+24,vw=w-48;
 g+=line(vx,base,vx+vw,base)+circle(vx+vw*s.vth,base,4,C.purple)+text(vx+vw*s.vth,base+19,'V臨界','small');
 if(s.read)g+=line(vx+vw*s.vread,base-12,vx+vw*s.vread,base+4,C.on)+text(vx+vw*s.vread,base+19,'V讀','small');
 g+=text(W/2,cy-12,s.power?(s.read?`感測結果 ${s.bit} · 其餘字線通過`:'供電開啟'):'外部電源關閉','small');
 return g;
}
