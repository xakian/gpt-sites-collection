import {stages,clamp} from './model.js';
const fmt=n=>Number(n.toFixed(2));
const path=points=>'M'+points.map(p=>p.map(fmt).join(',')).join('L');
export function createScene(shell){
 shell.wrap.style.width='100%';shell.wrap.style.height='100%';
 const svg=shell.svg;
 svg.innerHTML=`<defs><clipPath id="polish-clip"><rect id="keep-region"/></clipPath><clipPath id="sample-clip"><rect id="sample-bounds"/></clipPath></defs>
 <text id="view-label" class="muted"/><text id="process-line"/><g id="legend"/>
 <g clip-path="url(#sample-clip)"><g id="sample"><g id="bath"/><path id="body" class="dielectric"/><path id="underlay" class="base"/>
 <g id="resist"/><g clip-path="url(#polish-clip)"><path id="barrier" class="barrier"/><path id="seed" class="seed"/><path id="copper" class="copper"/></g>
 <path id="target-line" class="target"/><g id="tool"/><g id="markers"/><text id="dielectric-label"/><g id="sample-tag"/></g><g id="next-sample"/></g>
 <text id="context" class="muted"/><text id="scale-note" class="muted"/>`;
 const get=id=>svg.querySelector('#'+id);
 const set=(id,attrs)=>Object.entries(attrs).forEach(([k,v])=>get(id).setAttribute(k,String(v)));
 const text=(id,value,attrs)=>{get(id).textContent=value;set(id,attrs);};
 let w=0,h=0,g;
 function resize(){
  ({width:w,height:h}=shell.host.getBoundingClientRect());
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  const narrow=w<600,short=h<310;
  const width=Math.min(w-(narrow?36:90),1080),l=(w-width)/2,r=l+width;
  const top=short?115:Math.max(narrow?224:192,h*.36),bottom=h-(short?64:78),depth=(bottom-top)*.64;
  g={l,r,top,bottom,depth,narrow,short,width,trenches:[[l+width*.19,l+width*.40],[l+width*.60,l+width*.81]],b:short?4:narrow?6:7,s:short?3:4,over:short?24:44};
  set('sample-bounds',{x:0,y:0,width:w,height:h-26});
  text('view-label','固定局部剖面 · 同一段結構',{x:w/2,y:23,'text-anchor':'middle','font-size':12,opacity:short?0:1});
  set('process-line',{x:w/2,y:short?22:53,'text-anchor':'middle','font-size':narrow?16:18});
  text('scale-note','示意比例 · 薄層已放大',{x:w/2,y:h-10,'text-anchor':'middle','font-size':12,opacity:short?0:1});
 }
 function surface(offset,depth=g.depth){const {l,r,top,trenches}=g;return [[l,top-offset],...trenches.flatMap(([a,b])=>[[a+offset,top-offset],[a+offset,top+depth-offset],[b-offset,top+depth-offset],[b-offset,top-offset]]),[r,top-offset]];}
 function band(upper,lower){return path([...upper,...lower.slice().reverse()])+'Z';}
 function rect(x,y,width,height,cls,extra=''){return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(Math.max(0,width))}" height="${fmt(Math.max(0,height))}" class="${cls}" ${extra}/>`;}
 function label(x,y,value,size=16,cls=''){return `<text x="${fmt(x)}" y="${fmt(y)}" text-anchor="middle" font-size="${size}" class="${cls}">${value}</text>`;}
 function render(s){
  if(!g)resize();
  const {l,r,top,bottom,depth,trenches,b,s:seedSize,over,narrow,short,width}=g;
  const actualDepth=depth*s.etch,B=b*s.barrier,S=seedSize*s.seed;
  text('process-line',stages[s.stage].line,{});
  set('sample',{'transform':`translate(${fmt(s.exit*(w+30))} 0)`});
  const edge=surface(0,actualDepth);
  set('body',{d:path([...edge,[r,bottom],[l,bottom]])+'Z'});
  set('underlay',{d:path([[l,bottom],[r,bottom],[r,bottom+13],[l,bottom+13]])+'Z'});
  const fields=[[l,trenches[0][0]],[trenches[0][1],trenches[1][0]],[trenches[1][1],r]];
  get('resist').innerHTML=fields.map(([a,z])=>rect(a,top-22*s.mask,z-a,22*s.mask,'resist')).join('');
  set('resist',{opacity:s.mask>0?1:0});
  set('barrier',{d:band(surface(B),surface(0)),opacity:s.barrier>0?1:0});
  set('seed',{d:band(surface(B+S),surface(B)),opacity:s.seed>0?1:0});
  // Bottom-up filling, with a slower field/sidewall deposit. No falling molten metal.
  const f=s.fill,field=f<.78?8*f/.78:8+(f-.78)/.22*(over-8);
  const side=6*f,fieldTop=top-B-S-field;
  const fillTop=Math.max(fieldTop,top+depth-B-S-(depth+14)*clamp(f/.82)-(over-14)*clamp((f-.82)/.18));
  const upper=[[l,fieldTop],...trenches.flatMap(([a,z])=>[[a+B+S+side,fieldTop],[a+B+S+side,fillTop],[z-B-S-side,fillTop],[z-B-S-side,fieldTop]]),[r,fieldTop]];
  set('copper',{d:band(upper,surface(B+S)),opacity:f>0?1:0});
  const fullTop=top-b-seedSize-over;
  const cut=s.t>=24?fullTop+s.copperPolish*(seedSize+over)+s.barrierPolish*b:0;
  set('keep-region',{x:l-1,y:cut,width:width+2,height:bottom+30-cut});
  set('target-line',{d:`M${l-8},${top}H${r+8}`,opacity:s.stage>=4&&s.stage<=6?.7:0});
  const keys=[['絕緣層','#DFEAF0'],[s.stage<2?'光阻':'阻障層',s.stage<2?'#DDD5E8':'#6D818B'],['種子銅','#AC6947'],['電鍍銅','#DFAB87']];
  const gap=narrow?148:150,cols=narrow?2:4;
  get('legend').innerHTML=keys.map(([name,color],i)=>{const x=w/2-(cols*gap)/2+(i%cols)*gap+18,y=(short?h-10:82)+Math.floor(i/cols)*24;return `<rect x="${x}" y="${y-11}" width="12" height="12" rx="2" fill="${color}" stroke="#74848E" stroke-width=".6"/><text x="${x+20}" y="${y}" font-size="${narrow?14:15}" class="muted">${name}</text>`;}).join('');
  get('bath').innerHTML=rect(l-5,top-over-21,width+10,depth+over+26,'bath');set('bath',{opacity:s.bath});
  let marks='';
  if(s.stage===0||s.stage===1){
   trenches.forEach(([a,z])=>{const x=(a+z)/2;marks+=label(x,top-42,s.etch<.95?'開口':'溝槽',narrow?15:17);if(s.t>3.5&&s.t<6.5){const yy=top+actualDepth-7;marks+=`<path d="M${x},${top-20}V${yy}m-4 -6l4 6 4 -6" class="guide"/>`;}});
  }else if(s.stage===2||s.stage===3){
   const x=trenches[0][0]+B+(s.stage===3?S/2:-B/2),y=top+depth*.5;
   marks+=label(w/2,top-35,s.stage===2?'表面、槽壁、槽底都覆上':'在阻障層上鋪一層薄銅',narrow?15:17);
   marks+=`<path d="M${w/2},${top-27}L${x},${y}" class="guide"/><circle cx="${x}" cy="${y}" r="3" fill="#F7F9FA" stroke="#647A88"/>`;
  }else if(s.stage===4){
   marks+=label(w/2,top-over-(short?23:42),f<.92?'電鍍液中，銅逐漸長出':'表面銅連成一片',narrow?15:17);
   if(f<.78)trenches.forEach(([a,z])=>{const x=(a+z)/2;marks+=`<path d="M${x},${top+depth-22}V${Math.max(top+18,fillTop-10)}m-4 6l4 -6 4 6" class="guide"/>`;});
  }else if(s.stage>=5&&s.stage<=6){
   marks+=label(w/2,top-over-(short?42:50),s.stage===5?'研磨墊 ＋ 研磨液':'接續清除場區阻障',narrow?15:17);
  }else if(s.stage===7||s.stage===8){
   trenches.forEach(([a,z],i)=>{const x=(a+z)/2;marks+=label(x,top-23,'銅線 '+(i===0?'A':'B'),narrow?15:17)+`<path d="M${x},${top-17}V${top+12}" class="guide"/>`;});
  }
  get('markers').innerHTML=marks;
  text('dielectric-label','絕緣層',{x:w/2,y:bottom-15,'text-anchor':'middle','font-size':narrow?16:18});
  const tagx=l+12,tagy=bottom+13;
  get('sample-tag').innerHTML=`<path d="M${tagx},${tagy-7}v6m-3 -3h6" stroke="#7D8D96" stroke-width="1"/>`;
  const contact=s.t<24.8?fullTop-12*(1-clamp((s.t-24)/.8)):cut;
  const dx=Math.sin(s.t*6)*7,padHeight=short?16:24;
  get('tool').innerHTML=rect(l-7+dx,contact-padHeight,width+14,padHeight-3,'pad','rx="4"')+
   `<path d="M${w/2-24+dx},${contact-padHeight/2}h48m-6 -4l6 4 -6 4M${w/2-24+dx},${contact-padHeight/2}l6 -4m-6 4l6 4" class="guide"/>`+
   Array.from({length:11},(_,i)=>{const p=(s.t*.55+i/11)%1,x=l+p*width,y=contact-1+Math.sin(i*3+s.t*4)*1.5;return `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="1.8" class="slurry"/>`;}).join('')+
   `<path d="M${r+3},${contact}q14 10 12 25" class="guide"/>`;
  set('tool',{opacity:s.pad});
  const context=s.stage===0?'已完成曝光與顯影':s.stage===1?'圖案從光阻轉移到絕緣層':s.stage===2?'灰色薄層是導體，抑制銅擴散':s.stage===3?'深銅色與淺銅色，都是銅':s.stage===4?'連續表面銅會連接相鄰線路':s.stage===5?'移除的材料由研磨液帶走':s.stage===6?'保留槽壁、槽底的阻障':s.stage===7?'線路沿畫面前後方向延伸':'整段換新，不倒轉材料變化';
  text('context',context,{x:w/2,y:h-(short?34:41),'text-anchor':'middle','font-size':narrow?14:15});
  const nextX=(1-s.entry)*(-w-30);
  get('next-sample').innerHTML=rect(l,top,width,bottom-top,'dielectric')+rect(l,bottom,width,13,'base')+fields.map(([a,z])=>rect(a,top-22,z-a,22,'resist')).join('')+label(w/2,bottom-15,'絕緣層',narrow?16:18)+label(w/2,top-43,'下一段待加工材料',narrow?15:17);
  set('next-sample',{transform:`translate(${fmt(nextX)} 0)`,opacity:s.t>=42.1?1:0});
 }
 resize();return {resize,render};
}
