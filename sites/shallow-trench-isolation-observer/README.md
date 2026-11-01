# 淺溝槽隔離 STI 1.0.0

第二批05，共用規格v1.0／原樣範本副本1.0.0。執行`node server.mjs`，本機4205；免建置、無第三方執行依賴。

36秒代表性平面bulk silicon STI：已圖案化pad oxide/SiN→蝕槽→熱襯層→O3-TEOS SACVD共形增厚填充→CMP停止→去SiN→去pad oxide→完成／更換工件。延長到36秒，給退場與新件各2秒。固定同一槽，下方矽連續；襯層消耗0.44L矽。去pad同步降低槽氧化物，完成略凸。

關鍵幀1、7.9、11.9、18.9、23.9、26.9、30、33、35秒。模型、科學來源與簡化在dist/model.js；幾何與響應布局在drawing.js；控制由app.js連接原樣共享播放器。驗收及網站身分在../../records/shallow-trench-isolation/。
