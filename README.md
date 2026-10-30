# GPT Sites Collection

10 個獨立網站，從 2026-10-28 至 2026-10-30 建立的 GPT Sites 已發佈版本複製。每個網站分別部署至 Vercel；原本 GPT Sites 保留，尚未接入 xakian 主站。

## 網站

| 網站 | 目錄 |
| --- | --- |
| 晶圓電性測試 | `sites/wafer-electrical-test-20261030` |
| 供應鏈：區分物料、服務與資訊 | `sites/supply-chain-three-relations-20261029` |
| SOIC-8 封裝觀察 | `sites/soic-eight-observer` |
| 半導體知識座標圖 | `sites/semiconductor-coordinate-atlas-1029` |
| 半導體製程實驗基地 | `sites/semiconductor-foundry-lab` |
| 半導體工廠 · Wafer Works | `sites/wafer-works-lab-20261029` |
| 擴散 · 01 | `sites/diffusion-points-20261029` |
| 座標之間 | `sites/coordinate-field-xjq-1028` |
| 台灣半導體產業知識座標圖 | `sites/taiwan-semiconductor-atlas` |
| 知識座標圖 | `sites/knowledge-atlas-20261028` |

## 部署與維護

每個 Vercel 專案的 Root Directory 指向上述對應目錄，直接提供 `dist/`，不需要安裝套件或重新編譯。各目錄的 `vercel.json` 記錄設定。更新 GitHub `main` 後由 Vercel Git 整合部署。

原始內容、樣式、腳本、素材及下載附件按發佈版本原樣保留；沒有重新設計或改寫互動。`migration/sources.json` 記錄原站網址、原始 commit、版本號和逐檔 SHA-256。`.gitattributes` 防止 Git 自動轉換換行而改變原始檔案位元組。原站的 `.openai/hosting.json` 不放入副本，避免誤向原 GPT Sites 發佈。

網站使用的 localStorage / sessionStorage 仍以各自網址儲存。舊 GPT Sites 的本機存檔不會自動出現在新網域；可使用原站已有的匯出／匯入功能轉移支援的資料。

GPT Sites 的日後修改不會自動同步到本儲存庫；本次是固定版本複製，後續同步需明確更新來源版本。

## 驗證

執行 `node scripts/verify-source.mjs` 比對複製檔案。原始測試保留在各網站目錄。部署與驗證結果記錄於 `migration/`。

