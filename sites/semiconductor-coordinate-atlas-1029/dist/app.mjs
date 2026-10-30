import {AXES,STATES,validate,metrics,attribute,locate,maximum,matches,partition} from './core.mjs';
import {createNavigator} from './navigator.mjs';
import {relationStyle,relationColor,sortRelations,relationCurve,appendArrow,relationSwatch} from './relation-style.mjs';
import {createLegend} from './legend.mjs';
import {ExplorationHistory,snapshotValidator} from './exploration-history.mjs';
import {DatasetStore,dataSignature} from './data-transfer.mjs';
import {createDataManager} from './data-manager.mjs';
import {coordinatePoints,overviewLayout,graphRegions,nearestPoint} from './map-layout.mjs';
import {createCoordinateMotion} from './coordinate-motion.mjs';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORAGE='semiconductor-atlas-view-v3';let data,builtinData,dataStore,dataManager,historyKey,counts,byId,srcById,points=[],part,layout;let overviewMap;let frame=0,navigatorView,legendView,history,searchTimer,rememberTimer,searchPending=false;
const coordinateMotion=createCoordinateMotion();let lastDrawView='',lastDrawAxes='',historyReady=false;
const HISTORY_STORAGE='semiconductor-atlas-history-v1:'+location.pathname;
const state={x:'P',y:'M',view:'coordinates',selected:null,controls:false,detail:false,q:'',type:'',relationType:'',zoom:1,panX:0,panY:0,showNames:true,showEdges:true,edge:false,navigator:false,legend:false,edgeColors:true,edgeFocus:''};
try{const current=localStorage.getItem(STORAGE),previous=localStorage.getItem('semiconductor-atlas-view-v2'),s=JSON.parse(current||previous||localStorage.getItem('semiconductor-atlas-view-v1')||'null');if(s){if(AXES[s.x]&&AXES[s.y]&&s.x!==s.y){state.x=s.x;state.y=s.y;}if(['coordinates','relations'].includes(s.view))state.view=s.view;state.selected=s.selected;if(current||previous){state.controls=!!s.controls;state.detail=!!s.detail;if(current){state.showNames=s.showNames!==false;state.showEdges=s.showEdges!==false;}state.navigator=!!s.navigator;state.legend=!!s.legend;state.edgeColors=s.edgeColors!==false;}}}catch{}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify({x:state.x,y:state.y,view:state.view,selected:state.selected,controls:state.controls,detail:state.detail,showNames:state.showNames,showEdges:state.showEdges,navigator:state.navigator,legend:state.legend,edgeColors:state.edgeColors}));}catch{}rememberSoon();}
function reset(){state.zoom=1;state.panX=0;state.panY=0;}
function applyEdgeFocus(kind){state.edgeFocus=kind;$$('#plot .edge-group').forEach(e=>{e.classList.toggle('edge-muted',!!kind&&e.dataset.kind!==kind);e.classList.toggle('edge-focused',!!kind&&e.dataset.kind===kind);});}
function fitPanels(){if(state.detail||state.edge)state.legend=false;if(innerWidth<900){if(state.detail||state.edge){state.controls=false;state.navigator=false;}else if(state.controls||state.navigator)state.legend=false;}const navOpen=state.view==='relations'&&state.navigator,legendOpen=state.view==='relations'&&state.legend;$('#controls').hidden=!state.controls;$('#detail').hidden=!state.detail;$('#edge-info').hidden=!state.edge;$('#navigator').hidden=!navOpen;$('#legend-panel').hidden=!legendOpen;$('#nav-toggle').hidden=state.view!=='relations';$('#legend-toggle').hidden=state.view!=='relations';$('#nav-toggle').setAttribute('aria-expanded',navOpen);$('#legend-toggle').setAttribute('aria-expanded',legendOpen);$('#location-strip').hidden=state.view!=='relations'||!state.selected||navOpen;$('#menu').setAttribute('aria-expanded',state.controls);$('#tooltip').hidden=true;if(!legendOpen&&state.edgeFocus)applyEdgeFocus('');}
function openLegend(){state.legend=true;state.detail=false;state.edge=false;if(innerWidth<900){state.controls=false;state.navigator=false;}fitPanels();legendView.render();save();}

function openNavigator(){state.navigator=true;state.controls=false;if(innerWidth<900){state.detail=false;state.edge=false;}fitPanels();navigatorView.reveal();save();}

function selectTopic(id,{detail=true,historyCaptured=false}={}){if(!byId.has(id))return;if(!historyCaptured)beforeNavigation();state.selected=id;state.detail=detail;state.edge=false;if(!detail)state.controls=false;if(innerWidth<900){state.controls=false;if(detail)state.navigator=false;}render();$('#detail').scrollTop=0;afterNavigation();save();}
function captureExploration(){
 const svg=$('#plot');return {view:state.view,x:state.x,y:state.y,selected:state.selected,q:state.q,type:state.type,relationType:state.relationType,zoom:state.zoom,panX:state.panX,panY:state.panY,width:Math.max(1,svg.clientWidth),height:Math.max(1,svg.clientHeight),route:navigatorView.getPath(),panels:Object.fromEntries(['controls','detail','navigator','legend'].map(k=>[k,state[k]])),controlSections:$$('#controls details[open][id]').map(e=>e.id),detailSections:$$('#detail-content details[open][data-section]').map(e=>e.dataset.section)};
}
function persistHistory(){if(!history)return;try{sessionStorage.setItem(historyKey,history.serialize());}catch{$('#history-storage-note').textContent='此瀏覽器無法保存分頁紀錄；仍可在目前頁面使用返回。';}}
function remember(){clearTimeout(rememberTimer);if(!history||searchPending)return;history.refresh(captureExploration());persistHistory();}
function rememberSoon(){clearTimeout(rememberTimer);rememberTimer=setTimeout(remember,180);}
function beforeNavigation(){flushSearch();remember();}
function afterNavigation(){if(!history)return;history.push(captureExploration());persistHistory();renderHistory();}
function flushSearch(){if(!searchPending)return;clearTimeout(searchTimer);searchPending=false;afterNavigation();}
function visitLabel(s){return `${s.view==='relations'?'關係':'座標'} · ${byId.get(s.selected)?.name||'全覽'}`;}
function renderHistory(){
 const {entries,index}=history;
 for(const [selector,step,label]of [['#history-back',-1,'返回上一位置'],['#history-forward',1,'前往下一位置']]){const b=$(selector),s=entries[index+step];b.disabled=!s;b.title=s?`${label}：${visitLabel(s)}`:label;b.setAttribute('aria-label',b.title);}
 $('#history-count').textContent=`${index+1} / ${entries.length}`;$('#history-clear').disabled=entries.length===1;
 $('#history-list').innerHTML=entries.map((s,i)=>`<li><button data-visit="${i}" ${i===index?'aria-current="step"':''}><span class="history-number">${i+1}</span><span>${esc(visitLabel(s))}<small>${esc(s.view==='coordinates'?`X ${AXES[s.x].short} / Y ${AXES[s.y].short}`:s.route.map(id=>byId.get(id)?.name).join(' › '))}${s.q?' · 搜尋 '+esc(s.q):''}${s.type?' · '+esc(s.type):''}${s.relationType?' · '+esc(s.relationType):''}</small></span>${i===index?'<span class="history-current">目前</span>':''}</button></li>`).join('');
 $$('#history-list [data-visit]').forEach(b=>b.onclick=()=>restoreVisit(Number(b.dataset.visit)));
}
function applyVisit(s){
 const svg=$('#plot');for(const k of ['view','x','y','selected','q','type','relationType'])state[k]=s[k];
 Object.assign(state,s.panels,{zoom:1,panX:0,panY:0,edge:false,edgeFocus:''});
 $('#search').value=state.q;$('#type').value=state.type;$('#relation-type').value=state.relationType;
 $$('#controls details[id]').forEach(e=>e.open=s.controlSections.includes(e.id));
 navigatorView.setPath(s.route);render();
 $$('#detail-content details[data-section]').forEach(e=>e.open=s.detailSections.includes(e.dataset.section));
}
function restoreVisit(index){
 flushSearch();remember();const fromList=!!document.activeElement?.closest('#history-list'),s=history.go(index);if(!s)return;applyVisit(s);history.refresh(captureExploration());persistHistory();renderHistory();save();
 if(fromList){const target=!$('#controls').hidden?$('#history-section>summary'):!$('#history-back').disabled?$('#history-back'):$('#history-forward');target.focus({preventScroll:true});}
 $('#history-announcement').textContent=`已到第 ${history.index+1} 個位置：${visitLabel(s)}`;
}
function travel(step){flushSearch();restoreVisit(history.index+step);}
function initializeHistory(){
 history=new ExplorationHistory(captureExploration(),{validate:snapshotValidator(data)});
 try{if(history.load(sessionStorage.getItem(historyKey)))applyVisit(history.current);}catch{}
 history.refresh(captureExploration());renderHistory();persistHistory();historyReady=true;
}
function clearFilters(){beforeNavigation();state.q='';state.type='';state.relationType='';$('#search').value='';$('#type').value='';$('#relation-type').value='';render();afterNavigation();}
function indexData(){overviewMap=overviewLayout(data);counts=metrics(data);byId=new Map(data.topics.map(t=>[t.id,t]));srcById=new Map(data.sources.map(s=>[s.id,s]));historyKey=HISTORY_STORAGE+(dataStore.custom?':'+dataSignature(data):'');}
function fillDataOptions(){
 $('#type').innerHTML='<option value="">全部類型</option>'+[...new Set(data.topics.flatMap(t=>t.types))].map(t=>`<option>${esc(t)}</option>`).join('');
 $('#relation-type').innerHTML='<option value="">全部直接關係</option>'+[...new Set(data.relations.map(e=>e.kind))].map(k=>`<option>${esc(k)}</option>`).join('');
 $('#type').value=state.type;$('#relation-type').value=state.relationType;
 $('#relation-index').textContent=[...new Set(data.relations.map(e=>e.kind))].join(' · ');
}
function connectDataViews(){
 navigatorView=createNavigator(data,{state:()=>state,beforeNavigate:beforeNavigation,navigate:id=>selectTopic(id,{detail:false,historyCaptured:true}),afterPath:afterNavigation,detail:()=>selectTopic(state.selected),clear:clearFilters});
 $('#legend-all').checked=false;
 legendView=createLegend(data,{state:()=>state,focus:applyEdgeFocus,colors:colored=>{state.edgeColors=colored;draw();save();}});
}
function applyDataset(next){
 flushSearch();remember();const route=navigatorView.getPath();data=next;indexData();
 if(!byId.has(state.selected))state.selected=state.view==='relations'?(byId.has('K13')?'K13':data.topics[0]?.id||null):null;
 if(!data.topics.some(t=>t.types.includes(state.type)))state.type='';
 if(!data.relations.some(e=>e.kind===state.relationType))state.relationType='';
 Object.assign(state,{edge:false,edgeFocus:'',detail:false,navigator:false,legend:false});
 fillDataOptions();connectDataViews();navigatorView.setPath(route.every(id=>byId.has(id))?route:[]);render();
 history=new ExplorationHistory(captureExploration(),{validate:snapshotValidator(data)});persistHistory();renderHistory();save();
}
function statusText(t){const p=locate(t,state.x,state.y,counts);return p.located?`(${p.x.value}, ${p.y.value})`:'○ 未定位';}
function setup(){
 for(const [k,a] of Object.entries(AXES))for(const sel of ['#xaxis','#yaxis'])$(sel).insertAdjacentHTML('beforeend',`<option value="${k}">${a.short}</option>`);
 $('#axis-guide').innerHTML=Object.values(AXES).map(a=>`<p><b>${a.name}</b><br>${a.description}</p>`).join('');
 fillDataOptions();
 $('#menu').onclick=()=>{state.controls=!state.controls;if(state.controls)state.navigator=false;if(innerWidth<900&&state.controls){state.detail=false;state.edge=false;}fitPanels();save();};
 $$('[data-close]').forEach(b=>b.onclick=()=>{state[b.dataset.close]=false;fitPanels();save();if(b.dataset.close==='controls')$('#menu').focus();if(b.dataset.close==='navigator')$('#nav-toggle').focus();if(b.dataset.close==='legend')$('#legend-toggle').focus();});
 $$('[data-view]').forEach(b=>b.onclick=()=>{beforeNavigation();state.view=b.dataset.view;state.edge=false;if(state.view==='relations'){if(!state.selected)state.selected=byId.has('K13')?'K13':data.topics[0]?.id||null;if(state.navigator)state.controls=false;}reset();render();afterNavigation();save();});
 $('#preset').onchange=e=>{beforeNavigation();[state.x,state.y]=e.target.value.split('');reset();render();afterNavigation();save();};
 for(const [sel,key,other] of [['#xaxis','x','y'],['#yaxis','y','x']])$(sel).onchange=e=>{if(e.target.value===state[other])return;beforeNavigation();state[key]=e.target.value;reset();render();afterNavigation();save();};
 $('#swap').onclick=()=>{beforeNavigation();[state.x,state.y]=[state.y,state.x];reset();render();afterNavigation();save();};
 $('#axis-reset').onclick=()=>{if(state.x==='P'&&state.y==='M')return;beforeNavigation();state.x='P';state.y='M';reset();render();afterNavigation();save();};
 $('#search').oninput=e=>{if(!searchPending)beforeNavigation();searchPending=true;clearTimeout(searchTimer);state.q=e.target.value;if(state.q)$('#list-section').open=true;render();searchTimer=setTimeout(flushSearch,450);};$('#type').onchange=e=>{beforeNavigation();state.type=e.target.value;render();afterNavigation();};
 const clear=clearFilters;$('#clear').onclick=clear;$('#clear-footer').onclick=clear;$('#filter-chip').onclick=clear;
 connectDataViews();
 $('#nav-toggle').onclick=()=>{if(state.navigator){state.navigator=false;fitPanels();save();}else openNavigator();};$('#location-button').onclick=openNavigator;
 $('#legend-toggle').onclick=()=>{if(state.legend){state.legend=false;fitPanels();save();}else openLegend();};
 $('#relation-type').onchange=e=>{beforeNavigation();state.relationType=e.target.value;state.edge=false;render();afterNavigation();};
 $('#show-names').checked=state.showNames;$('#show-edge-labels').checked=state.showEdges;
 $('#show-names').onchange=e=>{state.showNames=e.target.checked;$('#outer-points').classList.toggle('show-names',state.showNames);draw();save();};$('#show-edge-labels').onchange=e=>{state.showEdges=e.target.checked;draw();save();};
 $('#edge-close').onclick=()=>{state.edge=false;fitPanels();};
 $('#topic-info').onclick=()=>{if(state.selected)selectTopic(state.selected);};
 $('#export').onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='semiconductor-atlas-data.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),500);};
 document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;for(const name of ['legend','edge','detail','controls','navigator']){if(!state[name])continue;state[name]=false;fitPanels();save();if(name==='legend')$('#legend-toggle').focus();if(name==='controls')$('#menu').focus();if(name==='navigator')$('#nav-toggle').focus();break;}});
 new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{fitPanels();draw();});}).observe($('#stage'));
 $('#history-back').onclick=()=>travel(-1);$('#history-forward').onclick=()=>travel(1);
 $('#history-clear').onclick=()=>{flushSearch();history.clear(captureExploration());persistHistory();renderHistory();$('#history-section>summary').focus();};
 addEventListener('pagehide',()=>{flushSearch();remember();});
 addGestures();
}
function render(){
 const previousPositions=captureCoordinatePositions();
 $('#axis-dock').hidden=state.view!=='coordinates';
 $('#dataset-topic-count').textContent=data.topics.length;$('#dataset-date').textContent=data.updatedAt;
 fitPanels();part=partition(data,state.x,state.y,counts,state.q,state.type);part.outside.sort((a,b)=>a.id.localeCompare(b.id));
 $('#xaxis').value=state.x;$('#yaxis').value=state.y;
 $$('#xaxis option').forEach(o=>o.disabled=o.value===state.y);$$('#yaxis option').forEach(o=>o.disabled=o.value===state.x);
 const preset=state.x+state.y;$('#preset').value=['PM','SR','MR'].includes(preset)?preset:'custom';
 $$('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===state.view);b.setAttribute('aria-pressed',b.dataset.view===state.view);});
 $('#view-caption').textContent=state.view==='coordinates'?({PM:'內容方向',SR:'收錄結構',MR:'實作與連結'}[preset]||'自訂座標'):'直接關係';
 $('#chart-hint').textContent=state.view==='coordinates'?'每個小點是一個主題；同座標以固定小幅錯位分開，實際數值見詳情':'左圖顯示直接關係；右圖固定顯示全部主題與簡化連線';
 $('#relationship-section').hidden=state.view!=='relations';$('#plot').setAttribute('aria-label',state.view==='relations'?'主題直接關係圖':'主題座標平面');$('#outer').hidden=state.view!=='coordinates';
 $('#counts').textContent=`符合條件 ${part.central.length+part.outside.length} ／ 全部 ${data.topics.length}；其他主題淡化保留位置`;
 $('#topic-info').disabled=!state.selected;
 $('#counts').title=state.view==='relations'?'此處維持所選座標的分類計數；關係圖只顯示局部鄰域。':'';
 $('#clear-footer').hidden=!part.hidden.length;$('#footer-note').textContent=state.view==='relations'?'局部一階關係 · 依來源與收錄決策':AXES[state.x].kind==='count'&&AXES[state.y].kind==='count'?'完整資料計數 · 不隨篩選改變':'編輯評分 · 可修訂';
 $('#outer-count').textContent=partition(data,state.x,state.y,counts).outside.length;$('#outer-points').classList.toggle('show-names',state.showNames);
 const allTopics=partition(data,state.x,state.y,counts),allOutside=allTopics.outside.sort((a,b)=>a.id.localeCompare(b.id));
 $('#axis-counts').textContent=`${allTopics.central.length} 個完整座標 · ${allOutside.length} 個未定位`;
 $('#axis-reset').disabled=state.x==='P'&&state.y==='M';
 const filtered=!!(part.hidden.length||state.relationType);$('#canvas-area').classList.toggle('has-filter',filtered);$('#filter-chip').hidden=!filtered;$('#filter-dot').hidden=!filtered;$('#filter-chip-label').textContent=part.hidden.length?`${part.hidden.length} 個已淡化`:'關係已篩選';
 $('#outer-points').innerHTML=allOutside.map(t=>`<button data-topic="${t.id}" class="${state.selected===t.id?'selected':''} ${matches(t,state.q,state.type)?'':'muted-point'}" aria-label="${esc(t.name)} · 未定位" title="${esc(t.name)} · ${esc(locate(t,state.x,state.y,counts).reasons.join('；'))}"><span class="outer-name">${esc(t.name)}</span></button>`).join('');
 const visible=data.topics.filter(t=>matches(t,state.q,state.type));$('#results-meta').textContent=`${visible.length} 個結果 · ${part.hidden.length} 個淡化`;$('#result-count').textContent=visible.length;
 $('#results').innerHTML=visible.length?visible.map(t=>`<button class="result ${state.selected===t.id?'selected':''}" data-topic="${t.id}" aria-pressed="${state.selected===t.id}"><span>${esc(t.name)}<small>${esc(t.english)}</small></span><span class="status-dot">${statusText(t)}</span></button>`).join(''):'<p class="muted">沒有符合的主題。試試中文、英文或清除篩選。</p>';
 if(state.detail&&state.selected){const oldId=$('#detail-content').dataset.renderedTopic,opened=oldId===state.selected?$$('#detail-content details[open][data-section]').map(e=>e.dataset.section):[];renderDetail(byId.get(state.selected));$('#detail-content').dataset.renderedTopic=state.selected;opened.forEach(key=>{const e=$(`#detail-content details[data-section="${key}"]`);if(e)e.open=true;});}
 navigatorView.sync();bindTopics();draw(previousPositions);
}
function bindTopics(){ $$('[data-topic]').forEach(b=>b.onclick=()=>selectTopic(b.dataset.topic));}
function sourceLinks(ids){return ids.map(id=>{const s=srcById.get(id);return `<div class="source"><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><small>${esc(s.supports)}</small><small>查核 ${esc(s.checkedAt)}</small></div>`;}).join('');}
function renderDetail(t){
 const p=locate(t,state.x,state.y,counts),edges=data.relations.filter(e=>e.status==='confirmed'&&(e.from===t.id||e.to===t.id));
 $('#detail-content').innerHTML=`<p class="topic-type">${t.types.map(esc).join(' / ')}</p><h1 class="topic-title">${esc(t.name)}</h1><p class="summary-text">${esc(t.summary)}</p><div class="question"><span class="eyebrow">本單元回答</span>${esc(t.question)}</div><details class="section" data-section="scores"><summary>座標與評分依據</summary><div class="status-box">${p.located?`● 已定位　X = ${p.x.value}　Y = ${p.y.value}`:`○ 目前選軸下未定位<br>${p.reasons.map(esc).join('<br>')}`}${!matches(t,state.q,state.type)?'<br>此主題不符合目前搜尋或類型條件。':''}</div><div class="score-grid">${Object.keys(AXES).map(k=>{const a=attribute(t,k,counts);return `<div class="score-card"><span>${AXES[k].short}${[state.x,state.y].includes(k)?` · ${state.x===k?'X':'Y'}`:''}</span><strong>${a.status==='known'?a.value:STATES[a.status]}</strong><p>${esc(a.reason)}</p><small>${a.method}${a.updatedAt?' · '+a.updatedAt:''}</small></div>`;}).join('')}</div></details><details class="section" data-section="scope"><summary>範圍與英文術語</summary><p>${esc(t.scope)}</p><p><b>${esc(t.english)}</b>${t.aliases?.length?'<br>'+t.aliases.map(esc).join(' / '):''}</p></details><details class="section" data-section="relations"><summary>直接相關主題 <small>${counts[t.id].R}</small></summary>${edges.length?edges.map(e=>{const out=e.from===t.id,other=byId.get(out?e.to:e.from);return `<div class="edge">${out?`本主題 ─ ${esc(e.kind)} → <button data-topic="${other.id}">${esc(other.name)}</button>`:`<button data-topic="${other.id}">${esc(other.name)}</button> ─ ${esc(e.kind)} → 本主題`}<details><summary>條件與依據${e.basis==='editorial'?' · 編輯收錄決策':''}</summary><p>${esc(e.condition)}</p>${sourceLinks(e.sources)}</details></div>`;}).join(''):'<p class="muted">目前沒有已確認的直接關係。</p>'}</details><details class="section" data-section="sources"><summary>內容來源 · ${t.sources.length}</summary><p>下列來源支持內容；P、M 為本單元的編輯評分，可修訂。</p>${sourceLinks(t.sources)}</details>`;
}
function el(name,attrs={},text){const e=document.createElementNS('http://www.w3.org/2000/svg',name);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;return e;}
function captureCoordinatePositions(){
 const positions=new Map(),stage=$('#stage').getBoundingClientRect();
 for(const node of $$('#plot [data-area="coordinates"],#plot [data-area="outside"]')){const r=node.querySelector('.dot').getBoundingClientRect();positions.set(node.dataset.nodeId,{x:r.x+r.width/2-stage.x,y:r.y+r.height/2-stage.y});}
 if(!$('#outer').hidden)for(const button of $$('#outer-points button')){if(positions.has(button.dataset.topic))continue;const r=button.getBoundingClientRect();positions.set(button.dataset.topic,{x:r.x+r.width/2-stage.x,y:r.y+10.5-stage.y});}
 return positions;
}
function animateCoordinates(from){
 const svg=$('#plot'),outer=$('#outer-points'),stage=$('#stage').getBoundingClientRect(),ghostLayer=el('g',{'data-map':'transit'});svg.append(ghostLayer);
 // Temporary SVG dots bridge the central plane and the HTML unlocated strip.
 for(const button of $$('#outer-points button')){const r=button.getBoundingClientRect(),p={id:button.dataset.topic,x:r.x+r.width/2-stage.x,y:r.y+10.5-stage.y};point(ghostLayer,p,'目前選軸下未定位',{area:'outside',muted:!matches(byId.get(p.id),state.q,state.type)});}
 const targets=points.map(p=>({...p})),entries=new Map(points.map(p=>[p.id,p])),nodes=new Map($$('#plot [data-node-id]').map(n=>[n.dataset.nodeId,n])),labels=new Map($$('#plot [data-label-for]').map(n=>[n.dataset.labelFor,n]));
 outer.style.visibility='hidden';svg.setAttribute('aria-busy','true');
 coordinateMotion.start(from,targets,positions=>{
  positions.forEach((p,i)=>{const target=targets[i],node=nodes.get(p.id),label=labels.get(p.id);node?.setAttribute('transform',`translate(${p.x},${p.y})`);label?.setAttribute('transform',`translate(${p.x-target.x},${p.y-target.y})`);Object.assign(entries.get(p.id),{x:p.x,y:p.y});});
 },()=>{ghostLayer.remove();points=points.filter(p=>p.area!=='outside');outer.style.visibility='';svg.setAttribute('aria-busy','false');});
}
function draw(previousPositions){
 if(!data||!part)return;const svg=$('#plot'),w=svg.clientWidth,h=svg.clientHeight;if(!w||!h)return;
 const animate=historyReady&&lastDrawView==='coordinates'&&state.view==='coordinates'&&(lastDrawAxes!==state.x+state.y||coordinateMotion.active)&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const from=previousPositions||captureCoordinatePositions();coordinateMotion.stop();$('#outer-points').style.visibility='';svg.setAttribute('aria-busy','false');
 lastDrawView=state.view;lastDrawAxes=state.x+state.y;
 svg.replaceChildren();svg.setAttribute('viewBox',`0 0 ${w} ${h}`);points=[];$('#tooltip').hidden=true;$('#empty').hidden=true;
 if(state.view==='relations'){drawGraph(svg,w,h);return;}
 const dock=$('#axis-dock').getBoundingClientRect(),stage=$('#stage').getBoundingClientRect();
 const all=partition(data,state.x,state.y,counts),left=w<500?42:76,right=w<500?28:62,top=Math.max(108,dock.bottom-stage.top+40);
 const outerRows=Math.ceil(all.outside.length/Math.max(1,Math.floor((w-28)/88))),bottom=all.outside.length?Math.min(h*.28,62+outerRows*58):64;
 const box={x:left,y:top,w:Math.max(70,w-left-right),h:Math.max(60,h-top-bottom)},maxX=maximum(state.x,counts),maxY=maximum(state.y,counts);
 layout={left:box.x,top:box.y,pw:box.w,ph:box.h,w,h};
 const sx=v=>box.x+v/maxX*box.w,sy=v=>box.y+box.h-v/maxY*box.h;
 const bg=el('g',{class:'coordinate-grid'});svg.append(bg);
 for(const [axis,max,coord]of [['x',maxX,sx],['y',maxY,sy]]){const step=Math.max(1,Math.ceil(max/(axis==='x'&&w<500?6:9)));for(let v=0;v<=max;v++){if(v%step!==0&&v!==max)continue;const z=coord(v);if(axis==='x'){bg.append(el('line',{x1:z,y1:box.y,x2:z,y2:box.y+box.h,class:v===0?'axis':'grid'}));bg.append(el('text',{x:z,y:box.y+box.h+20,'text-anchor':'middle'},v));}else{bg.append(el('line',{x1:box.x,y1:z,x2:box.x+box.w,y2:z,class:v===0?'axis':'grid'}));bg.append(el('text',{x:box.x-14,y:z+4,'text-anchor':'end'},v));}}}
 axisTitle(svg,{x:box.x,y:box.y-24},'y');axisTitle(svg,{x:box.x+box.w,y:box.y+box.h+43,'text-anchor':'end'},'x');
 const layer=el('g',{'data-map':'coordinates'});svg.append(layer);
 const coords=coordinatePoints(all.central,state.x,state.y,counts,box);
 let closest=Infinity;for(let i=0;i<coords.length;i++)for(let j=i+1;j<coords.length;j++)closest=Math.min(closest,Math.hypot(coords[i].x-coords[j].x,coords[i].y-coords[j].y));
 const radius=Math.max(1.2,Math.min(2.6,(closest-.8)/2));coords.forEach(p=>p.radius=radius);
 for(const p of coords)point(layer,p,`座標 ${p.valueX}, ${p.valueY}`,{area:'coordinates',muted:!matches(byId.get(p.id),state.q,state.type)});
 drawNames(layer,coords,{x:box.x-15,y:box.y-16,w:box.w+32,h:box.h+28});
 if(animate&&from.size)animateCoordinates(from);
 if(!all.central.length){$('#empty').textContent=all.outside.length?'這組軸目前沒有可定位主題':'目前沒有主題';$('#empty').hidden=false;}
}
function activatePoint(p){
 // The map stays unobstructed while traversing; clicking its current topic opens details.
 selectTopic(p.id,{detail:p.area==='coordinates'||p.area==='outside'||p.id===state.selected});
}
function point(layer,p,label,{area,muted=false,neighbor=false}={}){
 const t=byId.get(p.id),selected=p.id===state.selected;
 const g=el('g',{transform:`translate(${p.x},${p.y})`,class:`map-point ${selected?'selected-point':''} ${muted?'muted-point':''} ${neighbor?'neighbor-point':''}`,role:'button',tabindex:'0','data-node-id':t.id,'data-area':area,'aria-label':`${t.name} · ${label}${selected?' · 目前主題':''}`,'aria-pressed':selected});
 g.append(el('circle',{r:11,class:'hit'}));if(selected)g.append(el('circle',{r:9,class:'selection-ring',fill:'none',stroke:'#222','stroke-width':1.2}));
 if(neighbor&&!selected)g.append(el('circle',{r:6,class:'neighbor-ring',fill:'#e0e3e5'}));
 g.append(el('circle',{r:selected?3.5:(p.radius||2.6),class:'dot',fill:area==='outside'?'#fafafa':'#303030',stroke:area==='outside'?'#555':'none','stroke-width':1}));
 if(area==='outside'&&(state.showNames||selected))g.append(el('text',{y:19,'text-anchor':'middle',class:'node-name'},t.name));
 const entry={...p,area};points.push(entry);
 g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activatePoint(entry);}};
 g.onpointerenter=e=>{if(e.pointerType!=='touch')showTip(`${esc(t.name)}<small>${esc(label)}</small>`,entry.x,entry.y);};g.onpointerleave=()=>$('#tooltip').hidden=true;
 layer.append(g);
}
function drawNames(layer,nodes,box,{overview=false}={}){
 const selected=state.selected,labels=el('g',{class:'map-labels','pointer-events':'none'});layer.append(labels);
 // Labels are placed separately from data dots and may use subtle leader lines.
 const occupied=nodes.map(p=>({x:p.x-6,y:p.y-6,w:12,h:12}));
 const wanted=nodes.filter(p=>state.showNames||p.id===selected).sort((a,b)=>(b.id===selected)-(a.id===selected)||a.id.localeCompare(b.id));
 for(const p of wanted){
  const labelGroup=el('g',{'data-label-for':p.id});labels.append(labelGroup);
  const t=byId.get(p.id),isSelected=p.id===selected,muted=!matches(t,state.q,state.type),text=el('text',{class:`node-name ${isSelected?'current-name':''}`,y:0},t.name);labelGroup.append(text);
  while(text.textContent.length>2&&text.getBBox().width>box.w-8)text.textContent=text.textContent.replace(/…$/,'').slice(0,-1)+'…';
  const measure=text.getBBox(),width=measure.width,height=measure.height||12;
  const candidates=[];for(const d of [10,22,36,52,72,96])for(const dx of [8,-width-8,-width/2])for(const side of [-1,1])candidates.push({x:p.x+dx,y:p.y+side*d-(side<0?height:0),w:width,h:height+3});
  const fits=r=>r.x>=box.x&&r.y>=box.y&&r.x+r.w<=box.x+box.w&&r.y+r.h<=box.y+box.h&&!occupied.some(o=>r.x<o.x+o.w+3&&r.x+r.w+3>o.x&&r.y<o.y+o.h+2&&r.y+r.h+2>o.y);
  let target=candidates.find(fits);
  if(!target&&isSelected)target={x:Math.max(box.x,Math.min(box.x+box.w-width,p.x-width/2)),y:Math.max(box.y,p.y-25),w:width,h:height};
  if(!target){labelGroup.remove();continue;}
  occupied.push(target);text.setAttribute('x',target.x);text.setAttribute('y',target.y+height-2);if(muted)text.classList.add('muted-label');
  const lx=Math.max(target.x,Math.min(target.x+width,p.x)),ly=target.y+height/2;
  if(Math.hypot(lx-p.x,ly-p.y)>19){const line=el('line',{x1:p.x,y1:p.y,x2:lx,y2:ly,class:'label-leader'});labelGroup.insertBefore(line,text);}
  if(overview&&!isSelected)text.classList.add('overview-name');
 }
}
function drawGraph(svg,w,h){
 const center=byId.get(state.selected);if(!center){legendView.sync([]);$('#empty').textContent='目前沒有可顯示的主題';$('#empty').hidden=false;return;}
 const regions=graphRegions(w,h),a=regions.local,b=regions.global;
 const divider=regions.stacked?{x1:14,y1:b.y-28,x2:w-14,y2:b.y-28}:{x1:b.x-22,y1:82,x2:b.x-22,y2:h-62};svg.append(el('line',{...divider,class:'map-divider'}));
 svg.append(el('text',{x:a.x,y:a.y-14,class:'map-heading'},`直接關係 · ${center.name}`));svg.append(el('text',{x:b.x,y:b.y-14,class:'map-heading'},`全域 · ${data.topics.length}`));
 const allEdges=data.relations.filter(e=>e.status==='confirmed'&&(e.from===center.id||e.to===center.id));
 const allNeighbors=[...new Set(allEdges.map(e=>e.from===center.id?e.to:e.from))].sort();
 // Filtered topics remain in their original slots. Only emphasis changes.
 const visibleEdges=allEdges.filter(e=>(!state.relationType||e.kind===state.relationType)&&matches(byId.get(e.from===center.id?e.to:e.from),state.q,state.type));
 const activeIds=new Set([center.id,...visibleEdges.map(e=>e.from===center.id?e.to:e.from)]);legendView.sync(visibleEdges);
 const cx=a.x+a.w/2,cy=a.y+a.h/2,rx=Math.max(20,a.w/2-45),ry=Math.max(22,a.h/2-32),pos=new Map([[center.id,{id:center.id,x:cx,y:cy}]]);
 allNeighbors.forEach((id,i)=>{const theta=-Math.PI/2+i*2*Math.PI/Math.max(1,allNeighbors.length);pos.set(id,{id,x:cx+rx*Math.cos(theta),y:cy+ry*Math.sin(theta)});});
 const local=el('g',{'data-map':'local'});svg.append(local);
 const defs=el('defs'),clip=el('clipPath',{id:'local-clip'});clip.append(el('rect',{x:a.x-7,y:a.y-4,width:a.w+14,height:a.h+8}));defs.append(clip);const markers=new Map();for(const kind of new Set(visibleEdges.map(e=>e.kind)))markers.set(kind,appendArrow(defs,relationStyle(kind),state.edgeColors));svg.append(defs);
 const edgeLayer=el('g',{'clip-path':'url(#local-clip)'});local.append(edgeLayer);
 for(const id of allNeighbors){const pair=sortRelations(allEdges.filter(e=>e.from===id||e.to===id));pair.forEach((edge,index)=>{
  if(!visibleEdges.includes(edge))return;
  const curve=relationCurve(pos.get(center.id),pos.get(id),edge.from===center.id,index,pair.length),style=relationStyle(edge.kind),title=`${byId.get(edge.from).name} → ${edge.kind} → ${byId.get(edge.to).name}`;
  const g=el('g',{class:'edge-group',role:'button',tabindex:'0','data-edge-id':edge.id,'data-kind':edge.kind,'data-from':edge.from,'data-to':edge.to,'aria-label':title+'，查看關係詳情',style:`--edge-color:${relationColor(style,state.edgeColors)}`});
  g.append(el('path',{d:curve.path,class:'edge-line',fill:'none','stroke-dasharray':style.dash,'stroke-linecap':'round','marker-end':`url(#${markers.get(edge.kind)})`}));g.append(el('path',{d:curve.path,class:'edge-hit'}));
  if(state.showEdges){const from=pos.get(center.id),to=pos.get(id),delta=curve.middle.x-(from.x+to.x)/2,side=pair.length>1&&Math.abs(to.y-from.y)>Math.abs(to.x-from.x)?Math.sign(delta):0;g.append(el('text',{x:curve.middle.x+side*5,y:curve.middle.y-7,'text-anchor':side<0?'end':side>0?'start':'middle',class:'edge-label'},edge.kind));}
  g.onclick=e=>{e.stopPropagation();showEdge([edge]);};g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showEdge([edge]);}};g.onpointerenter=e=>{if(e.pointerType!=='touch')showTip(esc(title),curve.middle.x,curve.middle.y);};g.onpointerleave=()=>$('#tooltip').hidden=true;edgeLayer.append(g);
 });}
 for(const p of pos.values())point(local,p,'直接關係主題',{area:'local',muted:!activeIds.has(p.id)});
 drawNames(local,[...pos.values()],a);
 if(!allNeighbors.length)local.append(el('text',{x:cx,y:cy+45,'text-anchor':'middle'},'沒有已確認的直接關係'));
 const global=el('g',{'data-map':'global'});svg.append(global);
 const margin=Math.min(34,b.w*.12,b.h*.12),gp=overviewMap.points.map(p=>({id:p.id,x:b.x+margin+p.x*(b.w-2*margin),y:b.y+margin+p.y*(b.h-2*margin)})),byPosition=new Map(gp.map(p=>[p.id,p]));
 for(const edge of overviewMap.edges){const from=byPosition.get(edge.from),to=byPosition.get(edge.to),active=(edge.from===center.id&&activeIds.has(edge.to))||(edge.to===center.id&&activeIds.has(edge.from));global.append(el('line',{x1:from.x,y1:from.y,x2:to.x,y2:to.y,class:`overview-link ${active?'active-link':''}`,'data-pair':edge.from+'|'+edge.to}));}
 for(const p of gp)point(global,p,p.id===center.id?'目前中心主題':activeIds.has(p.id)?'左圖直接相連主題':'全域主題',{area:'global',neighbor:p.id!==center.id&&activeIds.has(p.id),muted:!matches(byId.get(p.id),state.q,state.type)});
 drawNames(global,gp,b,{overview:true});
 applyEdgeFocus(state.edgeFocus);$('#view-caption').textContent=`直接關係 · ${center.name} · 全域 ${data.topics.length} 個主題`;
}
function showTip(html,x,y){const tip=$('#tooltip');tip.innerHTML=html;tip.style.left=Math.max(8,Math.min(x+16,$('#stage').clientWidth-275))+'px';tip.style.top=Math.max(65,Math.min(y+16,$('#stage').clientHeight-115))+'px';tip.hidden=false;}
function showEdge(edges){state.edge=true;state.detail=false;if(innerWidth<900)state.controls=false;$('#edge-content').innerHTML=edges.map(e=>`<div class="edge"><button data-topic="${e.from}">${esc(byId.get(e.from).name)}</button> ─ ${esc(e.kind)} → <button data-topic="${e.to}">${esc(byId.get(e.to).name)}</button><p>${esc(e.condition)}</p><details><summary>來源與依據${e.basis==='editorial'?' · 編輯收錄決策':''}</summary>${sourceLinks(e.sources)}</details></div>`).join('');$$('#edge-content>.edge').forEach((node,i)=>node.prepend(relationSwatch(relationStyle(edges[i].kind),state.edgeColors,'detail-'+i)));fitPanels();bindTopics();$('#edge-info').scrollTop=0;save();}
function axisTitle(svg,attrs,key){const text=el('text',{...attrs,class:'axis-title axis-help',role:'button',tabindex:'0','aria-label':`${key.toUpperCase()} 軸 ${AXES[state[key]].short}，前往換軸選單`},`${key.toUpperCase()}  ${AXES[state[key]].short}`);const open=()=>$(`#${key}axis`).focus();text.onclick=open;text.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}};svg.append(text);}
function addGestures(){
 const svg=$('#plot');let down=null;
 svg.addEventListener('pointerdown',e=>{if(e.button!==0)return;down={x:e.clientX,y:e.clientY};});
 svg.addEventListener('pointercancel',()=>down=null);
 svg.addEventListener('click',e=>{
  if(e.target.closest('.edge-group,.axis-help'))return;
  if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>5){down=null;return;}down=null;
  const b=svg.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top,p=nearestPoint(points,x,y,20);if(p)activatePoint(p);
 });
}
try{const r=await fetch('./data.json');if(!r.ok)throw new Error('主題資料讀取失敗');builtinData=await r.json();const errors=validate(builtinData);if(errors.length)throw new Error(errors.slice(0,4).join('；'));let storage;try{storage=localStorage;}catch{storage={getItem(){throw 0;},setItem(){throw 0;}};}dataStore=new DatasetStore(storage,'semiconductor-atlas-data-v1:'+location.pathname,builtinData);data=dataStore.data;indexData();if(!byId.has(state.selected)){state.selected=null;state.detail=false;}if(state.view==='relations'&&!state.selected)state.selected=byId.has('K13')?'K13':data.topics[0]?.id||null;setup();render();initializeHistory();dataManager=createDataManager(dataStore,{current:()=>data,apply:applyDataset});}catch(e){$('#stage').innerHTML=`<div class="status-box" role="alert">無法載入知識資料：${esc(e.message)}。請重新整理；資料修復前不產生虛構座標。</div>`;}
