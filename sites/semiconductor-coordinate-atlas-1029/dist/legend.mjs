import {relationStyle,relationSwatch,RELATION_FAMILIES} from './relation-style.mjs';

export function createLegend(data,actions) {
  const $=selector=>document.querySelector(selector);
  const allKinds=[...new Set(data.relations.filter(e=>e.status==='confirmed').map(e=>e.kind))].sort((a,b)=>relationStyle(a).order-relationStyle(b).order);
  let edges=[],showAll=false;
  function sync(visibleEdges) {
    edges=visibleEdges;
    if(actions.state().edgeFocus&&!edges.some(e=>e.kind===actions.state().edgeFocus))actions.focus('');
    render();
  }
  function render() {
    const state=actions.state(),counts=new Map();edges.forEach(e=>counts.set(e.kind,(counts.get(e.kind)||0)+1));
    const kinds=showAll?allKinds:allKinds.filter(kind=>counts.has(kind));
    const container=$('#legend-list'),scroll=container.scrollTop;container.replaceChildren();
    $('#legend-count').textContent=showAll?`${allKinds.length} 種`:`${kinds.length} 種 · ${edges.length} 條`;
    $('#legend-empty').hidden=!!kinds.length;
    $('#legend-colors').checked=state.edgeColors;
    $('#legend-focus-note').hidden=!state.edgeFocus;
    $('#legend-focus-name').textContent=state.edgeFocus||'';
    let group=-1;
    for(const kind of kinds){
      const style=relationStyle(kind),count=counts.get(kind)||0;
      if(showAll&&group!==style.group){group=style.group;const title=document.createElement('p');title.className='legend-family';title.textContent=RELATION_FAMILIES[group]?.name||'尚未定義樣式';container.append(title);}
      const button=document.createElement('button');button.className='legend-row';button.dataset.legendKind=kind;button.disabled=!count;
      button.setAttribute('aria-pressed',String(state.edgeFocus===kind));button.setAttribute('aria-label',`${kind}，目前圖中 ${count} 條${count?'，點按聚焦':''}`);
      button.append(relationSwatch(style,state.edgeColors,'legend'));
      const label=document.createElement('span');label.textContent=kind;button.append(label);
      const number=document.createElement('small');number.textContent=count;button.append(number);
      button.onclick=()=>{actions.focus(actions.state().edgeFocus===kind?'':kind);render();[...container.querySelectorAll('button')].find(b=>b.dataset.legendKind===kind)?.focus({preventScroll:true});};
      container.append(button);
    }
    container.scrollTop=scroll;
  }
  $('#legend-all').onchange=e=>{showAll=e.target.checked;render();};
  $('#legend-colors').onchange=e=>actions.colors(e.target.checked);
  $('#legend-reset-focus').onclick=()=>{actions.focus('');render();};
  return {sync,render};
}
