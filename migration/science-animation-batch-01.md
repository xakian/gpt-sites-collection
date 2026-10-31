# 科學觀察動畫：八站 GitHub 同步

2026-10-31 · 來源聊天「建立八個私人動畫網站」。

本次只備份來源至既有公開儲存庫的 `codex/science-animation-batch-01` 分支。**未合併 main，未建立或更新任何 Vercel 部署，未改動 xakian 主站；八個 GPT Sites 保留私人原站。**

| # | 主題與來源目錄 | GPT Sites 版本 | 本次結果 |
| --- | --- | --- | --- |
| 1 | [熱氧化](../sites/thermal-oxidation-observer-b01/) | 1 | 與既有 GitHub 備份一致 |
| 2 | [PN 接面二極體](../sites/pn-junction-observer-b01/) | 1 | 與既有 GitHub 備份一致 |
| 3 | [CMOS 反相器](../sites/cmos-inverter-observer-b01/) | 1 | 與既有 GitHub 備份一致 |
| 4 | [SRAM 六電晶體記憶單元](../sites/sram-six-transistor-observer-b01/) | 1 | 本次新增備份 |
| 5 | [NAND 快閃記憶體](../sites/nand-flash-observer-b01/) | 1 | 本次新增備份 |
| 6 | [CMOS 影像感測器](../sites/cmos-image-sensor-observer-b01/) | 1 | 本次新增備份 |
| 7 | [LED 發光](../sites/led-emission-observer-b01/) | 1 | 本次新增備份 |
| 8 | [矽穿孔 TSV](../sites/tsv-observer-b01/) | 1 | 本次新增備份 |

前三站已有早一輪備份，本次確認來源檔完全一致；其餘五站納入同一批次，方便之後只選需要的站部署。本分支以最新 main 為基礎，沒有攜入或覆蓋其他工作分支的修改。

## 內容與檢查

每站保留 HTML、SVG/動畫程式、樣式、共用觀看介面、科學來源、模型、原有測試與本機伺服器。從 Sites 即時版本紀錄確認來源 commit，再逐檔複製與計算 SHA-256；[來源清單](science-animation-batch-01.json) 可追溯全部檔案。原 README 原樣存為 README.source.md，另加 GitHub 使用說明。不包含 .git、GPT Sites 身分檔、登入憑證、環境秘密或 Vercel 專案連結。

執行 `node scripts/verify-science-animation-batch-01.mjs` 核對此批次來源雜湊與部署鎖；原有模型測試及本機 HTTP 檢查結果見 [本次驗證](science-animation-batch-01-verification.json)。這是同步驗證，不是重新做全套科學動畫驗收。

原製作紀錄：八站曾通過桌面／手機完整循環、五種尺寸、主要播放操作、說明面板與關鍵科學狀態。**真正背景返回及瀏覽器 prefers-reduced-motion 仍待補測**；實體手機、真實 OS 減少動態與完整登出登入也未測。這些限制保持原狀，不因 GitHub 備份而改成通過。

## 避免本次消耗 Vercel 建置用量

- 只推送這個 `codex/` 分支，不推送 main，也不建立 PR 或觸發部署 Hook。
- 儲存庫根目錄與既有十站已禁止 `codex/**` 的 Git 自動部署；八個新增目錄另外設定 `git.deploymentEnabled: false`。
- 未新增 Actions、自動化排程、Vercel 專案或套件安裝。

## 下次明確要求部署時

1. 先查 Vercel 即時額度，再盤點 xakian 主站現有單元、來源與內容雜湊。前三站先前已被納入主站學習目錄，不能只因本分支新增目錄就重複部署。
2. 對照本清單，列出真正新增／更新／完全一致的單元；一致的跳過，保留既有網址。
3. 八站皆可直接提供 dist，沒有後端、套件安裝或遠端編譯需要。只準備使用者選定目標的必要部署設定。
4. 再處理選定內容的合併與發布。不要直接合併整個歷史同步分支，不要未盤點就解除全部部署鎖。Git 部署鎖不阻止人為 CLI 部署；本回合未執行任何部署命令。
5. 發布後核對來源 commit、正式檔案與未變更網站沒有重複部署。
