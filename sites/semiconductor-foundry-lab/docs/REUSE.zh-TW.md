# 沿用與新增模組

來源為 Hex Terrain Combat Lab v0.4、Sites v38，提交 `edd19a5426da16b766de618faf48bd4b65208b32`。直接取得來源倉庫，沒有改寫原站。原始模組檔案雜湊見 `BASELINE.json`，一旦接手完成，不應再次執行 `scripts/adopt-source.mjs` 覆寫已經演進的共用底層。

| 原始模組 | 新位置 | 沿用與必要整理 |
| --- | --- | --- |
| hex.js | dist/core/hex.js | 直接沿用軸座標、六鄰接、格距、可配置 radius、可見格子列舉與反向座標，只改註解語意。 |
| config.js | dist/core/config.js | 保留 32px 六角格、217 格預設尺度、原配色、淡線對比、地形高度、300ms 換格間隔、140ms 呈現、120Hz 固定更新與 100ms 單幀上限；移除戰鬥數值。 |
| movement.js | dist/core/movement.js | 保留立即換格與 moveSerial、計時器、moveBySteps 及高度位置計算；將第二角色及血量／裝填判定改為實體佔格回呼。新增 BFS 尋路。 |
| presentation.js | dist/core/presentation.js | 保留 cubic ease-out 的 140ms 顯示過渡、暫停、減少動態、跳遠定位與重置；二人迴圈改為任意 actors 集合，完全移除血量、彈藥、攻擊姿態與戰鬥視野讀取。 |
| rendering.js | dist/core/terrain-renderer.js | 從原始碼抽出 resize、hex、terrainSides、tile、drawTerrain、circle、traceBoard、boardBackdrop、cameraUpdate 等實作，保留高低地側牆、陰影、原點平移與向量 Path2D 快取。 |
| input.js / intent-input.js | dist/core/input.js | 保留實際按下才觸發、排除重複鍵／IME／表單焦點／快捷鍵、最新一個方向緩衝、失焦清除與可序列意圖；移除施工組合、裝填、守衛與攻擊。 |
| main.js 的 frame | dist/core/runtime.js | 抽出原有固定時間累加流程、requestAnimationFrame、暫停與生命週期；每個世界只推進一次。 |
| fullscreen.js | dist/core/fullscreen.js | 原實作直接沿用，畫布與 HUD 一起全螢幕，失敗時顯示可讀訊息。 |

`dist/game/renderer.js` 新增設備、角色、物流線、工作與攜帶量圖形，依 shape 資料繪製；既有地形仍由共用 renderer 處理。平移／縮放／點選反查是新增能力，不宣稱來源本來具備。

`dist/game/` 的庫存、加工、品質規則、供電、建設、物流預約、工人讓路、訂單與版本化存檔都是新增工廠規則。`dist/content/samples/foundry.js` 是可整批替換的示例資料。`dist/main.js` 只負責介面與意圖接線。

新站未帶入 pulse、ammunition、computer、dummy、wards、戰鬥迷霧、傷害、聯機房間、Worker、資料庫或來源站部署設定。工人使用獨立物流排程，不沿用追擊 AI。舊遊戲的房間及存檔都不讀取。
