# 焊點電遷移與空洞成長

批次06／5；主題1.0.0、共用規格v1.0、範本1.0.0。

在此目錄執行 `node server.mjs`，開啟 http://127.0.0.1:4605/ 。免安裝、免建置。

內容單與一手來源見 內容單.json 及 dist/model.js。app.js 沿用未修改的共用控制、單一主時鐘；model.js 保存科學狀態，graphics.js 繪製物件，layout.js 分配響應式位置，svg.js 是本題副本的繪圖小工具。

選用Chang等人研究的Cu-SAC-L材料及Bump 1方向：上方薄Al導線、Cu UBM、SAC1205（Sn–1.2Ag–0.5Cu，另含0.05Ni）、下方Cu。上端陰極、下端陽極；電子向下，傳統電流向上。單一剖面與圖符為定性改編，電子與原子速度差、空洞尺寸及累積層均放大，不求解電流密度或質量平衡。終態仍有金屬通路，只顯示電阻上升趨勢；原研究未直接量測單顆焊點電阻。停電不使空洞癒合。

驗收證據：../../records/solder-electromigration/ 。站點身分只使用 .openai/hosting.json，禁止再次註冊。正式版本與私人網址以 ../../records/batch-06/progress.json 為準。
