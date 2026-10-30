import {parseDataset,inspectDataset,diffDatasets,MAX_BYTES} from './data-transfer.mjs';

const $=s=>document.querySelector(s);
const node=(tag,text,className)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;};
const value=v=>v===undefined?'（無）':typeof v==='string'?v:JSON.stringify(v,null,2);
const labels={topics:'主題',relations:'關係',sources:'來源'};
const verbs={add:'新增',edit:'修改',remove:'移除'};

export function createDataManager(store,actions){
 let pending=null,readToken=0;
 function message(text,error=false){const n=$('#import-message');n.textContent=text;n.classList.toggle('import-error',error);}
 function refresh(){
  const d=actions.current();$('#data-status').textContent=`${store.custom?'本機自訂資料':'網站內建資料'} · ${d.topics.length} 主題 / ${d.relations.length} 關係 / ${d.sources.length} 來源`;
  $('#data-version-name').textContent=store.custom?store.label:'';
  $('#data-undo').disabled=!store.canUndo;
  if(store.notice)message(store.notice,true);
 }
 function cancel(){readToken++;pending=null;$('#import-preview').hidden=true;$('#import-apply').disabled=true;message('');}
 function showFields(container,list){
  for(const f of list){const row=node('div',undefined,'data-field');row.append(node('code',f.path));
   for(const [label,v]of [['原本',f.before],['變更後',f.after]]){const block=node('div');block.append(node('small',label),node('pre',value(v)));row.append(block);}container.append(row);
  }
 }
 function preview(data,label,mode='import',report=inspectDataset(data)){
  pending=null;$('#import-apply').disabled=true;$('#import-preview').hidden=false;$('#import-diff').replaceChildren();$('#import-warnings').replaceChildren();
  $('#import-preview-name').textContent=label;
  if(report.errors.length){message(`未通過檢查，尚未套用。共 ${report.errors.length} 個問題。`,true);const list=node('ul');report.errors.slice(0,50).forEach(e=>list.append(node('li',e)));$('#import-diff').append(list);if(report.errors.length>50)$('#import-diff').append(node('p','先修正以上 50 項後，再重新檢查。'));return;}
  const diff=diffDatasets(actions.current(),data);
  for(const g of diff.groups){
   const group=node('details',undefined,'data-diff-group'),summary=node('summary');
   const count=action=>g.changes.filter(c=>c.action===action).length;
   summary.textContent=`${labels[g.key]} ${g.before} → ${g.after} · ＋${count('add')} ／改 ${count('edit')} ／－${count('remove')}`;group.append(summary);
   if(!g.changes.length&&!g.orderChanged)group.append(node('p','沒有變更。'));
   if(g.orderChanged)group.append(node('p','既有項目的排列順序有變更。'));
   for(const change of g.changes){const item=node('details',undefined,'data-diff-item');item.append(node('summary',`${verbs[change.action]} · ${change.label} (${change.id})`));item.ontoggle=()=>{if(item.open&&!item.dataset.loaded){showFields(item,change.fields);item.dataset.loaded='true';}};group.append(item);}
   $('#import-diff').append(group);
  }
  if(diff.metadata.length){const meta=node('details');meta.append(node('summary','版本資訊與其他欄位'));meta.ontoggle=()=>{if(meta.open&&!meta.dataset.loaded){showFields(meta,diff.metadata);meta.dataset.loaded='true';}};$('#import-diff').append(meta);}
  report.warnings.forEach(w=>$('#import-warnings').append(node('p',w)));
  if(!diff.total){message('與目前資料相同，無需套用。');return;}
  pending={data,label,mode};$('#import-apply').disabled=false;
  message('檢查通過，尚未套用。展開各項可查看完整差異。');
 }
 function read(raw,label){try{const report=parseDataset(raw);preview(report.data,label,'import',report);}catch(e){cancel();message(e.message,true);}}
 $('#import-choose').onclick=()=>$('#import-file').click();
 $('#import-file').onchange=async e=>{
  const file=e.target.files[0];if(!file)return;cancel();const token=readToken;
  if(file.size>MAX_BYTES){message('檔案超過 1 MB，請縮小資料後再匯入。',true);e.target.value='';return;}
  message('正在讀取檔案…');
  try{const raw=await file.text();if(token===readToken)read(raw,file.name);}catch{if(token===readToken)message('無法讀取檔案，請重新選擇。',true);}
  e.target.value='';
 };
 $('#import-json').oninput=cancel;
 $('#import-check').onclick=()=>{cancel();read($('#import-json').value,'貼上的 JSON');};
 $('#import-cancel').onclick=cancel;
 $('#data-default').onclick=()=>{cancel();preview(store.official,'網站內建資料','default');};
 $('#data-undo').onclick=()=>{cancel();if(store.canUndo)preview(store.record.previous.data||store.official,store.record.previous.label,'undo');};
 $('#import-apply').onclick=()=>{
  if(!pending)return;const plan=pending;
  try{
   if(plan.mode==='undo')store.undo();else store.apply(plan.mode==='default'?null:plan.data,plan.label);
   actions.apply(store.data);cancel();$('#import-json').value='';refresh();
   message(plan.mode==='undo'?'已回復上一版；探索歷程從目前位置重新開始。':'已套用並保存在此瀏覽器；探索歷程從目前位置重新開始。');
   $('#data-section>summary').focus({preventScroll:true});
  }catch(e){message(e.message,true);}
 };
 refresh();return {refresh,cancel};
}
