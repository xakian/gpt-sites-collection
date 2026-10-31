# 維護規則

2026-10-31 發布規則：使用者確認台灣半導體圖譜的精簡版上線，其他站不可重複部署。10 個專案已在各自的 `vercel.json` 禁止 `codex/**` 自動預覽；正式分支仍正常部署。`ignoreCommand` 呼叫 `scripts/vercel-ignore-unchanged.mjs`，比較上次成功部署的 `VERCEL_GIT_PREVIOUS_SHA` 與當前版本，僅在該站 `dist/` 或實質部署設定有變更時建置。文件和首次加入省用量規則不算網站更新。不能改成僅比最後一個 commit；缺少比較依據時會保守建置，發布前須先核對各站基準與測試結果。這些規則須保留，除非使用者明確變更發布策略。

- 省用量規則測試：`node scripts/vercel-ignore-unchanged.test.mjs`。
- 發布前確認 Vercel 本期剩餘額度、受影響專案與正式網址；合併一次後，核對有變更站的正式檔案及其他站的跳過紀錄。
- 主站內已遷移的單元依 `xakian/xakian` 的維護流程修改；本倉庫保留的舊副本不再覆蓋主站。原 GPT Sites 不再同步。

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
