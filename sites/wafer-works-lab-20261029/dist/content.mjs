export const HZ=60, MAP={w:24,h:18,safe:{x:1,y:13,w:3,h:4}};
export const INFRA=[{id:'warehouse',label:'材料倉',x:1,y:1,w:3,h:2,port:{x:2.5,y:3.5},capacity:12},{id:'shipping',label:'出貨站',x:19,y:1,w:3,h:2,port:{x:20.5,y:3.5},capacity:2}];
export const MATERIALS={filmA:{label:'薄膜 A',cost:12},resist:{label:'光阻',cost:8},developer:{label:'顯影補給',cost:4},etchA:{label:'蝕刻補給 A',cost:8},stripCleanA:{label:'去光阻清洗',cost:8}};
export const MACHINES={
 dep:{id:'dep',label:'沉積',no:'01',capability:'dep',cost:400,upgrade:200,materials:{filmA:5},tool:false,note:'在已清潔基板上加入薄膜，還沒有圖案。',source:'https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made'},
 litho:{id:'litho',label:'複合微影',no:'02',capability:'litho',cost:500,upgrade:250,materials:{resist:5,developer:5},tool:true,note:'曝光改變光阻反應，顯影形成光阻開口。此時薄膜仍未被蝕刻。合併塗阻、烘烤、曝光及顯影。',source:'https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made'},
 etch:{id:'etch',label:'蝕刻',no:'03',capability:'etch',cost:300,upgrade:150,materials:{etchA:5},tool:false,note:'透過光阻開口移除選定區域的薄膜，形成薄膜圖案；光阻仍留在表面。',source:'https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made'},
 clean:{id:'clean',label:'去光阻清洗',no:'04',capability:'clean',cost:150,upgrade:100,materials:{stripCleanA:5},tool:false,note:'去除光阻與殘留，保留薄膜圖案。真實製程會多次清洗，本作合併簡化。',source:'https://www.lamresearch.com/products/our-processes/strip-clean/'},
 inspect:{id:'inspect',label:'檢查',no:'05',capability:'inspect',cost:150,upgrade:100,materials:{},tool:false,note:'確認已有缺陷與合格片數，不修復晶圓。圖案化試片不是完整 IC。',source:'https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made'}
};
export const ITEMS={
 wafer:{label:'晶圓盒',kind:'wafer_lot',cost:40},
 dep:{label:'沉積補給盒',kind:'supply_box',cost:12,contents:{filmA:1}},
 litho:{label:'微影補給盒',kind:'supply_box',cost:12,contents:{resist:1,developer:1}},
 etch:{label:'蝕刻補給盒',kind:'supply_box',cost:8,contents:{etchA:1}},
 clean:{label:'清洗補給盒',kind:'supply_box',cost:8,contents:{stripCleanA:1}},
 mask:{label:'圖案 A 光罩',kind:'tool',cost:50,pattern:'A'}
};
const recipe=(id,capability,seconds,fee,input,materials,effects,extra={})=>({id,version:1,label:'標準配方',capability,seconds,fee,input,materials,effects,...extra});
export const RECIPES={
 'dep.standard':recipe('dep.standard','dep',25,6,{film:'none',resist:'none'},{filmA:1},{film:'blanket'}),
 'litho.standard':recipe('litho.standard','litho',45,5,{film:'blanket',resist:'none'},{resist:1,developer:1},{resist:'patterned'}, {tool:'A'}),
 'litho.fast':recipe('litho.fast','litho',30,5,{film:'blanket',resist:'none'},{resist:1,developer:1},{resist:'patterned'},{tool:'A',unlock:1,defects:[19,20],label:'快速配方 · 18/20 合格'}),
 'etch.standard':recipe('etch.standard','etch',25,4,{film:'blanket',resist:'patterned'},{etchA:1},{film:'patterned',resist:'residual'}),
 'clean.standard':recipe('clean.standard','clean',15,3,{film:'patterned',resist:'residual'},{stripCleanA:1},{resist:'none'}),
 'inspect.standard':recipe('inspect.standard','inspect',10,2,{film:'patterned',resist:'none'},{},{inspect:true})
};
export const ROUTES={'sampleA':{version:1,product:'sample.patternA',pattern:'A',steps:[['dep.standard'],['litho.standard','litho.fast'],['etch.standard'],['clean.standard'],['inspect.standard']]}};
export const STAGES=['已清潔基板','未圖案化薄膜','已圖案化光阻','已蝕刻待清洗','清潔圖案化試片','已檢查試片'];
export const ORDERS={tutorial:{label:'教學驗證',seconds:null,minGood:20,price:15,unlock:0},regular:{label:'試片訂單',seconds:300,minGood:18,price:15,unlock:1},rush:{label:'急件試片',seconds:180,minGood:18,price:16,unlock:3,fresh:true}};
export const DEFAULT_CONTENT={machines:MACHINES,items:ITEMS,recipes:RECIPES,routes:ROUTES,materials:MATERIALS,orders:ORDERS};
export function validateContent(c=DEFAULT_CONTENT){
 for(const [id,m] of Object.entries(c.machines)){if(id!==m.id||m.cost<0||m.upgrade<0)throw Error('無效設備 '+id);for(const k of Object.keys(m.materials))if(!c.materials[k])throw Error('材料引用不存在 '+k);}
 for(const [id,r] of Object.entries(c.recipes)){if(r.id!==id||r.seconds<=0||r.fee<0||!Object.values(c.machines).some(m=>m.capability===r.capability))throw Error('無效配方 '+id);for(const k of Object.keys(r.materials))if(!c.materials[k]||r.materials[k]<0)throw Error('配方材料錯誤');if(r.tool&&!Object.values(c.items).some(i=>i.kind==='tool'&&i.pattern===r.tool))throw Error('工具不可取得');for(const k of Object.keys(r.effects))if(!['film','resist','inspect'].includes(k))throw Error('未支援效果');}
 for(const route of Object.values(c.routes)){if(route.steps.length===0)throw Error('空路線');for(const ids of route.steps){if(!ids.length)throw Error('空節點');for(const id of ids)if(!c.recipes[id])throw Error('路線引用不存在 '+id);}if(!route.steps.at(-1).some(id=>c.recipes[id].effects.inspect))throw Error('路線沒有檢查終點');}
 return true;
}
