import {ramp,smooth} from './svg.js';
export const duration=30;
export const info={shortTitle:'PECVD 薄膜沉積',title:'PECVD｜氣體如何形成保護膜',label:'噴淋頭、電漿與淺台階晶圓上的SiNx成膜剖視',overview:20,summary:'採代表性電容耦合PECVD：SiH₄與NH₃提供含矽／含氮物種，N₂作載氣，上方RF噴淋頭與下方加熱載台。真實膜常含氫，標作SiNₓ:H；不是固定Si₃N₄配比。圖形只代表物種通量，省略完整反應網路、表面吸附擴散細節與實際配方。側壁覆蓋比水平面薄，僅示意條件會影響覆蓋性，不保證無孔洞。30秒不是實際工時；連續供氣成膜，不採ALD半反應循環。',sources:[{title:'Oxford Instruments — PECVD',url:'https://plasma.oxinst.com/technologies/pecvd',note:'RF上電極／噴淋頭、下方加熱載台與沉積。'},{title:'Plasma-Therm — LPCVD and PECVD process comparison',url:'https://www.plasmatherm.com/wp-content/uploads/2022/04/Plasma-Therm-LPCVD-vs-PECVD-Whitepaper.pdf',note:'第5頁的SiH₄／NH₃、載氣及SiNx性質；未引用操作參數。'}],supplement:'<details><summary>補充：三種符號怎麼分？</summary><p>小 e⁻ 表示電子；帶 + 的圓形表示正離子；菱形加 · 表示中性活性物種／自由基。淡色空心圓表示氣體及反應後離去的物種。這些形狀用於分辨角色，不是分子的真實形狀或逐分子配比。</p><p>RF能量用來維持電漿並活化化學反應；圖中沒有PVD的金屬靶。薄膜形成在原有表面，不是整片從上方掉落。</p></details>'};
export const stages=[
 {at:0,key:2,title:'基板與載台',what:'同一片帶淺台階的晶圓放在加熱載台上。上方噴淋頭是供氣與RF電極。',detail:'只示意建立環境，不提供溫度、壓力或操作配方。'},
 {at:4,key:5.5,title:'連續供氣',what:'SiH₄、NH₃與N₂由上方噴淋頭進入，沿表面及右側排氣路徑流動。',detail:'氣體尚未等於固體薄膜；真正成膜需要表面反應。'},
 {at:7,key:8.5,title:'電漿活化',what:'RF能量維持電漿。電子碰撞使氣體出現離子及較活潑的中性物種。',detail:'電子、離子與自由基分開畫；中性物種不是全部受電場直接拉向晶圓。'},
 {at:10,key:13,title:'表面開始成膜',what:'含矽與含氮的活性物種抵達台階表面並參與反應，新的SiNₓ從表面形成。',detail:'台階頂部、側面與底部都有覆蓋，沒有一整片膜從氣體中落下。'},
 {at:16,key:20,title:'持續沉積與排氣',what:'連續供氣使薄膜逐漸增厚，副產物與未反應氣體同時沿出口排出。',detail:'反應網路複雜，空心圓是多種離去物種的統稱，並非唯一反應式。'},
 {at:23,key:25,title:'停氣與清除殘氣',what:'停止RF與反應物供給，殘餘物種排出，已形成的固體膜留在晶圓上。',detail:'停止電漿不會讓薄膜倒退成氣體。'},
 {at:26,key:27,title:'鍍膜完成件離場',what:'鍍膜晶圓向右離開，新基板由左側進入。',detail:'每輪從另一片基板開始，沒有倒播化學反應。'}
];
export function state(t){return{t,index:Math.max(0,stages.findLastIndex(x=>t>=x.at)),gas:t>=4&&t<23,plasma:t>=7&&t<23,film:ramp(t,10,23.8),out:smooth(ramp(t,26,28)),incoming:smooth(ramp(t,28,30)),newWafer:t>=28};}

