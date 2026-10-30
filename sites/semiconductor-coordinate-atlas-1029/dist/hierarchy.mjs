// The navigator describes editorial collection, never causal or physical hierarchy.
export function collectionHierarchy(data) {
  const ids = data.topics.map(t => t.id);
  const parents = new Map(ids.map(id => [id, []]));
  const children = new Map(ids.map(id => [id, []]));
  for (const e of data.relations) {
    if (e.kind !== '收錄於' || e.status !== 'confirmed' || e.from === e.to || !parents.has(e.from) || !parents.has(e.to)) continue;
    if (!parents.get(e.from).includes(e.to)) {
      parents.get(e.from).push(e.to);
      children.get(e.to).push(e.from);
    }
  }
  const order = new Map(ids.map((id, i) => [id, i]));
  for (const list of [...parents.values(), ...children.values()]) list.sort((a, b) => order.get(a) - order.get(b));
  const roots = ids.filter(id => !parents.get(id).length && children.get(id).length);
  const unassigned = ids.filter(id => !parents.get(id).length && !children.get(id).length);
  const reachable = new Set();
  function walk(id) { if (reachable.has(id)) return; reachable.add(id); children.get(id).forEach(walk); }
  [...roots, ...unassigned].forEach(walk);
  const unresolved = ids.filter(id => !reachable.has(id));
  return { ids, parents, children, roots, unassigned, unresolved };
}

export function collectionPaths(index, id, limit = 64) {
  const paths = [];
  let truncated = false, cycle = false;
  function walk(node, trail) {
    if (trail.includes(node)) { cycle = true; return; }
    if (paths.length >= limit) { truncated = true; return; }
    const next = [node, ...trail], parents = index.parents.get(node);
    if (!parents) return;
    if (!parents.length) paths.push(next);
    else parents.forEach(parent => walk(parent, next));
  }
  walk(id, []);
  return { paths, truncated, cycle };
}

export function preferredPath(paths, previous = []) {
  let best = paths[0] || [], score = -1;
  for (const path of paths) {
    let common = 0;
    while (common < path.length && common < previous.length && path[common] === previous[common]) common++;
    if (common > score) { best = path; score = common; }
  }
  return best;
}
