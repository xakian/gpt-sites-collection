/**
 * Wafer probing — deterministic observation timeline, topic version 1.0.0.
 *
 * This module owns no wall clock and no animation loop. Its input is the local
 * time supplied by the unmodified common ObserverPlayer / PlayerClock 1.0.0.
 * All die outcomes, measurements and limits below are invented teaching data.
 * They do not represent a particular product, test specification or yield.
 */
export const DURATION_MS = 54_000;
export const TOPIC_VERSION = '1.0.0';

const clamp = (n, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const smooth = n => { const p = clamp(n); return p * p * (3 - 2 * p); };
const ramp = (p, start, end) => smooth((p - start) / (end - start));
const point = die => ({x: die.x, y: die.y});
const interpolate = (a, b, p) => ({x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p});
const signed = n => String(n).replace('-', '−');

const rowLengths = [3, 5, 7, 7, 7, 5, 3];
export const DIES = Object.freeze(rowLengths.flatMap((length, row) =>
  Array.from({length}, (_, col) => {
    const x = col - (length - 1) / 2, y = row - 3;
    return Object.freeze({id: `${x},${y}`, x, y, label: `X ${signed(x)} · Y ${signed(y)}`});
  })
));
export const ORDER = Object.freeze(rowLengths.flatMap((_, row) => {
  const cells = DIES.filter(die => die.y === row - 3);
  return row % 2 ? cells.reverse() : cells;
}));

/** Logical teaching binning, not real test limits. First two dice contrast. */
const failedIndices = new Set([1, 8, 14, 20, 27, 34]);
const outcome = i => failedIndices.has(i) ? 'fail' : 'pass';
const measurementValue = i => i === 0 ? .96 : i === 1 ? 1.28 :
  failedIndices.has(i) ? (i % 2 ? 1.24 : .82) : [.94, .98, 1.02, 1.05][i % 4];

export const ILLUSTRATION = Object.freeze({
  isIllustrative: true,
  description: '37 顆示意晶粒；測值、限值、結果分布及時間均為教學安排，不是實測資料或真實良率。',
  limits: Object.freeze([.90, 1.10]),
  unit: '相對值',
  singleSite: true,
  normalContactZ: 1
});

/** Broad sections for the shared notes selector. Intervals are [start,end). */
export const PHASES = Object.freeze([
  {id:'align', title:'對準晶圓位置', start:0, end:3_000, keyframe:2_700},
  {id:'contact', title:'焊墊接觸探針', start:3_000, end:6_400, keyframe:6_200},
  {id:'measure', title:'施加訊號・量測回應', start:6_400, end:9_600, keyframe:8_900},
  {id:'record', title:'判讀並記入座標', start:9_600, end:13_000, keyframe:11_200},
  {id:'next', title:'下一顆・未通過示例', start:13_000, end:23_000, keyframe:21_200},
  {id:'scan', title:'逐顆巡測', start:23_000, end:45_000, keyframe:34_500},
  {id:'map', title:'晶圓圖完成', start:45_000, end:50_000, keyframe:47_000},
  {id:'reset', title:'本輪結束・重新示範', start:50_000, end:54_000, keyframe:52_200}
].map(Object.freeze));

export const KEYFRAMES = Object.freeze([
  {id:'overview', title:'尚未切割的晶圓', time:800, phaseIndex:0},
  {id:'aligned', title:'XY 對位完成', time:2_700, phaseIndex:0},
  {id:'contact', title:'焊墊與針尖接觸', time:6_200, phaseIndex:1},
  {id:'stimulus', title:'測試機施加訊號', time:7_200, phaseIndex:2},
  {id:'response', title:'測試機量測回應', time:8_900, phaseIndex:2},
  {id:'compare', title:'與示意限值比較', time:10_100, phaseIndex:3},
  {id:'pass', title:'通過，寫入同座標', time:11_200, phaseIndex:3},
  {id:'lower', title:'工作台下降，接觸分離', time:12_850, phaseIndex:3},
  {id:'move', title:'分離後移到下一位置', time:14_100, phaseIndex:4},
  {id:'fail', title:'未通過，保留其座標', time:21_200, phaseIndex:4},
  {id:'scan', title:'其他位置重複相同步驟', time:34_500, phaseIndex:5},
  {id:'complete', title:'完成位置與結果對照', time:47_000, phaseIndex:6},
  {id:'reset', title:'遮幕後重新示範', time:53_800, phaseIndex:7}
].map(Object.freeze));

/** Contact and measurement fractions are common to the slow and fast cycles. */
export const CYCLE = Object.freeze({
  moveStart:.04, moveEnd:.18, riseEnd:.30, stimulusStart:.34,
  responseStart:.50, compareStart:.66, recordAt:.78,
  lowerStart:.88, lowerEnd:.97
});
const SCAN_START = 23_000;
const SCAN_END = 45_000;
const QUICK_CYCLE = (SCAN_END - SCAN_START) / (ORDER.length - 2);

export const CYCLES = Object.freeze(ORDER.map((die, index) => {
  const start = index === 0 ? 3_000 : index === 1 ? 13_000 : SCAN_START + (index - 2) * QUICK_CYCLE;
  const duration = index < 2 ? 10_000 : QUICK_CYCLE;
  return Object.freeze({index, die, start, end:start + duration, duration,
    writeAt:start + duration * CYCLE.recordAt});
}));

/** All stage and mechanical boundaries, useful for direct-seek/browser QA. */
export const BOUNDARIES = Object.freeze([...new Set([
  0, 600, 1_000, 2_400, ...PHASES.flatMap(p => [p.start,p.end]),
  ...CYCLES.flatMap(c => [c.start, ...Object.values(CYCLE).map(f => c.start + f*c.duration), c.end]),
  53_600, DURATION_MS
])].sort((a,b) => a-b));

function cycleMechanism(ms, cycle) {
  const p = clamp((ms - cycle.start) / cycle.duration);
  const previous = cycle.index ? ORDER[cycle.index - 1] : cycle.die;
  const from = point(previous), to = point(cycle.die);
  const xyProgress = ramp(p,CYCLE.moveStart,CYCLE.moveEnd);
  const position = interpolate(from,to,xyProgress);
  const z = p < CYCLE.moveEnd ? 0 : p < CYCLE.riseEnd ?
    ramp(p,CYCLE.moveEnd,CYCLE.riseEnd) : p <= CYCLE.lowerStart ? 1 :
      1-ramp(p,CYCLE.lowerStart,CYCLE.lowerEnd);
  const contact = p >= CYCLE.riseEnd && p <= CYCLE.lowerStart;
  let signalMode = 'idle', signalProgress = 0, step = '工作台保持下降';
  if (p >= CYCLE.moveStart && p < CYCLE.moveEnd) step = 'XY 平移對位';
  else if (p >= CYCLE.moveEnd && p < CYCLE.riseEnd) step = 'Z 上升接觸';
  else if (p >= CYCLE.riseEnd && p < CYCLE.stimulusStart) step = '接觸穩定';
  else if (p >= CYCLE.stimulusStart && p < CYCLE.responseStart) {
    step = '施加測試訊號'; signalMode = 'stimulus';
    signalProgress = clamp((p-CYCLE.stimulusStart)/(CYCLE.responseStart-CYCLE.stimulusStart));
  } else if (p >= CYCLE.responseStart && p < CYCLE.compareStart) {
    step = '量測電性回應'; signalMode = 'response';
    signalProgress = clamp((p-CYCLE.responseStart)/(CYCLE.compareStart-CYCLE.responseStart));
  } else if (p >= CYCLE.compareStart && p < CYCLE.recordAt) {
    step = '與限值比較'; signalMode = 'compare';
    signalProgress = clamp((p-CYCLE.compareStart)/(CYCLE.recordAt-CYCLE.compareStart));
  } else if (p >= CYCLE.recordAt && p < CYCLE.lowerStart) step = '記入相同座標';
  else if (p >= CYCLE.lowerStart && p < CYCLE.lowerEnd) step = 'Z 下降分離';
  else if (p >= CYCLE.lowerEnd) step = '準備下一位置';
  return {from,to,position,xyProgress,z,contact,signalMode,signalProgress,step,progress:p};
}

/**
 * Reconstruct every visible state from a single local time in milliseconds.
 * Calling backwards, skipping frames, resizing or changing speed is safe.
 * The opaque reset is a replay transition; tests/results never reverse on screen.
 */
export function stateAt(milliseconds) {
  const numeric = Number(milliseconds);
  const tMs = clamp(Number.isFinite(numeric) ? numeric : 0,0,DURATION_MS);
  const t = tMs/1_000;
  const phaseIndex = Math.max(0,PHASES.findIndex(p => tMs >= p.start && (tMs < p.end || p.end === DURATION_MS)));
  const phase = PHASES[phaseIndex];
  let scanIndex = 0;
  if (tMs >= 45_000) scanIndex = ORDER.length-1;
  else if (tMs >= SCAN_START) scanIndex = Math.min(ORDER.length-1,2+Math.floor((tMs-SCAN_START)/QUICK_CYCLE));
  else if (tMs >= 13_000) scanIndex = 1;
  const current = ORDER[scanIndex];
  const cycle = CYCLES[scanIndex];
  let mechanism;
  if (tMs < 3_000) {
    const from={x:0,y:0},to=point(current),xyProgress=ramp(tMs,1_000,2_400);
    mechanism={from,to,position:interpolate(from,to,xyProgress),xyProgress,z:0,contact:false,
      signalMode:'idle',signalProgress:0,step:tMs<1_000?'尚未切割的晶圓':tMs<2_400?'XY 平移對位':'對位完成',progress:0};
  } else if (tMs >= 45_000) {
    const position=point(current);
    mechanism={from:position,to:position,position,xyProgress:1,z:0,contact:false,
      signalMode:'idle',signalProgress:0,step:tMs<50_000?'保留每顆晶粒的測試結果':'重新播放示範',progress:1};
  } else mechanism=cycleMechanism(tMs,cycle);

  const writtenIds = new Set(CYCLES.filter(c => tMs >= c.writeAt).map(c => c.die.id));
  const orderIndices = new Map(ORDER.map((die,i) => [die.id,i]));
  const records = DIES.map(die => ({...die,status:writtenIds.has(die.id)?outcome(orderIndices.get(die.id)):'untested'}));
  const counts = records.reduce((a,r) => {a[r.status]++;return a;}, {pass:0,fail:0,untested:0});
  counts.tested=counts.pass+counts.fail;counts.total=DIES.length;
  const recordWritten=writtenIds.has(current.id);
  const result=recordWritten?outcome(scanIndex):'untested';
  const value=measurementValue(scanIndex);
  const measurementProgress=clamp((mechanism.progress-CYCLE.responseStart)/(CYCLE.compareStart-CYCLE.responseStart));
  const resetOpacity=tMs<600?1-ramp(tMs,0,600):tMs>=50_000?ramp(tMs,50_000,53_600):0;

  return {
    t,tMs,phaseIndex,title:phase.title,phase,step:mechanism.step,
    target:current,current,from:mechanism.from,to:mechanism.to,
    position:mechanism.position,xyProgress:mechanism.xyProgress,
    z:mechanism.z,contact:mechanism.contact,signalMode:mechanism.signalMode,
    signalProgress:mechanism.signalProgress,result,recordWritten,records,counts,
    measurement:{value,displayedValue:measurementProgress*value,limits:[...ILLUSTRATION.limits],
      unit:ILLUSTRATION.unit,visible:tMs>=3_000&&tMs<45_000&&mechanism.progress>=CYCLE.responseStart&&mechanism.progress<CYCLE.lowerEnd,
      progress:measurementProgress,isIllustrative:true},
    scanIndex,scanProgress:mechanism.progress,
    cycleReset:{opacity:resetOpacity,active:tMs<600||tMs>=50_000,label:'重新觀察同一段示範'},
    waferOpacity:1-resetOpacity
  };
}
