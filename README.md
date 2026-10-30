# GPT Sites Collection

10 個獨立網站，從 2026-10-28 至 2026-10-30 建立的 GPT Sites 已發佈版本複製。每個網站分別部署至 Vercel；原本 GPT Sites 保留，尚未接入 xakian 主站。

## 網站

| 網站（公開網址） | 目錄 |
| --- | --- |
| [晶圓電性測試](https://xakian-wafer-electrical-test.vercel.app) | `sites/wafer-electrical-test-20261030` |
| [供應鏈：區分物料、服務與資訊](https://xakian-supply-chain-relations.vercel.app) | `sites/supply-chain-three-relations-20261029` |
| [SOIC-8 封裝觀察](https://xakian-soic-eight-observer.vercel.app) | `sites/soic-eight-observer` |
| [半導體知識座標圖](https://xakian-semiconductor-coordinate-atl.vercel.app) | `sites/semiconductor-coordinate-atlas-1029` |
| [半導體製程實驗基地](https://xakian-semiconductor-foundry-lab.vercel.app) | `sites/semiconductor-foundry-lab` |
| [半導體工廠 · Wafer Works](https://xakian-wafer-works.vercel.app) | `sites/wafer-works-lab-20261029` |
| [擴散 · 01](https://xakian-diffusion.vercel.app) | `sites/diffusion-points-20261029` |
| [座標之間](https://xakian-coordinate-field.vercel.app) | `sites/coordinate-field-xjq-1028` |
| [台灣半導體產業知識座標圖](https://xakian-taiwan-semiconductor-atlas.vercel.app) | `sites/taiwan-semiconductor-atlas` |
| [知識座標圖](https://xakian-knowledge-atlas.vercel.app) | `sites/knowledge-atlas-20261028` |

## 部署與維護

每個 Vercel 專案的 Root Directory 指向上述對應目錄，直接提供 `dist/`，不需要安裝套件或重新編譯。各目錄的 `vercel.json` 記錄設定。更新 GitHub `main` 後由 Vercel Git 整合部署。

原始內容、樣式、腳本、素材及下載附件按發佈版本原樣保留；沒有重新設計或改寫互動。`migration/sources.json` 記錄原站網址、原始 commit、版本號和逐檔 SHA-256。`.gitattributes` 防止 Git 自動轉換換行而改變原始檔案位元組。原站的 `.openai/hosting.json` 不放入副本，避免誤向原 GPT Sites 發佈。

網站使用的 localStorage / sessionStorage 仍以各自網址儲存。舊 GPT Sites 的本機存檔不會自動出現在新網域；可使用原站已有的匯出／匯入功能轉移支援的資料。

GPT Sites 的日後修改不會自動同步到本儲存庫。日常更新採用「在 GPT Sites 修改並發佈 → 告訴 Codex 要同步哪一站 → 更新 GitHub main → Vercel 自動部署」的流程。

完整步驟、可直接複製的指令句與回復舊版方式，請看 [更新與同步流程](UPDATE_WORKFLOW.md)。GPT Sites 作為內容編輯來源，這 10 個副本繼續獨立部署，尚未接入 xakian 主站。

## 驗證

2026-10-30 完成部署與檢查：

- 196 個複製檔案與原站已發佈 commit 的 SHA-256 相同。
- 87 個正式網站檔案均可在未登入狀態取得 HTTP 200，且 SHA-256 與來源相同，包含 HTML、樣式、腳本、資料、圖片與下載附件。
- 14 組原有測試指令通過，涵蓋全部 10 站；詳見 [測試紀錄](migration/tests.json)。
- 每站完成代表性互動檢查，以及 390 × 844 手機視窗的畫面檢查；沒有頁面水平溢出。這是部署煙霧測試，不是所有操作的完整回歸測試。

執行 `node scripts/verify-source.mjs` 比對本機複製檔案，執行 `node scripts/verify-deployments.mjs` 重新比對公開部署。原始測試保留在各網站目錄。

[部署清單](migration/deployments.json) · [HTTP 逐檔檢查](migration/http-verification.json) · [瀏覽器檢查](migration/browser-verification.json)

