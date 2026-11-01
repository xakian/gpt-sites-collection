import {mount,txt,rect,path,ramp,lerp,ease} from './view.js';import {topic,state} from './model.js';
function body(t,s,font){
 const ys=[lerp(40,210,s.stack),lerp(155,240,s.stack),270],via=[170,360,220],starts=[130,170,360],ends=[170,360,220];let g='';
 // Registered holes stay with each tape. The front is a cut through the via route.
 for(let i=2;i>=0;i--){const y=ys[i],x=90;g+=`<g data-layer="${i}">`;
 g+=`<path d="M90,${y} l28,-18 h420 l-28,18 Z M510,${y} l28,-18 v30 l-28,18 Z" fill="#d9e0d4" stroke="#819180" stroke-width="1"/>`;
 g+=rect(x,y,420,30,'',`fill="${s.fire>.5?'#e4e2d6':'#dae5d8'}" fill-opacity=".9"`);
 if(s.hole>0){g+=rect(via[i]-8,y,16,30*s.hole,'','fill="#f7f9fa"');for(const px of [108,492])g+=`<circle cx="${px}" cy="${y+10}" r="${5*s.hole}" fill="#f7f9fa" stroke="#7b8e7b"/>`;}
 if(s.fill>0)g+=rect(via[i]-7,y,14,30*s.fill,'','fill="#a6a9af"');
 if(s.print>0){g+=path(`M${starts[i]},${y} H${lerp(starts[i],ends[i],s.print)}`,'','fill="none" stroke="#9299a2" stroke-width="8"');if(i===0)g+=rect(116,y-6,28*s.print,6,'','fill="#b1b5bd"');if(i===2)g+=rect(206,y+30,28*s.print,6,'','fill="#b1b5bd"');}
 if(s.stack<.65)g+=txt(74,y+22,'生瓷 '+(i+1),font,'end');
 if(t>=3&&t<6){const p=ramp(t,3,5),out=ramp(t,5,6),dy=p<.5?25*p*2:25*(2-p*2);g+='<g opacity="'+(1-out)+'">'+rect(via[i]-7,y-34+dy-70*out,14,25,'fixture')+'</g>';if(p>.5)g+=rect(via[i]-6-650*out,y+35+60*out,12,15,'','fill="#dae5d8"');}
 g+='</g>';}
 if(t>=13&&t<17.5){const enter=ease(ramp(t,13,14)),leave=ramp(t,17,17.5);g+='<g transform="translate(0 '+(-180*(1-enter)-100*leave)+')" opacity="'+(enter*(1-leave))+'">'+rect(104,192,400,18,'fixture')+path('M240,163 v20 m-6,-7 6,7 6,-7 M370,163 v20 m-6,-7 6,7 6,-7','heat')+'</g>';}
 if(t>=17&&t<21){for(let i=0;i<8;i++){const p=((t-17)/2+i*.17)%1;g+=`<circle cx="${140+i*48}" cy="${215-p*135}" r="${3+2*p}" fill="#b6ac9d" opacity="${.7*(1-p)}"/>`;}}
 if(s.highlight>0){const d='M130,210 H170 V240 H360 V270 H220 V306';g+=path(d,'signal',`opacity="${s.highlight}" stroke-dasharray="${590*s.highlight} 900"`);}
 return g;
}
mount(topic,(t,{w,h,small})=>{const s=state(t),short=h<300,scale=Math.min((w-22)/620,(h-(short?8:84))/350,1.65),font=(small?15:16)/scale,ox=(w-620*scale)/2,oy=short?4:(h-350*scale)/2+15,shx=1-.16*s.fire,shy=1-.2*s.fire,travel=w/scale+700;
 let out=txt(short?12:w/2,25,short?'三層 LTCC 剖視':t<10?'灰銀色：填孔柱與橫向線段':t<17?'對位後，各孔柱接到下一層銀線':t<21?'先排膠，再共同緻密化':t<30?'陶瓷與金屬一起收縮，接點相連':'硬陶瓷退出，新的生瓷進場',small?15:16,short?'start':'middle');
 out+=`<g transform="translate(${ox} ${oy}) scale(${scale})">`;
 if(t>=17&&t<27){const op=Math.min(ramp(t,17,17.5),1-ramp(t,26,27));out+=`<rect x="60" y="120" width="480" height="210" rx="16" fill="#edddd0" fill-opacity="${op*.24}" stroke="#bc9884" stroke-opacity="${op*.5}"/>`;}
 const tray=rect(60,306,480,13,'fixture')+rect(150,300,20,6,'fixture')+rect(430,300,20,6,'fixture');
 out+=`<g transform="translate(${s.exit*travel} 0)">`+tray+`<g transform="translate(300 300) scale(${shx} ${shy}) translate(-300 -300)">`+body(t,s,font/Math.min(shx,shy))+'</g></g>';
 if(t>=32)out+=`<g transform="translate(${-travel*(1-s.incoming)} 0)">`+tray+body(0,state(0),font)+'</g>';
 out+='</g>';if(!short)out+=txt(w/2,h-13,t<6?'生瓷含玻璃／陶瓷粉體與有機成分':t<10?'填孔完成，再把孔與橫向銀線接上':t<17?'同一條路徑，沿層間接點接續':t<26?'整體收縮為示意，不是通用比例':'上墊 → 填孔柱與橫線 → 下墊',small?15:16);return out;});
