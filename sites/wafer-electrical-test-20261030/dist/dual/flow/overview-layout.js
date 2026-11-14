import {sectionHeading} from './flow-headings.js';
import {wrapWords} from './flow-type.js';
const units=s=>Array.from(s).reduce((n,c)=>n+(/[\u0020-\u007e]/.test(c)?.6:1),0);
export function wrapText(s,width,font){const lines=[];let line='';for(const c of s){if(line&&units(line+c)*font>width){lines.push(line);line=c;}else line+=c;}if(line)lines.push(line);return lines;}
export function groupsFor(topic){const seen=new Set();return topic.pages.map((p,index)=>({...p,index,ids:p.ids.filter(id=>{if(seen.has(id))return false;seen.add(id);return true;})}));}
// All geometry is determined by viewport, never by the current step.
export function layout(width,height,topic,measure){
 const dense=(width<600&&height<500)||height<300,groups=groupsFor(topic),by=new Map(topic.nodes.map(n=>[n.id,n])),margin=width<600?6:10,gap=width<600?(dense?6:8):(dense?10:14),top=27,bottom=18;let best;
 for(let font=15;font>=7.5&&!best;font-=.5){const candidates=[];
  for(let columns=1;columns<=groups.length;columns++){const rows=[];
   for(let offset=0;offset<groups.length;offset+=columns){const chunk=groups.slice(offset,offset+columns),pw=(width-2*margin-gap*(chunk.length-1))/chunk.length,panels=[];
    for(const group of chunk){let chosen;
     for(let inner=1;inner<=group.ids.length;inner++){const pad=width<600?4:7,g=width<600?(dense?3:4):8,cw=(pw-pad*2-g*(inner-1))/inner;if(cw<font*3.5+8)continue;
      const header=sectionHeading(group,pw,dense?12:14,measure);if(!header)continue;const {headerFont,heading,hh}=header;
      const compact=width<600||height<300,lines=group.ids.map(id=>compact?wrapWords(by.get(id),cw-10,font,measure):wrapText(`${id} ${by.get(id).title}`,cw-10,font));if(lines.some(l=>!l))continue;
      const glyph=measure?.('國Ag',font),glyphHeight=glyph?glyph.ascent+glyph.descent:font*1.34;const nr=Math.ceil(lines.length/inner),rh=Array.from({length:nr},(_,r)=>Math.max(...lines.slice(r*inner,(r+1)*inner).map(l=>compact?glyphHeight+(l.length-1)*font*1.12+(dense?2:4):l.length*(font+1.5)+5))),ph=hh+rh.reduce((a,b)=>a+b,0)+g*(nr-1)+(dense?4:8);
      const v={group,pw,inner,cw,pad,g,...header,lines,rh,ph};if(!chosen||ph<chosen.ph)chosen=v;
     }if(!chosen)break;panels.push(chosen);
    }if(panels.length!==chunk.length){rows.length=0;break;}rows.push({panels,h:Math.max(...panels.map(p=>p.ph))});
   }if(!rows.length)continue;const total=rows.reduce((s,r)=>s+r.h,0)+gap*(rows.length-1);if(total>height-top-bottom)continue;
   const score=rows.flatMap(r=>r.panels).reduce((s,p)=>s+Math.min(p.cw,180)*p.group.ids.length,0)-rows.length*18;candidates.push({rows,total,font,score,columns});
  }candidates.sort((a,b)=>b.score-a.score);best=candidates[0];
 }if(!best)throw Error('Viewport too small to fit complete flow');
 const extra=(height-top-bottom-best.total)/best.rows.length,panels=[],boxes=new Map();let y=top;
 for(const row of best.rows){let x=margin;const rowH=row.h+extra;for(const p of row.panels){const h=rowH,spare=Math.max(0,h-p.ph)/p.rh.length;panels.push({x,y,w:p.pw,h,index:p.group.index,title:p.group.title,heading:p.heading,headerFont:p.headerFont,headerInset:p.headerInset,headerLineHeight:p.headerLineHeight,hh:p.hh,ids:p.group.ids});let cy=y+p.hh;
  for(let r=0;r<p.rh.length;r++){const ch=p.rh[r]+spare;for(let c=0;c<p.inner;c++){const k=r*p.inner+c,id=p.group.ids[k];if(!id)continue;const col=r%2?p.inner-1-c:c;boxes.set(id,{id,x:x+p.pad+col*(p.cw+p.g),y:cy,w:p.cw,h:ch,group:p.group.index,lines:p.lines[k]});}cy+=ch+p.g;}x+=p.pw+gap;
 }y+=rowH+gap;}return{width,height,font:best.font,columns:best.columns,panels,boxes};
}
export function intersects(a,b,r,pad=.7){const x1=r.x-pad,x2=r.x+r.w+pad,y1=r.y-pad,y2=r.y+r.h+pad;if(Math.abs(a[0]-b[0])<.01)return a[0]>x1&&a[0]<x2&&Math.max(a[1],b[1])>y1&&Math.min(a[1],b[1])<y2;return a[1]>y1&&a[1]<y2&&Math.max(a[0],b[0])>x1&&Math.min(a[0],b[0])<x2;}
export function route(a,b,layout){
 const ports=r=>[[[r.x+r.w/2,r.y],[r.x+r.w/2,r.y-3]],[[r.x+r.w/2,r.y+r.h],[r.x+r.w/2,r.y+r.h+3]],[[r.x,r.y+r.h/2],[r.x-3,r.y+r.h/2]],[[r.x+r.w,r.y+r.h/2],[r.x+r.w+3,r.y+r.h/2]]];
 const obstacles=[...layout.boxes.values()],xs=[3,layout.width-3,...layout.panels.flatMap(p=>[p.x-4,p.x+p.w+4])],ys=[23,layout.height-14,...layout.panels.flatMap(p=>[p.y+p.hh-3,p.y+p.h+4])];let best,cost=Infinity;
 const check=points=>{points=points.filter((p,i)=>!i||p[0]!==points[i-1][0]||p[1]!==points[i-1][1]);let d=points.length*2;for(let i=1;i<points.length;i++){const p=points[i-1],q=points[i];if(obstacles.some(r=>r!==a&&r!==b&&intersects(p,q,r)))return;if(i>1&&i<points.length-1&&(intersects(p,q,a,.1)||intersects(p,q,b,.1)))return;d+=Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1]);}if(d<cost){cost=d;best=points;}};
 for(const[s,so]of ports(a))for(const[t,to]of ports(b)){check([s,so,[to[0],so[1]],to,t]);check([s,so,[so[0],to[1]],to,t]);for(const x of xs)check([s,so,[x,so[1]],[x,to[1]],to,t]);for(const y of ys)check([s,so,[so[0],y],[to[0],y],to,t]);}
 if(!best)throw Error(`No clear connector ${a.id} → ${b.id}`);return best;
}
export const pathD=points=>points.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
export function along(points,ratio){const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));let distance=lengths.reduce((a,b)=>a+b,0)*Math.max(0,Math.min(1,ratio));for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]){const p=points[i],q=points[i+1],u=lengths[i]?distance/lengths[i]:0;return[p[0]+(q[0]-p[0])*u,p[1]+(q[1]-p[1])*u];}distance-=lengths[i];}return points.at(-1);}
