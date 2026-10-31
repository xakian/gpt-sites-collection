# 銅互連與 CMP

繁體中文、44 秒、九段 SVG 觀察動畫。固定局部剖面追蹤同一段材料，從光阻開口到槽內銅互連。

- 共用規格：v1.0
- 共用程式範本：1.0.0（dist/shared/ 原樣副本，SHA-256 已對照）
- 主題網站版本：1.0.0
- 私人網址：https://copper-interconnect-cmp-observer.fishddry.chatgpt.site/
- Sites ID：appgprj_6ae56e3cdef88191913edb1598d440b6

## 本機觀看

需要 Node.js 20 或更新版本，無額外安裝依賴。

```text
node server.mjs
```

開啟 http://127.0.0.1:4181/ 。一般開啟即播放。右上可暫停、重播、開啟說明；底部四速度、全寬進度定位。定位後暫停。說明可選步驟再按「定位此步」。

```text
node --test tests/*.test.js
```

## 檔案分工

- dist/index.html：語系、面板、來源、簡化與補充圖。
- dist/model.js：分鏡、純時間狀態、44 秒週期及關鍵幀。
- dist/scene.js：SVG 材料幾何、場景與響應式布局。
- dist/materials.css：主題材料配色。
- dist/app.js：主題與共用介面接合。
- dist/shared/：共用範本原樣副本，僅此副本隨新站發佈。
- .openai/hosting.json：本主題獨立網站識別與 dist 靜態輸出設定。

完整內容單、來源對照、驗收與發佈紀錄位於 ../../records/copper-interconnect-cmp/。
單元測試不能代替真實背景返回、系統動態偏好或實體手機測試，交付限制見 ACCEPTANCE.txt。

## 科學範圍

單層溝槽；TaN/Ta 合併為阻障／襯層，種子銅與電鍍銅以深淺追蹤來源。先移除表面銅，再移除場區導電阻障，保留槽壁／槽底薄膜及槽內銅。省略通孔、退火、後續蓋層及實際凹陷／侵蝕，比例與時間均為示意。

## 維護

只在此資料夾使用 Git。維護時先依 Sites 流程讀取此 ID 的即時來源與私人存取設定，不建立另一個同名網站。不要把識別、Git 資料或任何憑證複製給其他主題。
