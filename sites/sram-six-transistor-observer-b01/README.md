# SRAM 六電晶體記憶單元

來源：GPT Sites 第 1 版（https://sram-six-transistor-observer-b01.fishddry.chatgpt.site）。本資料夾是 GitHub 副本，動畫與來源 commit 08247fdf85d361f04d83158da7770ea2564b12b9 逐檔一致。原站維持私人。

## 本機開啟

需要 Node.js 20.11 或更新版本。於本目錄執行 `node server.mjs`，開啟 http://127.0.0.1:4184/ 。無套件安裝、無建置。`npm test` 執行原有模型測試。

## 後續部署

此回合只同步 GitHub，不部署。Vercel Root Directory 為 `sites/sram-six-transistor-observer-b01`，輸出為 `dist`；使用純靜態檔案，安裝與建置命令留空。`vercel.json` 目前禁止所有 Git 自動部署。部署前先取得使用者明確要求、確認額度與主站是否已有相同單元，再只開啟需要發布的項目。不可把整個儲存庫一併部署。

完整批次與待補測項目見 [八站同步說明](../../migration/science-animation-batch-01.md)。原製作說明保留於 [README.source.md](README.source.md)，其中舊本機紀錄路徑僅作歷史參照；本副本未攜入 GPT Sites 身分檔，勿向原站反向發布。
