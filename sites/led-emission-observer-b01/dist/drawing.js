import{C,rect,line,text,circle,path,arrow,electron,hole,clamp,mix}from'./svg.js';
export function draw(s,{W,H,t}){
 const w=Math.min(W-84,620),x=(W-w)/2,top=H*.25,nh=Math.max(27,H*.12),ah=Math.max(34,H*.12),ph=Math.max(27,H*.11),bh=Math.max(26,H*.10),active=top+nh+ah/2,bottom=top+nh+ah+ph+bh,cx=x+w*.7,wx=x+w+18;
 let g=text(W/2,20,'AlGaAs 紅光 LED · 約 660 nm','label');
 g+=rect(x,top,w,nh,'#C5D5E0')+rect(x,top+nh,w,ah,'#EBD0CC')+rect(x,top+nh+ah,w,ph,'#D7CBDC')+rect(x,top+nh+ah+ph,w,bh,'#C4CBD5');
 g+=text(x+10,top+nh/2+5,'n-AlGaAs','label','start')+text(x+10,active+5,'發光區','material','start')+text(x+10,top+nh+ah+ph/2+5,'p-AlGaAs','label','start')+text(x+10,bottom-bh/2+5,'p-GaAs','label','start');
 g+=rect(cx-32,top-8,64,8,C.metal)+rect(x,bottom,w,8,C.metal)+path(`M${cx},${top-8} V${top-23} H${wx} V${bottom+22} H${cx} V${bottom+8}`,s.drive>0?C.on:C.ink,1.5);
 g+=text(wx-6,top-29,s.drive>0?'−':'n','label')+text(wx-6,bottom+41,s.drive>0?'+':'p','label');
 const vy=(top+bottom)/2;g+=circle(wx,vy,12,C.paper)+text(wx,vy-2,'−','minor')+text(wx,vy+9,'+','minor')+rect(wx-15,vy-34,30,18,C.paper,'style="stroke:none"')+text(wx,vy-20,'電源','small');
 function photon(xx,yy,opacity=1){return `<g opacity="${opacity}">`+path(`M${xx-6},${yy+4} l4,-8 l4,8 l4,-8`,'#C66D6C',2)+'</g>';}
 function heat(xx,yy,opacity=1){return `<g opacity="${opacity}">`+path(`M${xx-5},${yy+9} q-6,-5 0,-10 q6,-5 0,-10 M${xx+4},${yy+9} q-6,-5 0,-10 q6,-5 0,-10`,'#C3A06A',1.5)+'</g>';}
 for(const e of s.events){const ex=x+110+(e.id%6)*(w-130)/5,a=e.age;
   if(a<1.8){const q=clamp(a/1.8);g+=electron(mix(cx,ex,q),mix(top-3,active-8,q))+hole(mix(cx,ex,q),mix(bottom+3,active+8,q));}
   else if(a<2.2){const q=(a-1.8)/.4;g+=hole(ex,active+8)+electron(ex,mix(active-8,active+8,q));}
   else {if(a<3.1)g+=circle(ex,active+8,3,C.electron,`opacity="${1-(a-2.2)/.9}"`);const q=clamp((a-2.2)/3);
     if(e.radiative&&!e.trapped){g+=photon(mix(ex,ex<cx?x+60:x+w+40,q),mix(active,28,q),q>.8?(1-q)*5:1);}
     else if(e.radiative&&e.trapped){const qq=clamp(q*2);g+=photon(mix(ex,ex-30,qq),active-16*Math.sin(qq*Math.PI),1-qq);if(q>.4)g+=heat(ex-30,active-5,Math.sin((q-.4)/.6*Math.PI));}
     else g+=heat(ex,active-4,Math.sin(q*Math.PI));
   }
 }
 g+=text(W/2,H-35,s.drive>0?'上 n 接負 · 下 p 接正':'外部驅動關閉','small')+text(W/2,H-15,'藍點：電子　空圈：電洞　紅波：光子','small');
 return g;
}
