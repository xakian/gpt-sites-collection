# 封裝熱翹曲與陰影疊紋量測

批次05／8，主題1.0.0，規格v1.0，範本1.0.0。網站身分已保存在 .openai/hosting.json；不得重建或改變私人存取。

在此目錄執行 `node server.mjs`，開啟 http://127.0.0.1:4508/ 。Node.js20+，免安裝／免建置。dist可直接由靜態HTTP伺服器提供。

以EMC模封料／Cu的等效雙層封裝試片作材料示例。固定參考光柵、斜入射白光及垂直觀察相機；追蹤同一平滑表面A，並以同一高度模型同步顯示疊紋、中央側輪廓與相對高度圖。

內容單、關鍵幀、簡化與一手來源：CONTENT.md。圖形與布局：dist/app.js；科學狀態與說明：dist/model.js；材料樣式：dist/topic.css；接法：dist/view.js；共用控制副本：dist/shared/。canonical未修改。

逐項驗收及發布身分／版本／來源提交見 ../../records/thermal-warpage-moire/ 與 ../../records/batch-05/progress.json。背景與減少動態媒體偏好仍受環境限制，不能宣稱全部通過。
