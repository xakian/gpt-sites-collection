import {collectionHierarchy, collectionPaths, preferredPath} from './hierarchy.mjs';
import {matches} from './core.mjs';

const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key = path => JSON.stringify(path);

export function createNavigator(data, actions) {
  const $ = s => document.querySelector(s);
  const topics = new Map(data.topics.map(t => [t.id, t]));
  const index = collectionHierarchy(data), expanded = new Set();
  let selectedPath = [], previousId = null, routeInfo = {paths:[]};

  function expandPath() {
    selectedPath.slice(0, -1).forEach((_, i) => expanded.add(key(selectedPath.slice(0, i + 1))));
    if (index.unassigned.includes(actions.state().selected)) expanded.add('unassigned');
    if (index.unresolved.includes(actions.state().selected)) expanded.add('unresolved');
  }
  function navigate(id, path) {
    actions.beforeNavigate?.();
    selectedPath = path; previousId = id; expandPath();
    actions.navigate(id);
    focusCurrent();
  }
  function currentButton() { return $('#nav-tree button[aria-current="location"]'); }
  function focusCurrent() { currentButton()?.focus({preventScroll:true}); }
  function reveal() { expandPath(); render(); currentButton()?.scrollIntoView({block:'nearest'}); }

  function sync() {
    const id = actions.state().selected, changed = id !== previousId;
    routeInfo = collectionPaths(index, id);
    if (changed || !routeInfo.paths.some(p => key(p) === key(selectedPath))) selectedPath = preferredPath(routeInfo.paths, selectedPath);
    previousId = id;
    if (changed) expandPath();
    render();
    if (changed && !$('#navigator').hidden) currentButton()?.scrollIntoView({block:'nearest'});
  }
  function render() {
    const state = actions.state(), id = state.selected, topic = topics.get(id);
    const independent = index.unassigned.includes(id), unresolved = index.unresolved.includes(id);
    const level = !topic ? '尚未選取' : unresolved ? '層級待釐清' : independent ? '未分層' : `第 ${selectedPath.length} 層`;
    const route = selectedPath.length ? selectedPath : topic ? [id] : [];
    const hidden = topic && !matches(topic, state.q, state.type);
    $('#nav-count').textContent = data.topics.length;
    $('#nav-current').textContent = topic?.name || '選取主題';
    $('#nav-depth').textContent = level;
    $('#nav-open-detail').disabled = !topic;
    $('#nav-filter-note').hidden = !hidden;
    $('#nav-routes-wrap').hidden = routeInfo.paths.length < 2;
    $('#nav-routes').innerHTML = routeInfo.paths.map((p, i) => `<option value="${i}" ${key(p)===key(selectedPath)?'selected':''}>${p.map(n=>escape(topics.get(n).name)).join(' › ')}</option>`).join('');
    const routeText = route.map(n=>topics.get(n).name).join(' › ');
    $('#location-text').textContent = routeText || '選取主題';
    $('#location-depth').textContent = level;
    $('#location-button').title = `${routeText} · ${level}${hidden?' · 不符合目前篩選':''}，開啟總覽定位樹`;
    $('#location-button').setAttribute('aria-label', $('#location-button').title);
    $('#nav-breadcrumb').innerHTML = route.map((n, i) => `<button data-ancestor="${i}" ${i===route.length-1?'aria-current="location"':''}>${escape(topics.get(n).name)}</button>`).join('<span aria-hidden="true">›</span>');
    $('#nav-breadcrumb').querySelectorAll('[data-ancestor]').forEach(button => button.onclick = () => {
      const path = route.slice(0, Number(button.dataset.ancestor) + 1); navigate(path.at(-1), path);
    });
    let sequence = 0;
    function row(n, path, flat = false) {
      const t = topics.get(n), token = key(path), cycle = path.slice(0,-1).includes(n);
      const children = flat || cycle ? [] : index.children.get(n), open = expanded.has(token);
      const active = n===id && (key(selectedPath)===token || unresolved);
      const onPath = !active && selectedPath.length > path.length && path.every((v,i)=>selectedPath[i]===v);
      const filtered = !matches(t, state.q, state.type), multiple = index.parents.get(n).length>1;
      const childId = `nav-children-${sequence++}`;
      return `<li class="tree-item${active?' current':''}${onPath?' on-path':''}${filtered?' filtered':''}"><div class="tree-row">${children.length?`<button class="tree-toggle" data-branch="${escape(token)}" aria-label="${open?'收合':'展開'} ${escape(t.name)}" aria-expanded="${open}" aria-controls="${childId}"><span aria-hidden="true">›</span></button>`:'<span class="tree-leaf" aria-hidden="true"></span>'}<button class="tree-topic" data-nav-id="${escape(n)}" data-route="${escape(token)}" ${active?'aria-current="location"':''} title="${escape(t.name)}${filtered?' · 不符合目前篩選':''}${multiple?' · 多處收錄':''}"><span class="tree-dot" aria-hidden="true"></span><span>${escape(t.name)}</span>${multiple?'<small title="多處收錄">↗</small>':''}${children.length?`<small>${children.length}</small>`:''}</button></div>${cycle?'<small class="tree-warning">循環收錄，層級待釐清</small>':''}${children.length?`<ul id="${childId}" ${open?'':'hidden'}>${open?children.map(child=>row(child,[...path,child])).join(''):''}</ul>`:''}</li>`;
    }
    function bucket(name, label, ids) {
      if (!ids.length) return '';
      const open = expanded.has(name);
      return `<li class="tree-bucket"><button class="bucket-toggle" data-bucket="${name}" aria-expanded="${open}"><span aria-hidden="true">${open?'⌄':'›'}</span>${label}<small>${ids.length}</small></button>${open?`<ul>${ids.map(n=>row(n,[n],true)).join('')}</ul>`:''}</li>`;
    }
    const scroll = $('#nav-tree').scrollTop;
    $('#nav-tree').innerHTML = `<ul class="tree-roots">${index.roots.map(n=>row(n,[n])).join('')}${bucket('unassigned','未分層主題',index.unassigned)}${bucket('unresolved','層級待釐清',index.unresolved)}</ul>`;
    $('#nav-tree').scrollTop = scroll;
    $('#nav-tree').querySelectorAll('[data-branch],[data-bucket]').forEach(button => button.onclick = () => {
      const attr=button.hasAttribute('data-branch')?'data-branch':'data-bucket', value=button.getAttribute(attr);
      expanded.has(value)?expanded.delete(value):expanded.add(value);
      render();
      [...$('#nav-tree').querySelectorAll(`[${attr}]`)].find(b=>b.getAttribute(attr)===value)?.focus({preventScroll:true});
    });
    $('#nav-tree').querySelectorAll('[data-nav-id]').forEach(button => button.onclick = () => navigate(button.dataset.navId, JSON.parse(button.dataset.route)));
    $('#nav-route-warning').hidden = !(routeInfo.truncated || routeInfo.cycle);
    $('#nav-route-warning').textContent = routeInfo.cycle?'收錄關係含循環，部分層級待釐清。':'路徑過多，先列出前 64 條。';
  }

  $('#nav-reveal').onclick = () => { reveal(); focusCurrent(); };
  $('#nav-open-detail').onclick = () => actions.detail();
  $('#nav-clear-filter').onclick = () => actions.clear();
  $('#nav-routes').onchange = e => {
    actions.beforeNavigate?.();
    selectedPath = routeInfo.paths[Number(e.target.value)] || selectedPath;
    reveal(); actions.afterPath?.();
  };
  $('#nav-collapse').onclick = () => { expanded.clear(); render(); };
  $('#nav-tree').onkeydown = e => {
    const button=e.target.closest('[data-nav-id]'); if(!button)return;
    const buttons=[...$('#nav-tree').querySelectorAll('[data-nav-id]')], i=buttons.indexOf(button), path=JSON.parse(button.dataset.route), token=key(path);
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();buttons[Math.max(0,Math.min(buttons.length-1,i+(e.key==='ArrowDown'?1:-1)))].focus();}
    else if(e.key==='Home'||e.key==='End'){e.preventDefault();(e.key==='Home'?buttons[0]:buttons.at(-1))?.focus();}
    else if(e.key==='ArrowRight'&&index.children.get(button.dataset.navId).length){e.preventDefault();if(!expanded.has(token)){expanded.add(token);render();[...$('#nav-tree').querySelectorAll('[data-route]')].find(b=>b.dataset.route===token)?.focus();}else buttons[i+1]?.focus();}
    else if(e.key==='ArrowLeft'){e.preventDefault();if(expanded.has(token)){expanded.delete(token);render();[...$('#nav-tree').querySelectorAll('[data-route]')].find(b=>b.dataset.route===token)?.focus();}else{const parent=key(path.slice(0,-1));[...$('#nav-tree').querySelectorAll('[data-route]')].find(b=>b.dataset.route===parent)?.focus();}}
  };
  return {sync, reveal, getPath:()=>[...selectedPath], setPath:path=>{selectedPath=[...path];previousId=actions.state().selected;expandPath();}};
}
