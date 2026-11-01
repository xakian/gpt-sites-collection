import {ramp,smooth} from './svg.js';
export const duration=28;
export const stages=[
 {at:0,key:0.6,title:'污染晶圓',what:'同一段矽表面上，棕色微粒 P 仍附著。這是固定放大的局部剖面。',detail:'P 是被追蹤的固體污染，不是矽的一部分。'},
 {at:2,key:4,title:'液體潤濕',what:'清洗液由左側進入，在晶圓上形成連續液膜並流向右側排液口。',detail:'藍色是液體，箭頭表示流動。液膜厚度大幅放大。'},
 {at:6,key:8,title:'兆聲波作用',what:'換能器把聲能送入液體，近表面流動促進附著微粒鬆動。',detail:'紫色弧線表示聲壓波，不是會吃掉微粒的物質；未畫出空化氣泡。'},
 {at:10,key:11.5,title:'微粒脫附',what:'微粒 P 離開原本接觸的矽表面，但仍在清洗液中。',detail:'脫附與排出是不同事件。微粒身分一直保留。'},
 {at:13,key:16,title:'液流帶走',what:'微粒 P 隨液流向右移動，進入排出路徑，離開這段晶圓表面。',detail:'污染進入廢液收集，不會變成矽或直接消失。'},
 {at:18,key:19,title:'超純水沖洗',what:'停止聲學作用後，以超純水補充並置換表面殘留液體。',detail:'清洗、沖洗與乾燥在此合併為概念流程，不是設備配方。'},
 {at:21,key:23.5,title:'旋乾與氮氣',what:'旋轉使液體向晶圓邊緣移動，氮氣輔助乾燥，留下乾燥表面。',detail:'局部剖面固定在晶圓上；旋轉位置見補充圖。液體進入排液路徑。'},
 {at:24,key:25,title:'完成件離場',what:'乾淨晶圓由右側退出，接著由左側送入另一片待清洗晶圓。',detail:'新污染只出現在新晶圓上，沒有把清洗過程倒播。'}
];
export function state(t){
 const index=Math.max(0,stages.findLastIndex(s=>t>=s.at));
 const wet=ramp(t,2,5)*(1-ramp(t,21,23.5));
 return {t,index,wet,acoustic:t>=6&&t<18,lift:smooth(ramp(t,10,13)),travel:smooth(ramp(t,13,18)),out:smooth(ramp(t,24,26)),incoming:smooth(ramp(t,26,28)),dry:t>=23.5,newWafer:t>=26};
}
