// Fit labels after layout so larger type never moves nodes or reroutes edges.
const approximate=(text,font)=>({width:Array.from(text).reduce((n,c)=>n+(/[\u0020-\u007e]/.test(c)?.6:1),0)*font,ascent:font*.95,descent:font*.25});
export function browserTextMeasure(svg){
 const context=document.createElement('canvas').getContext('2d'),family=getComputedStyle(svg).fontFamily,cache=new Map(),heights=new Map();
 const probe=document.createElementNS('http://www.w3.org/2000/svg','text');probe.textContent='國Ag';probe.setAttribute('font-weight','600');probe.setAttribute('visibility','hidden');probe.setAttribute('aria-hidden','true');
 return(text,font)=>{const key=font+':'+text;if(cache.has(key))return cache.get(key);
  // Reserve the bold active state even when the current node is not active.
  context.font=`600 ${font}px ${family}`;
  if(!heights.has(font)){if(!probe.isConnected)svg.appendChild(probe);probe.setAttribute('font-size',font);const b=probe.getBBox();heights.set(font,{ascent:-b.y,descent:b.y+b.height});}
  const m=context.measureText(text),v={width:m.width,...heights.get(font)};
  cache.set(key,v);return v;
 };
}

export function wrapWords(node,width,font,measure=approximate){
 const words=node.words?.join('')===node.title?node.words:[node.title],prefix=node.id+' ',tokens=[prefix,...words];
 if(measure(prefix+node.title,font).width<=width)return[prefix+node.title];
 if(measure(node.title,font).width<=width)return[prefix,node.title];
 const cache=new Map();
 function solve(start){
  if(start===tokens.length)return{lines:[],cost:0};if(cache.has(start))return cache.get(start);
  let best=null,line='';
  for(let end=start;end<tokens.length;end++){line+=tokens[end];const size=measure(line,font).width;if(size>width)break;
   const tail=solve(end+1);if(!tail)continue;
   const cost=100+10*((width-size)/width)**2+(/[與或被]$/.test(line)?8:0)+(/^[與或被]/.test(line)?3:0)+tail.cost;
   if(!best||cost<best.cost)best={lines:[line,...tail.lines],cost};
  }cache.set(start,best);return best;
 }return solve(0)?.lines;
}
function fitNode(node,box,font,measure){
 const lines=wrapWords(node,box.w-10,font,measure);if(!lines)return;
 const metrics=lines.map(line=>measure(line,font)),ascent=Math.max(...metrics.map(m=>m.ascent)),descent=Math.max(...metrics.map(m=>m.descent)),lineHeight=font*1.12,textHeight=ascent+descent+(lines.length-1)*lineHeight;
 if(textHeight>box.h-2)return;
 return{font,lines,lineHeight,baseline:box.y+(box.h-textHeight)/2+ascent-.25};
}
export function fitLabels(view,topic,measure=approximate){
 const by=new Map(topic.nodes.map(n=>[n.id,n]));
 // A single stable type size per section, measured for its longest labels.
 for(const panel of view.panels){let fitted;
  for(let font=20;font>=8;font-=.5){const candidates=panel.ids.map(id=>fitNode(by.get(id),view.boxes.get(id),font,measure));
   if(candidates.every(Boolean)){fitted=candidates;panel.labelFont=font;break;}
  }
  if(!fitted)throw Error('Section labels do not fit: '+panel.title);
  panel.ids.forEach((id,i)=>Object.assign(view.boxes.get(id),fitted[i]));
 }
 return view;
}
