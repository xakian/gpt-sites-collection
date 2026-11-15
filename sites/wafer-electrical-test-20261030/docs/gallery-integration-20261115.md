# 動畫總覽嵌入（2026-11-15）

使用者授權將本站接入主站 `/learn/gallery/` 的 122 題總覽。正式網址、Vercel 專案、Root Directory、Standard Protection 與 GitHub 可見性沿用實際既有設定。本站仍獨立部署，不複製到主站；原科學模型、40 秒時序與雙模式播放器不變。

`dist/index.html` 新增 `gallery-embed.js` 模組。只有 iframe、題目 `gallery=wafer-test` 及明確允許的 `parent` 來源同時符合，才載入總覽樣式並接收控制。正式父來源只允許 `https://xakian.com`、`https://www.xakian.com`；開發時僅允許同一 loopback hostname 的本機父頁。單獨開啟原網址時接法不啟用。

父頁透過 `postMessage` 傳入播放、暫停、重播、模式與畫面內狀態；接收端核對 `event.source`、完整 origin、題目、方法與參數。動畫回報時間／模式快照，使父頁可卸載並恢復。畫面外時鐘停止；啟用中的快照回報上限每秒十次。來源與控制驗證在 `gallery-protocol.mjs`，測試為 `tests/gallery-protocol.test.mjs`。

下載來源 `dist/source-project.zip` 同步包含本次接法、文件及測試，不含憑證、Git 內部資料或站點身分檔。執行 `node --test tests/*.test.mjs` 及倉庫既有忽略建置測試；發布時只更新本站，另外 9 個專案沿上次成功部署 SHA 判斷並驗證跳過。

正式驗收證據另存科學觀察動畫專案 `records/learning-gallery-release-20261115/`；不為驗收紀錄單獨再次部署。
