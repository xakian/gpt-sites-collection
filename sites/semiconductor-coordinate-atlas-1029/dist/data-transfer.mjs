import {validate} from './core.mjs';
import {RELATION_STYLES} from './relation-style.mjs';

export const MAX_BYTES=1024*1024;
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const text=v=>typeof v==='string'&&v.trim().length>0;
const id=v=>typeof v==='string'&&/^[A-Za-z][A-Za-z0-9_.:-]{0,79}$/.test(v);
const strings=v=>Array.isArray(v)&&v.every(text);
const date=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
const clone=v=>JSON.parse(JSON.stringify(v));
export const canonical=v=>Array.isArray(v)?'['+v.map(canonical).join(',')+']':object(v)?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}':JSON.stringify(v);
export function dataSignature(data){let h=2166136261;for(const c of canonical(data))h=Math.imul(h^c.codePointAt(0),16777619);return (h>>>0).toString(16);}

// Imported data must satisfy every assumption used by the renderer, not only scores.
export function inspectDataset(data){
 const errors=[],warnings=[];
 if(!object(data))return {errors:['最外層必須是 JSON 物件。'],warnings};
 const stack=[[data,0]];
 while(stack.length){const [v,depth]=stack.pop();if(depth>40)return {errors:['資料巢狀層數過深。'],warnings};if(object(v)||Array.isArray(v))for(const child of Object.values(v))stack.push([child,depth+1]);}
 if(data.schemaVersion!==1)errors.push('schemaVersion 必須為 1。');
 if(!date(data.updatedAt))errors.push('updatedAt 必須是有效的 YYYY-MM-DD 日期。');
 for(const [key,limit,label]of [['topics',600,'主題'],['relations',4000,'關係'],['sources',1200,'來源']]){
  if(!Array.isArray(data[key]))errors.push(`${label}必須是陣列。`);
  else if(data[key].length>limit)errors.push(`${label}超過本版上限 ${limit} 筆。`);
 }
 if(errors.length)return {errors,warnings};
 for(const [key,label]of [['topics','主題'],['relations','關係'],['sources','來源']]){
  const seen=new Set();data[key].forEach((v,i)=>{
   if(!object(v)){errors.push(`${label}第 ${i+1} 筆必須是物件。`);return;}
   if(!id(v.id)||seen.has(v.id))errors.push(`${label}第 ${i+1} 筆的 ID 無效或重複；使用英文字開頭的英數、_ . : -。`);
   seen.add(v.id);
  });
 }
 if(errors.length)return {errors,warnings};
 for(const t of data.topics){
  for(const k of ['name','english','question','summary','scope'])if(!text(t[k]))errors.push(`${t.id} 缺少文字欄位 ${k}。`);
  if(!strings(t.aliases)||!strings(t.types)||!t.types.length||!strings(t.sources))errors.push(`${t.id} aliases、types、sources 必須是文字陣列，types 不可空白。`);
  if(t.resources!==undefined&&!Array.isArray(t.resources))errors.push(`${t.id} resources 必須是陣列。`);
  for(const k of ['P','M']){const s=t.scores?.[k];if(!object(s)||!text(s.reason)||!text(s.method)||!date(s.updatedAt))errors.push(`${t.id} ${k} 缺少評分理由、方法或有效日期。`);}
 }
 for(const s of data.sources){
  if(!text(s.title)||!text(s.supports)||!date(s.checkedAt))errors.push(`${s.id} 來源缺少標題、支持範圍或有效查核日期。`);
  try{const u=new URL(s.url);if(u.protocol!=='https:'||u.username||u.password)throw 0;}catch{errors.push(`${s.id} 來源 URL 必須是無帳密的有效 HTTPS 網址。`);}
 }
 for(const e of data.relations){
  if(!id(e.from)||!id(e.to)||!text(e.kind)||!text(e.condition)||!strings(e.sources)||!date(e.checkedAt)||!['editorial','source'].includes(e.basis))errors.push(`${e.id} 關係缺少端點、種類、條件、來源、依據或有效查核日期。`);
  if(e.kind==='收錄於'&&e.basis!=='editorial')errors.push(`${e.id}「收錄於」必須標示 basis: editorial。`);
 }
 if(errors.length)return {errors,warnings};
 errors.push(...validate(data));
 if(errors.length)return {errors,warnings};
 const defined=new Set(RELATION_STYLES.map(s=>s.kind)),unknown=[...new Set(data.relations.map(e=>e.kind))].filter(k=>!defined.has(k));
 if(unknown.length)warnings.push(`未定義專屬箭頭的種類：${unknown.join('、')}。將使用通用樣式，請由圖例或關係名稱辨識。`);
 const parents=new Map(data.topics.map(t=>[t.id,[]])),colors=new Map();
 data.relations.filter(e=>e.status==='confirmed'&&e.kind==='收錄於').forEach(e=>parents.get(e.from).push(e.to));
 function cycle(n){if(colors.get(n)===1)return true;if(colors.get(n)===2)return false;colors.set(n,1);for(const p of parents.get(n))if(cycle(p))return true;colors.set(n,2);return false;}
 if(data.topics.some(t=>cycle(t.id)))errors.push('收錄關係包含循環；請先釐清上下層並修正後再匯入。');
 return {errors,warnings};
}

export function parseDataset(raw){
 if(new TextEncoder().encode(raw).byteLength>MAX_BYTES)throw new Error('檔案超過 1 MB，請縮小資料後再匯入。');
 let data;try{data=JSON.parse(raw.replace(/^\uFEFF/,''));}catch{throw new Error('JSON 語法錯誤，請檢查引號、逗號與括號。');}
 const report=inspectDataset(data);return {data,...report};
}

function fields(before,after,path=''){
 if(canonical(before)===canonical(after))return [];
 if(object(before)&&object(after))return [...new Set([...Object.keys(before),...Object.keys(after)])].sort().flatMap(k=>fields(before[k],after[k],path?`${path}.${k}`:k));
 return [{path,before,after}];
}
export function diffDatasets(before,after){
 const sections=['topics','relations','sources'];let total=0;
 const groups=sections.map(key=>{
  const a=new Map(before[key].map(v=>[v.id,v])),b=new Map(after[key].map(v=>[v.id,v]));
  const changes=[];
  for(const [id,v]of b){if(!a.has(id))changes.push({action:'add',id,label:v.name||v.title||v.kind,fields:fields({},v)});else{const f=fields(a.get(id),v);if(f.length)changes.push({action:'edit',id,label:v.name||v.title||v.kind,fields:f});}}
  for(const [id,v]of a)if(!b.has(id))changes.push({action:'remove',id,label:v.name||v.title||v.kind,fields:fields(v,{})});
  const orderChanged=canonical([...a.keys()].filter(id=>b.has(id)))!==canonical([...b.keys()].filter(id=>a.has(id)));
  total+=changes.length+(orderChanged?1:0);
  return {key,changes,orderChanged,before:a.size,after:b.size};
 });
 const meta=v=>Object.fromEntries(Object.entries(v).filter(([k])=>!sections.includes(k)));
 const metadata=fields(meta(before),meta(after));total+=metadata.length;
 return {groups,metadata,total};
}

// One atomic write stores current data and one recovery point. Failure changes neither.
export class DatasetStore{
 constructor(storage,key,official){this.storage=storage;this.key=key;this.official=official;this.raw=null;this.record={version:1,current:null,previous:null};this.notice='';
  try{this.raw=storage.getItem(key);if(this.raw){const v=JSON.parse(this.raw);if(v.version!==1||!('current'in v)||!('previous'in v))throw 0;
   for(const entry of [v.current,v.previous])if(entry!==null&&(!object(entry)||typeof entry.label!=='string'||(entry.data!==null&&inspectDataset(entry.data).errors.length)))throw 0;
   this.record=v;
  }}catch{this.notice='已略過無法讀取的本機資料，先顯示網站內建資料。';}
 }
 get data(){return this.record.current?.data||this.official;}
 get custom(){return !!this.record.current?.data;}
 get canUndo(){return this.record.previous!==null;}
 get label(){return this.record.current?.label||'網站內建資料';}
 write(next){
  const raw=JSON.stringify(next);
  try{if(this.storage.getItem(this.key)!==this.raw)throw new Error('stale');this.storage.setItem(this.key,raw);}catch(e){if(e.message==='stale')throw new Error('另一個分頁已更新資料。請重新整理，再預覽這次變更。');throw new Error('瀏覽器無法保存資料，這次變更尚未套用。請先匯出備份，檢查可用空間或瀏覽器設定。');}
  this.record=next;this.raw=raw;this.notice='';
 }
 apply(data,label){
  if(data!==null){const {errors}=inspectDataset(data);if(errors.length)throw new Error(errors[0]);}
  this.write({version:1,current:{data:clone(data),label},previous:this.record.current?clone(this.record.current):{data:null,label:'網站內建資料'}});
 }
 undo(){if(!this.canUndo)return false;this.write({version:1,current:clone(this.record.previous),previous:null});return true;}
}
