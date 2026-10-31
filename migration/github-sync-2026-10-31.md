# 2026-10-31 GitHub 同步紀錄

本次只將 GPT Sites 已發佈來源保存到 GitHub 的 `codex/sites-sync-20261031` 分支。未合併 main、未建立 Vercel 部署、未修改 xakian 主站，也未更改或刪除原 GPT Sites。

## 範圍

盤點時實際有 16 個 GPT Sites，其中 15 個已發佈；SRAM 尚未發佈，排除。以本次盤點的版本快照為準，不追隨其他工作中的後續發佈。

- 新增 11 站。
- SOIC-8：第 1 版更新至第 4 版。
- 供應鏈：第 5 版更新至第 8 版。
- 晶圓電性測試第 2 版、半導體知識座標圖第 9 版與既有 GitHub 內容逐檔相同。
- 原儲存庫其餘 6 個舊站保留，合計 21 個網站目錄；不因它們未出現在目前 Sites 清單而刪除。

| 網站／來源目錄 | 已發佈版本 | 本次處理 |
| --- | --- | --- |
| [CMOS 反相器：兩顆電晶體如何把 0 變成 1？](../sites/cmos-inverter-observer-b01/) | 1 | 新增 |
| [PN 接面二極體：電流為什麼偏好一個方向？](../sites/pn-junction-observer-b01/) | 1 | 新增 |
| [熱氧化：矽表面的氧化層](../sites/thermal-oxidation-observer-b01/) | 1 | 新增 |
| [MOSFET：閘極怎麼控制電流？](../sites/mosfet-gate-current-observer/) | 1 | 新增 |
| [單晶矽拉晶：一顆晶種怎麼長成整根晶棒？](../sites/cz-silicon-observer/) | 1 | 新增 |
| [原子層沉積（ALD）：薄膜怎麼沿著凹槽長出來？](../sites/ald-trench-observer/) | 1 | 新增 |
| [離子佈植與退火：怎麼改變矽的導電特性？](../sites/ion-implant-anneal-observer/) | 1 | 新增 |
| [晶圓探針測試｜科學觀察動畫](../sites/wafer-probe-observer-20261031/) | 1 | 新增 |
| [倒裝接合｜晶粒翻過來，怎麼接到基板？](../sites/flip-chip-bonding-observer/) | 1 | 新增 |
| [銅互連與 CMP：為什麼填滿銅，還要把它磨掉？](../sites/copper-interconnect-cmp-observer/) | 1 | 新增 |
| [微影到蝕刻：圖案怎麼留下來](../sites/lithography-etch-observer/) | 1 | 新增 |
| [晶圓電性測試](../sites/wafer-electrical-test-20261030/) | 2 | 一致，保留 |
| [供應鏈：區分物料、服務與資訊](../sites/supply-chain-three-relations-20261029/) | 8 | 更新 |
| [SOIC-8 封裝觀察](../sites/soic-eight-observer/) | 4 | 更新 |
| [半導體知識座標圖](../sites/semiconductor-coordinate-atlas-1029/) | 9 | 一致，保留 |

## 保存與驗證

本機驗證結果：297 個來源檔案逐檔 SHA-256 相同，其中 151 個是網站執行檔案；91 個 JavaScript 檔案語法通過，102 個本機檔案引用可解析，12 組原有測試通過。MOSFET 原始來源沒有測試套件，已檢查檔案一致性、語法和引用。本次未重新做瀏覽器互動驗收，也沒有 Vercel 部署驗收。

[來源與逐檔 SHA-256](github-sync-2026-10-31.json) 記錄 Site 識別碼、已成功發佈的版本、來源 commit 與各檔案雜湊。[本機檢查結果](github-sync-2026-10-31-verification.json) 記錄原有測試、語法與檔案引用檢查。網站檔案直接取自指定來源 commit；未重新設計、未重新產生內容。

原站的 `.openai/hosting.json` 不複製，以免將副本誤發佈回 GPT Sites。來源驗證用的短效憑證不保存到檔案或 GitHub。只額外加入 Vercel 靜態檔案設定與本次分支的禁止自動部署規則。

## Vercel 暫不部署

根目錄與所有網站目錄的 `vercel.json` 均設定 `git.deploymentEnabled["codex/sites-sync-20261031"] = false`。該規則僅針對此分支，不改動其他分支的部署設定。未建立 PR，以免引入額外預覽觸發；未更新正式分支。

GitHub 保存完成不代表網站已上線。後續部署須由使用者另行要求，先重新查看 Vercel 用量、實際主站儲存庫與目錄對應。只將需要上線的網站接入目標，沿用能直接提供 `dist/` 的方式，避免每個小提交觸發全部網站建置。

首次遷移資料 `migration/sources.json` 與舊部署清單保持原樣，屬於歷史紀錄，不作為目前網址仍可用的證明。
