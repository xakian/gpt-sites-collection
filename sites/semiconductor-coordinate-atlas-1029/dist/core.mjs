export const AXES={P:{name:'本單元的原理側重',short:'原理側重',kind:'rating',description:'本單元有多側重現象、機制與變量關係。'},M:{name:'本單元的實作側重',short:'實作側重',kind:'rating',description:'本單元有多側重形成結構、方法、操作與結果判斷。'},S:{name:'已記錄直接子題數',short:'直接子題數',kind:'count',description:'完整資料中，以「收錄於」直接指向此主題的不同子題數，不計孫節點。'},R:{name:'已記錄關聯主題數',short:'關聯主題數',kind:'count',description:'完整資料中，已確認直接關係的不同其他主題數，合併入邊與出邊並去重。'}};
export const STATES={known:'已知',unknown:'未知',pending:'待評估',not_applicable:'不適用'};
export function validate(data){
 const errors=[];if(data?.schemaVersion!==1)errors.push('不支援的格式版本');
 if(!Array.isArray(data?.topics)||!Array.isArray(data?.relations)||!Array.isArray(data?.sources))return ['資料必須包含主題、關係與來源陣列'];
 const ids=new Set(),srcs=new Set(data.sources.map(s=>s.id));if(srcs.size!==data.sources.length)errors.push('來源 ID 重複');
 for(const s of data.sources)if(!/^https?:\/\//.test(s.url)||!s.title||!s.supports||!s.checkedAt)errors.push('來源資訊不完整');
 for(const t of data.topics){
 if(!t.id||ids.has(t.id))errors.push('主題 ID 重複或缺少');ids.add(t.id);
 if(!t.name||!t.question||!t.summary||!Array.isArray(t.types)||!t.types.length)errors.push(`${t.id} 內容不完整`);
 for(const k of ['P','M']){const s=t.scores?.[k];if(!s||!STATES[s.status]||!s.reason||!s.updatedAt||(s.status==='known'?!(Number.isInteger(s.value)&&s.value>=0&&s.value<=4):s.value!==null))errors.push(`${t.id} ${k} 狀態或分數不合法`);}
 if(!Array.isArray(t.sources)||!t.sources.length||t.sources.some(s=>!srcs.has(s)))errors.push(`${t.id} 來源無效`);
 }
 const edgeIds=new Set();for(const e of data.relations){if(!e.id||edgeIds.has(e.id))errors.push('關係 ID 重複或缺少');edgeIds.add(e.id);if(!ids.has(e.from)||!ids.has(e.to)||e.from===e.to)errors.push(`${e.id} 端點無效`);if(!e.kind||!e.condition||!['confirmed','pending'].includes(e.status)||!e.sources?.length||e.sources.some(s=>!srcs.has(s)))errors.push(`${e.id} 關係內容無效`);}
 return errors;
}
export function metrics(data){
 const ids=new Set(data.topics.map(t=>t.id));const sets=Object.fromEntries([...ids].map(id=>[id,{S:new Set(),R:new Set()}]));
 for(const e of data.relations){if(e.status!=='confirmed'||e.from===e.to||!ids.has(e.from)||!ids.has(e.to))continue;sets[e.from].R.add(e.to);sets[e.to].R.add(e.from);if(e.kind==='收錄於')sets[e.to].S.add(e.from);}
 return Object.fromEntries(Object.entries(sets).map(([id,v])=>[id,{S:v.S.size,R:v.R.size,updatedAt:data.updatedAt}]));
}
export function attribute(t,k,counts){if(k==='S'||k==='R')return {status:'known',value:counts[t.id][k],reason:AXES[k].description,updatedAt:counts[t.id].updatedAt,method:'依完整資料計算'};return t.scores[k];}
export function isKnown(s,k){return s?.status==='known'&&Number.isInteger(s.value)&&s.value>=0&&(AXES[k].kind!=='rating'||s.value<=4);}
export function locate(t,x,y,counts){const a=attribute(t,x,counts),b=attribute(t,y,counts);return {located:isKnown(a,x)&&isKnown(b,y),x:a,y:b,reasons:[[x,a],[y,b]].filter(([k,s])=>!isKnown(s,k)).map(([k,s])=>`${AXES[k].short}：${STATES[s?.status]||'無效'}。${s?.reason||'需要重新查核'}`)};}
export function maximum(k,counts){return AXES[k].kind==='rating'?4:Math.max(1,...Object.values(counts).map(v=>v[k]));}
export function matches(t,q,type){const text=[t.name,t.english,...(t.aliases||[])].join(' ').toLocaleLowerCase();return (!q||text.includes(q.trim().toLocaleLowerCase()))&&(!type||t.types.includes(type));}
export function partition(data,x,y,counts,q='',type=''){const central=[],outside=[],hidden=[];for(const t of data.topics){if(!matches(t,q,type))hidden.push(t);else(locate(t,x,y,counts).located?central:outside).push(t);}return{central,outside,hidden};}
export function groups(topics,x,y,counts){const result=new Map();for(const t of topics){const a=attribute(t,x,counts).value,b=attribute(t,y,counts).value,key=`${a},${b}`;if(!result.has(key))result.set(key,{x:a,y:b,topics:[]});result.get(key).topics.push(t);}return [...result.values()];}
