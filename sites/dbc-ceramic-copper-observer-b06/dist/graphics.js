import {C,rect,text,line,arrow,swap} from './svg.js';import {layout} from './layout.js';
export function draw(s,size){const L=layout(size),{w,h,mobile,font:f,main:m,zoom:z}=L,sw=swap(s.t,27,30,w),wet=sw.fresh?0:s.wet,solid=sw.fresh?0:s.solid,contact=sw.fresh?0:s.contact;let out=text(w/2,26,s.thermal,f,C.muted);
function material(x,y,width,large){const gap=(1-contact)*(large?30:45),cuH=large?32:38,cerH=large?36:48,layer=large?12:5;let o=rect(x,y+layer,width,cerH,C.ceramic)+rect(x,y-cuH-gap,width,cuH,C.copper);o+=rect(x,y-gap-3,width,3,'#B48774');
if(wet>0){o+=rect(x,y,width*wet,layer,solid>=1?'#AE927F':'#E6BF94');if(solid<1){for(let n=0;n<Math.floor(width*wet/16);n++)o+=`<path d="M${x+n*16+2} ${y+layer*.5}q4 -3 8 0" fill="none" stroke="#A57855" stroke-width="1"/>`;}}
if(large){o+=text(x+width/2,y-cuH-gap+23,'固態銅',f)+text(x+width/2,y+layer+25,'固態 Al₂O₃',f);o+=text(x+width/2,y+layer+cerH+22,wet===0?'薄氧化層（放大）':solid>=1?'固化接合界面':'局部液相與潤濕前緣',f);}
return o;}
out+=`<g transform="translate(${sw.x} 0)">${material(m.x,m.y,m.width,false)}${rect(m.x-8,m.y+53,m.width+16,13,C.tool)}${text(m.x+m.width/2,m.y+89,'銅箔／氧化鋁／承托',f)}${mobile?'':text(m.x+m.width/2,m.y-104,'整件材料',f,C.muted)}`;
if(s.t>=5&&s.t<24&&!sw.fresh)out+=`<path d="M${m.x-15} ${m.y+68}v-160h${m.width+30}v160" fill="none" stroke="#B8AAA0" stroke-width="2" stroke-dasharray="5 5"/>`;
if(s.t>=24&&s.t<27&&!sw.fresh){out+=arrow(m.x+20,m.y-20,m.x+m.width-20,m.y-20,'#A67A52');out+=text(m.x+m.width/2,m.y-49,'銅內導電',f);}
out+='</g>';
out+=`<g transform="translate(${sw.x} 0)">${text(z.x+z.width/2,z.y-100,'同一界面 · 放大',f,C.muted)}${material(z.x,z.y,z.width,true)}</g>`;
if(!mobile)out+=line(m.x+m.width+12,m.y,z.x-12,z.y,C.line,1,'stroke-dasharray="4 4"');
return out;}

