export const quantities = {
  price: { label: '價格', unit: 'NT$', digits: 0 },
  weight: { label: '重量', unit: 'g', digits: 1 },
  pages: { label: '頁數', unit: '頁', digits: 0 },
  time: { label: '所需時間', unit: '分鐘', digits: 0 },
  interest: { label: '興趣程度', unit: '0–10 分', digits: 1 },
  difficulty: { label: '理解難度', unit: '0–10 分', digits: 1 },
};
export const NA = Object.freeze({ status: 'na' });
export const UNKNOWN = Object.freeze({ status: 'unknown' });
const known = value => ({ status: 'known', value });
const item = (id, name, kind, description, values) => ({ id, name, kind, description,
  values: Object.fromEntries(Object.keys(quantities).map((key, i) => [key, typeof values[i] === 'number' ? known(values[i]) : values[i]])) });
export const data = [
  item('p01', '植物觀察筆記', '書籍', '一本辨認日常植物的圖文書。時間為估計閱讀時間。', [480, 620, 224, 240, 7.8, 3.2]),
  item('p02', '幾何的形狀', '書籍', '用圖形思考空間與證明的入門書。', [720, 850, 312, 540, 9.2, 7.6]),
  item('p03', '短篇小說集', '書籍', '收錄十二篇短篇小說的平裝本。', [320, 260, 192, 300, 6.4, 2.8]),
  item('p04', '城市攝影集', '書籍', '以街道、窗景與行人為主題的攝影集。', [1280, 1180, 160, 90, 8.3, 1.5]),
  item('p05', '聲音與記憶', '書籍', '一份免費電子書；沒有單獨實體的重量。', [0, NA, 88, 150, 8.8, 5.4]),
  item('p06', '二手詩集', '書籍', '朋友贈送的舊詩集，尚未秤重。', [0, UNKNOWN, 96, 75, 7.1, 4.3]),
  item('p07', '陶製杯', '物品', '手工製作的日用杯。此處不替物品指定固定使用時間。', [560, 340, NA, NA, 6.7, NA]),
  item('p08', '自動鉛筆', '物品', '一支可替換筆芯的日常書寫工具。', [85, 14, NA, NA, 5.2, NA]),
  item('p09', '金屬水壺', '物品', '容量 500 mL 的空水壺；重量不包含水。', [890, 275, NA, NA, 6.1, NA]),
  item('p10', '摺疊檯燈', '物品', '可以收起燈臂的小型桌燈。', [1690, 960, NA, NA, 7.4, NA]),
  item('p11', '隨身錄音筆', '物品', '用來採集日常聲音的手持錄音裝置。', [3280, 95, NA, NA, 8.6, 4.8]),
  item('p12', '透明直尺', '物品', '一把 15 cm 的塑膠直尺。', [35, 18, NA, NA, 3.5, NA]),
  item('p13', '河邊的石頭', '物品', '散步時撿到的石頭，取得價格確實為零。', [0, 92, NA, NA, 5.9, NA]),
  item('p14', '舊底片相機', '物品', '家中留下的相機；價格尚未確認。', [UNKNOWN, 680, NA, NA, 8.1, 6.2]),
  item('p15', '河岸散步', '活動', '一段不需門票的河岸路線。時間為單次估計。', [0, NA, NA, 45, 7.6, 0]),
  item('p16', '陶藝工作坊', '活動', '包含材料的單次手作課程。', [1500, NA, NA, 180, 8.7, 4.6]),
  item('p17', '看一場電影', '活動', '一次電影院觀影，不計交通與等候時間。', [340, NA, NA, 125, 7.2, 2.5]),
  item('p18', '吉他指彈練習', '活動', '用現有樂器練習一小段指法，沒有額外支出。', [0, NA, NA, 30, 9.1, 6.8]),
  item('p19', '天文觀測夜', '活動', '一場夜間觀測活動；主辦方尚未公布費用。', [UNKNOWN, NA, NA, 210, 9.4, 5.8]),
  item('p20', '整理舊照片', '活動', '整理一次現有照片；完成時間目前未知。', [0, NA, NA, UNKNOWN, 6.8, 3.7]),
  item('p21', '逛美術館', '活動', '一次常設展參觀的估計費用與時間。', [200, NA, NA, 100, 8.5, 3.9]),
  item('p22', '摺紙小實驗', '活動', '用一張紙觀察對摺後的層序，價格為材料費。', [5, 4.5, NA, 20, 9.6, 7.1]),
  item('p23', '摺痕是一種記憶', '想法', '將摺痕看成紙張曾經歷過的動作紀錄。', [NA, NA, NA, NA, 9.5, 6.5]),
  item('p24', '城市的聲音地圖', '想法', '不用街名，改用聲音來辨認城市的位置。', [NA, NA, NA, NA, 8.9, 5.2]),
  item('p25', '沒有文字的日記', '想法', '只用顏色與形狀記錄一天的感受。', [NA, NA, NA, NA, 7.7, 3.4]),
  item('p26', '用節奏記住公式', '想法', '思考節奏能否承載數學表達的結構。', [NA, NA, NA, NA, 9.3, 8.2]),
  item('p27', '一個尚未命名的問題', '想法', '直覺上感到有趣，還無法評估理解難度。', [NA, NA, NA, NA, 8.4, UNKNOWN]),
  item('p28', '影子會留下時間嗎', '想法', '把一天中影子的位置疊成一張圖。', [NA, NA, NA, NA, 8.2, 5.6]),
  item('p29', '讓物件自己分類', '想法', '分類方式隨選用的描述量改變。', [NA, NA, NA, NA, 9.7, 7.9]),
  item('p30', '空白也是資訊', '想法', '區分沒有、不適用，以及還不知道。興趣尚未評分。', [NA, NA, NA, NA, UNKNOWN, 6.9]),
];
export const DEFAULT_AXES = { x: 'price', y: 'weight' };
export const isEligible = (point, x, y) => [x, y].every(key => point.values[key].status === 'known' && Number.isFinite(point.values[key].value));
export function valueText(value, key) {
  if (value.status === 'na') return '不適用';
  if (value.status === 'unknown') return '未知';
  const num = value.value.toLocaleString('zh-TW', { maximumFractionDigits: quantities[key].digits });
  return `${num} ${['interest', 'difficulty'].includes(key) ? '/ 10 分' : quantities[key].unit}`;
}
export function scaleDomain(values) {
  if (!values.length) return null;
  let min = Math.min(...values), max = Math.max(...values);
  const span = max - min || Math.max(Math.abs(min) * .2, 1);
  const low = min >= 0 ? Math.max(0, min - span * .08) : min - span * .08;
  const high = max + span * .08;
  const raw = (high - low) / 4;
  const base = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].find(n => n * base >= raw) * base;
  const start = Math.floor(low / step) * step, end = Math.ceil(high / step) * step;
  const ticks = [];
  for (let v = start; v <= end + step * 1e-6; v += step) ticks.push(+v.toPrecision(12));
  return { min: start, max: end, ticks };
}
export function plotBounds(w, h) {
  return { left: Math.min(110, Math.max(65, w * .115)), right: w - Math.min(100, Math.max(55, w * .09)),
    top: Math.min(90, Math.max(28, h * .115)), bottom: h - Math.min(100, Math.max(40, h * .13)) };
}
const hash = str => [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
// Permanent slots are assigned by opaque ID, never by any data value or category.
const slotIds = [...data].sort((a, b) => hash(a.id + 'orbit-seed') - hash(b.id + 'orbit-seed')).map(p => p.id);
export function outerPositions(w, h) {
  const left = 23, top = 24, width = w - 46, height = h - 48;
  const perimeter = 2 * (width + height);
  return new Map(slotIds.map((id, index) => {
    let d = (index + .35) / slotIds.length * perimeter, x, y;
    if (d < width) { x = left + d; y = top; }
    else if ((d -= width) < height) { x = left + width; y = top + d; }
    else if ((d -= height) < width) { x = left + width - d; y = top + height; }
    else { d -= width; x = left; y = top + height - d; }
    // Small deterministic inward variation makes the edge feel less mechanical.
    const inset = (hash(id + 'inset') % 8);
    if (y === top) y += inset;
    else if (x === left + width) x -= inset;
    else if (y === top + height) y -= inset;
    else x += inset;
    return [id, { x, y }];
  }));
}
export function layout(w, h, xKey, yKey) {
  const bounds = plotBounds(w, h), outer = outerPositions(w, h);
  const eligible = data.filter(p => isEligible(p, xKey, yKey));
  const xDomain = scaleDomain(eligible.map(p => p.values[xKey].value));
  const yDomain = scaleDomain(eligible.map(p => p.values[yKey].value));
  for (const [key, domain] of [[xKey, xDomain], [yKey, yDomain]]) {
    if (domain && ['interest', 'difficulty'].includes(key) && domain.max > 10) {
      domain.max = 10; domain.ticks = domain.ticks.filter(v => v <= 10);
      if (!domain.ticks.includes(10)) domain.ticks.push(10);
    }
  }
  // Data area is inset from the frame so zero-valued dots remain fully inside.
  const inner = { left: bounds.left + 17, right: bounds.right - 17, top: bounds.top + 29, bottom: bounds.bottom - 31 };
  const projectX = v => inner.left + (v - xDomain.min) / (xDomain.max - xDomain.min) * (inner.right - inner.left);
  const projectY = v => inner.bottom - (v - yDomain.min) / (yDomain.max - yDomain.min) * (inner.bottom - inner.top);
  const positions = data.map(p => {
    const central = isEligible(p, xKey, yKey);
    const pos = central ? { x: projectX(p.values[xKey].value), y: projectY(p.values[yKey].value) } : outer.get(p.id);
    return { id: p.id, central, ...pos, ax: pos.x, ay: pos.y };
  });
  const central = positions.filter(p => p.central);
  // Separate markers only as much as needed; leader lines retain exact coordinates.
  for (let iteration = 0; iteration < 180; iteration++) {
    let changed = false;
    for (let i = 0; i < central.length; i++) for (let j = i + 1; j < central.length; j++) {
      const a = central[i], b = central[j]; let dx = b.x - a.x, dy = b.y - a.y;
      let d = Math.hypot(dx, dy);
      if (d < 12.5) {
        if (d < .001) { const angle = hash(a.id + b.id) % 628 / 100; dx = Math.cos(angle); dy = Math.sin(angle); d = 1; }
        const push = (12.6 - d) / 2;
        a.x -= dx / d * push; a.y -= dy / d * push; b.x += dx / d * push; b.y += dy / d * push; changed = true;
      }
    }
    for (const p of central) { p.x = Math.max(inner.left - 7, Math.min(inner.right + 7, p.x)); p.y = Math.max(inner.top - 6, Math.min(inner.bottom + 6, p.y)); }
    if (!changed) break;
  }
  return { bounds, inner, positions, xDomain, yDomain, projectX, projectY, count: eligible.length };
}
