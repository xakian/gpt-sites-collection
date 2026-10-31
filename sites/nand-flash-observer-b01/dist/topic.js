export const topic={title:'NAND 快閃記憶體：把電荷留在浮動閘',shortTitle:'NAND · 寫入、保存與抹除',sceneLabel:'平面浮動閘 SLC NAND：串列中的選定記憶單元放大，顯示絕緣包覆的浮動閘與電子穿隧。',duration:32,overview:11,stages:[
{start:0,key:2,title:'抹除態：低臨界電壓',what:'從抹除態開始，浮動閘沒有額外儲存電子。本圖把這個較低臨界電壓的狀態定義為 1。',detail:'這是平面浮動閘、每格一位元的 SLC 示例；不把 3D 電荷捕捉結構或多位準資料混在同一格。'},
{start:4,key:6.7,title:'頁寫入：電子進入浮動閘',what:'寫入電場使電子經薄穿隧氧化層進入浮動閘。額外負電荷使臨界電壓提高，建立 0。',detail:'穿隧以穿過完整氧化層的移動符號表示；不是鑽洞或金屬接線。周邊依頁操作並選擇要寫入的格。'},
{start:9,key:9.5,title:'停止寫入',what:'寫入電場移除後，浮動閘仍被絕緣材料包圍。',detail:'下方電壓尺是定性比較；實際寫入脈衝與驗證迭代沒有展開。'},
{start:10,key:12,title:'斷電仍保存電荷',what:'外部供電關閉，儲存的額外電子留在浮動閘中，形成非揮發性資料。',detail:'保持不是永遠保證；時間、溫度、氧化層缺陷及寫抹次數都影響可靠度。'},
{start:14,key:17,title:'復電讀取：判讀 0',what:'選定控制閘使用介於兩狀態臨界電壓間的讀取電壓。高臨界電壓的格不導通，串列感測為 0。',detail:'其他字線施加通過電壓，選擇閘開啟。電子改變的是電場與臨界電壓，不是拿顆粒堵住通道。'},
{start:20,key:21,title:'讀出資訊，電荷仍在',what:'感測結果送往外部，浮動閘儲存電荷不因這一次正常讀取而被移走。',detail:'正常讀取是感測通道電流；圖上資料數字不是一顆被運出的電子。省略累積讀取擾動。'},
{start:22,key:24.7,title:'區塊抹除',what:'施加抹除條件，浮動閘電子穿隧回到基板。示意區塊中的多格一起回到低臨界電壓。',detail:'NAND 以區塊抹除，不能把這個動作誤認為只抹除任意單一位元；穿隧層仍然完整。'},
{start:27,key:27.5,title:'抹除完成',what:'額外儲存電子已移除，回到 1 的狀態。',detail:'晶片與材料沒有換掉；循環由真實寫抹操作回到起始資料。'},
{start:28,key:30,title:'再讀取：判讀 1',what:'同一讀取電壓高於抹除態臨界電壓，選定通道可以導通，串列感測為 1。',detail:'圖中藍色移動符號是通道電子；浮動閘保持絕緣。下一輪從此抹除態重新寫入。'}],notes:[
'採平面浮動閘 SLC，抹除＝1、寫入＝0 的固定編碼。實際 NAND 還有電荷捕捉、3D 與多位準結構；本圖不代表所有產品。',
'上方是同一區塊的縮小示意，框出的格放大在下方。周邊驅動、選擇閘和感測器以功能文字表示；不是完整記憶陣列接線圖。',
'穿隧事件、電子數、電壓與時間皆為定性示意，不提供操作電壓。電子穿過絕緣障壁不等於破壞氧化層；長期寫抹仍可能劣化。',
'浮動閘與控制閘由介電層隔離，浮動閘與矽由穿隧氧化層隔離。為辨讀而放大層厚與粒子。'],sources:[
{title:'KIOXIA · NAND Flash Memory',url:'https://www.kioxia.com/en-jp/rd/technology/nand-flash.html',supports:'浮動閘、臨界電壓與 NAND 儲存結構。'},
{title:'KIOXIA · Reliability Handbook（2025）',url:'https://www.kioxia.com/content/dam/kioxia/en-jp/about/asset/reliability-handbook-e.pdf',supports:'第 62–63 頁，穿隧氧化層、Fowler–Nordheim 穿隧與可靠度。'},
{title:'Altera · AN 500 NAND Flash commands',url:'https://docs.altera.com/r/docs/683829/current/an-500-nand-flash-memory-interface-with-altera-max-series/amd-and-samsung-nand-flash-devices-commands?contentId=JNhnt6aMSdYjo4DS2BeE5g',supports:'頁寫入與區塊抹除的操作單位。'},
{title:'Micron · US7619931B2',url:'https://patents.google.com/patent/US7619931B2/en',supports:'背景與圖 3、6–7 的串列、選擇閘及未選字線通過電壓；不將特定驗證方法視為所有 NAND 通則。'}]};
