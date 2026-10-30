# 晶圓電性測試

版本 1.0.0。依 docs/task-v1.txt 建立，40 秒、兩顆晶粒、兩類測項、位置紀錄；未更改科學模型、資料、時序或重設語義。

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

原始程式由 Sites Git 保存；站點 ID 為 appgprj_6ae415e3ac68819182a0fd488d8ad557。現有站點維護須保留 `.openai/hosting.json` 的 project_id，並從站點取得最新原始碼與版本。Git HEAD 是完整來源版本的準據。

下載專案是可執行來源快照，不含憑證、Git 內部資料或站點身分檔，避免另建專案時誤用既有站點。若延續本站，先取得既有站點原始碼，而不是重新註冊。

下一步優先補足 docs/acceptance.md 的真實瀏覽器驗收，按原任務 H4 修正；不要先擴充其他主題。播放器與純狀態取樣方式可重用，SVG 幾何和時序資料則屬此主題。
