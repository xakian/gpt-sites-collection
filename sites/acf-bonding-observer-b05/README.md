# ACF 異向導電膜接合

批次 05／01，主題版本 1.0.0。共用規格 v1.0、共用程式範本 1.0.0。網站身分：`appgprj_6ae6c0b2b3048191bf7a838b20c51d38`，不得重建。部署狀態、來源提交及私人網址以 `../../records/batch-05/progress.json` 和本題部署紀錄為準。

## 執行

本資料夾執行 `node server.mjs`，開啟 `http://127.0.0.1:4501/`。Node.js 20+，免安裝、免建置、無第三方執行依賴。`dist/` 可由靜態 HTTP 伺服器直接提供。

## 內容與來源

30 秒固定局部剖視，兩對 COG 凸塊／端子、六顆金屬包覆聚合物代表顆粒、熱固性絕緣樹脂。貼膜、揭離型膜、對準、靠近後受壓、固化、冷卻卸載、接觸路徑及成品退場。原材料從左側入場；已固化接合件向右退場。

本例未使用額外絕緣外殼，不把 Dexerials 的絕緣包覆產品細節混入。顆粒數、尺寸、變形、時間為示意，不是製程參數或特定廠牌配方。綠色表示接觸路徑；網狀線表示絕緣樹脂固化。

- [Dexerials：ACF 接合、COG 應用](https://www.dexerials.jp/en/rd/tech/tech02.html)
- [Samsung Display：金屬包覆聚合物顆粒與不導電膠材](https://global.samsungdisplay.com/29970)
- [AMADA WELD TECH：受壓接合、保持壓縮冷卻與固化](https://www.amadaweldtech.eu/knowlegde-base/heat-sealingacf-final-bonding)

查證日期 2026-11-01。內容單、階段、關鍵幀及完整簡化見 `dist/model.js`；播放介面副本在 `dist/shared/`；物件繪製 `dist/app.js`、狀態 `dist/model.js`、材料與布局 `dist/topic.css`、主題接法 `dist/view.js`。canonical 範本未修改。

## 驗收與接續

逐項測試見 `../../records/acf-bonding/驗收紀錄.md` 及 `補測與發佈_20261101.md`。桌面／手機整輪、五尺寸、關鍵幀、邊界與控制已實測；背景與減少動態媒體偏好受環境能力限制，仍待補測，不宣稱全數驗收。正式站操作與部署結果各自保存，不以平台部署成功替代使用者身分驗收。
