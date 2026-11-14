// Presentation follows the compiled route and the existing master clock.
// Incoming routes stay visible for the whole destination step, without lighting a future branch.
const visitKey=(c,keys)=>JSON.stringify(keys.map(key=>c[key]));
export function buildEmphasisIndex(plan){
 const index=new Map();index.iterationKeys=plan.iterationKeys;
 for(const t of plan.transitions)index.set(`${visitKey(t.context,index.iterationKeys)}:${t.id}`,t);
 return index;
}
export function edgeEmphasis(edge,state,index){
 const key=visitKey(state.context,index.iterationKeys),parts=edge.parts.map(p=>index.get(`${key}:${p.id}`));
 if(parts.some(p=>!p))return{moving:false,feeding:false,traversed:false,progress:0};
 let current=-1;
 for(let i=0;i<parts.length;i++)if(parts[i].start<=state.time&&state.time<parts[i].end)current=i;
 const last=parts.at(-1),traversed=last.start<=state.time;
 const feeding=traversed&&state.active.some(n=>n.id===edge.to);
 const t=parts[current];
 return{moving:current>=0,feeding,traversed,progress:t?(current+(state.time-t.start)/(t.end-t.start))/parts.length:0};
}
