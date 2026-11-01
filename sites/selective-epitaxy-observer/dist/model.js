import {ramp,smooth} from './svg.js';
export const duration=30;
export const info={shortTitle:'選擇性矽磊晶',title:'選擇性矽磊晶｜晶體只在開窗中成長',label:'SiO2遮罩開窗與單晶矽表面延續晶向的局部磊晶剖視',overview:22,summary:'採Si(100)單晶矽、SiO₂遮罩與DCS（二氯矽烷SiH₂Cl₂）／HCl／H₂的代表性選擇性CVD模型。表面準備合併成一段，不提供配方。晶向導引線不是完整鑽石立方晶胞；原子、膜厚與時間均非真實比例。新增矽用稍深色區分來源，與基板同為矽。成長保持在遮罩高度以下，簡化平頂輪廓，不指定側面晶面角度。選擇性依表面、氣體和條件而變，不保證永遠完美。省略缺陷、摻雜、SiGe與橫向外延。',sources:[{title:'ASM — Epitaxy',url:'https://www.asm.com/our-technology-products/epitaxy',note:'表面準備與選擇性矽系成長。'},{title:'Journal of Materials Research — Selective epitaxial growth of silicon',url:'https://www.cambridge.org/core/journals/journal-of-materials-research/article/abs/selective-epitaxial-growth-of-silicon/2F2277E235408000030686DCBCD1D7D2',note:'DCS／HCl／H₂代表反應系統與表面條件。'},{title:'Physical Review B — Selectively grown epitaxial Si facets',url:'https://journals.aps.org/prb/abstract/10.1103/PhysRevB.48.17331',note:'不同條件可有不同側面形貌，不能一概指定為同一晶面。'}],supplement:'<details><summary>補充：氣體也會碰到遮罩</summary><p>選擇性不是一面讓氣體無法穿越的牆。反應物會抵達矽與氧化物；在選定條件下，暴露單晶矽可持續成長，遮罩上則抑制持續成核與淨沉積。HCl也影響矽表面反應，不只作用於遮罩。</p><p>與拉晶不同，這裡是在已有晶圓表面局部長出新矽。若條件失去選擇性，遮罩上也可能產生不希望的沉積；本動畫不畫失效分支。</p></details>'};
export const stages=[
 {at:0,key:1,title:'同一個遮罩開窗',what:'厚SiO₂遮罩留下中央開口，下方是單晶矽。開口內薄表面層需要前處理。',detail:'固定追蹤同一窗口；厚遮罩不是這次要清掉的薄表面層。'},
 {at:2,key:6,title:'表面準備',what:'開口的原生氧化／污染經前處理移除，留下適合磊晶的矽表面。',detail:'移除物種經出口離開；本段合併必要處理，不是完整清洗配方。'},
 {at:7,key:9,title:'氣體抵達兩種表面',what:'反應氣體同時到達開口與SiO₂遮罩上方。遮罩不是阻擋氣體的隱形屏障。',detail:'來源、材料表面與反應條件共同決定選擇性。'},
 {at:11,key:14,title:'延續原有晶向',what:'新增矽從暴露單晶矽向上長出。線條與節點和下方原有晶向對齊。',detail:'淡色格線只是取向提示，不代表完整晶胞或任意方塊堆疊。'},
 {at:18,key:22,title:'局部矽層增厚',what:'中央矽繼續增厚，原始表面以虛線保留。遮罩區沒有持續的淨成長。',detail:'完成形貌受晶向、窗口和條件影響；這裡固定平頂的概念剖面。'},
 {at:24,key:25,title:'停止供氣，晶體保留',what:'氣體與副產物排出，新長出的矽留在原晶圓上。',detail:'停止供氣不會讓新晶體縮回原表面。'},
 {at:26,key:27,title:'完成晶圓退出',what:'帶局部磊晶的晶圓退出，下一片已開窗的新晶圓進場。',detail:'更換工件，沒有把成長倒播。'}
];
export function state(t){return{t,index:Math.max(0,stages.findLastIndex(x=>t>=x.at)),prep:ramp(t,2,6),growth:ramp(t,11,23.5),gas:t>=7&&t<24,out:smooth(ramp(t,26,28)),incoming:smooth(ramp(t,28,30)),newWafer:t>=28};}
