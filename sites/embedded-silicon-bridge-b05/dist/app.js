import {mount,txt,rect,path,ramp} from './view.js';import {topic,state} from './model.js';
const bridgePath='M270,200 V250 H370 V200',externalA='M140,200 V270 H180 V310',externalB='M500,200 V270 H460 V310';
function assembly(t,s,font){let g=rect(60,220,520,90,'','fill="#e2e5d8" fill-opacity=".72"');
 g+=rect(244,230,152,40,'silicon');g+=rect(46,330,548,12,'fixture')+rect(100,310,28,20,'fixture')+rect(515,310,28,20,'fixture');
 // Fine traces stay in the metal layers on the bridge; there is no downward TSV.
 for(const d of ['M270,220 V250 H370 V220','M290,220 V235 H350 V220'])g+=path(d,'','fill="none" stroke="#b89555" stroke-width="5"');
 for(const d of ['M140,220 V270 H180 V310','M180,220 V258 H210 V310','M500,220 V270 H460 V310','M460,220 V258 H430 V310'])g+=path(d,'','fill="none" stroke="#b89555" stroke-width="6"');
 for(const x of [140,180,270,290,350,370,460,500])g+=rect(x-(x>240&&x<400?7:11),218,x>240&&x<400?14:22,5,'metal');
 for(const [id,x,p,bond,lift] of [['A',100,s.placeA,s.bondA,s.liftA],['B',340,s.placeB,s.bondB,s.liftB]]){const dy=-90*(1-p),fine=id==='A'?[270,290]:[350,370],coarse=id==='A'?[140,180]:[460,500];g+=`<g data-die="${id}" transform="translate(0 ${dy})">`+rect(x,150,200,50,'silicon')+txt(x+100,182,'晶粒 '+id,font);
 for(const px of coarse.concat(fine)){const narrow=fine.includes(px),bw=narrow?10:18;g+=`<rect x="${px-bw/2}" y="200" width="${bw}" height="20" rx="${2+2*bond}" fill="${bond>.99?'#c7b17f':'#b9bec3'}" stroke="#7b8b93" stroke-width="1"/>`;}
 if(lift<1)g+=`<g transform="translate(0 ${-100*lift})" opacity="${1-lift}">`+rect(x+20,124,160,26,'fixture')+path(`M${x+100},92 V116 m-6,-8 6,8 6,-8`,bond>0&&bond<1?'heat':'guide')+'</g>';
 g+='</g>';}
 if(s.bridge>0)g+=path(bridgePath,'signal',`stroke-dasharray="${200*s.bridge} 800"`);
 if(s.external>0)for(const d of [externalA,externalB])g+=path(d,'',`fill="none" stroke="#547da4" stroke-width="3" vector-effect="non-scaling-stroke" stroke-dasharray="${150*s.external} 800"`);
 g+=txt(320,298,'有機載板',font);return g;}
mount(topic,(t,{w,h,small})=>{const s=state(t),short=h<300,scale=Math.min((w-20)/640,(h-(short?8:85))/360,1.65),font=(small?15:16)/scale,ox=(w-640*scale)/2,oy=short?4:(h-360*scale)/2+10,travel=w/scale+700;
 let out=txt(short?12:w/2,26,short?'局部矽橋 · 無 TSV':t<18?'內側細接點對矽橋，外側接一般載板':t<23?'A 接點 → 橋上金屬 → B 接點':t<26?'綠線：跨橋　藍線：外部連接':'接合件保留接點退場',small?15:16,short?'start':'middle');
 out+=`<g transform="translate(${ox} ${oy}) scale(${scale})"><g transform="translate(${travel*s.exit} 0)">`+assembly(t,s,font)+'</g>';if(t>=28)out+=`<g transform="translate(${-travel*(1-s.incoming)} 0)">`+assembly(0,state(0),font)+'</g>';out+='</g>';
 if(!short)out+=txt(w/2,h-12,t<18?'中央淺藍小塊：內嵌矽橋':t<26?'導通沿金屬線，矽橋底部沒有 TSV':'新的載板與晶粒從左側進場',small?15:16);return out;});
