import {ramp,ease} from './view.js';
export const state=t=>({placeA:ease(ramp(t,3,7)),bondA:ramp(t,7,8),liftA:ease(ramp(t,8,9)),placeB:ease(ramp(t,8,12)),bondB:ramp(t,12,15),liftB:ease(ramp(t,15,17)),bridge:ramp(t,18,23),external:ramp(t,23,25),exit:ease(ramp(t,26,28)),incoming:ease(ramp(t,28,30))});
export const topic={title:'封裝內嵌矽橋互連',question:'兩顆晶粒，如何只靠邊緣下方的小矽橋連起來？',duration:30,overview:25,intro:'採傳統無 TSV 的 EMIB 類局部矽橋架構。橋與有機載板配線已完成；追蹤兩顆晶粒依序放置接合，最後沿真正的金屬接點看跨橋路徑。',simplifications:'教學剖視放大接點，使用局部透明載板看見橋與線路。不是特定量產產品的尺寸或製程配方；接合採公開 Intel 專利所述焊料凸塊熱壓接合的概念流程，省略凸塊製造與底填。矽橋本體承載表面金屬配線，不將整塊矽畫成導體。此傳統模型不含穿矽向下的 TSV，與新版 EMIB-T 分開。綠線為跨晶粒的實體連通性，藍線為一般載板外部路徑，均不模擬晶片邏輯或所有電源訊號。',sources:[{title:'Intel · EMIB Technology Brief',url:'https://www.intel.com/content/dam/www/central-libraries/us/en/documents/2025-07/emib-product-brief.pdf',claim:'小矽橋嵌在載板中，橋接區採細間距，其他區域較寬；EMIB-T新增TSV為另一變體。'},{title:'Intel · US8901748B2',url:'https://patents.google.com/patent/US8901748B2/en',claim:'內嵌橋上金屬互連；外部供電／連接可經一般載板，傳統橋不需要外部連接用的TSV。'},{title:'Intel · US20170018525A1',url:'https://patents.google.com/patent/US20170018525A1/en',claim:'圖4–6與正文支持以焊料凸塊加熱潤濕、熱壓接合的代表組裝方案。'}],steps:[
{start:0,key:2,title:'局部矽橋與載板',what:'小矽橋位於兩顆晶粒將來相鄰邊緣的下方；橋上細線與載板外部配線預先完成。',detail:'橋只服務局部密集互連，沒有鋪滿整個封裝；矽基體下方沒有TSV。'},
{start:3,key:7.8,title:'晶粒 A 放置接合',what:'取放工具把晶粒A降到對應接點，接著加熱與壓合概括完成焊料接合。',detail:'內側細接點接到橋上金屬；外側較寬接點接到一般載板。下方持續承托。'},
{start:8,key:14.8,title:'晶粒 B 放置接合',what:'第二顆晶粒對準並下降，保留第一顆已接合晶粒與全部接點。',detail:'第二顆內側細接點與橋另一端對應，不是接到裸矽任意位置。'},
{start:15,key:17.8,title:'工具退出',what:'焊料接點保留在界面，取放／加壓工具向上退出。',detail:'工具離開後晶粒不浮起；本例略去後續底填細節，不表示實際產品不需要底填。'},
{start:18,key:22.8,title:'沿橋上金屬互連',what:'依序沿A細接點、橋上金屬配線、B細接點高亮。',detail:'路徑沒有穿過矽橋底部，綠色不代表整塊矽導通，也不代表播放邏輯運算。'},
{start:23,key:25,title:'一般載板外部連接',what:'另一組較寬接點經有機載板內金屬路徑向下連接。',detail:'跨橋與外部連接分工；不是所有訊號或電源都必須經過小矽橋。'},
{start:26,key:27,title:'完成件退場',what:'兩顆已接合晶粒隨載板離開，新載板與新晶粒接續進場。',detail:'已形成的接點不倒退拆開。'}]};
