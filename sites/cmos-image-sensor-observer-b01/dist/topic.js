export const topic={title:'CMOS 影像感測器：光怎麼變成像素數值？',shortTitle:'CMOS 感光像素 · 從光到數字',sceneLabel:'4T 釘扎光二極體像素：PPD、TX、FD、RST、SF、SEL 與像素外的欄 CDS、ADC。',duration:34,overview:14.8,stages:[
{start:0,key:1.5,title:'準備像素，開始新曝光',what:'TX 與 RST 開啟，讓感光與讀出節點回到準備狀態；接著關閉轉移閘。',detail:'追蹤同一個灰階像素。PPD 是釘扎光二極體，TX、RST、SF、SEL 才是四顆電晶體。'},
{start:3,key:8,title:'同樣光強，逐漸累積',what:'光子在矽內被吸收，產生可收集的電子。TX 關閉時，電子累積在 PPD。',detail:'這一段光子抵達頻率固定；從早期到後期可看到較長曝光收集較多電荷。圖上的粒子數只作示意。'},
{start:12,key:13,title:'重設讀出節點',what:'曝光結束。RST 先重設 FD，但 TX 仍關閉，因此 PPD 保有曝光累積的電荷。',detail:'不是每次「重設」都會清空感光區。此時被重設的是 FD 讀出節點。'},
{start:14,key:15,title:'先取得參考電壓',what:'RST 關閉、SEL 開啟，先經 SF 讀取 FD 的重設電壓 V參考。PPD 電荷仍留在原處。',detail:'SF 的絕緣閘極感知 FD 電壓，欄電路保存一次電壓取樣；沒有電子穿過 SF 閘極進入欄電路。'},
{start:16,key:17.5,title:'開啟 TX，轉移電荷',what:'TX 脈衝將 PPD 中的訊號電子移往 FD。PPD 電子減少，FD 電子增加，FD 電壓隨之下降。',detail:'藍點保留身分沿同一路徑移動；這是轉移，不是把電子複製到兩處。'},
{start:19,key:20.5,title:'再取得訊號電壓',what:'TX 關閉，讀出較低的 V訊號。欄電路分別保存參考和訊號兩次取樣。',detail:'示例採歸一化電壓：參考 1.0、訊號 0.4；不是特定感測器的實際伏特值。'},
{start:21,key:22.5,title:'相關雙取樣：取差值',what:'欄 CDS 使用 V參考 − V訊號，得到 0.6 的有效訊號示意。',detail:'更多曝光電子對應較低 FD 電壓，卻可形成較大的取樣差值。真實相關雙取樣可抑制部分重設雜訊，但不能消除所有雜訊。'},
{start:24,key:25,title:'欄 ADC 轉成灰階數值',what:'位於像素外的欄 ADC 將差值量化；本示例用 8 位元線性刻度，0.6 對應灰階 153。',detail:'灰階數字是資訊副本，沿資料箭頭送往後端；不是將光子或原來的電子直接搬進數字。'},
{start:27,key:28.5,title:'讀出後重設，送出資料',what:'本次資料送往後端。TX、RST 開啟，把像素準備好，取樣器隨後清除舊資料。',detail:'電子經重設路徑離開讀出節點；已送出的數值不會被吸回像素。下一輪使用新的入射光。'},
{start:30,key:32,title:'同一像素，等待下一輪',what:'像素已準備完成，下一輪由新的光子開始。材料與四顆電晶體全程保留。',detail:'只追蹤一個像素與必要欄電路，沒有模擬整台相機的掃描排程。'}],notes:[
'採 4T PPD 灰階像素與欄 CDS／ADC 示例。電路圖為功能接法，非按實際晶片版圖或層厚比例。光生電子的對應電洞流向基板端，圖上省略這個快速收集路徑。',
'金色波線是光子；藍點是訊號電子；綠線表示開啟的電荷路徑；灰紫色訊號線與數值代表電壓／資料。SF 閘極保留絕緣間隙。',
'歸一化電壓、8 位元與 153 是便於觀看的固定示例。量子效率、暗電流、雜訊、飽和、轉移殘留與顏色濾光片均未定量模擬；沒有聲稱每個光子都變成一個成功收集的電子。',
'先參考取樣、後 TX 轉移、再訊號取樣。曝光時長與取樣時序被放慢，圖上粒子數不代表滿井容量。'],sources:[
{title:'Hamamatsu Photonics · Advances in CMOS image sensors',url:'https://hub.hamamatsu.com/us/en/technical-notes/image-sensors/advances-in-cmos-image-sensors.html',supports:'PPD、FD 重設、參考取樣、TX 轉移、訊號取樣與 CDS 的時序，以及片上／欄 ADC 架構。'}]};
