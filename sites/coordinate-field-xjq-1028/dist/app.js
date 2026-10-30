import { data, quantities, DEFAULT_AXES, isEligible, valueText, layout } from './model.js';
const $ = id => document.getElementById(id);
const NS = 'http://www.w3.org/2000/svg';
const svg = (tag, attributes = {}, text = '') => {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attributes)) el.setAttribute(k, v);
  if (text) el.textContent = text;
  return el;
};
let axes = { ...DEFAULT_AXES }, selected = null, hovered = null;
let animation = null, hasDrawn = false;
const currentPositions = new Map(), nodes = new Map();
for (const axis of ['x', 'y']) {
  const select = $(`${axis}-axis`);
  for (const [key, q] of Object.entries(quantities)) {
    const opt = document.createElement('option');opt.value = key;opt.textContent = `${q.label} · ${q.unit}`;select.append(opt);
  }
  select.value = axes[axis];
  select.addEventListener('change', () => { axes[axis] = select.value; hovered = null; $('hover-label').hidden = true; render(true); if (selected) showInspector(); });
}
data.forEach(p => {
  const line = svg('line', { class: 'leader' }), anchor = svg('circle', { class: 'anchor', r: 1.2 });
  $('leaders').append(line, anchor);
  const g = svg('g', { class: 'point', tabindex: 0, role: 'button', 'data-id': p.id });
  const hit = svg('circle', { class: 'hit', r: 12 }), halo = svg('circle', { class: 'halo', r: 8.5 }), dot = svg('circle', { class: 'point-dot', r: 4.5 });
  g.append(hit, halo, dot);$('points').append(g);nodes.set(p.id, { g, line, anchor });
  g.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { hovered = p.id; showHover(p); } });
  g.addEventListener('pointerleave', () => { hovered = null;$('hover-label').hidden = true; });
  g.addEventListener('focus', () => { hovered = p.id;showHover(p); });
  g.addEventListener('blur', () => { hovered = null;$('hover-label').hidden = true; });
  g.addEventListener('click', event => { event.stopPropagation();choose(event.detail ? nearestPoint(event)?.id || p.id : p.id); });
  g.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault();choose(p.id); } });
});
function choose(id) {
  selected = selected === id ? null : id;hovered = null;$('hover-label').hidden = true;
  if (selected) showInspector(); else $('inspector').hidden = true;
  updatePointStates();
}
function updatePointStates() {
  for (const p of data) {
    const node = nodes.get(p.id), central = isEligible(p, axes.x, axes.y);
    node.g.setAttribute('class', `point ${central ? 'central' : 'outer'}${selected === p.id ? ' selected' : ''}`);
    node.g.setAttribute('aria-pressed', String(selected === p.id));
    node.g.setAttribute('aria-label', `${p.name}，${central ? '座標內' : '外圍'}，${quantities[axes.x].label}${valueText(p.values[axes.x], axes.x)}，${quantities[axes.y].label}${valueText(p.values[axes.y], axes.y)}`);
    node.line.setAttribute('class', `leader${selected === p.id ? ' selected' : ''}`);
  }
}
function showInspector() {
  const p = data.find(p => p.id === selected);if (!p) return;
  $('point-name').textContent = p.name;$('point-kind').textContent = `${p.kind} · ${p.id.slice(1)}`;
  $('point-description').textContent = p.description;
  $('point-values').replaceChildren(...['x', 'y'].map(axis => {
    const key = axes[axis], row = document.createElement('div');row.className = 'value';
    const dt = document.createElement('dt');dt.textContent = `${axis.toUpperCase()} · ${quantities[key].label}`;
    const dd = document.createElement('dd');dd.textContent = valueText(p.values[key], key);if (p.values[key].status !== 'known') dd.className = 'missing';
    row.append(dt, dd);return row;
  }));
  const reasons = [...new Set([axes.x, axes.y])].filter(key => p.values[key].status !== 'known').map(key => `${quantities[key].label}${p.values[key].status === 'na' ? '不適用' : '未知'}`);
  $('point-reason').textContent = reasons.length ? `留在外圍 · ${reasons.join('、')}` : '座標內 · 兩個量皆適用且已知';
  $('inspector').hidden = false;
  $('live-status').textContent = `${p.name}。${$('point-reason').textContent}`;
}
function showHover(p) {
  const pos = currentPositions.get(p.id);if (!pos) return;
  const el = $('hover-label');el.textContent = p.name;el.hidden = false;
  const w = $('stage').clientWidth, h = $('stage').clientHeight;
  el.style.left = `${Math.max(6, Math.min(w - el.offsetWidth - 6, pos.x - el.offsetWidth / 2))}px`;
  el.style.top = `${Math.max(3, Math.min(h - el.offsetHeight - 3, pos.y - el.offsetHeight - 13))}px`;
}
function tickText(value) { return value.toLocaleString('zh-TW', { maximumFractionDigits: 3 }); }
function drawGrid(result) {
  const { bounds: b, inner: i, xDomain, yDomain, projectX, projectY } = result, els = [];
  els.push(svg('rect', { class: 'frame', x: b.left, y: b.top, width: b.right - b.left, height: b.bottom - b.top, rx: 1 }));
  if (xDomain && yDomain) {
    const compact = b.right - b.left < 300;
    xDomain.ticks.forEach((v, n, all) => {
      const x = projectX(v);
      els.push(svg('line', { class: n === 0 ? 'axis-line' : 'grid-line', x1: x, x2: x, y1: i.top, y2: i.bottom }));
      if (!compact || n === 0 || n === all.length - 1 || n % 2 === 0) els.push(svg('text', { class: 'tick', x, y: i.bottom + 16, 'text-anchor': 'middle' }, tickText(v)));
    });
    yDomain.ticks.forEach((v, n, all) => {
      const y = projectY(v);
      els.push(svg('line', { class: n === 0 ? 'axis-line' : 'grid-line', x1: i.left, x2: i.right, y1: y, y2: y }));
      if (i.bottom - i.top > 140 || n === 0 || n === all.length - 1 || n % 2 === 0) els.push(svg('text', { class: 'tick', x: b.left - 9, y: y + 3, 'text-anchor': 'end' }, tickText(v)));
    });
  } else {
    els.push(svg('text', { class: 'empty-label', x: (b.left + b.right) / 2, y: (b.top + b.bottom) / 2, 'text-anchor': 'middle' }, '目前沒有完整的座標'));
  }
  els.push(svg('text', { class: 'axis-name', x: b.left + 13, y: b.top + 17 }, `Y  ${quantities[axes.y].label}`));
  els.push(svg('text', { class: 'axis-unit', x: b.right - 12, y: b.top + 17, 'text-anchor': 'end' }, quantities[axes.y].unit));
  els.push(svg('text', { class: 'axis-name', x: b.right, y: b.bottom + 25, 'text-anchor': 'end' }, `X  ${quantities[axes.x].label} · ${quantities[axes.x].unit}`));
  $('grid').replaceChildren(...els);
}
function updatePosition(point, target) {
  const { g, line, anchor } = nodes.get(point.id);g.setAttribute('transform', `translate(${point.x} ${point.y})`);
  currentPositions.set(point.id, point);
  const displaced = target.central && Math.hypot(target.x - target.ax, target.y - target.ay) > 1.8;
  line.style.display = anchor.style.display = displaced ? '' : 'none';
  if (displaced) {
    line.setAttribute('x1', target.ax);line.setAttribute('y1', target.ay);line.setAttribute('x2', point.x);line.setAttribute('y2', point.y);
    anchor.setAttribute('cx', target.ax);anchor.setAttribute('cy', target.ay);
  }
}
function render(animate = false) {
  const w = $('stage').clientWidth, h = $('stage').clientHeight;if (!w || !h) return;
  $('field').setAttribute('viewBox', `0 0 ${w} ${h}`);
  const result = layout(w, h, axes.x, axes.y);
  drawGrid(result);updatePointStates();
  $('position-count').textContent = `${result.count} 座標內 / ${30 - result.count} 外圍`;
  $('live-status').textContent = `${quantities[axes.x].label}與${quantities[axes.y].label}。${result.count} 個點在座標內，${30 - result.count} 個點在外圍。`;
  if (animation) cancelAnimationFrame(animation);
  if (animate && hasDrawn && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const starts = new Map(currentPositions), start = performance.now();
    const frame = now => {
      const t = Math.min(1, (now - start) / 540), ease = t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      for (const target of result.positions) {
        const from = starts.get(target.id) || target;
        updatePosition({ id: target.id, x: from.x + (target.x - from.x) * ease, y: from.y + (target.y - from.y) * ease }, target);
      }
      if (t < 1) animation = requestAnimationFrame(frame);else { animation = null; }
    };animation = requestAnimationFrame(frame);
  } else result.positions.forEach(p => updatePosition(p, p));
  hasDrawn = true;
  if (hovered) showHover(data.find(p => p.id === hovered));
}
$('settings-toggle').addEventListener('click', () => {
  const open = $('options').hidden;$('options').hidden = !open;$('settings-toggle').setAttribute('aria-expanded', String(open));
  $('hover-label').hidden = true;hovered = null;
});
$('reset').addEventListener('click', () => {
  axes = { ...DEFAULT_AXES };selected = null;hovered = null;
  $('x-axis').value = axes.x;$('y-axis').value = axes.y;$('inspector').hidden = true;$('hover-label').hidden = true;
  render(true);
});
$('close-inspector').addEventListener('click', () => { const previous = selected;selected = null;$('inspector').hidden = true;updatePointStates();if (previous) nodes.get(previous).g.focus({ preventScroll: true }); });
function nearestPoint(event) {
  const rect = $('stage').getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
  let nearest = null, distance = 19;
  for (const point of currentPositions.values()) { const d = Math.hypot(point.x - x, point.y - y); if (d < distance) { nearest = point; distance = d; } }
  return nearest;
}
$('field').addEventListener('pointermove', event => {
  if (event.pointerType === 'touch') return;
  const p = nearestPoint(event);
  hovered = p?.id || null;
  if (p) showHover(data.find(d => d.id === p.id)); else $('hover-label').hidden = true;
});
$('field').addEventListener('pointerleave', () => { hovered = null; $('hover-label').hidden = true; });
$('field').addEventListener('click', event => {
  const p = nearestPoint(event);
  if (p) choose(p.id); else { selected = null; $('inspector').hidden = true; updatePointStates(); }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (selected) { selected = null;$('inspector').hidden = true;updatePointStates(); }
    else if (!$('options').hidden) { $('options').hidden = true;$('settings-toggle').setAttribute('aria-expanded', 'false');$('settings-toggle').focus(); }
  }
});
new ResizeObserver(() => {
  if (window.innerWidth < 760) { const s = $('inspector').style; s.removeProperty('width');s.removeProperty('left');s.removeProperty('top');s.removeProperty('right');s.removeProperty('bottom'); }
  render(false);
}).observe($('stage'));
render();
