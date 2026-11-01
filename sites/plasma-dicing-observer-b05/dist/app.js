import {mount,txt,rect,path,ramp} from './view.js';import {topic,state} from './model.js';
function wafer(s,font,t,travel){let g='';
 g+=`<g transform="translate(${travel*s.frameExit} 0)">`;
 g+=rect(40,230,45,24,'fixture')+rect(555,230,45,24,'fixture');
 g+=path(`M60,234 H285 Q320,${234-4*s.pin} 355,234 H580`,'','fill="none" stroke="#c3b2d1" stroke-width="8"');
 for(const x of [220,385])if(s.etch<1)g+=rect(x,160+70*s.etch,35,70*(1-s.etch),'silicon');
 for(const [i,x] of [90,255,420].entries()){if(i===1)continue;g+=rect(x,160,130,70,'silicon')+rect(x,155,130,5,'metal')+rect(x,149,130,6,'glass',`opacity="${s.mask}"`);}
 g+=txt(150,278,'膠帶',font)+txt(540,278,'框架',font);
 if(t>=19&&t<25)g+=path(`M320,318 V${260-24*s.pin} m-7,10 7,-10 7,10`,'guide');g+='</g>';
 g+=`<g transform="translate(${travel*s.pickExit} ${-80*s.lift})">`+rect(255,160,130,70,'silicon')+rect(255,155,130,5,'metal')+rect(255,149,130,6,'glass',`opacity="${s.mask}"`)+txt(320,202,'A',font+2);
 if(t>=19)g+=`<g transform="translate(0 ${-75*(1-s.tool)})" opacity="${ramp(t,19,19.5)}">`+rect(292,96,56,59,'fixture')+path('M320,68 V92','guide')+'</g>';g+='</g>';
 if(t>=4&&t<14){for(const x of [237.5,402.5]){g+=path(`M${x},94 V140 m-5,-8 5,8 5,-8`,'signal');for(let n=0;n<4;n++){const p=((t*0.5+n/4)%1),y=160+70*s.etch-p*(85+70*s.etch);g+=`<circle cx="${x+Math.sin(n*3)*6}" cy="${y}" r="3.5" fill="#c6a1a1" opacity="${1-p}"/>`;}}}
 return g;}
mount(topic,(t,{w,h,small})=>{const s=state(t),short=h<300,scale=Math.min((w-16)/640,(h-(short?12:70))/330,1.8),font=(small?15:16)/scale,ox=(w-640*scale)/2,oy=short?0:(h-330*scale)/2+10,travel=w/scale+680;
 let out=txt(short?12:w/2,25,t<4?'遮罩保護元件 · 街道已開通':t<14?'同步移除矽 · 反應產物向外排出':t<17?'矽已分離 · 膠帶仍完整':t<20?'去遮罩與清理':t<25?'吸嘴與頂針配合 · 取出 A':'取出晶粒 →　剩餘框架 →',small?15:16,short?'start':'middle');
 out+=`<g transform="translate(${ox} ${oy}) scale(${scale})">`+wafer(s,font,t,travel);if(t>=30)out+=`<g transform="translate(${-travel*(1-s.incoming)} 0)">`+wafer(state(0),font,0,travel)+'</g>';out+='</g>';
 if(!short)out+=txt(w/2,h-12,t<20?'淡綠遮罩／金色元件層／淺藍矽／紫色膠帶':'A 的接點面朝上，其他晶粒仍留在框架',small?15:16);return out;});

