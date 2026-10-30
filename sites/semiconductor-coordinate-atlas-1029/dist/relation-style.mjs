// Presentation vocabulary only; these families never alter the knowledge graph.
export const RELATION_FAMILIES = [
  {name:'編排與分類',color:'#626870',head:'triangle-open',kinds:['收錄於','是一種','包含角色']},
  {name:'機制與模型',color:'#426d94',head:'double-chevron',kinds:['使用機制','由模型描述']},
  {name:'使用與結構',color:'#357d70',head:'chevron',kinds:['使用或涉及','使用材料','使用元件','使用結構','具有結構']},
  {name:'作用與整合',color:'#97612e',head:'triangle-filled',kinds:['執行或支援','作用於','調整','形成','整合']},
  {name:'產業供應',color:'#80618c',head:'barred',kinds:['提供服務或技術','提供設備']},
];
const DASHES = ['', '10 5', '3 4', '1 4', '9 3 1 3'];
export const RELATION_STYLES = Object.freeze(RELATION_FAMILIES.flatMap((family,group)=>family.kinds.map((kind,variant)=>Object.freeze({kind,group,family:family.name,color:family.color,head:family.head,dash:DASHES[variant],id:`relation-${group}-${variant}`,order:group*10+variant}))));
const styles = new Map(RELATION_STYLES.map(style=>[style.kind,style]));
export function relationStyle(kind) { return styles.get(kind) || {kind,group:5,family:'尚未定義樣式',color:'#666',head:'fallback',dash:'2 2',id:'relation-fallback',order:99}; }
export function relationColor(style,colored=true) { return colored ? style.color : '#626870'; }
export function sortRelations(edges) { return [...edges].sort((a,b)=>relationStyle(a.kind).order-relationStyle(b.kind).order||a.id.localeCompare(b.id)); }

// A canonical A→B frame keeps lanes distinct even when individual edges reverse.
export function relationCurve(a,b,fromA,index,total) {
  const distance=Math.hypot(b.x-a.x,b.y-a.y)||1, nx=-(b.y-a.y)/distance,ny=(b.x-a.x)/distance;
  const spacing=Math.min(24,distance/Math.max(5,total*3));
  const offset=(index-(total-1)/2)*2*spacing;
  const control={x:(a.x+b.x)/2+nx*offset,y:(a.y+b.y)/2+ny*offset};
  const inset=Math.min(18,distance*.2);
  const endSpacing=Math.min(14,inset*1.6/Math.max(1,total-1));
  const lateral=(index-(total-1)/2)*endSpacing,along=Math.sqrt(Math.max(0,inset*inset-lateral*lateral));
  const ux=(b.x-a.x)/distance,uy=(b.y-a.y)/distance;
  const nearA={x:a.x+ux*along+nx*lateral,y:a.y+uy*along+ny*lateral};
  const nearB={x:b.x-ux*along+nx*lateral,y:b.y-uy*along+ny*lateral};
  const start=fromA?nearA:nearB,end=fromA?nearB:nearA;
  const middle={x:(start.x+2*control.x+end.x)/4,y:(start.y+2*control.y+end.y)/4};
  return {start,end,control,middle,path:`M${start.x},${start.y} Q${control.x},${control.y} ${end.x},${end.y}`};
}

export const ARROW_SHAPES = {
  'triangle-open':{d:'M1 1 L11 6 L1 11 Z',fill:'paper'},
  'double-chevron':{d:'M0 1 L5 6 L0 11 M6 1 L11 6 L6 11',fill:'none'},
  'chevron':{d:'M1 1 L11 6 L1 11',fill:'none'},
  'triangle-filled':{d:'M1 1 L11 6 L1 11 Z',fill:'color'},
  'barred':{d:'M0 1 V11 M3 1 L11 6 L3 11 Z',fill:'color'},
  'fallback':{d:'M1 1 L11 6 L1 11 M1 6 H7',fill:'none'},
};
export function svgElement(name,attrs={},text) {
  const node=document.createElementNS('http://www.w3.org/2000/svg',name);
  Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,value));
  if(text!==undefined)node.textContent=text;
  return node;
}
export function appendArrow(defs,style,colored,prefix='graph') {
  const color=relationColor(style,colored),shape=ARROW_SHAPES[style.head];
  const id=`${prefix}-${style.id}`;
  const marker=svgElement('marker',{id,viewBox:'0 0 12 12',refX:11,refY:6,markerUnits:'userSpaceOnUse',markerWidth:12,markerHeight:12,orient:'auto',overflow:'visible'});
  marker.append(svgElement('path',{d:shape.d,fill:shape.fill==='paper'?'#fafafa':shape.fill==='color'?color:'none',stroke:color,'stroke-width':1.3,'stroke-linejoin':'round','stroke-linecap':'round'}));
  defs.append(marker);return id;
}
export function relationSwatch(style,colored,prefix) {
  const svg=svgElement('svg',{viewBox:'0 0 92 24','aria-hidden':'true',class:'relation-swatch'}),defs=svgElement('defs');
  const marker=appendArrow(defs,style,colored,prefix);svg.append(defs);
  svg.append(svgElement('path',{d:'M4 12 H84',fill:'none',stroke:relationColor(style,colored),'stroke-width':1.5,'stroke-dasharray':style.dash,'stroke-linecap':'round','marker-end':`url(#${marker})`}));
  return svg;
}
