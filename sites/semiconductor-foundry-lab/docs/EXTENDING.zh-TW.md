# 後續內容與規則擴充

目前發行的是明確標記的示例。取得正式遊戲內容 Word 後，先逐項整理物料、設備、流程、品質、目標、解鎖與知識，再新增正式內容模組，於 `dist/content/index.js` 切換來源；保留 samples 作為底層回歸用例。

| 想新增或修改的內容 | 主要檔案與欄位 |
| --- | --- |
| 物料、名稱、辨識顏色 | dist/content/samples/foundry.js 的 materials；穩定 id、name、short、color。 |
| 同類設備、容量、價格、佔格與入口 | 同檔 buildings；id、behavior、shape、footprint、entrance、cost、capacity、recipes、power、unlock。相同 behavior 可使用不同 id、名稱、配方與外形；不改 core。 |
| 同類製程、時間、輸入輸出與品質變因 | 同檔 recipes；id、building、inputs、outputs、duration、power、qualityRule、knowledge，選配 fast 的時間／電力倍率、異常間隔、科技與替代輸出。 |
| 工人物料流向 | 同檔 routes；material、from、to。from / to 是設備定義 id；同類新設備需新增對應物流路線資料。 |
| 科技及依賴 | 同檔 technologies；id、requires、delivered、cost、duration、description。解鎖依賴會檢查循環。新類型的科技效果另在 game 中實作，不能只寫說明冒充生效。 |
| 訂單階段、目標與獎勵 | 同檔 orders；id、name、target（累計合格交付量）、reward、description、unlock。若新增非交付量目標，擴充 game/production.js 的完成條件。 |
| 初始地圖、設備、玩家與工人 | 同檔 map；radius、player、workers、buildings、terrain。新角色集合由內容建立；存檔依該內容版本核對數量。 |
| 科學說明 | 同檔 knowledge；id、name、fact、observe、simplification、source、sourceName。必須可指出操作變因與可觀察結果，來源使用可查核原始資料。 |

共用與玩法責任如下：

- `dist/core/`：座標、時間、輸入、碰撞回呼、移動顯示、基礎地形、全螢幕及瀏覽器儲存介面；不讀取晶圓名稱、配方、訂單或品質。
- `dist/game/state.js`：實體集合、設備實例、穩定 id、邏輯位置、可查找狀態與事件。
- `dist/game/inventory.js`：守恆轉移、來源預約及目的地容量。所有手動與工人搬運共用此層。
- `dist/game/production.js`：扣料一次、工作計時、產出一次、供電及交付；新增全新品質機制時修改這裡。
- `dist/game/workers.js`：搬運預約、操作員、路徑重算及入口讓路；新增工種時修改這裡。
- `dist/game/construction.js`：佔格、入口及全基地通路檢查；確認後才扣費。
- `dist/game/rules.js`：createGameState 之外的 stepGame / applyIntent 接線、主要互動及玩法驗證。
- `dist/game/save.js`：SaveEnvelope、匯入驗證及相容性；新增世界欄位時同步檢查與遷移。
- `dist/game/renderer.js` / `dist/main.js`：新形狀或新類型狀態的呈現及介面。既有行為新增同類資料時不需修改 core。

## 最低契約

Entity 具有 `id`、`kind`、`q/r`、`appearance`、`status`。移動角色另有 inventory、capacity、role、taskId、stepTimer、moveSerial；設備實例具有 type、inventory、job、mode、batch。畫面使用動畫位置，庫存及佔格永遠使用 q/r。

Task 具有 id、workerId、source、destination、material、quantity、status。reserved 階段鎖住來源數量，carrying 階段物料存在工人身上，兩階段都預約目的地容量；任務不存在的物料不可再被手動或其他任務領走。

SaveEnvelope 包含 gameId、schemaVersion、contentVersion、simulationTime、world。`semiconductor-foundry-lab:save:v1` 是手動儲存，尾綴 `:auto` 為自動儲存；沒有使用 HexBase 的鍵。匯入在新世界完整通過檢查後才取代目前世界，失敗不寫入舊存檔。載入保持暫停。

內容 id 應維持穩定。更動物料流、角色數量、配方或地圖契約時，提高 content.version 並新增明確遷移；目前不默默讀取其他版本。

## 實作新資料後的檢查

執行 `node scripts/validate.mjs` 檢查重複 id、引用、正數數量、建築欄位與循環科技。執行 `node --test tests/game.test.mjs`，包括新設備使用既有規則實際加工的案例。再在瀏覽器驗證取放、配方、輸入提示、路徑、暫停與讀檔。

目前同類規則包含倉儲、加工、檢測、交付、廠務及搬運／操作分工。新增污染、真實參數模型、多入口設備、多項品質、多批次追蹤、其他交付物或非交付量任務，屬新玩法；應擴充 game 與相關 UI／存檔，而非硬塞進現有欄位或改寫時間迴圈。
