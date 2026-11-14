# 晶圓電性測試

2026-11-14 雙模式更新。依原版本 1.0.0 的科學模型，保留 40 秒、兩顆晶粒、兩類測項與位置紀錄，新增同頁示意／流程切換。兩模式沿用同一播放狀態與量測資料；詳見 `docs/dual-mode-release-20261114.md`。

## 啟動

無前端依賴、無建置步驟。使用 Python 3：

```sh
python3 -m http.server 4173 --directory dist
```

瀏覽 http://localhost:4173。請使用 HTTP 伺服器，不直接以 file:// 開啟 ES modules。

或使用 `npm start`。`package-lock.json` 為無依賴的鎖定檔，無須 npm install。

## 檢查

Node.js 20+：`npm test`。六組測試涵蓋揭示門檻、4001 個時間點的接觸與供電不變條件、判定邊界、重設，以及以模擬宿主事件檢查播放器生命週期。

開啟 `/qa.html` 可在真實瀏覽器中以固定 1440×900／390×844 iframe 進行畫面檢查、互動檢查與 2× 十輪檢查。這個開發頁不在主畫面顯示。執行時請保留分頁在前景；背景凍結會自然延長所需時間。

`docs/acceptance.md` 記錄實際已完成與未完成驗收，不將模擬時間或靜態程式檢查寫成實際觀看。

## 實作分工

- `dist/config.mjs`：固定案例、輸出觀測窗口、電流限值、階段與定位點。
- `dist/model.mjs`：`sampleTopic(t, config)` 為純函式；任意定位不依賴播放歷史。`currentPass` 區分 null 與數字 0。
- `dist/player.mjs`：單一 requestAnimationFrame、播放意圖、速度、背景凍結、減少動態偏好；`seek / play / pause / replay / setSpeed / destroy`。
- `dist/app.mjs`：只依主題狀態更新 SVG／HTML；說明、焦點與原生控制。
- `dist/index.html`、`dist/style.css`：原創 SVG 接觸示意、兩行功能表、共用 0–20 μA 電流尺、九格結果圖與響應式版面。

所有教學數據與限值均為預設案例，不是實測或電路求解。未證明使用者學習成效。

## 延續工作

依 2026-10-30 後續決定，本 GitHub 倉庫是維護來源。正式站保留 https://xakian-wafer-electrical-test.vercel.app/ ，Vercel Root Directory 為 `sites/wafer-electrical-test-20261030`，提供已提交的 `dist/`；不再由 GPT Sites 匯入或回傳。

下載專案是可執行來源快照，不含憑證、Git 內部資料或站點身分檔。維護本站時以 GitHub 最新提交為準，沿既有 PR → main → Vercel 流程更新原專案。

`docs/acceptance.md` 保留初版驗收紀錄的原本意義，後續雙模式驗收另列新紀錄。播放器與純狀態取樣方式可重用，SVG 幾何和時序資料則屬此主題。
