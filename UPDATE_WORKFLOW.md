# GPT Sites 更新與同步流程

適用於這個儲存庫既有的 10 個網站。GPT Sites 是日常編輯來源，GitHub 保存可追溯的副本，10 個既有 Vercel 專案各自提供公開網站。此流程不接入 xakian 主站。

```text
在 GPT Sites 修改並成功發佈
           ↓ 你告訴 Codex 要同步哪一站
取得該已發佈版本 → 比對差異與驗證
           ↓
更新 gpt-sites-collection 的 main
           ↓ Vercel Git 整合自動部署
檢查原有公開網址 → 回報完成
```

目前沒有 GPT Sites → GitHub 的背景同步排程或 webhook；以下是由你發起、Codex 協助執行的流程。GitHub → Vercel 已連接自動部署。

## 你每次只要做兩件事

1. 在原 GPT Sites 修改網站，確認這次版本已成功發佈，並在原站看過內容。
2. 在 Codex 告訴我網站名稱或原站連結，要求同步。沿用本對話最方便；新對話可附上本儲存庫網址。

日常更新可以直接貼：

> 我已在 GPT Sites 更新並發佈「晶圓電性測試」。請按照 https://github.com/xakian/gpt-sites-collection/blob/main/UPDATE_WORKFLOW.md，把這一站最新成功發佈的版本同步到 GitHub，並驗證對應 Vercel 正式網站。保持內容、外觀與互動一致，保留原 GPT Site，先不接入 xakian。

一次更新多站可以說：

> 請檢查 gpt-sites-collection 對應的 10 個 GPT Sites，只同步有新成功發佈版本的網站，推送到 GitHub main，並確認對應 Vercel 部署成功。未改動的網站略過，不接入 xakian。

如果想先看差異再決定是否上線：

> 請比較「網站名稱」的 GPT Sites 最新已發佈版本與 GitHub 副本，列出差異，先不要推送 GitHub 或部署。

若只存了草稿、發佈失敗或版本仍在發佈中，不會把它當成可同步的新版本。尚未發佈的新網站也不會自動加入這 10 站。

## Codex 執行順序

### 1. 對準來源與既有部署

- 從 [sources.json](migration/sources.json) 取得原站 `id`、原站網址、目錄和上次同步的版本／commit；名稱可能變更，以原站 ID 為準。
- 從 [deployments.json](migration/deployments.json) 取得既有 Vercel 專案名稱與實際公開網址。不要重新建立 GitHub 儲存庫、Vercel 專案或網域。
- 檢查本機未提交修改並取得 GitHub 最新狀態，保留其他人的修改；若同一站在 GitHub 有獨立內容修改，先列出衝突，不要直接覆蓋。
- 使用目前可用的 Sites 技能與連接工具確認來源、已儲存版本及成功部署狀態。記錄精確的版本 ID、版本號、部署 ID 與 `source.commit_sha`；不能只看最新儲存版本號或原始碼分支 HEAD。
- 若原站正在回滾，或無法確認版本與已發佈內容的對應，先釐清目標版本。沒有新版本時回報「已是最新」，不產生空的更新 commit。

### 2. 取得與替換指定版本

- 在獨立來源 checkout 透過 Sites 官方 source helper 取得來源；存取憑證只留在記憶體，依技能經隱藏 stdin 傳入，不放進檔案、指令參數、Git 或輸出。
- 從剛確認的已發佈 commit 讀取檔案，即使來源分支 HEAD 已有較新的草稿，也不混入。
- 只同步該站 `sites/<slug>/` 的原始碼、已發佈 `dist/`、素材、下載附件和原有測試；保持位元組一致。清除新版本已移除的舊來源檔，避免舊資產殘留。
- 保留副本專用的 `vercel.json` 和根目錄 `.gitattributes`。原站 `.openai/hosting.json`、Git metadata、憑證、`.env`、`.vercel`、本機執行狀態與安裝依賴不放進公開副本。不要向原 GPT Sites 的來源倉庫推送或重新發佈原站。
- 目前各站都是直接提供 `dist/` 的靜態網站。若新版本改用伺服器、登入、資料庫或其他平台功能，先確認 Vercel 所需設定和相容性，再安排遷移；不要直接套用現有靜態設定並宣稱功能相同。
- 更新 `migration/sources.json` 中該站的版本、來源 commit、部署資訊與完整檔案清單／SHA-256。不要先改雜湊來掩蓋意外的檔案差異。

### 3. 檢查並推送 GitHub

- 檢視 diff：本次只有指定網站及必要追溯紀錄改變，原站內容沒有被重新設計或改寫。
- 執行相關原有測試，以及 `node scripts/verify-source.mjs`。依實際更新範圍驗證桌面、手機和主要互動；與更新無關的測試不必反覆重跑。
- 在獨立更新紀錄中寫入日期、網站、來源版本與 commit、變更摘要、測試結果；不要把舊測試紀錄當作新版本的驗證結果。
- 通常每站建立一個來源同步 commit，便於單站回復，例如 `Sync wafer-electrical-test-20261030 to GPT Sites v3`。一次多站可先完成各站 commit，再一次推送 `main`。
- 保留原本 10 個公開網址、Git 整合和 Root Directory 設定。更新 `main` 即會依既有 Git 整合觸發 Vercel；不需要再手動上傳同一份網站。

### 4. 確認上線，而不只確認 push 成功

- 檢查這次 GitHub commit 對應的 `Vercel – <專案名稱>` 狀態，以及對應正式部署的來源 commit 和成功狀態。
- 用未登入的請求開啟原有公開網址，確認內容已是此次版本，再執行 `node scripts/verify-deployments.mjs` 比對線上檔案。
- 目前 `verify-deployments.mjs` 會檢查全部 10 站並更新 `migration/http-verification.json`；來源版本清單必須先正確更新。若出現差異，確認部署完成、專案目錄與網域指向後再判定原因。
- 對變更涉及的主要互動做瀏覽器抽查。同步是完整保留原站檔案；代表性操作檢查不等同於所有路徑都做過回歸測試。
- 完成回報應包含：更新了哪些站、原版本 → 新版本、GitHub commit、原有 Vercel 網址、部署與驗證結果。若只有部分完成，要逐站說明。
- 若將部署後驗證報告再提交到 `main`，它可能再次觸發部署；只補交一次紀錄並確認最終 commit 的部署結果，避免為記錄部署而無限新增 commit。

## 同步與資料的界線

| 情況 | 處理方式 |
| --- | --- |
| 在 GPT Sites 修改程式、文字、樣式或素材並發佈 | 按本流程同步指定已發佈版本 |
| 在網站內新增筆記、調整資料或玩遊戲產生存檔 | 若資料存在 localStorage／sessionStorage，它不屬於原始碼同步；使用原站已有的匯出／匯入功能轉移 |
| 只改 GitHub 副本的網站內容 | 不會回傳 GPT Sites；下次同步前需處理差異，日常內容修改建議統一在 GPT Sites 進行 |
| 多個網站同在一個 GitHub 儲存庫 | 只修改指定站的檔案，但一次 push 可能觸發多個 Vercel 專案部署；未改動站的內容不變 |
| 新增第 11 個網站或變更架構 | 另行指定新增或遷移，不當作這 10 站的例行更新 |

## 想回復舊版時

可以直接說：

> 請把「網站名稱」的 GitHub 與 Vercel 副本回復到上一次同步版本，保留 Git 歷史，先不改原 GPT Site，也不接入 xakian。

優先用新的 Git commit 回復該站檔案與對應來源版本清單，再讓 Vercel 自動部署並驗證。若先前的同步 commit 只包含這一站，可使用 `git revert`；若混有其他網站或後續修改，則只回復指定站及其紀錄，避免連帶撤回其他變更。

回復副本不會回復原 GPT Site。下一次要求「同步最新版本」仍會以 GPT Sites 的目標版本為準；若需長期停留舊版，要在後續同步指令中指定版本或排除該站。

## 相關檔案與依據

- [十個公開網站與維護資訊](README.md)
- [來源與逐檔雜湊](migration/sources.json)
- [Vercel 專案及公開網址](migration/deployments.json)
- [本機來源比對](scripts/verify-source.mjs)
- [公開部署比對](scripts/verify-deployments.mjs)
- [Vercel 官方 GitHub 整合文件](https://vercel.com/docs/git/vercel-for-github)：Git 推送、正式分支與預覽部署行為。

流程整理日期：2026-10-30。這份文件記錄操作流程，沒有新增排程、webhook 或另一套 CI 部署管線。
