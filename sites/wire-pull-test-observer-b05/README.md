# 打線接點拉力測試

批次05／6，主題1.0.0，規格v1.0，範本1.0.0。網站身分已保存在 .openai/hosting.json；不得重建或改變私人存取。

在此目錄執行 `node server.mjs`，開啟 http://127.0.0.1:4506/ 。Node.js20+，免安裝／免建置。dist可直接由靜態HTTP伺服器提供。

採未模封試件的破壞性wire pull。固定兩端焊墊與試件，拉鉤從線弧下方接觸後垂直上升；本例選線材中段斷裂，同時記錄峰值與斷裂位置。

內容單、關鍵幀、簡化與一手來源：CONTENT.md。圖形與布局：dist/app.js；科學狀態與說明：dist/model.js；材料樣式：dist/topic.css；接法：dist/view.js；共用控制副本：dist/shared/。canonical未修改。

逐項驗收及發布身分／版本／來源提交見 ../../records/wire-pull-test/ 與 ../../records/batch-05/progress.json。背景與減少動態媒體偏好仍受環境限制，不能宣稱全部通過。
