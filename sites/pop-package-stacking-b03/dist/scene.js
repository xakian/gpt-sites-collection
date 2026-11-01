import {rect,text,line,circle,path,legend} from './svg.js';
export function draw(s,l){const {width:W,height:H,x,w,y,k}=l,upper=y-(100-64*s.place-6*s.wet)*k+s.dip*4*k,dx=(1-s.align)*w*.08,ux=x+dx,shift=-(1-s.entry)*(W+w)+s.exit*(W+w),xs=[.12,.25,.75,.88],bot=[.3,.43,.57,.7],r=16*k;
let out=`<defs><clipPath id="work"><rect y="62" width="${W}" height="${H-80}"/></clipPath></defs>`+legend([['mold','模封'],['substrate','基板'],['solder','焊料'],['pad','焊墊'],['flux','助焊劑'],['carrier','載具']],W);
let a=rect(x-7,y+22*k,15,45*k,'carrier')+rect(x+w-8,y+22*k,15,45*k,'carrier')+rect(x-7,y+60*k,w+14,9*k,'carrier');a+=rect(x,y,w,22*k,'substrate')+rect(x+w*.34,y-20*k,w*.32,20*k,'mold')+rect(x+w*.41,y-16*k,w*.18,8*k,'die');
for(const q of xs)a+=rect(x+w*q-15*k,y-4*k,30*k,4*k,'pad');for(const q of bot)a+=rect(x+w*q-7*k,y+20*k,14*k,4*k,'pad')+circle(x+w*q,y+31*k,9*k,'solder');
a+=rect(ux,upper-18*k,w,18*k,'substrate')+rect(ux+w*.08,upper-48*k,w*.84,30*k,'mold')+rect(ux+w*.36,upper-40*k,w*.28,10*k,'die')+path(`M${ux+8} ${upper-14*k}h8l-8 8Z`,'mark');
for(const q of xs){const xx=ux+w*q,top=upper; a+=rect(xx-9*k,top-3*k,18*k,3*k,'pad');if(s.wet>0)a+=path(`M${xx-9*k} ${top} Q${xx-20*k} ${top+12*k} ${xx-15*k} ${y-4*k} L${xx+15*k} ${y-4*k} Q${xx+20*k} ${top+12*k} ${xx+9*k} ${top}Z`,'solder outline');else a+=circle(xx,top+r,r,'solder');if(s.flux>0&&s.wet<1)a+=path(`M${xx-9*k} ${top+24*k}Q${xx} ${top+29*k} ${xx+9*k} ${top+24*k}`,'fluxline',`opacity="${s.flux*(1-s.wet)}"`);}
if(s.t>=4&&s.t<9){const ty=y-66*k;a+=`<g transform="translate(${-W*(1-s.tray)} 0)">`+rect(ux-5,ty,w+10,8*k,'flux')+path(`M${ux-9} ${ty-2*k}v14h${w+18}v-14`,'tray')+'</g>';}
if(s.tool>0)a+=`<g opacity="${s.tool}">`+rect(ux+w*.36,upper-58*k-(1-s.tool)*40,w*.28,10*k,'tool')+line(ux+w*.5,upper-58*k-(1-s.tool)*40,ux+w*.5,upper-70*k-(1-s.tool)*40,'tool-line')+'</g>';
if(s.index===2)for(const q of xs)a+=line(ux+w*q,upper+29*k,x+w*q,y-5*k,'guide');
if(s.hot)for(const side of [x-17,x+w+17])a+=path(`M${side} ${y+42*k}q-12 -12 0 -24t0 -24t0 -24`,'heat');
if(s.connected){a+=path(`M${x+w*.43} ${upper-9*k}H${x+w*.12}V${y+10*k}H${x+w*.3}V${y+40*k}`,'flow');}
const captions=['上下完整封裝與避球載具','上層球端沾助焊劑','周邊球對準頂面墊','中央模封保持避讓','各接點潤濕，底部球懸空','冷卻，接點維持分離','封裝間連通；底部球待裝板'];
out+=`<g clip-path="url(#work)"><g transform="translate(${shift} 0)">${a}</g></g>`;out+=text(W/2,Math.min(H-28,y+119*k),captions[s.index]);return out;}
