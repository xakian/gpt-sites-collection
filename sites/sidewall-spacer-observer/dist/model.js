import {ramp,smooth} from './svg.js';
export const duration=28;
export const info={shortTitle:'側壁間隔層',title:'側壁間隔層｜薄膜為什麼只留在兩側',label:'同一中央多晶矽線條與連續氧化物膜的共形覆蓋、方向性回蝕剖面',overview:22,summary:'採多晶矽線條旁的CVD氧化物間隔層代表模型，依Dhong與Petrillo的1986年研究摘要；IBM網頁上架日期2019不代表研究年份。這是線條形貌示意，非完整電晶體層序。下方為連續矽基板，沒有假設一層永遠不被蝕刻的氧化物保護膜。採有限氧化物對矽選擇性，水平膜清除附近停止，露出的矽表面有少量放大的損失。膜厚、粒子與時間非實際比例；一階幾何不精確預測輪廓。省略摻雜、芯模移除及器件導通。',sources:[{title:'IBM Research — Sidewall Spacer Technology for MOS and Bipolar Devices',url:'https://research.ibm.com/publications/sidewall-spacer-technology-for-mos-and-bipolar-devices',note:'CVD氧化物／氮化物與RIE形成側壁；厚度、角度、共形性與選擇性影響輪廓。研究1986年。'}],supplement:'<details><summary>補充：方向性與選擇性</summary><p>以向下的離子輔助作用強化水平區移除，側壁相對較慢，但並非完全不被蝕刻。動畫中側膜也變薄，上端逐漸圓化。</p><p>中央線條的頂部與兩旁平面先清出。選擇性有限，繼續回蝕也會損傷矽，因此這裡在水平膜清除附近停止，不宣稱矽完全不會反應。</p></details>'};
export const stages=[
{at:0,key:1,title:'固定中央線條',what:'多晶矽線條位在連續矽基板上，準備覆膜。',detail:'本題觀察輪廓，不是完整電晶體。中央線條不被移除。'},
{at:3,key:9.9,title:'CVD共形覆蓋',what:'同一層氧化物連續包覆線條頂部、側壁與兩旁水平面。',detail:'膜從表面逐漸增厚，側邊不是獨立貼上的零件。'},
{at:10,key:14,title:'方向性回蝕',what:'向下離子輔助作用使水平區移除較快；側膜也緩慢變薄。',detail:'氣態反應產物移向排氣，並非把固體碎片吹走。'},
{at:18,key:19,title:'清出水平表面',what:'頂部與兩旁水平膜清除，側壁殘留同一層氧化物。',detail:'有限選擇性帶來少量矽表面損失；上端呈圓角。'},
{at:21,key:22,title:'留下側壁間隔層',what:'兩條間隔層留在原線條兩側，中央結構保持。',detail:'最終形狀由膜厚、方向性、時間與選擇性共同決定。'},
{at:24,key:25,title:'完成件退出',what:'完成件離開，新線條基板進場。',detail:'沒有把已去除的膜反向長回來。'}];
export function state(t){return{t,index:Math.max(0,stages.findLastIndex(x=>t>=x.at)),coat:ramp(t,3,10),etch:ramp(t,10,18),side:ramp(t,10,20),loss:ramp(t,18,20),out:smooth(ramp(t,24,26)),incoming:smooth(ramp(t,26,28)),newWafer:t>=26};}
