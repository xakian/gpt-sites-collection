export const topic={title:'LED：電流如何在半導體裡變成光？',shortTitle:'紅光 LED · 注入、複合與出射',sceneLabel:'固定 AlGaAs 雙異質結紅光 LED 剖面，上 n 接負、下 p 接正。載子進入活性層，部分能量由光子帶走。',duration:30,overview:11.4,stages:[
{start:0,key:1.5,title:'固定材料，尚未驅動',what:'同一顆紅光 LED 保留上方 n 接點、n 包覆層、活性發光層、p 包覆層、p-GaAs 基板與下方 p 接點。',detail:'採 AlGaAs 雙異質結示例，活性層為 p-Ga₀.₆₅Al₀.₃₅As；代表發光波長約 660 nm。'},
{start:3,key:4.5,title:'施加正向驅動',what:'上方 n 端接負、下方 p 端接正，外部電源提供能量。',detail:'此圖固定元件方向與極性；不以反向擊穿發光，也不模擬實際驅動器。'},
{start:5,key:6.4,title:'載子進入發光區',what:'電子由上方 n 層注入，電洞由下方 p 層注入，抵達同一活性區。',detail:'藍色帶負號的點是電子，空心圈表示電洞，也就是可被電子填入的空態。'},
{start:9,key:11.4,title:'電子填補較低能態',what:'電子移入較低能量的空態，短暫的實心標記表示已填入。部分事件同時放出紅色光子。',detail:'複合不是整顆電子質量消失變成光；釋放的是能量差。活性區內小幅向下移動是能態改變的符號，不代表真實能帶的空間距離。'},
{start:16,key:18,title:'有些光出射，有些能量成為熱',what:'部分紅光子離開材料；部分被困住或吸收。非輻射複合與吸收造成的熱，以橙色波紋表示。',detail:'內部生成光和外部可見光不同。示意事件的數量比例不代表材料的實際量子效率或取光效率。'},
{start:20,key:21,title:'降低驅動，停止新注入',what:'正向驅動降下來，新載子供應停止，先前已注入的載子仍可完成複合。',detail:'光不會瞬間倒退回材料；已生成的光子繼續離開或被吸收。'},
{start:22,key:24,title:'剩餘能量離開',what:'剩餘複合事件結束，光子出射或吸收後，元件回到暗的狀態。',detail:'材料與接點不變形、不換色。複合後的電子回到材料背景所代表的價帶，不當作持續可移動的注入電子追蹤。'},
{start:26,key:28,title:'同一元件，等待再開啟',what:'電源關閉，沒有持續新注入。下一輪對同一顆 LED 再次施加正向驅動。',detail:'循環是驅動的開與關，不是製造新器件或把已出射光子吸回去。'}],notes:[
'沿用 Vishay DH-red 的層序：n-AlGaAs／p-Ga₀.₆₅Al₀.₃₅As 活性層／p-AlGaAs／p-GaAs 基板。包覆層具有不同組成與能隙，不能把所有層都當成相同材料。',
'固定約 660 nm 紅光示例；波長主要由材料能隙決定，不能只調電流就任意切換紅綠藍。幾何、粒子、時間與熱波紋都經放大或放慢。',
'在活性區中，以較高位置的電子與較低位置的空態表達能態轉移；短暫填入後併入背景價帶。外部回路持續補充與移出電子，沒有電子質量湮滅。',
'省略接面能帶彎曲、定量電流、聲子、溫度升高及完整光學反射；保留輻射與非輻射競爭、吸收及取光損失。白光螢光粉、雷射與電路設計不在本題。'],sources:[
{title:'ROHM · LED Devices Application Note',url:'https://fscdn.rohm.com/en/products/databook/applinote/opto/led/led_device_an-e.pdf',supports:'第 1–3 頁：材料能隙、AlGaAs DH 660 nm 示例、內部效率與取光損失。'},
{title:'Vishay · Physics of Optoelectronic Devices',url:'https://www.vishay.com/docs/led_physics.pdf',supports:'第 1、3 頁：直接能隙成分與 DH-red 層序、n／p 接點；不採用歷史產品效率作現況。'},
{title:'Cornell · Semiconductor Optoelectronics, Chapter 7',url:'https://courses.cit.cornell.edu/ece533/Lectures/handout7.pdf',supports:'7.1–7.2：注入、活性區與輻射／非輻射複合。'}]};
