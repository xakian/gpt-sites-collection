# ALD 科學來源與採用範圍

讀取日期：2026-10-31。使用原始研究、作者機構資料；沒有把搜索摘要之外未取得的全文聲稱讀過。

1. Yim et al. (2020), *PCCP* 22, 23107–23120，DOI [10.1039/D0CP03358H](https://pubs.rsc.org/en/content/articlehtml/2020/cp/d0cp03358h)。原始研究的實驗段及表1經網頁索引可讀；出版社直接開頁有時403。300°C，TMA/N2清除/H2O/N2清除，代表0.1/4/0.1/4秒。樣品12：500循環、平面47.5nm、入口附近飽和區50.2nm，GPC分別0.0951與0.100nm；光學厚度包含原生氧化層。較長曝露可提高滲透深度，飽和區增厚量相近。動畫採約0.10nm／循環作代表平均，沒有把模型參數0.098nm當通用實測值。原文為橫向高深寬比結構；動畫重畫成直立開放凹槽剖面以解說同一表面傳輸原理，沒有照搬幾何或宣稱匹配原文樣品尺寸。

2. Dillon et al. (1995), *Surface Science* 322, 230–242, “Surface chemistry of Al₂O₃ deposition using Al(CH₃)₃ and H₂O in a binary reaction sequence”，DOI [10.1016/0039-6028(95)90033-0](https://www.sciencedirect.com/science/article/pii/0039602895900330)。出版社原研究摘要支持原位FTIR觀察OH/CH3交替、自限半反應與CH4副產物。動畫中的反應式是代表局部配體交換，沒有表示全部微觀路徑。

3. Puurunen (2005), *Applied Surface Science* 245, 6–10，DOI [10.1016/j.apsusc.2004.10.003](https://research.aalto.fi/en/publications/correlation-between-the-growth-per-cycle-and-the-surface-hydroxyl/)。作者機構摘要支持GPC與表面OH濃度相關、甲基立體阻礙及「一OH對一Al」不足以描述全部化學。端基圖示因而不作精確分子計量。

4. Vandalon & Kessels (2019), *Langmuir* 35, 10374–10382，DOI 10.1021/acs.langmuir.9b01600，[作者機構全文PDF](https://research.tue.nl/files/133918546/acs.langmuir.9b01600.pdf)。支持初始生長依起始表面而異；不能把穩態平均GPC直接當作最初幾個循環增厚。

本片採三個理想示意循環，已在面板明示：氣體路線、時間、膜厚和分子皆誇大；基板準備、成核、密度、雜質、粗糙度與氣體傳輸方程未建模。充分曝露下的等厚輪廓不是任意凹槽的保證。

## 實際讀取的共用來源

- 本機 AGENTS.md。
- exports/pro-project-upload-v1.0-20261031/請上傳的5個檔案/00_閱讀指引與上傳說明.txt：上傳包v1.0。
- 根目錄 CURRENT.md：2026-10-31。
- specs/科學動畫系列_共用規格與製作流程_v1.0.txt、科學動畫系列_新增主題內容單_v1.0.txt。
- shared-template/README.md、starter/index.html、starter/app.js、shared/observer.css、shared/observer.js、shared/player-clock.js、server.mjs、package.json、tests/player-clock.test.js。
- 使用本機逐檔原始碼；沒有必要從合併的「完整原始碼.txt」還原。沒有假設舊聊天共享。本題開始前沒有既存的ald-trench內容單或站點README。

共同檔案雜湊（SHA256）與canonical相同：observer.css `163940AAD85D0517268B61BF8D33F1FD39ACDBF0C7E5C708C44A1B5ABE09E570`；observer.js `9B5FBFD61574B09C87553C54F4523C71A38F92058A45C0C27CAF15ECF23BA74E`；player-clock.js `07DB138BC322823C5AB861F98DFBF7211F331489F4C627166F81A33EFC225442`。
