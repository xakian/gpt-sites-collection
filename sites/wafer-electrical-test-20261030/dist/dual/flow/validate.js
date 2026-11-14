// Authoring checks run before compiling; no network or deployment side effects.
export function validateTopic(topic) {
  const fail = message => { throw Error(`主題資料：${message}`); };
  if (!topic || !Array.isArray(topic.nodes) || !topic.nodes.length) fail('需要文字步驟');
  const controls = topic.controls || [], all = [...topic.nodes, ...controls], ids = new Set();
  for (const n of all) {
    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(n.id) || ids.has(n.id)) fail(`步驟識別重複或不合法：${n.id}`);
    ids.add(n.id);
  }
  const visible = new Set(topic.nodes.map(n => n.id));
  if (!visible.has(topic.start) || !visible.has(topic.finish)) fail('起點與終點必須是文字步驟');
  const phases = topic.phaseNames || ['原料準備','製程條件設定','設備執行','薄膜形成','結果檢查與調整'];
  for (const n of topic.nodes) {
    for (const key of ['title','operation','purpose','material','parameters']) if (typeof n[key] !== 'string' || !n[key].trim()) fail(`${n.id} 缺少 ${key}`);
    if (!Number.isInteger(n.phase) || !phases[n.phase]) fail(`${n.id} 的階段不合法`);
    if (!Array.isArray(n.words) || !n.words.length || n.words.some(w => typeof w !== 'string' || !w) || n.words.join('') !== n.title) fail(`${n.id} 的 words 必須完整拼回標題`);
    if (n.duration !== undefined && (!Number.isFinite(n.duration) || n.duration <= 0)) fail(`${n.id} 的時間必須大於零`);
  }
  const covered = new Set();
  if (!Array.isArray(topic.pages) || !topic.pages.length) fail('需要閱讀分段');
  for (const p of topic.pages) {
    if (!Array.isArray(p.phrases) || !p.phrases.length || p.phrases.some(s => typeof s !== 'string' || !s) || p.phrases.join('') !== p.title) fail(`段落「${p.title}」的 phrases 不完整`);
    if (!p.ids?.length) fail(`段落「${p.title}」沒有步驟`);
    for (const id of p.ids) { if (!visible.has(id)) fail(`段落引用不存在的步驟 ${id}`); covered.add(id); }
  }
  for (const id of visible) if (!covered.has(id)) fail(`${id} 沒有放入同屏分段`);
  for (const n of controls) if (!['fork','join','decision'].includes(n.kind) || (n.kind === 'join' && (!Number.isInteger(n.wait) || n.wait < 1))) fail(`控制節點 ${n.id} 不合法`);
  const edgeIds = new Set();
  for (const e of topic.edges || []) {
    if (!ids.has(e.from) || !ids.has(e.to) || !e.id || edgeIds.has(e.id)) fail(`連線不合法或重複：${e.id}`);
    edgeIds.add(e.id);
    if (!['sequence','condition','parallel','loop','feedback','loss'].includes(e.kind)) fail(`未知線型 ${e.kind}`);
    if (e.when !== 'always' && typeof topic.conditions?.[e.when] !== 'function') fail(`缺少條件 ${e.when}`);
    if (e.effect && typeof topic.effects?.[e.effect] !== 'function') fail(`缺少效果 ${e.effect}`);
  }
  for (const n of topic.nodes) if (n.effect && typeof topic.effects?.[n.effect] !== 'function') fail(`缺少效果 ${n.effect}`);
  const fields = new Set();
  for (const field of topic.settings || []) {
    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(field.key) || fields.has(field.key)) fail('設定名稱不合法或重複');
    fields.add(field.key);
    if (!['boolean','select'].includes(field.type)) fail(`未知設定類型 ${field.type}`);
    if (field.type === 'select' && (!field.choices?.length || field.choices.some(c => !['string','number','boolean'].includes(typeof c.value)))) fail(`${field.key} 缺少可選值`);
  }
  for (const loop of topic.loops || []) {
    if (!loop.key || !loop.completedKey || !loop.totalOption || !loop.ids?.length) fail('循環必須指定計數與重啟範圍');
    for (const id of [...loop.ids, loop.start, loop.check, loop.exit]) if (!visible.has(id)) fail(`循環引用不存在的步驟 ${id}`);
  }
  return topic;
}

export function validateOptions(topic, options) {
  for (const field of topic.settings || []) {
    const value = options[field.key];
    if (field.type === 'boolean' && typeof value !== 'boolean') throw Error(`${field.key} 必須是布林值`);
    if (field.type === 'select' && !field.choices.some(c => c.value === value)) throw Error(`${field.key} 不在允許的示例選項中`);
  }
  for (const loop of topic.loops || []) {
    const count = options[loop.totalOption];
    if (!Number.isInteger(count) || count < 1 || count > 100) throw Error('示意循環次數必須是 1–100 的整數');
  }
}
