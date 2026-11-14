import {validateTopic,validateOptions} from './validate.js';
// A small, deterministic directed-graph interpreter. The shared clock owns time.
export const PHASES=['原料準備','製程條件設定','設備執行','薄膜形成','結果檢查與調整'];
export const edge=(from,to,label='',when='always',kind='sequence',effect='')=>({id:`${from}>${to}:${when}`,from,to,label,when,kind,effect});
export function chain(ids){return ids.slice(1).map((id,i)=>edge(ids[i],id));}
export function makeNodes(prefix,rows,phases,pages){return rows.trim().split('\n').map((row,i)=>{const [title,operation,purpose,material,parameters,note='']=row.split('|');const id=prefix+String(i+1).padStart(2,'0');return {id,title,operation,purpose,material,parameters,note,phase:phases[i],page:pages.findIndex(p=>p.ids.includes(id)),duration:1800};});}
export function compile(topic,options={}){
 validateTopic(topic);const o={...topic.defaults,...options};validateOptions(topic,o);
 const eligible=(rule,c,o)=>rule==='always'||Boolean(topic.conditions[rule](Object.freeze({...c}),Object.freeze({...o})));
 const effect=(name,c)=>{if(name)topic.effects[name](c,Object.freeze({...o}));};
 const nodes=new Map([...topic.nodes,...(topic.controls||[])].map(n=>[n.id,n]));
 const outgoing=new Map();for(const e of topic.edges){if(!nodes.has(e.from)||!nodes.has(e.to))throw Error(`Broken edge ${e.id}`);if(!outgoing.has(e.from))outgoing.set(e.from,[]);outgoing.get(e.from).push(e);}
 const c={cycle:1,completed:0,scan:1,completedScans:0,attempt:1,adjusted:false,...topic.initialContext},events=[],transitions=[],joins=new Map(),queue=[{time:0,id:topic.start,arrival:true}],hits=new Map();
 let safety=0;
 function route(id,time){const n=nodes.get(id);const chosen=(outgoing.get(id)||[]).filter(e=>eligible(e.when,c,o));if((outgoing.get(id)||[]).length&&!chosen.length)throw Error('No branch matched at '+id);if(n.kind!=='fork'&&chosen.length>1)throw Error(`Ambiguous branch at ${id}`);for(const e of chosen){effect(e.effect,c);const travel=n.kind?0:300;transitions.push({...e,start:time,end:time+Math.max(travel,120),context:{...c}});queue.push({id:e.to,time:time+travel,arrival:true});}}
 while(queue.length){if(++safety>20000)throw Error('Non-terminating graph');queue.sort((a,b)=>a.time-b.time);const task=queue.shift(),n=nodes.get(task.id);if(!task.arrival){effect(n.effect||'',c);route(n.id,task.time);continue;}
  if(n.kind==='join'){const key=n.id+':'+JSON.stringify((topic.iterationKeys||['attempt','cycle','scan']).map(k=>c[k])),count=(joins.get(key)||0)+1;joins.set(key,count);if(count>n.wait)throw Error('Too many join arrivals at '+n.id);if(count===n.wait)route(n.id,task.time);continue;}
  if(n.kind==='fork'||n.kind==='decision'){route(n.id,task.time);continue;}
  const visit=(hits.get(n.id)||0)+1;hits.set(n.id,visit);const duration=n.duration??1800;events.push({id:n.id,start:task.time,end:task.time+duration,context:{...c},visit});queue.push({id:n.id,time:task.time+duration,arrival:false});
 }
 const end=Math.max(...events.map(e=>e.end));
 if(!events.some(e=>e.id===topic.finish))throw Error('Graph did not reach completion');
 events.sort((a,b)=>a.start-b.start);return {events,transitions,duration:end+2400,options:o,finalContext:{...c},loops:topic.loops||[],iterationKeys:topic.iterationKeys||['attempt','cycle','scan']};
}
export function frameAt(plan,time){
 const t=Math.max(0,Math.min(time,plan.duration));const active=plan.events.filter(e=>e.start<=t&&e.end>t);
 const previous=plan.events.filter(e=>e.start<=t);const focus=active[0]||previous.at(-1)||plan.events[0];
 const context={...focus.context};for(const tr of plan.transitions)if(tr.start<=t&&tr.start>=focus.start)Object.assign(context,tr.context);
 const states={};for(const e of plan.events){if(e.start>t)continue;if(e.context.attempt<context.attempt&&plan.events.some(next=>next.id===e.id&&next.context.attempt===context.attempt))continue;if(plan.loops.some(loop=>e.context[loop.key]<context[loop.key]&&loop.ids.includes(e.id)))continue;states[e.id]=e.end<=t?'done':'active';}
 const finished=t>=plan.duration-2400;const completed=plan.events.filter(e=>e.end<=t).length;const fraction=active.reduce((sum,e)=>sum+(t-e.start)/(e.end-e.start),0);
 const progress=finished?100:Math.min(99,Math.floor(100*(completed+fraction)/plan.events.length));
 const links=plan.transitions.filter(e=>e.start<=t&&e.end>=t);
 return {time:t,active,focus,context,states,links,progress,finished,completed,total:plan.events.length};
}
export function nodeTime(plan,id,context={}){const candidates=plan.events.filter(e=>e.id===id);return (candidates.find(e=>plan.iterationKeys.every(key=>context[key]===undefined||e.context[key]===context[key]))||candidates[0])?.start;}
