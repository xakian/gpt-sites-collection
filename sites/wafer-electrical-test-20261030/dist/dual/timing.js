// A reversible map of semantic visits. Repeated nodes keep distinct source windows.
export function buildTiming(topic) {
  const nodes=new Map(topic.nodes.map(n=>[n.id,n]));let cursor=0;
  const visits=topic.visits||topic.nodes;
  const counts=new Map();
  const segments=visits.map((v,index)=>{
    const n=nodes.get(v.id);if(!n)throw Error('Unknown visit '+v.id);
    const duration=v.duration??n.duration??3000,source=v.source||n.source;
    const visit=(counts.get(v.id)||0)+1;counts.set(v.id,visit);
    const s={id:v.id,index,visit,start:cursor,end:cursor+duration,
      sourceStart:source[0],sourceEnd:source[1],anchor:v.anchor??n.anchor,
      majorStage:v.majorStage??n.majorStage,context:{attempt:1,cycle:1,completed:0,...v.context}};
    cursor=s.end;return s;
  });
  if(!segments.length)throw Error('Missing visits');
  for(let i=0;i<segments.length;i++){
    const s=segments[i];
    if(!(s.end>s.start&&s.sourceEnd>s.sourceStart))throw Error('Invalid span '+s.id);
    if(Math.abs(s.sourceStart-(i?segments[i-1].sourceEnd:0))>.00001)throw Error('Source gap '+s.id);
    if(!(s.anchor>=s.sourceStart&&s.anchor<s.sourceEnd))throw Error('Anchor outside '+s.id);
  }
  if(Math.abs(segments.at(-1).sourceEnd-topic.sourceDuration)>.00001)throw Error('Incomplete timeline');
  const find=(v,key)=>segments.find(s=>v<s[key])||segments.at(-1);
  function toSource(ms){const v=Math.max(0,Math.min(cursor,ms)),s=find(v,'end');return s.sourceStart+(v-s.start)/(s.end-s.start)*(s.sourceEnd-s.sourceStart);}
  function toFlow(ms){const v=Math.max(0,Math.min(topic.sourceDuration,ms)),s=find(v,'sourceEnd');return s.start+(v-s.sourceStart)/(s.sourceEnd-s.sourceStart)*(s.end-s.start);}
  function anchorFor(id,currentSource){
    const available=segments.filter(s=>s.id===id),current=find(currentSource,'sourceEnd');
    const loop=(topic.loops||[]).find(l=>l.ids.includes(id));
    return (loop&&available.find(s=>s.context[loop.key]===current.context[loop.key])||available[0]).anchor;
  }
  return{segments,duration:cursor,toSource,toFlow,anchorFor,atSource:ms=>find(ms,'sourceEnd'),atFlow:ms=>find(ms,'end')};
}
export function splitPosition(total,duration,playing,hint=null){
  if(!playing&&hint&&Math.abs(total-hint.total)<.000001)return{run:hint.run,local:hint.local};
  const end=!playing&&total>0&&Math.abs(total%duration)<.000001;
  const run=Math.max(0,Math.floor(total/duration)-(end?1:0));return{run,local:end?duration:total-run*duration};
}
export function makePlan(topic,timing){
  const events=timing.segments.map(s=>({...s})),transitions=[];
  for(let i=1;i<events.length;i++){
    const previous=events[i-1],target=events[i];
    const edge=topic.edges.find(e=>e.from===previous.id&&e.to===target.id);
    if(!edge)throw Error(`Missing selected edge ${previous.id} → ${target.id}`);
    transitions.push({...edge,start:target.start,end:Math.min(target.end,target.start+500),context:{...target.context}});
  }
  return{events,transitions,duration:timing.duration,options:topic.defaults||{},
    finalContext:{...events.at(-1).context},loops:topic.loops||[],iterationKeys:topic.iterationKeys||['cycle','sample','case'],
    nodeIds:topic.nodes.map(n=>n.id)};
}
export function frameAt(plan,ms){
  const time=Math.max(0,Math.min(plan.duration,ms)),focus=plan.events.find(e=>time<e.end)||plan.events.at(-1);
  const finished=time>=plan.duration-.001,states={};
  for(const id of plan.nodeIds){
    let candidates=plan.events.filter(e=>e.id===id&&e.start<=time);
    const loop=plan.loops.find(l=>l.ids.includes(id));
    if(loop&&focus.context[loop.key]>0)candidates=candidates.filter(e=>e.context[loop.key]===focus.context[loop.key]);
    const last=candidates.at(-1);states[id]=!last?'pending':finished||last.end<=time?'done':'active';
  }
  return{time,focus,context:{...focus.context},states,active:finished?[]:[focus],
    links:plan.transitions.filter(e=>e.start<=time&&time<=e.end),
    progress:finished?100:Math.min(99,Math.floor(time/plan.duration*100)),finished,
    completed:plan.events.filter(e=>e.end<=time).length,total:plan.events.length};
}
