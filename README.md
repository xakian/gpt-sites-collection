# 本分支新增：科學觀察動畫八站

**只同步 GitHub，尚未部署 Vercel。** [八站目錄、版本與後續部署說明](migration/science-animation-batch-01.md)。既有十站內容保持 main 版本。

---

# GPT Sites Collection

2026-10-30 後續決定：使用者要求最後一次遷移後手動刪除原 GPT Sites。本次僅將正式內容仍停留在 v26 的「擴散 · 01」更新至 v27，依據見 migration/retirement-2026-10-30.json。這段取代下方「原 GPT Sites 保留」的歷史描述；之後仍以本 GitHub 儲存庫為唯一修改來源，不再同步 GPT Sites。

10 個獨立網站，最初從 2026-10-28 至 2026-10-30 建立的 GPT Sites 已發佈版本複製。

**自 2026-10-30 起，本 GitHub 儲存庫是唯一修改來源，以下 Vercel 網址是正式公開版本。** 原 GPT Sites 已完成最後收尾遷移，之後由使用者手動刪除；這 10 站尚未接入 xakian 主站。

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

首次遷移時，內容、樣式、腳本、素材及下載附件按原站發佈版本原樣保留。`migration/sources.json` 保存當時的原站網址、原始 commit、版本號和逐檔 SHA-256，作為歷史來源紀錄；日後修改以 GitHub commit 追蹤。`.gitattributes` 防止 Git 自動轉換換行。原站的 `.openai/hosting.json` 不放入副本，避免誤向原 GPT Sites 發佈。

網站使用的 localStorage / sessionStorage 仍以各自網址儲存。舊 GPT Sites 的本機存檔不會自動出現在新網域；可使用原站已有的匯出／匯入功能轉移支援的資料。

日常更新採用「告訴 Codex 要修改哪個正式網站 → 修改本儲存庫並檢查 → 推送 GitHub main → Vercel 自動部署與驗證」的流程。你不需要另說一次同步，也不需要再到 GPT Sites 修改同一份內容。

完整步驟、可直接複製的指令句與回復舊版方式，請看 [更新與發佈流程](UPDATE_WORKFLOW.md)。供後續 Codex 工作遵循的規則記錄於 [AGENTS.md](AGENTS.md)。

## 驗證

首次遷移（2026-10-30）完成部署與檢查：

- 196 個複製檔案與原站已發佈 commit 的 SHA-256 相同。
- 87 個正式網站檔案均可在未登入狀態取得 HTTP 200，且 SHA-256 與來源相同，包含 HTML、樣式、腳本、資料、圖片與下載附件。
- 14 組原有測試指令通過，涵蓋全部 10 站；詳見 [測試紀錄](migration/tests.json)。
- 每站完成代表性互動檢查，以及 390 × 844 手機視窗的畫面檢查；沒有頁面水平溢出。這是部署煙霧測試，不是所有操作的完整回歸測試。

日常發佈後執行 `node scripts/verify-deployments.mjs`，比對公開網站與 Git HEAD 中已提交的網站檔案；可加 `--site <slug>` 只檢查一站。報告寫入 `.verification/http-verification.json`，不自動提交。

`node scripts/verify-source.mjs` 保留作首次遷移快照比對；日後授權修改可能使它回報差異，不代表新的 GitHub 版本部署錯誤。原始測試仍保留在各網站目錄，依變更選擇執行。

[部署清單](migration/deployments.json) · [首次遷移 HTTP 檢查](migration/http-verification.json) · [首次遷移瀏覽器檢查](migration/browser-verification.json)

