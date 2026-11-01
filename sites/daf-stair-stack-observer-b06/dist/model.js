export const topic={title:'DAF 薄膜與階梯式晶粒堆疊',question:'薄膜跟著晶粒走，焊墊留在階梯邊緣',simplification:'三顆同尺寸晶粒正面向上、同向錯位。採非導電、爐固化型環氧 DAF 的代表流程，貼合後進行固化，不混用 SkipCure 路線，不給通用溫度配方。薄膜厚度、焊墊與取晶行程放大。框架僅顯示一個取晶窗口，其他晶粒隨膠帶送入。時間壓縮，非設備節拍。',sources:[{title:'SK hynix · Conventional Package Assembly',url:'https://news.skhynix.com/en/semiconductor-back-end-process-episode-6-conventional-packages/',claim:'晶圓背面 DAF 隨分割及取晶移交。'},{title:'Micron · US7262506B2',url:'https://patents.justia.com/patent/7262506',claim:'錯位堆疊露出下層焊墊的結構原理。'},{title:'Henkel · Laminate Packaging Die Attach Films',url:'https://dm.henkel-dam.com/is/content/henkel/product_table_Henkel_Solutions_for_Laminate_Packaging_Die_Attach_Filmspdf',claim:'ATB 100 與 F100E 等爐固化膠膜路線；依產品決定固化安排。'}]};
export const stages=[
{start:0,key:1,title:'晶粒、DAF 與切割膠帶',explain:'晶粒已分割，背面 DAF 與晶粒同尺寸。下方連續切割膠帶留在框架，支撐待取晶粒。',detail:'焊墊朝上。紫色是非導電 DAF，淡藍色是切割膠帶。'},
{start:2,key:4,title:'第一層帶膜拾取與貼合',explain:'頂升支撐配合取放頭，將晶粒與背面薄膜帶離膠帶，再放到基板。',detail:'DAF 留在晶粒背面；切割膠帶不進入堆疊。'},
{start:9,key:13,title:'追蹤第二層與 DAF',explain:'② 晶粒移到第一層上方，向右錯開，留下第一層左邊焊墊。',detail:'每顆晶粒有自己的 DAF。大部分面積重疊支撐，薄膜不當懸空硬柱。'},
{start:16,key:20,title:'第三層同向錯位',explain:'第三顆向相同方向錯開，第二層左邊焊墊也保持可接近。',detail:'皆正面向上；此時只有機械黏接，沒有電性互連。'},
{start:23,key:25,title:'疊層完成，進行爐固化',explain:'代表性爐固化型膠膜在疊層貼合後依指定熱歷程固化。',detail:'爐中基板有承托。不同產品的固化安排不一定相同。'},
{start:26,key:27,title:'三層焊墊保持外露',explain:'逐層檢查外露焊墊與層間 DAF，供後續打線使用。',detail:'金色只表示焊墊，沒有金線就不表示已互連。'},
{start:29,key:30,title:'成品退場，新材料進場',explain:'完整疊層與基板一起離開，框架與剩餘膠帶另行移出。新框架與基板進場。',detail:'下一輪是新材料，固化成品沒有倒拆回原料。'}];
export const clamp=x=>Math.max(0,Math.min(1,x));export const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
export function stateAt(t){const index=Math.max(0,stages.findLastIndex(s=>t>=s.start));return {t,index,title:stages[index].title,cured:t>=26,exit:ease((t-29)/1.3),enter:ease((t-30.5)/1.5),chips:[0,1,2].map(i=>({i,p:clamp((t-(2+i*7))/6),feed:i===0?1:ease((t-(i*7))/1.5)}))};}

