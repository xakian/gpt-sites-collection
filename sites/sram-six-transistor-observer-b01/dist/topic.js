export const topic={title:'SRAM：六顆電晶體怎麼記住一個位元？',shortTitle:'6T SRAM · 回授、寫入與讀取',sceneLabel:'兩組互相回授的 CMOS 反相器，與兩個由 WL 控制的存取 NMOS。Q、Q̄ 為互補節點，BL、BL̄ 為位線。',duration:32,overview:10,stages:[
{start:0,key:1.5,title:'持續供電，保持 Q＝0',what:'P1、N1 與 P2、N2 組成兩個互相回授的反相器。Q=0、Q̄=1，是其中一個穩定狀態。',detail:'A1、A2 是另外兩顆存取 NMOS，總計六顆。WL 關閉時，內部儲存節點與外部位線隔離。'},
{start:3,key:4.3,title:'先準備互補位線',what:'周邊寫入驅動器將 BL 拉高、BL̄ 拉低；字線仍關閉。',detail:'先準備資料再開啟存取，避免把預充狀態誤當作寫入資料。'},
{start:5,key:6,title:'字線開啟，寫入 1',what:'WL 拉高，A1 與 A2 導通。外部驅動克服原狀態，Q 升高、Q̄ 降低，翻轉為另一個穩定狀態。',detail:'過渡電壓以漸變顯示，邏輯標記在過渡時顯示箭頭；實際寫入裕量與器件尺寸未定量模擬。'},
{start:7,key:10,title:'字線關閉，回授保持',what:'A1、A2 關閉；Q=1、Q̄=0。內部兩反相器互相維持狀態。',detail:'這不是一批電子無限繞圈，也不是 DRAM 的定期刷新；必須持續供電。'},
{start:12,key:14.5,title:'讀取前，兩位線預充',what:'WL 維持低，周邊把 BL 與 BL̄ 都預充到高電位。',detail:'正常讀取先讓兩條位線一樣高；寫入驅動器關閉，避免外部強制改寫儲存節點。'},
{start:15,key:17,title:'讀取微小位線差異',what:'停止預充後開啟 WL。Q̄=0 的一側使 BL̄ 經 A2、N2 略為放電；感測器判讀為 Q=1。',detail:'正常設計下儲存節點保持原資料。黃色條的微小差異只是放大的示意，不代表實際感測電壓。'},
{start:18,key:21,title:'關閉存取，讀後仍是 1',what:'WL 回低，讀取結束。Q 仍為 1，資料沒有因為被讀出而消失。',detail:'周邊保留的是判讀得到的資訊；不是把儲存節點的電子抽走當作資料。'},
{start:23,key:24.3,title:'準備相反的資料',what:'BL 拉低、BL̄ 拉高，準備把 Q 寫回 0；此時 WL 仍低。',detail:'讀取和寫入使用不同的位線控制條件。'},
{start:25,key:26,title:'再次開字線，改寫 0',what:'WL 脈衝使 Q 下降、Q̄ 上升；兩個節點重新翻轉。',detail:'循環回到起點前，必須有這次明確寫入；不能在接縫直接更換資料。'},
{start:27,key:30,title:'保持 0，完成一輪',what:'字線關閉，兩反相器在持續供電下保持 Q=0。',detail:'電源、六顆元件及接線全程保留，下一輪重新準備寫入 1。'}],notes:[
'採標準單一 6T SRAM。P 為 PMOS，N 與 A 為 NMOS；六顆 cell 元件外的預充、寫入驅動與感測器只以文字功能區表示。',
'圖中只有實心圓點是接點；帶留白的跨線不相接。Q 接右邊閘極，Q̄ 接左邊閘極。體端接法省略。',
'供電移除後不保證保存。實際讀取可能擾動低節點，須靠器件尺寸與穩定裕量避免翻轉；本圖只示正常工作，未計算電路雜訊或讀寫裕量。',
'色條表示電壓，綠線表示導通路徑。保持狀態不畫永動電流；省略實際漏電與位線電容分布。時間、電壓差與比例只供觀看。'],sources:[
{title:'Universität Hamburg · CMOS 6 transistor SRAM cell',url:'https://tams-www.informatik.uni-hamburg.de/applets/sram/index.html',supports:'兩個交叉耦合反相器、兩顆存取 NMOS 與寫入條件；沒有執行舊 Java applet。'},
{title:'MIT 6.823 · Memory Hierarchy',url:'https://csg.csail.mit.edu/6.823S15/lectures/L06.pdf',supports:'PDF 第 6 頁的 6T 接法、互補位線寫入、預充差動讀取、正常非破壞讀取與不需刷新。'}]};
