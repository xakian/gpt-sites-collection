import {mount,txt,rect,path,ramp} from './view.js';
import {topic,state} from './model.js';
function assembly(t,s,font){
 const chipY=-110+104*s.approach+6*s.press,chipX=36*(1-s.align),filmY=-70*(1-s.film),ry=11-3*s.press,cy=266-ry;
 let g=rect(70,280,460,52,'glass')+rect(45,336,510,14,'fixture');
 g+=rect(162,266,96,14,'metal')+rect(342,266,96,14,'metal');
 g+='<g transform="translate(0 '+filmY+')">'+rect(88,228+10*s.press,424,52-10*s.press,'resin',`fill-opacity="${.55+.25*s.cure}"`);
 if(s.cure>0)g+='<g opacity="'+s.cure+'">'+[110,140,280,310,462,490].map(x=>path(`M${x},242 l8,10 -8,10 8,14`,'guide','stroke-dasharray="2 3"')).join('')+'</g>';
 for(const [i,x] of [196,228,292,318,376,408].entries()){const active=i<2||i>3;const px=x+(!active?(i===2?-6:6)*s.press:0),py=active?cy:255;g+=`<ellipse data-particle="${i}" cx="${px}" cy="${py}" rx="${active?11+4*s.press:9}" ry="${active?ry:9}" fill="#f1e3bf" stroke="#af8c45" stroke-width="3"/>`;}
 g+='</g>';
 if(t<6){const peel=ramp(t,3,5),leave=ramp(t,5,6),edge=88+424*peel;g+='<g transform="translate('+(-2400*leave)+' 0)">'+path(`M512,${226+filmY} H${edge} Q${edge-22},${210+filmY} ${edge-45},${195+filmY} L${88-450*peel},${195+filmY-100*peel}`,'guide','stroke="#99aeb7" stroke-width="5"')+'</g>';}
 g+='<g transform="translate('+chipX+' '+chipY+')">'+rect(118,148,364,52,'silicon')+rect(162,200,96,50,'metal')+rect(342,200,96,50,'metal');
 g+=txt(300,180,'晶片',font)+txt(210,230,'凸塊',font)+txt(390,230,'凸塊',font)+'</g>';
 if(t<23){const lift=75*s.unload;g+='<g transform="translate('+chipX+' '+(chipY-lift)+')" opacity="'+(1-s.unload)+'">'+rect(142,119,316,24,'fixture')+path('M210,86 v25 m-7,-8 7,8 7,-8 M390,86 v25 m-7,-8 7,8 7,-8',t>=9&&t<19?'heat':'guide')+'</g>';}
 if(s.press>.99){g+='<g opacity="'+(.25+.75*s.verify)+'">'+[196,228,376,408].map(x=>path(`M${x},239 V279`,'signal')).join('')+'</g>';}
 g+=txt(300,314,'玻璃基板',font)+txt(210,372,'端子 A',font)+txt(390,372,'端子 B',font);
 return g;
}
mount(topic,(t,{w,h,small},step)=>{
 const s=state(t),short=h<300,scale=Math.min((w-28)/600,(h-(short?8:105))/(short?385:370),1.65),font=(small?15:short?16:17)/scale,ox=(w-600*scale)/2,oy=short?4:(h-370*scale)/2+12;
 let svg=txt(short?14:w/2,28,short?'COG 局部剖視':t<19?'COG 局部剖視':t<23?'保持壓縮冷卻，再卸載':t<27?'接點導通，端子間保持隔離':'完成件 →　新材料 →',small?15:17,short?'start':'middle');
 svg+='<g transform="translate('+ox+' '+oy+') scale('+scale+')">';
 const travel=w/scale+600,outgoing=s.exit*travel;svg+='<g transform="translate('+outgoing+' 0)">'+assembly(t,s,font)+'</g>';
 if(t>=29)svg+='<g transform="translate('+(-travel*(1-s.incoming))+' 0)">'+assembly(0,state(0),font)+'</g>';
 svg+='</g>';
 const note=t<3?'膠膜內的顆粒尚未接通上下':t<6?'離型膜離開，樹脂與顆粒留下':t<9?'兩對凸塊各自對準端子':t<12?'凸塊下降，靠近膠層內的顆粒':t<14?'接觸後壓縮，連接上下金屬':t<19?'網狀符號：絕緣樹脂逐步固化':t<23?'固化膠固定間隙與接觸':t<27?'綠線：垂直接觸　／　中間顆粒互不相接':'接合件保留固化狀態退出';
 if(!short){if(w<400&&t>=23&&t<27){svg+=txt(w/2,h-42,'綠線：垂直接觸',15)+txt(w/2,h-20,'中間顆粒互不相接',15);}else svg+=txt(w/2,h-10,note,small?15:16);}
 return svg;
});
