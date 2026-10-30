# SOIC-8 封裝觀察

依《極簡半導體流程循環動畫網站 開發規格書 v1.0》製作的繁體中文觀察式動畫。18 秒一輪，單一代表晶粒、六站、無後端、無外部資產與執行依賴。

## 啟動

需要 Node.js 20 或更新版本。在本目錄執行 `node server.mjs`，開啟 http://127.0.0.1:4173 。不需安裝套件或建置。也可將 dist 交給任何靜態網站主機。

執行 `node --test tests/acceptance.test.mjs` 可檢查決定性狀態、材料先後、轉站連續性、單一排程、速度、暫停、背景時鐘及減少動態初始狀態。

## 操作

右上播放／暫停、重播、說明；右下選擇 0.5／1／1.5／2 倍速。點站名開啟說明並暫停，「定位此步」到達該站關鍵幀。關閉說明仍暫停，「播放接續」會收合面板。系統減少動態偏好下初始停在 1.70 秒，明確播放或重播才動。

## 檔案責任

- dist/clock.js：與主題無關的單一 requestAnimationFrame 時鐘。
- dist/topic.js：SOIC-8 材料、八個接點、六站文案及純函數 evaluate。
- dist/layouts.js：直向／橫向站位、圓角路徑、依距離取樣。
- dist/primitives.js：晶粒、導線架、金線、晶圓與局部側視圖示。
- dist/scene.js：重用 SVG 節點並更新屬性，內部金線不因封膠而刪除。
- dist/inspector.js：說明、完成態、側視、文字版及簡化聲明。
- dist/app.js：SceneHost、控制、尺寸與動態偏好連接。
- dist/styles.css：材料 token、細線、控制與面板版面。

新主題可提供 id、title、durationMs、keyframes、learningGoals、evaluate 與自己的 SceneView，重用 PlayerClock。第一版沒有主題切換器或通用流程引擎。

## 開發驗收入口

只在 localhost／127.0.0.1 啟用 `?qa`，顯示毫秒定位、減少動態模擬與 200% 文字驗收控制；`?qa&motion=reduce` 可驗證靜態初始狀態。DOM 的 data-frame、data-clock、data-metrics 提供唯讀測試觀測值。部署網域不啟用這些入口。

## 設計決定

原環境沒有應用框架，因此採 Sites 支援的免建置 HTML／ES modules，避免新增安裝依賴。材料與六站維持規格指定組合。主時序採文件的 18 秒，桌面三欄兩列、直向兩欄三列。直向移交繞過站名，成品由測試站側邊出口離開；短橫向視窗允許垂直捲動。字級改用 rem，以支援文字放大。

科學與省略說明、規格書列出的官方來源均在網站說明面板。未宣稱尺寸、等長站時或流動前緣為物理模擬。一般預設私人 Sites 存取，未擴大分享範圍。
