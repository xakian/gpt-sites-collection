const widthOf=(s,font)=>Array.from(s).reduce((n,c)=>n+(/[\u0020-\u007e]/.test(c)?.6:1),0)*font;
export function sectionHeading(page,width,font,measure=(s,f)=>({width:widthOf(s,f)})){
 const phrases=page.phrases||[page.title],inset=font*.6+8,available=width-inset-4;
 const cache=new Map();
 function split(start){
  if(start===phrases.length)return{lines:[],cost:0};if(cache.has(start))return cache.get(start);
  let best,line='';
  for(let end=start;end<phrases.length;end++){
   line+=phrases[end];const size=measure(line,font).width;if(size>available)break;
   const tail=split(end+1);if(!tail)continue;
   const cost=100+10*((available-size)/available)**2+tail.cost;
   if(!best||cost<best.cost)best={lines:[line,...tail.lines],cost};
  }cache.set(start,best);return best;
 }
 const heading=split(0)?.lines;if(!heading)return;
 return{heading,headerFont:font,headerInset:inset,headerLineHeight:font*1.2,hh:heading.length*font*1.2+6};
}
