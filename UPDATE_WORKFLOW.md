# GitHub 更新與發佈流程

## 2026-10-31：目前停在 GitHub 保存階段

本次使用者重新授權一次性同步已發佈 GPT Sites。檔案保存於 `codex/sites-sync-20261031`，該分支已禁止 Vercel 自動部署；尚未合併 main、尚未部署或接入主站。

先完成並驗證 GitHub 保存，再依使用者之後的指示處理 Vercel。部署前重查剩餘額度、主站儲存庫與網站目錄對應，避免直接套用下方歷史流程而觸發全部專案。詳見 [本次同步紀錄](migration/github-sync-2026-10-31.md)。

以下為 2026-10-30 歷史流程，並不授權本次發佈。

---

2026-10-30 後續決定：使用者要求最後一次遷移後手動刪除原 GPT Sites。本次僅將正式內容仍停留在 v26 的「擴散 · 01」更新至 v27，依據見 migration/retirement-2026-10-30.json。這段取代下方「原 GPT Sites 保留」的歷史描述；之後仍以本 GitHub 儲存庫為唯一修改來源，不再同步 GPT Sites。

使用者於 2026-10-30 選定：**`xakian/gpt-sites-collection` 是這 10 站唯一的修改來源；既有 Vercel 網址是正式網站；GPT Sites 由使用者手動刪除。** 本流程取代原先從 GPT Sites 同步的流程。這 10 站繼續獨立部署，先不接入 xakian 主站。

```text
你告訴 Codex「哪個網站，要改什麼」
             ↓
修改 gpt-sites-collection 對應網站 → 檢查與預覽
             ↓
推送 GitHub main
             ↓ Vercel Git 整合自動部署
驗證原有公開網址 → 回報完成

原 GPT Sites：保留為舊版參考，與上面的更新流程分開
```

## 每次怎麼交代

可以直接貼正式 Vercel 網址，或說網站名稱：

> 請修改 gpt-sites-collection 裡的「晶圓電性測試」：〔具體修改內容〕。以 GitHub 最新版本為準，完成檢查後部署到原有 Vercel 網址。GPT Sites 保留作舊版參考，先不接入 xakian。

你不需要自己編輯 GitHub 程式碼，也不需要額外下達「同步」指令。Codex 在這個儲存庫修改、提交並驗證部署，GitHub 保存修改歷史。

若只想先看效果：

> 請修改 gpt-sites-collection 裡的「網站名稱」並提供預覽，先不要推送 main 或更新正式網站。

若換到新對話，附上儲存庫網址 https://github.com/xakian/gpt-sites-collection ，並要求先閱讀 `AGENTS.md`。

在 Vercel 網頁內操作遊戲、編輯筆記或匯入資料，仍依該網站原本的儲存方式處理；本機存檔不會自動變成 GitHub 原始碼修改。

## Codex 每次的工作

1. **取得 GitHub 最新狀態。** 檢查未提交修改，保留現有工作。從 README 和 `migration/deployments.json` 對準站名、目錄、既有 Vercel 專案及網址。
2. **修改對應站點。** 以 `sites/<slug>/` 為範圍。目前各站直接提供已追蹤的 `dist/`，如有其他來源檔或產物生成流程，也要保持一致。不要重新建立網站或更換公開網址。
3. **驗證改動。** 執行與改動相關的原有測試，檢查主要互動及必要的桌面／手機畫面。不要用首次遷移的舊雜湊阻止使用者授權的新修改。
4. **提交並推送。** 一站的一次修改盡量獨立提交，方便回復。依使用者要求發佈到 `main`；只有預覽要求時，不推送正式分支。一次 push 可能觸發多個 Vercel 專案，但未改動站點的內容不變。
5. **確認正式部署。** 檢查本次 GitHub commit 對應的 Vercel 成功狀態、來源 commit 和原有公開網址，再比對線上檔案，抽查改動的操作。
6. **回報結果。** 列出改了什麼、GitHub commit、Vercel 網址、通過的檢查，以及尚未完成的部分。

## 日常檔案驗證

確認目前 Git HEAD 已推送且完成部署後，在儲存庫根目錄執行：

```sh
# 只驗證指定站
node scripts/verify-deployments.mjs --site wafer-electrical-test-20261030

# 驗證全部 10 站
node scripts/verify-deployments.mjs
```

驗證程式從 Git HEAD 讀取目前已追蹤的網站檔案，涵蓋後續新增、修改和移除後的檔案清單，再與正式網址回傳的內容逐檔比對。它不會驗證已刪除檔案的舊 URL 是否仍被其他路由提供；涉及刪檔、重新導向或路由變更時另做對應檢查。

結果寫入 `.verification/http-verification.json`，包含被檢查的 Git commit。此目錄已忽略，不會因每次驗證更新時間戳就再觸發一輪部署。不要拿未提交的工作目錄修改宣稱已與正式網站一致。

## 原 GPT Sites 與歷史紀錄

- 原 10 個 GPT Sites 已完成收尾遷移與備份，由使用者手動刪除。
- 不建立 GPT Sites → GitHub 的自動同步，也不把 GitHub 修改發佈回 GPT Sites。
- 日後即使有人再修改原 GPT Site，也不自動覆蓋 GitHub 正式版本。若要採用某個舊站改動，須另外明確指定，並與 GitHub 最新版本比較整合。
- `migration/sources.json` 保存首次遷移來源、版本與檔案雜湊；原有測試、HTTP 及瀏覽器報告同樣保留為歷史證據。
- `scripts/verify-source.mjs` 仍可回答「現在是否與首次遷移時一樣」，但正式網站有新修改後，出現差異是正常結果。
- 本對話沒有建立同步排程、發佈 webhook 或第二套部署管線。

## 回復舊版

直接說：

> 請把「網站名稱」回復到上一次正常的 GitHub 版本，保留歷史，部署回同一個 Vercel 網址，先不接入 xakian。

以新的 Git commit 回復該站，再由 Vercel 自動部署並驗證。若上一個修改 commit 只包含該站，可使用 `git revert`；混有其他網站或後續修改時，只回復指定站點，避免撤回其他工作。原 GPT Sites 不參與正式版本回復。

## 相關連結

- [十個正式網站與目錄](README.md)
- [Codex 維護規則](AGENTS.md)
- [既有 Vercel 專案與網址](migration/deployments.json)
- [首次遷移來源](migration/sources.json)
- [Vercel 官方 GitHub 整合文件](https://vercel.com/docs/git/vercel-for-github)
