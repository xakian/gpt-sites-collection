export const topic={title:'PN 接面二極體：電流為什麼偏好一個方向？',shortTitle:'PN 接面 · 偏壓與載子',sceneLabel:'同一矽 PN 接面；P 在左、N 在右；固定摻雜離子、移動電子與電洞、空乏區及電源極性。',duration:30,overview:11,stages:[
{start:0,key:3,title:'零偏壓 · 動態平衡',what:'接面已形成空乏區，留下固定的負受體離子與正施體離子。擴散與電場造成的漂移互相平衡，因此淨電流為零。',detail:'平衡不等於載子靜止。空心圈是電洞，藍色負號是電子；小方格的正負號是固定離子。空乏區指可移動載子顯著減少，而非完全沒有任何粒子。'},
{start:6,key:7,title:'施加正向偏壓',what:'P 端接正、N 端接負，接面位障降低，空乏區變窄。',detail:'電源只改變可移動載子的分布；摻雜原子並不跟著移動。電壓與電流採定性示意，不指定普遍的開關門檻。'},
{start:8,key:11,title:'正向注入 · 電流增加',what:'電子由 N 區注入 P 區，電洞由 P 區注入 N 區。電源經接點持續補充載子。',detail:'圖中跨過接面的載子在對側逐漸復合；正向傳統電流為 P → N，方向與電子運動相反、與電洞運動相同。'},
{start:14,key:16,title:'回到零偏壓',what:'逐漸減小外加正向偏壓，空乏區與位障回到零偏壓狀態。',detail:'這裡省略快速切換時的儲存電荷與反向恢復；不是高頻二極體模型。'},
{start:17,key:23,title:'反向偏壓 · 小漏電',what:'P 端接負、N 端接正，空乏區變寬、位障提高。少數載子形成很小的反向電流。',detail:'反向電子由 P → N、電洞由 N → P，傳統電流為 N → P。此處未達崩潰；少數載子符號放大，不能按圖中數量推算電流。'},
{start:26,key:29,title:'電源回零，接回平衡',what:'外加電源回到零偏壓，同一接面回到原本的動態平衡。',detail:'材料、接點及固定離子位置全程不變；循環透過電源變化接回。'}],notes:[
'模型為對稱摻雜的一維矽 PN 接面示意；空乏近似、位障與寬度只表達趨勢，未解半導體漂移擴散方程。',
'電洞是價帶中可移動的未占據狀態，不是另一種有實體外殼的粒子。電子復合是填補空缺，並非電子質量消失。',
'離子在空乏區外仍存在，只是其電荷大致由可移動載子補償；用淡色表示局部近電中性。粒子軌跡為示意，沒有逐顆追蹤所有熱生成、復合事件。',
'漏電受溫度與器件影響。沒有納入崩潰、表面漏電細節、整流負載或反向恢復；真實二極體沒有對所有材料通用的固定開關電壓。'],sources:[
{title:'Renesas · Diodes, Transistors and FETs',url:'https://www.renesas.com/en/support/engineer-school/electronic-circuits-02-diodes-transistors-fets',supports:'P/N 摻雜、固定離子與偏壓極性；其入門式開關描述在本作以連續趨勢取代。'},
{title:'MIT 6.012 · PN junction diode terminal characteristics',url:'https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/a3aa1722b1c2e732dfe4c4be0c7b0631_MIT6_012S09_lec14.pdf',supports:'漂移與擴散平衡、正向少數載子注入、反向少數載子抽取與非理想開關特性。'}]};
