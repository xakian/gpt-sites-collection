import {rect,path,text,circle,group,arrow} from './svg.js';
export function draw(s,w,h){
 const fs=w<600?15:17,sm=w<600?13:15,c=w/2,ww=w*.62,L=c-ww/2,R=c+ww/2,total=Math.min(110,h*.25),ox=Math.min(12,h*.035),thin=Math.min(27,h*.075),rest=total-ox-thin,top=-total/2,sep=top+ox+thin,BY=h*.73,BH=Math.min(85,h*.16,h-BY-40),start=h*.35;
 let v=`<defs><clipPath id="frame">${rect(0,0,w,h,'white')}</clipPath></defs>`;
 const title=s.t<3?'追蹤A的一段薄矽':s.t<8?'H⁺植入 · 分離區位於A內':s.t<9?'表面清潔／準備':s.t<14?'A翻面180°（剖面投影）':s.t<19?'氧化面直接接合B':s.t<24?'熱處理，沿A內部分離':s.t<29?'A餘料需再整備':s.t<32?'整理薄矽表面':'SOI與供體餘料分流';v+=text(c,Math.max(24,h*.075),title,sm);
 const assembly=(fresh)=>{const q=fresh?{...s,implant:0,flip:0,bond:0,split:0,finish:0,out:0}:s,cos=Math.cos(Math.PI*q.flip),cy=start+(BY-total/2-start)*q.bond,shift=fresh?(s.incoming-1)*w*1.25:q.out*w*1.25,donorX=fresh?shift:-q.out*w*1.25,gap=q.split*h*.22,loss=q.finish*2,thinMid=top+ox+thin*.5;
 let a='';
 a+=group(rect(L,BY,ww,BH,'#C8D6DE','stroke="#6F8795" data-material="handle-b"')+text(c,BY+BH*.62,'B 承載矽',fs),`transform="translate(${shift} 0)"`);
 let layers=rect(L,top,ww,ox,'#DCECF2','stroke="#86A9BA" data-material="oxide"')+rect(L,top+ox,ww,thin-loss,'#ACC8CA','stroke="#6B9297" data-material="thin-a"')+circle(L+ww*.23,thinMid,3.7,'#B97E55','data-material="thin-a-marker"');
 a+=group(layers,`transform="translate(${shift} ${cy}) scale(1 ${cos})" data-object="A-thin-oxide"`);
 const remainder=rect(L,sep,ww,rest,'#BECED7','stroke="#708A98" data-material="donor-remainder"');
 a+=group(remainder,`transform="translate(${donorX} ${cy-gap}) scale(1 ${cos})" data-object="A-remainder"`);
 if(Math.abs(cos)>.55){a+=text(c+donorX,cy-gap+cos*(sep+rest*.5)+5,q.split>.1?'A 餘料':'A 供體',fs);a+=text(c+shift,cy+cos*thinMid+5,'A薄矽',fs);}
 const oy=cy+cos*(top+ox*.5),ly=oy+(cos<0?21:-18),sy=cy+cos*sep;
 if(Math.abs(cos)>.7){a+=group(path(`M${R} ${oy}H${R+10}V${ly-4}`,'#86A9BA',1)+text(R+8,ly, q.split>.8?'埋氧層':'SiO₂',sm,'start'),`transform="translate(${shift} 0)"`);}
 if(q.implant>0&&q.split<.75){let zone=path(`M${L} ${sy}H${R}`,'#C2956E',2.5,`stroke-dasharray="4 4" opacity="${q.implant}"`);if(Math.abs(cos)>.7)zone+=path(`M${R} ${sy}H${R+10}V${sy+(cos<0?-17:18)}`,'#B58D68',1)+text(R+8,sy+(cos<0?-19:32),'分離區',sm,'start');a+=group(zone,`transform="translate(${shift} 0)"`);}
 if(q.bond===1){a+=group(path(`M${L} ${BY}H${R}`,'#698B9D',1.3),`transform="translate(${shift} 0)"`);}
 if(!fresh&&s.t>=3&&s.t<8){for(let i=0;i<4;i++){const p=((s.t-3)*.35+i*.25)%1,x=L+ww*(i+1)/5,y=38+p*(cy+sep-38);a+=circle(x,y,3.8,'none','stroke="#AE9AC1"')+text(x+6,y+2,'+',10,'start','#9B87B1');}}
 if(!fresh&&s.t>=9&&s.t<14)a+=path(`M${c-25} ${cy-total/2-16}q25-20 50 0m-9-2l9 2l-3-9`,'#889DAA',1.5);
 if(!fresh&&s.t>=19&&s.t<24){for(let i=0;i<2;i++){const x=L-15-i*13;a+=path(`M${x} ${BY+BH*.75}q-5-5 0-10q5-5 0-10`,'#C9A883',1.4);}}
 if(!fresh&&s.t>=29&&s.t<32){const y=BY-ox-thin+loss-5;a+=rect(L,y-5,ww,5,'#CFD9DE','rx="2"')+arrow(c-20+15*Math.sin(s.t*2),y-12,40,0,'#8B9DA7');}
 return a;};
 v+=group(assembly(s.newWafer),'clip-path="url(#frame)"');
 v+=text(c,h-13,s.t<19?'● 同一段A薄矽，標記隨材料移動':s.t<29?'接合面保持；A在內部分離':s.t<32?'由上而下：A薄矽／埋氧／B':s.t<34?'← A餘料　　SOI →':'← 新一組A與B',sm,'middle','#5B6B75');return v;
}
