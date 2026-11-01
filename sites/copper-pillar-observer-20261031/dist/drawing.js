import {R,P,T,C} from './svg.js';import {colors as c} from './materials.js';import {solderProfile} from './model.js';
export function draw(s,w,h){
 const sx=Math.min((w-60)/560,1.5),sy=Math.min(sx*1.5,(h-175)/330),ox=(w-560*sx)/2,oy=100+60*sy+(h-175-330*sy)/2,shift=-(1-s.enter)*(w+300)+s.exit*(w+300),b=[];
 b.push(R(0,200,560,50,c.wafer,`stroke="${c.line}"`),R(125,190,110,10,c.pad),R(325,190,110,10,c.pad));
 for(const [x,width] of [[0,145],[215,130],[415,145]])b.push(R(x,180,width,20,c.passivation,`stroke="${c.line}"`));
 const seedPath='M0 179H145V189H215V179H345V189H415V179H560';
 if(s.seed>0){b.push(P(seedPath,'none',`stroke="${c.ubm}" stroke-width="8" opacity="${s.seed*(1-s.etch)}"`),P(seedPath,'none',`stroke="${c.copper}" stroke-width="6" opacity="${s.seed*(1-s.etch)}"`));if(s.etch>0)for(const x of [145,345])b.push(R(x,186,70,4,c.ubm),R(x,183,70,3,c.copper));}
 if(s.resist>0)for(const [x,width] of [[0,145],[215,130],[415,145]])b.push(R(x,38,width,138,c.resist,`opacity="${s.resist}"`));
 for(const x of [145,345]){
 const top=186-106*s.copper;b.push(R(x,top,70,106*s.copper,c.copper));
 if(s.nickel>0)b.push(R(x,top-8*s.nickel,70,8*s.nickel,c.nickel));
 if(s.solder>0){const base=top-8,profile=solderProfile(s.round);let d=`M${x} ${base}L${x} ${base-profile.z(-35)*s.solder}`;for(let k=1;k<=40;k++){const xx=-35+70*k/40;d+=`L${x+35+xx} ${base-profile.z(xx)*s.solder}`;}d+=`L${x+70} ${base}Z`;b.push(P(d,c.solder,`stroke="${c.line}" stroke-width="1"`));}
 }
 if(s.t>=8&&s.t<19){b.push(P('M0 179H-14V-30H55','none',`stroke="${c.line}" stroke-width="2"`),R(55,-45,80,30,'#E9EEF0',`stroke="${c.line}"`),T(95,-25,'−　＋',18),P('M135 -30H485V-3','none',`stroke="${c.line}" stroke-width="2"`),R(450,-3,70,10,s.t<14?c.copper:s.t<16?c.nickel:c.solder));}
 if(s.heat>0)for(const x of [180,380])for(let k=-1;k<=1;k++)b.push(P(`M${x+k*22} -20q-10 12 0 24t0 24`,'none',`stroke="${c.heat}" opacity="${s.heat}" stroke-width="2"`));
 let out=`<g transform="translate(${ox+shift} ${oy}) scale(${sx} ${sy})">${b.join('')}</g>`+T(w/2,28,s.stage.title,18);
 const note=s.t<2?'同一對焊墊・局部剖視':s.t<5?'開口底部接觸原焊墊':s.t<8?'光阻限定柱體位置':s.t<14?'銅在開口內逐步長高':s.t<16?'銅柱頂部的鎳阻障層':s.t<19?'錫銀焊料形成平頂帽':s.t<23?'柱下保留・柱間移除':s.t<27?'焊料圓化・銅柱保持固態':s.t<30?'凝固焊料帽・接點分離':'完成區域退出 → 新區域進場';out+=T(w/2,55,note,14);
 if(s.enter===1&&s.exit===0){out+=T(ox+180*sx,oy+250*sy+21,'焊墊 A',15)+T(ox+380*sx,oy+250*sy+21,'焊墊 B',15);}
 const legend=[['銅',c.copper],['鎳',c.nickel],['焊料',c.solder],['光阻',c.resist]];legend.forEach(([label,col],i)=>{const x=(i+.5)*w/4;out+=R(x-28,h-28,11,11,col)+T(x+9,h-18,label,14);});return out;
}
