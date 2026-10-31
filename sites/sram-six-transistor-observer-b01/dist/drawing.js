import{C,line,text,circle,path,rect,arrow}from'./svg.js';
export function draw(s,{W,H,t}){
 const width=Math.min(W-48,820),ox=(W-width)/2,L=ox+width*.32,R=ox+width*.68,BL=ox,BB=ox+width,mid=H*.50,py=H*.29,ny=H*.71,top=H*.20,bot=H*.80,wy=Math.max(30,H*.10),dh=Math.min(20,H*.055),gl=L+28,gr=R-28,al=(BL+L)/2,ar=(BB+R)/2;
 let g=text((L+R)/2,wy-9,`WL ${s.wl?'1 · 開啟':'0 · 關閉'}`,'label')+path(`M${al},${mid-16} V${wy} H${ar} V${mid-16}`,s.wl?C.on:C.ink,1.5)+text(L-14,top+5,'VDD','label','end')+path(`M${L},${py-dh} V${top} H${R} V${py-dh}`);
 const color=v=>v>.5?C.gold:C.metal;
 g+=text(BL,wy+20,'BL','label')+text(BB,wy+20,'BL̄','label')+rect(BL-12,wy+29,24,8,'#E6EBEF')+rect(BL-12,wy+29,24*s.bl,8,C.gold,'style="stroke:none"')+rect(BB-12,wy+29,24,8,'#E6EBEF')+rect(BB-12,wy+29,24*s.bb,8,C.gold,'style="stroke:none"')+line(BL,wy+45,BL,bot,color(s.bl))+line(BB,wy+45,BB,bot,color(s.bb));
 function inv(x,dir,out,i){const gate=x+dir*20;let z=path(`M${x},${py+dh} V${ny-dh} M${x},${ny+dh} V${bot}`)+line(x-12,bot,x+12,bot)+line(x-7,bot+5,x+7,bot+5);for(const[y,on,n]of[[py,out>.5,'P'+i],[ny,out<.5,'N'+i]]){z+=line(x,y-dh,x,y+dh,on?C.on:'#BCC7CD',`style="stroke-width:${on?5:2};stroke-dasharray:${on?'none':'4 4'}"`)+line(gate,y-dh,gate,y+dh)+line(gate,y,gate+dir*8,y)+text(x-dir*18,y+5,n,'label',dir===1?'end':'start');if(n[0]==='P')z+=circle(gate+dir*4,y,3.5,C.paper);}return z;}
 g+=inv(L,1,s.q,1)+inv(R,-1,s.qb,2)+line(gl,py,gl,ny)+line(gr,py,gr,ny);
 function cross(d,col){return path(d,C.paper,6)+path(d,col,1.8);}
 g+=cross(`M${L},${mid} H${L+9} V${mid-24} H${gr}`,color(s.q));
 g+=cross(`M${R},${mid} H${R-9} V${mid+24} H${gl}`,color(s.qb));
 g+=circle(gr,mid-24,2.7,C.ink)+circle(gl,mid+24,2.7,C.ink)+circle(L,mid,3,C.ink)+circle(R,mid,3,C.ink);
 function access(ax,left,right,name){return path(`M${left},${mid} H${ax-12} M${ax+12},${mid} H${right}`)+line(ax-12,mid,ax+12,mid,s.wl?C.on:'#BCC7CD',`style="stroke-width:${s.wl?5:2};stroke-dasharray:${s.wl?'none':'4 4'}"`)+line(ax-12,mid-16,ax+12,mid-16)+text(ax,mid+24,name,'label');}
 g+=access(al,BL,L,'A1')+access(ar,R,BB,'A2');
 const bit=q=>q<.05?'0':q>.95?'1':'↕';g+=text(L-4,mid-26,'Q '+bit(s.q),'label','end')+text(R+4,mid-26,'Q̄ '+bit(s.qb),'label','start');
 g+=text(W/2,H-16,s.mode,'small');
 if(s.read){g+=arrow(BB,mid-30,BB,mid-5,C.on,2)+text(BB-3,bot+23,'微降','minor','end');}
 return g;
}
