# 晶圓探針測試：科學來源、簡化與判讀限制

核對日期：2026-10-31。共用規格 v1.0；共用程式範本 1.0.0；主題版本 1.0.0。

## 本片集中回答的問題

晶圓還沒切開之前，怎麼知道哪些晶粒通過測試？

探針在晶粒表面的金屬接點建立暫時電接觸。自動測試設備（ATE）施加測試條件與訊號、取得反應，依測試規則判定，再把結果與同一片晶圓上的晶粒位置連在一起。晶圓圖呈現這些位置紀錄；這個過程不需要先切割晶圓。[S1–S5]

## 一手來源與支持範圍

| 編號 | 原始來源 | 支持的主張 | 使用界線 |
| --- | --- | --- | --- |
| S1 | Japan Electronic Materials，Products for Semiconductor Test | 晶圓尚未切割即可做 wafer test；探針接觸 bonding pads；tester 經探針卡收發訊號；測試有 DC、AC 與功能類型。 | 不沿用頁面中「first process」的寬泛敘述，亦不宣稱每種晶片具有相同測試項目。 |
| S2 | FormFactor 原始專利，Composite Motion Probing，US20070170941A1，公開日 2007-07-26 | FIG.1–2 的典型機構：chuck 先 XY 對準，再 Z 上升使端點接觸探針；測試與回應經探針卡傳遞。Overtravel 可使探針彈性壓縮，某些形式伴隨微量 scrub；同次接觸可對應一或多顆晶粒。 | 這是歷史一手資料，使用其中對基本機構的說明；不當作目前所有機台規格或接觸技術都相同的證據。 |
| S3 | FormFactor，Velox Probe Station Control Software，AUTOALIGN | X、Y、θ 對準；辨識晶圓直徑與晶粒尺寸；生成對應晶粒索引及兩軸晶粒數的 wafer map。 | 本片自定座標方向與原點；不可據此宣稱存在跨所有設備的統一晶粒索引慣例。 |
| S4 | NI，Managing Wafer Yield Across Semiconductor Fabrication | 將參數資料與規格門檻比較，據以分入產品或報廢類別（bin）；實際產品類別可超過二分。 | 動畫的相對輸出與限值是自建示例，不是 NI 提供的量測資料或工業限值。 |
| S5 | NI，Reducing Quality Escapes in Semiconductor Manufacturing | 晶圓圖呈現失敗位置；晶粒追溯資料包含 pass/fail、參數、wafer/lot ID；有誤剔除和錯誤放行的可能，也有重測等處置。 | 未通過不能單憑動畫指定為某一物理缺陷。接觸／量測異常診斷與重測未在本片展開。 |
| S6 | Teradyne，Test Strategies in the Era of Heterogeneous Integration，2023-09-05 | 測試覆蓋率依階段規劃；可把項目安排在 wafer、final 或 system level test；增加覆蓋率用以降低 defect escapes，並需評估時間與成本。 | 通過本次 wafer test 不代表零缺陷或全面可靠度保證；文章脈絡是異質整合，本文只援引測試覆蓋與分工原則。 |

### 可開啟網址

1. [S1：JEM — Products for Semiconductor Test](https://www.jem-net.co.jp/en/products/handotai)，見「What is Probe Card?」「Overview of Wafer Test」與三種測試條目。
2. [S2：FormFactor — Composite Motion Probing，US20070170941A1](https://patents.google.com/patent/US20070170941A1/en)，見 Description 的 FIG.1、FIG.2A–2C、FIG.12 說明。
3. [S3：FormFactor — Velox](https://www.formfactor.com/product/probe-systems/software/velox/)，見 AUTOALIGN、VUETRACK 與 REALIGN。
4. [S4：NI — Managing Wafer Yield Across Semiconductor Fabrication](https://www.ni.com/en/solutions/semiconductor/enterprise-data-management-analytics/managing-wafer-yield-semiconductor-fabrication.html)，見 Creating Specification Thresholds、Collecting Test Results。
5. [S5：NI — Reducing Quality Escapes in Semiconductor Manufacturing](https://www.ni.com/en/solutions/semiconductor/enterprise-data-management-analytics/reducing-quality-escapes-manufacturing.html)，見 Wafer Maps、Die Genealogy Data、retest or scrap。
6. [S6：Teradyne — Test Strategies in the Era of Heterogeneous Integration](https://www.teradyne.com/2023/09/05/test-strategies-in-the-era-of-heterogeneous-integration/)，見 Shift Left or Shift Right 與 defect escape rate。

所有來源均於上述核對日期透過網路實際開啟閱讀。來源的頁面文字、網址和產品內容日後可能更新；本清單記錄本版所採用的證據，不表示使用了原廠設備資料或獲得原廠認證。

## 觀察安排與追蹤物件

- 主要物件是同一片未切割晶圓、晶粒與其金屬接點、探針卡／探針、晶圓工作台、自動測試設備，以及數位晶圓圖。
- 俯視畫面採晶圓的參考座標，晶圓保持固定；接觸放大畫面呈現工作台 XY 定位及 Z 升降。這是視角選擇，不能解讀為設備中晶圓完全不動。
- 第一次與第二次接觸慢速呈現「對準 → 接觸 → 測試 → 判定 → 依座標登記 → 分離」。其餘晶粒加快重複，最後保留完整圖供對照。
- 同一晶粒在俯視圖、接觸放大圖與晶圓圖中維持相同位置索引。結果色與 ✓／× 屬於數位紀錄，未測狀態與未通過分開。
- 相鄰晶粒之間的切割道不是已切開的縫。晶粒不會在測試完成後自行離開晶圓。
- 每次移往下一位置前先分離探針。不得把仍接觸表面的探針橫向拖過多顆晶粒。
- 測試路徑只是電性介面的視覺提示；資料登記不表示搬運晶粒。

## 本版自行選定的簡化

| 項目 | 本版安排 | 限制與理由 |
| --- | --- | --- |
| 時間 | 完整一輪 54 秒；前兩顆慢看，後 35 顆加快。 | 觀看節奏，不是真實設備產能、測試時間或電訊號傳播速度。 |
| 晶粒 | 37 顆；7 列長度為 3、5、7、7、7、5、3。 | 為看清位置關係而減少晶粒數；不是實際晶圓尺寸、die size 或產出分布。 |
| 探針 | 4 支示例。 | 省略多數接點、探針卡層次及接線；實際數量和排列依產品而異。 |
| 幾何 | 放大接點、探針、間隙與升降。 | 不同比例的觀察圖，不能從畫面推得長度、針距、深度、力量或接觸電阻。 |
| 示意測試 | 無因次「相對輸出」；允許區間 0.90–1.10；第一顆 0.96、第二顆 1.28。 | 全為作者自建的示意值，不是產線資料、產品規格或特定器件模型。兩個例子用來顯示限值比較。 |
| 結果類別 | 未測、測試中、通過、未通過。 | 不展開多級產品 bins、測試異常、修復、重測或其他 disposition。 |
| 座標 | X 向右，Y 向下，中心索引 (0,0)。 | 晶粒格點索引，不是毫米；原點、方向是本片慣例。 |
| 測試並行 | 畫成單顆逐測。 | 真實設備可多顆平行接觸與測試。 |
| 儀器細節 | 省略外殼、多數線路、校正、溫控、清潔、接觸品質診斷。 | 保留觀眾需要看清的接觸、測試與位置紀錄關係；不作設備操作教學。 |
| 接觸細節 | 可見接觸與分離，不計算力學。 | 不模擬 overtravel、scrub、氧化層或接觸電阻；探針不應被理解為刺穿晶粒。 |
| 循環 | 明確遮罩表示重新觀看同一片晶圓的示意。 | 不是製程倒轉，不是每 54 秒自動清除正式測試紀錄，也不是下一片實物被無故替換。 |

## 判讀限制

1. 「通過」表示在已執行的項目、條件與限值下符合要求。測試覆蓋率有限，不能保證所有功能與未來可靠度。[S4、S6]
2. 「未通過」是測試判定；本片沒有證據用以區別電路缺陷、接觸異常或量測問題，因此不替某個示例指定具體故障根因。[S5]
3. 晶圓圖的顏色、符號、方向與結果分布是本片的視覺選擇；不能當成產業統一色碼或真實良率。[S3–S5]
4. 保留晶圓／晶粒識別是將結果對回實物的基礎。本片只顯示簡化的位置索引，沒有實作工廠追溯系統、資料檔案標準或下游挑晶設備。[S3、S5]
5. 封裝後或系統層級可能仍有測試。本片截止在晶圓上的測試紀錄，不涵蓋切割、封裝、最終測試及出貨判定。[S6]

## 科學可觀察驗收要點

- 可看到對準、接觸、測試、判定及登記的先後關係。
- 物理晶圓與數位晶圓圖能以同一座標對上。
- 探針未接觸時不呈現正在進行電性量測；變換晶粒前已分離。
- 量測值在允許區間內與外的兩例可分辨，並清楚標為示意。
- 未測狀態不被誤讀成未通過，結果不只靠色彩區分。
- 測完的晶粒依然留在同一片完整晶圓上。
- 循環以重新觀看的遮罩交代，不逆轉測試、移交或切割。

本檔列出內容依據與驗收目標，並不自行證明動畫播放、互動、裝置或部署測試已通過；實際結果由站點驗收紀錄另行記錄。
