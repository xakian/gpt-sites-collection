# 晶圓電性測試雙模式更新

新增示意／流程切換，保留 A、B 兩顆晶粒的接觸、供電、量測、判定與位置紀錄。流程模式依原時間語義呈現，不另造量測結果；切換保持播放／暫停狀態、速度與進度。

來源為科學觀察動畫專案 B29 已驗收的 `wafer-test`，25 個部署檔案逐一以 SHA-256 對準 2026-11-14 凍結清單。`dist/source-project.zip` 的 SHA-256 為 `3125b32e84e106680706cbae214abd7632d96726d809d21a891defd20c46857e`。

原來源已完成五基準尺寸、完整循環、控制、切換狀態、背景返回及 Windows 減少動態驗收。發布整合與正式站驗收紀錄另存於科學觀察動畫專案 `records/learning-dual-mode-release-20261114/`；真實手機及讀屏器朗讀不以桌面測試替代。

沿用 Vercel 專案 `prj_3tMFFATL8LlBdN5NPxtNv0WSmNsw`、原 Root Directory、網址與 Standard Protection。保留本倉庫十站的預覽停用及以各站上次成功部署判斷的忽略建置規則。

更新前正式部署為 `dpl_H4GpaUkoa3C9Xm9LjZBme9bqnRPi`、來源提交 `d7986d81cbe626c4fab3d260a3dcc5210878faa0`。回復時還原本次 PR，維持 Git 與正式部署來源一致。首次遷移的 `migration/` 雜湊與紀錄不改寫。
