import {PHASES} from './graph.js';
import {layout,pathD,along} from './overview-layout.js';
import {routeGraph,edgeLabels} from './flow-routing.js';
import {buildEmphasisIndex,edgeEmphasis} from './flow-emphasis.js';
import {browserTextMeasure,fitLabels} from './flow-type.js';
import {esc,visibleEdges} from './flow-view.js';
export {esc,visibleEdges};
const statusNames={pending:'未開始',active:'執行中',done:'已完成',skipped:'本例略過'};
export function diagram(topic,w,h,measure){const l=fitLabels(layout(w,h,topic,measure),topic,measure),edges=routeGraph(l,visibleEdges(topic));return{...l,edges,labels:edgeLabels(l,edges)};}
export function markup(topic,l){const w=l.width,h=l.height;
 let svg='<defs><marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerUnits="userSpaceOnUse" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L8 4L0 8" fill="#94A5AE"/></marker><marker id="active-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerUnits="userSpaceOnUse" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L8 4L0 8" fill="#365F7A"/></marker></defs><text id="flow-context" x="'+w/2+'" y="17" text-anchor="middle" class="flow-meta"></text>';
 for(const p of l.panels)svg+=`<g id="group-${p.index}" class="flow-group"><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="7"/><text x="${p.x+6}" y="${p.y+p.headerFont+4}" font-size="${p.headerFont}" class="group-number">${p.index+1}</text><text x="${p.x+p.headerInset}" y="${p.y+p.headerFont+4}" font-size="${p.headerFont}" class="group-heading">${p.heading.map((s,i)=>`<tspan x="${p.x+p.headerInset}" dy="${i?p.headerLineHeight:0}">${esc(s)}</tspan>`).join('')}</text></g>`;
 svg+='<g id="flow-edges">';
 for(const e of l.edges)svg+=`<g id="edge-group-${e.i}"><title>${esc(`${e.from} → ${e.to} ${e.label}`)}</title><path class="edge-clearance" d="${pathD(e.points)}"/><path id="edge-${e.i}" class="flow-edge ${e.kind}" d="${pathD(e.points)}" marker-end="url(#arrow)"/><circle id="dot-${e.i}" r="3.2" class="flow-dot" hidden/></g>`;
 svg+='</g>';
 for(const label of l.labels)svg+=`<g class="edge-label" id="edge-label-${label.edge}"><rect x="${label.x}" y="${label.y}" width="${label.w}" height="${label.h}" rx="2"/><text x="${label.x+label.w/2}" y="${label.y+9}" text-anchor="middle" font-size="${label.font}">${esc(label.text)}</text></g>`;
 for(const n of topic.nodes){const b=l.boxes.get(n.id),lh=b.lineHeight,y=b.baseline;svg+=`<g id="node-${n.id}" class="flow-node"><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="5"/><text x="${b.x+b.w/2}" y="${y}" text-anchor="middle" font-size="${b.font}" class="flow-title">${b.lines.map((s,i)=>`<tspan x="${b.x+b.w/2}" dy="${i?lh:0}">${esc(s)}</tspan>`).join('')}</text><path id="fill-${n.id}" class="node-progress" d="M${b.x+3} ${b.y+b.h-2}h0"/></g>`;}
 svg+=`<text id="flow-relation" x="${w/2}" y="${h-3}" text-anchor="middle" class="overview-caption">箭頭表順序 · 長虛線回返 · 跨線不相接 · 進度為流程示意</text>`;return svg;
}
export function createScene(shell,topic,onNode){const measure=browserTextMeasure(shell.svg),allEdges=visibleEdges(topic),by=new Map(topic.nodes.map(n=>[n.id,n]));let key='',view,dom,lastPlan,transitionIndex,visited;
 shell.wrap.style.width='100%';shell.wrap.style.height='100%';const overlay=shell.get('station-buttons');overlay.addEventListener('click',e=>{const b=e.target.closest('[data-node]');if(b)onNode(b.dataset.node,b);});
 function draw(state,plan){const rect=shell.host.getBoundingClientRect(),w=Math.max(300,rect.width),h=Math.max(200,rect.height),nextKey=`${Math.round(w)}:${Math.round(h)}`;
  if(key!==nextKey){key=nextKey;view=diagram(topic,w,h,measure);shell.svg.setAttribute('viewBox',`0 0 ${w} ${h}`);shell.svg.setAttribute('aria-label',`${topic.title}，${topic.nodes.length} 個完整步驟同屏，${topic.pages.length} 段分區。`);shell.svg.innerHTML=markup(topic,view);
   overlay.innerHTML=topic.nodes.map(n=>{const b=view.boxes.get(n.id);return `<button class="node-hit" data-node="${n.id}" style="left:${b.x/w*100}%;top:${b.y/h*100}%;width:${b.w/w*100}%;height:${b.h/h*100}%" aria-label="${n.id} ${esc(n.title)}：開啟說明"></button>`;}).join('');
   dom={nodes:new Map(topic.nodes.map(n=>[n.id,{group:shell.get('node-'+n.id),fill:shell.get('fill-'+n.id),button:overlay.querySelector(`[data-node="${n.id}"]`)}])),edges:view.edges.map(e=>({group:shell.get('edge-group-'+e.i),label:shell.get('edge-label-'+e.i),path:shell.get('edge-'+e.i),dot:shell.get('dot-'+e.i)})),groups:view.panels.map(p=>shell.get('group-'+p.index))};shell.root.dataset.visibleSteps=String(view.boxes.size);shell.root.dataset.diagramFont=String(view.font);
  }
  if(lastPlan!==plan){lastPlan=plan;transitionIndex=buildEmphasisIndex(plan);visited=new Set(plan.events.map(e=>e.id));}
  const emphasis=view.edges.map(e=>edgeEmphasis(e,state,transitionIndex));
  const movingSources=new Set(view.edges.filter((e,i)=>emphasis[i].moving).map(e=>e.from));
  const node=by.get(state.focus.id),ctx=state.context;
  const cycle=(topic.loops||[]).map(loop=>` · ${loop.label} ${ctx[loop.key]}／${plan.options[loop.totalOption]} ${loop.unit||'輪'}（完成 ${ctx[loop.completedKey]}）`).join('');
  shell.get('flow-context').textContent=`${(topic.phaseNames||PHASES)[node.phase]}${cycle} · 示意 ${state.progress}%`;
  for(const n of topic.nodes){const id=n.id,b=view.boxes.get(id),d=dom.nodes.get(id);let status=state.states[id]||'pending';if(!visited.has(id))status='skipped';const cls='flow-node '+status+(status==='done'&&movingSources.has(id)?' handoff':'');if(d.group.getAttribute('class')!==cls){d.group.setAttribute('class',cls);d.button.setAttribute('aria-label',`${id} ${n.title}，${statusNames[status]}，開啟說明`);d.button.setAttribute('aria-current',status==='active'?'step':'false');}const ev=state.active.find(e=>e.id===id),p=ev?(state.time-ev.start)/(ev.end-ev.start):status==='done'?1:0;d.fill.setAttribute('d',`M${b.x+3} ${b.y+b.h-2}h${(b.w-6)*p}`);}
  for(let i=0;i<view.panels.length;i++){const active=view.panels[i].ids.some(id=>state.active.some(e=>e.id===id)||movingSources.has(id));dom.groups[i].classList.toggle('active',active);}
  for(const e of view.edges){
   const p=emphasis[e.i],d=dom.edges[e.i],highlight=p.moving||p.feeding;
   if((highlight&&!d.group.classList.contains('emphasized'))||(p.moving&&!d.path.classList.contains('current')))shell.get('flow-edges').appendChild(d.group);
   d.group.classList.toggle('emphasized',highlight);d.label?.classList.toggle('current',highlight);
   d.path.classList.toggle('traversed',p.traversed);d.path.classList.toggle('feeding',p.feeding);d.path.classList.toggle('current',p.moving);
   d.path.setAttribute('marker-end',`url(#${highlight?'active-arrow':'arrow'})`);d.dot.toggleAttribute('hidden',!p.moving);
   if(p.moving){const[x,y]=along(e.points,p.progress);d.dot.setAttribute('cx',x);d.dot.setAttribute('cy',y);}
  }
  const branchLabels=topic.branchLabels||{};
  const choices=allEdges.filter(e=>e.from===state.focus.id&&['condition','loop','feedback'].includes(e.kind));
  let relation=state.finished?'本次完成 · 下一輪為新流程':state.links.filter(e=>by.has(e.from)&&by.has(e.to)&&e.label).map(e=>`${e.from} → ${e.to} ${e.label}`).join('；');
  if(choices.length>1)relation=state.focus.id+'：'+choices.map(e=>{const branch=e.parts.find(p=>branchLabels[p.when]);return (branchLabels[branch?.when]||e.label)+(['loop','feedback'].includes(e.kind)?'↶':'→')+e.to;}).join('｜');
  if(!relation){const loop=(topic.loops||[]).find(l=>l.ids.includes(state.focus.id));if(loop)relation=`${loop.check} 未達 ${plan.options[loop.totalOption]} ${loop.unit||'輪'} ↶ ${loop.start}；達標 → ${loop.exit}`;}
  shell.get('flow-relation').textContent=relation||'箭頭表順序 · 長虛線回返 · 跨線不相接 · 進度為流程示意';
  Object.assign(shell.root.dataset,{step:state.focus.id,cycle:String(ctx.cycle),completedCycles:String(ctx.completed),flowProgress:String(state.progress)});
  return{title:`${state.active.length>1?'並行 · ':''}${state.focus.id} ${node.title}`,index:topic.nodes.indexOf(node),count:topic.nodes.length};
 }
 return{draw,allEdges,invalidate(){key='';}};
}
