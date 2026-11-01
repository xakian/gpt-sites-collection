import {ramp,smooth} from './svg.js';
export const duration=30;
export const info={shortTitle:'PVD 金屬濺鍍',title:'PVD 金屬濺鍍｜金屬怎麼搬到晶圓上',label:'氬離子撞擊鋁靶，鋁原子在晶圓上沉積的腔體剖視',overview:18,summary:'非反應式直流鋁靶／氬氣的代表模型，採平坦晶圓。粒子數、膜厚與30秒時程均為示意；省略三維碰撞、鞘層及磁場。靶材確實耗損，但單片耗損小於這張圖的幾何解析度，靶不會在每輪恢復。鋁也會附著腔內擋板；擋板累積厚度未按比例繪製。並非所有PVD都有相同方向性或覆蓋性。',sources:[{title:'Applied Materials — PVD',url:'https://www.appliedmaterials.com/il/en/display/display-technology/pvd.html',note:'惰性氣體離子撞靶、靶材原子濺出與沉積。'},{title:'Kurt J. Lesker — What is sputtering?',url:'https://www.lesker.com/newweb/faqs/question.cfm?id=163',note:'抽氣、Ar氣體、放電及視線方向傳播。'},{title:'Kurt J. Lesker — Deposition systems notes',url:'https://www.lesker.com/newweb/vacuum_systems/deposition_systems_notes.cfm',note:'導電金屬靶可用直流，磁場主要約束電子。'}],supplement:'<details><summary>補充：為什麼不是完全共形？</summary><svg viewBox="0 0 360 180" role="img" aria-label="台階表面接受不同角度的濺鍍通量"><path d="M25 145V120H130V80H225V120H335V145Z" fill="#C9D5DC" stroke="#657985"/><path d="M25 115H125V75H230V115H335" fill="none" stroke="#91A9B8" stroke-width="7"/><path d="M70 25l18 55m100-60v36m90-30l-20 60" fill="none" stroke="#91A9B8" stroke-width="2"/><text x="180" y="169" text-anchor="middle" font-size="16">示意：方向性與遮蔽影響覆蓋</text></svg><p>到達方向與台階遮蔽會影響局部厚度；此圖只示意，不提供固定的台階覆蓋比。主畫面使用平坦晶圓。</p></details>'};
export const stages=[
 {at:0,key:2,title:'抽氣',what:'新晶圓已在承載台上，腔內殘氣經右側排氣路徑移除。上方固體是鋁靶。',detail:'這是固定腔體剖視，不是把金屬熔化滴到晶圓上。'},
 {at:4,key:5.5,title:'導入氬氣',what:'氬由入口補充，抽氣持續維持氣體流動。少量代表符號顯示氣體所在的位置。',detail:'空心 Ar 是中性氣體；稍後帶加號的 Ar⁺ 才是正離子。'},
 {at:6,key:8.2,title:'放電與撞靶',what:'電子碰撞使部分氬電離。Ar⁺ 朝負偏壓的鋁靶加速，將動量傳給固體表面。',detail:'小 e⁻、紫色 Ar⁺ 與灰藍 Al 是不同粒子。氬不會變成鋁。'},
 {at:9,key:10.1,title:'鋁原子濺出',what:'碰撞使靶表面的鋁原子離開，沿不同路徑向晶圓與腔內擋板傳播。',detail:'鋁來自靶材。撞靶後的氬可以中性化並回到腔內氣體，最後排出。'},
 {at:12,key:18,title:'表面累積成膜',what:'到達晶圓的鋁原子附著、形成並增厚薄膜；部分偏離的鋁留在擋板上。',detail:'代表粒子只顯示路徑，膜增長代表大量原子的累積；沒有逐顆計數或等比例質量圖。'},
 {at:22,key:24,title:'停機，膜保留',what:'停止放電與氬供給後，氣體繼續排出，固體鋁膜留在同一片晶圓上。',detail:'停電不會讓已形成的膜消失。靶與腔內擋板留在設備內。'},
 {at:26,key:27,title:'卸出鍍膜晶圓',what:'完成的鍍膜晶圓向右離開，下一片未鍍膜晶圓由左側進場。',detail:'每輪更換晶圓，不把薄膜倒轉吸回靶材。'}
];
export function state(t){return {t,index:Math.max(0,stages.findLastIndex(s=>t>=s.at)),gas:t>=4&&t<22,plasma:t>=6&&t<22,film:ramp(t,9.7,23.1),out:smooth(ramp(t,26,28)),incoming:smooth(ramp(t,28,30)),newWafer:t>=28};}
