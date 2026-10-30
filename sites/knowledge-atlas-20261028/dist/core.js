(function(root){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x));
 const idOk=s=>typeof s==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/.test(s);
 function validateData(input){
  const d=clone(input),fail=m=>{throw new Error(m)};
  if(!d||d.schemaVersion!==1)fail('不支援的資料格式：schemaVersion 必須為 1。');
  if(!Array.isArray(d.nodes)||d.nodes.length>5000)fail('nodes 必須是陣列，最多 5000 個單元。');
  if(!Array.isArray(d.dimensions)||d.dimensions.length<2||d.dimensions.length>30)fail('需有 2–30 個維度。');
  if(!Array.isArray(d.relations)||d.relations.length>20000)fail('relations 必須是陣列，最多 20000 條關係。');
  if(!Array.isArray(d.relationTypes))fail('缺少 relationTypes 關係類型定義。');
  function unique(arr,label){let ids=new Set();for(const x of arr){if(!x||!idOk(x.id)||ids.has(x.id))fail(label+' 有無效或重複 ID。');ids.add(x.id)}return ids}
  const dims=unique(d.dimensions,'維度'),nodes=unique(d.nodes,'節點'),rels=unique(d.relations,'關係'),types=unique(d.relationTypes,'關係類型');
  const str=(v,label,required=false)=>{if(typeof v!=='string'||v.length>20000||(required&&!v.trim()))fail(label+' 必須是有效文字。')};
  for(const dim of d.dimensions){str(dim.name,'維度名稱',true);if(!Array.isArray(dim.rules)||dim.rules.length!==5)fail(dim.name+' 必須有完整 1–5 分規則。');dim.rules.forEach(x=>str(x,'評分規則',true));dim.short=typeof dim.short==='string'?dim.short:dim.name;dim.reference=typeof dim.reference==='string'?dim.reference:'知識單元本身'}
  for(const t of d.relationTypes){str(t.name,'關係名稱',true);if(typeof t.directed!=='boolean')fail('關係類型需定義 directed。');t.description=typeof t.description==='string'?t.description:''}
  if(!types.has('part')||!d.relationTypes.find(t=>t.id==='part').directed)fail('需保留有方向的 part 父子關係類型。');
  for(const n of d.nodes){str(n.title,'節點標題',true);if(!['概念','敘述','公式','實例'].includes(n.type))fail(n.id+' 的節點類型不支援。');for(const key of ['definition','detail','formula','symbols']){if(n[key]===undefined)n[key]='';str(n[key],n.id+' '+key)}if(!Array.isArray(n.domains)||!Array.isArray(n.assumptions)||!Array.isArray(n.sources))fail(n.id+' 的標籤、假設、來源需為陣列。');n.domains.forEach(x=>str(x,'領域',true));n.assumptions.forEach(x=>str(x,'假設'));if(!n.scores||typeof n.scores!=='object'||Array.isArray(n.scores))fail(n.id+' 缺少 scores。');for(const k of Object.keys(n.scores)){if(!dims.has(k))fail(n.id+' 引用了未定義維度 '+k)}for(const dim of d.dimensions){if(!n.scores[dim.id])n.scores[dim.id]={value:null,reason:''};const s=n.scores[dim.id];if(s.value!==null&&(!Number.isInteger(s.value)||s.value<1||s.value>5))fail(n.id+' 的 '+dim.name+' 分數必須是 1–5 整數或 null。');str(s.reason,n.id+' 評分理由',s.value!==null)}for(const s of n.sources){str(s.title,'來源標題',true);if(typeof s.url!=='string'||!/^https?:\/\//i.test(s.url))fail('來源網址只接受 http / https。');try{new URL(s.url)}catch{fail('來源網址無效。')}if(s.note===undefined)s.note='';str(s.note,'來源備註')}if(!['已核對','待查證','使用者筆記'].includes(n.status))n.status='待查證'}
  if(d.coreId!==null&&!nodes.has(d.coreId))fail('coreId 必須指向現有節點或為 null。');
  const edges=new Set(),children=new Map();
  for(const r of d.relations){if(!nodes.has(r.source)||!nodes.has(r.target))fail(r.id+' 指向不存在的節點。');if(r.source===r.target)fail('關係不可連到節點自己。');if(!types.has(r.type))fail('關係引用了未定義類型。');str(r.reason,'關係理由',true);const type=d.relationTypes.find(t=>t.id===r.type),ends=type.directed?[r.source,r.target]:[r.source,r.target].sort(),key=[r.type,...ends].join('|');if(edges.has(key))fail('有重複的節點關係。');edges.add(key);if(r.type==='part'){if(!children.has(r.source))children.set(r.source,[]);children.get(r.source).push(r.target)}}
  const visited=new Set(),active=new Set();function dfs(id){if(active.has(id))fail('父子關係形成循環；請移除循環後再匯入。');if(visited.has(id))return;active.add(id);for(const c of children.get(id)||[])dfs(c);active.delete(id);visited.add(id)}for(const id of nodes)dfs(id);
  return d;
 }
 function filterNodes(data,query='',domains=[],types=['概念','敘述','公式','實例']){const q=query.trim().toLocaleLowerCase();return data.nodes.filter(n=>types.includes(n.type)&&(!domains.length||n.domains.some(d=>domains.includes(d)))&&(!q||[n.id,n.title,n.definition,n.detail,n.formula,...n.domains].join(' ').toLocaleLowerCase().includes(q)))}
 function groupNodes(nodes,x,y){const groups=new Map(),pending=[];for(const n of nodes){const a=n.scores[x]?.value??null,b=n.scores[y]?.value??null;if(a===null||b===null){pending.push(n);continue}const key=a+','+b;if(!groups.has(key))groups.set(key,{key,x:a,y:b,nodes:[]});groups.get(key).nodes.push(n)}return {groups:[...groups.values()],pending}}
 function serialize(d){return JSON.stringify({...d,exportedAt:new Date().toISOString()},null,2)}
 root.KCore={clone,validateData,filterNodes,groupNodes,serialize};
})(typeof window==='undefined'?globalThis:window);
