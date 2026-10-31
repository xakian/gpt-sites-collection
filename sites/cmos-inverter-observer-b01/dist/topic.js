export const topic={title:'CMOS 反相器：兩顆電晶體如何把 0 變成 1？',shortTitle:'CMOS 反相器 · 互補與充放電',sceneLabel:'上方 PMOS 接 VDD、下方 NMOS 接地；共同閘極 IN，兩個汲極共接 OUT 與負載電容。',duration:24,overview:4,stages:[
{start:0,key:3,title:'輸入 0，輸出 1',what:'PMOS 導通，把輸出拉到電源電位；NMOS 關閉。輸出電容已充電，OUT 維持高電位。',detail:'穩態的高亮線表示可導通路徑，不表示一直有大量電流。IN 同時連到兩顆元件的閘極。'},
{start:6,key:8.4,title:'輸入升高，輸出放電',what:'輸入由低升高。PMOS 逐漸關閉、NMOS 開啟，負載電容的電荷經下拉路徑釋放到接地端。',detail:'OUT 比 IN 晚改變；這個有限延遲是觀看安排，不是特定製程的實測時間。切換途中兩元件可能短暫同時導通。'},
{start:10,key:13,title:'輸入 1，輸出 0',what:'NMOS 維持導通，OUT 接近地電位；PMOS 關閉，隔開電源上拉路徑。',detail:'負載電容已放電。數位 0／1 在此對應低／高電壓，並非兩種不同材料或粒子。'},
{start:16,key:18.3,title:'輸入回低，電源充電',what:'輸入降低，PMOS 再次開啟。能量由 VDD 提供，輸出電容逐漸充電到高電位。',detail:'箭頭表示傳統電流。電容兩極板的正負電荷分離增加；電荷不會穿過絕緣介質。'},
{start:20,key:22,title:'回到高輸出穩態',what:'輸出再次穩定為 1，同一對元件等待下一次輸入切換。',detail:'循環只切換輸入，元件與接線不替換。實際 CMOS 有漏電，也消耗切換能量。'}],notes:[
'採一級靜態 CMOS 與集中負載電容；PMOS 的源極／體端接 VDD，NMOS 的源極／體端接地。圖省略體端線、寄生與閘極驅動電路。',
'導通判斷與充放電曲線均為定性示意。電壓以 VDD 為單位，不指定真實 VDD；24 秒播放週期不等於電路速度。',
'切換時的短路電流、輸入電容、次臨界漏電與動態功率未做定量計算。不能由穩態沒有移動箭頭推論真實電路完全不耗電。'],sources:[
{title:'Texas Instruments · Advanced CMOS Logic Designer’s Handbook',url:'https://www.ti.com/lit/an/sdya018/sdya018.pdf',supports:'CMOS 互補導通、邏輯反相與靜態／切換功耗；PDF 第 269–270、649 頁。'},
{title:'Toshiba · Connecting a Load Capacitance to a CMOS Output Pin',url:'https://toshiba.semicon-storage.com/ap-en/semiconductor/knowledge/e-learning/cmos-logic-usage-considerations/usage-4.html',supports:'負載電容充放電與傳播延遲。'},
{title:'Toshiba · Operating Supply Current and Power Dissipation',url:'https://toshiba.semicon-storage.com/us/semiconductor/knowledge/e-learning/cmos-logic-usage-considerations/usage-5.html',supports:'靜態與動態功耗分類。'}]};
