# 維護規則

## 2026-10-31 本次指示優先

使用者明確要求把目前已發佈 GPT Sites 一次性同步到 GitHub，先不做 Vercel 或主站部署。此要求取代下方禁止重新同步的歷史描述，但不授權長期自動同步。

- 本次工作分支為 `codex/sites-sync-20261031`；不可合併 main、部署 Vercel 或接入 xakian，除非使用者之後明確要求。
- 根目錄與每站 `vercel.json` 的分支禁止部署規則必須保留；將來發佈前先核實用量和實際部署目標，避免觸發全部專案建置。
- 依 `migration/github-sync-2026-10-31.json` 的快照驗證，未發佈的 SRAM 不納入；原有 6 站即使不在目前 Sites 清單，仍保留。
- 原 GPT Sites 不修改、不刪除、不反向發佈。來源憑證不得存檔或提交。
- 初次遷移及 retirement 紀錄保留歷史意義，不改寫舊來源雜湊。
- 本次檔案與原發佈 commit 一致；後續再修改時仍須先檢查 GitHub 最新狀態並保留使用者變更。

以下為 2026-10-30 歷史規則；與上述本次指示衝突時以上述為準。

---

2026-10-30 後續決定：使用者要求最後一次遷移後手動刪除原 GPT Sites。本次僅將正式內容仍停留在 v26 的「擴散 · 01」更新至 v27，依據見 migration/retirement-2026-10-30.json。這段取代下方「原 GPT Sites 保留」的歷史描述；之後仍以本 GitHub 儲存庫為唯一修改來源，不再同步 GPT Sites。

使用者已於 2026-10-30 決定：本 GitHub 儲存庫是這 10 個網站唯一的修改來源；既有 Vercel 網站是正式公開版本。原 GPT Sites 由使用者在本次收尾遷移後手動刪除，不再作為同步來源。

- 使用者要求修改某站時，先讀最新 GitHub 狀態，修改 `sites/<slug>/` 中對應網站，依變更檢查，再按使用者的發佈要求推送。若只要求討論或預覽，先不要推送正式分支。
- `main` 已連接 10 個既有 Vercel 專案。沿用 `migration/deployments.json` 的專案與公開網址，保留各站的 Root Directory 和 `vercel.json`。
- 不要從 GPT Sites 拉取新版覆蓋這裡，也不要把這裡的修改發佈回 GPT Sites。不要建立 Sites 同步排程。只有使用者之後明確改變此決定，才重新評估。
- 原 GPT Sites 的刪除由使用者手動操作。維持這 10 站獨立，未經新的要求不要接入 xakian 主站。
- 目前正式檔案是各站已追蹤的 `dist/`。修改原始碼後，若該站另有生成流程，須同步更新可部署產物；不能只修改不會被提供給訪客的來源檔。
- `migration/sources.json`、`migration/tests.json`、`migration/http-verification.json` 和 `migration/browser-verification.json` 是首次遷移紀錄，保留其原本意義。不要改寫舊來源雜湊，讓它假裝是新的 GPT Sites 版本。
- `scripts/verify-source.mjs` 只檢查是否仍與首次遷移快照相同；日後授權修改造成差異是預期結果，不作為日常發佈的通過條件。
- 日常部署檢查使用 `node scripts/verify-deployments.mjs`，或加上 `--site <slug>` 只檢查一站。它以執行時 Git HEAD 已提交的 `dist/` 為預期內容；先確認該 commit 已完成 Vercel 部署。報告輸出在忽略的 `.verification/`，避免為提交驗證時間戳反覆觸發部署。
- 完成更新後回報修改站點、GitHub commit、既有 Vercel 網址與實際驗證結果。不要僅因 git push 成功就聲稱網站已上線。

使用者操作方式與回復舊版流程見 [UPDATE_WORKFLOW.md](UPDATE_WORKFLOW.md)。
