import{C,line,text,circle,path,rect,arrow,clamp}from'./svg.js';
export function draw(s,{W,H,t}){
 const narrow=W<600,c=W*.47,cx=Math.min(c+Math.min(W*.31,230),W-48),gx=Math.max(32,c-Math.min(W*.29,240)),top=32,bottom=H-38,py=H*.29,ny=H*.69,mid=(py+ny)/2,dh=Math.min(22,H*.062),gate=c-24;
 let g=text(c,top-12,'VDD','label')+line(c,top,c,py-dh)+path(`M${c},${py+dh} V${ny-dh} M${c},${ny+dh} V${bottom}`)+line(c-16,bottom,c+16,bottom)+line(c-10,bottom+5,c+10,bottom+5)+line(c-5,bottom+10,c+5,bottom+10)+text(c,bottom+28,'GND','small');
 g+=path(`M${gx},${mid} H${gate-25} M${gate-25},${py} V${ny} M${gate-25},${py} H${gate-9} M${gate-25},${ny} H${gate}`)+circle(gate-5,py,4,C.paper)+line(gate,py-dh,gate,py+dh)+line(gate,ny-dh,gate,ny+dh)+path(`M${c},${mid} H${cx} V${mid+dh+22} M${cx},${mid+dh+32} V${mid+dh+50} H${cx+40} V${bottom} H${c}`);
 function mos(y,on,name){return line(c-13,y-dh,c-13,y+dh,on?C.on:'#B8C3C9',`style="stroke-width:${on?5:2};stroke-dasharray:${on?'none':'4 4'}"`)+line(c-13,y-dh,c,y-dh)+line(c-13,y+dh,c,y+dh)+text(c+23,y-5,name,'label','start')+text(c+23,y+14,on?'導通':'關閉','minor','start');}
 g+=mos(py,s.pOn,'PMOS')+mos(ny,s.nOn,'NMOS');
 if(s.pOn)g+=path(`M${c},${top} V${py-dh} M${c},${py+dh} V${mid} H${cx}`,C.on,2.5);
 if(s.nOn)g+=path(`M${cx},${mid} H${c} V${ny-dh} M${c},${ny+dh} V${bottom}`,C.on,2.5);
 g+=circle(c,mid,3,C.ink)+text(gx,mid-35,`IN ${s.input<.05?'0':s.input>.95?'1':'↕'}`,'label')+rect(gx-16,mid-24,32,12,'#E4EAF0')+rect(gx-16,mid-24,32*s.input,12,C.purple,'style="stroke:none"');
 const capY=mid+dh+22;g+=line(cx-20,capY,cx+20,capY,C.ink,'style="stroke-width:2.5"')+line(cx-20,capY+10,cx+20,capY+10,C.ink,'style="stroke-width:2.5"')+text(cx,capY+48,'負載電容','small');
 g+=text(cx,mid-30,`OUT ${s.output>.95?'1':s.output<.05?'0':'↕'}`,'label')+rect(cx-32,mid-17,64,9,'#E4EAF0')+rect(cx-32,mid-17,64*s.output,9,C.gold,'style="stroke:none"');
 for(let i=0;i<4;i++)g+=`<g opacity="${clamp(s.output*4-i)}">`+text(cx-15+i*10,capY-4,'+','minor')+text(cx-15+i*10,capY+22,'−','minor')+'</g>';
 if(s.charging){const p=(t*.6)%1;g+=arrow(c,top+(mid-top)*p,c,top+(mid-top)*p+12,C.on,2);g+=text(gx,Math.max(mid+40,H*.75),'充電','small');}
 if(s.discharging){const p=(t*.6)%1;g+=arrow(c,mid+(bottom-mid-12)*p,c,mid+(bottom-mid-12)*p+12,C.on,2);g+=text(gx,Math.max(mid+40,H*.75),'放電','small');}
 return g;
}
