import {ramp,ease,lerp} from './view.js';
export const state=t=>({amplitude:t<22?lerp(4,36,ease(ramp(t,4,13))):lerp(36,12,ease(ramp(t,22,28))),phase:t>=14&&t<18?3*Math.floor(t-14):t>=18&&t<19?9*(1-ramp(t,18,19)):0,map:ramp(t,19,20),recordExit:ease(ramp(t,29,31)),exit:ease(ramp(t,30,32)),incoming:ease(ramp(t,32,34))});
export const height=(u,v,a)=>a*(1-.5*u*u-.5*v*v);
export const topic={title:'封裝熱翹曲與陰影疊紋量測',question:'同一個表面的高低，如何對應疊紋與高度圖？',duration:34,overview:21,intro:'以EMC模封料／Cu的等效雙層封裝試片作材料示例。固定參考光柵、斜入射白光及垂直觀察相機；追蹤同一平滑表面A，並以同一高度模型同步顯示疊紋、中央側輪廓與相對高度圖。',simplifications:'雙層堆疊依公開研究作代表，不對應特定量產封裝。熱膨脹差、材料性質和殘餘應力只作定性說明；本例選中心較高的示意熱歷程，方向不通用。高度被放大；疊紋用參考間距與同一表面高度的週期強度表示，並非光學反演或有限元素結果。相位步進以整個試片連支撐小幅垂直移動概括，參考光柵固定。高度圖由已知示意模型生成，不能稱真實量測數據；色階與x/y方向全程固定。',sources:[{title:'Akrometrix · Shadow Moiré',url:'https://akrometrix.com/measurement-vision-technologies/',claim:'參考光柵與表面陰影形成幾何疊紋，白光斜入射、相機垂直觀察；相位步進可藉試件相對光柵的垂直位移完成。'},{title:'Park et al. · Electronic Packaging Enhancement (2023)',url:'https://pubmed.ncbi.nlm.nih.gov/36696132/',claim:'EMC/Cu雙層封裝的熱膨脹失配、有效固化收縮與熱歷程影響翹曲和殘餘應力；本動畫不重用論文數據或改善百分比。'},{title:'Akrometrix · Effects of Temperature Uniformity on Package Warpage',url:'https://akrometrix.com/wp-content/uploads/2018/10/Effects-of-Temperature-Uniformity-on-Package-Warpage-External.pdf',claim:'封裝溫度與量測條件影響翹曲，不能把單一方向或一條熱曲線當成所有產品通則。'}],steps:[
{start:0,key:2,title:'室溫參考與自由支撐',what:'試片A由三個角落支點承托，沒有夾具把表面壓平；上方光柵維持固定參考平面。',detail:'白光斜入射，相機沿垂直方向觀看；表面連續完整，沒有裂紋。'},
{start:4,key:9,title:'升溫與堆疊翹曲',what:'EMC與Cu的熱行為不同，本例表面中心逐漸較高，側輪廓同步變化。',detail:'這只是選定堆疊與熱歷程的示例；不能說所有封裝加熱都向上拱。'},
{start:13,key:13.8,title:'高溫代表疊紋',what:'表面高低改變光柵與陰影的相對關係，形成隨形狀變化的明暗帶。',detail:'明暗帶是幾何疊紋，不是溫度顏色、發光線或裂紋；單張明暗不能唯一判斷凹凸。'},
{start:14,key:16.5,title:'參考與相位步進',what:'試片和支撐小幅垂直移動，光柵固定，取得四個相位位置後回復量測位置。',detail:'相位資訊和校正參考協助排序條紋與判讀高度方向；本例以簡化模型展示，不執行實際反演。'},
{start:19,key:21,title:'相對高度圖與側輪廓',what:'固定座標與色階的高度圖顯示同一表面；虛線中央剖線對應下方側輪廓。',detail:'色彩表示相對高度而非溫度。圖形是教學示意，不是真實量測數據。'},
{start:22,key:28.5,title:'冷卻後仍有殘餘形狀',what:'冷卻時形狀改變，最後保留較初始更大的中心高度，側輪廓與高度圖一致。',detail:'熱歷程和材料殘餘應力可能使回程不同，不能強迫所有封裝回到平坦。'},
{start:29,key:31,title:'量測紀錄與試片分流',what:'高度紀錄向上另存，原試片帶著殘餘形狀向右退出，新試片由左側進場。',detail:'沒有為了循環把同一試片的殘餘翹曲抹掉。'}]};
