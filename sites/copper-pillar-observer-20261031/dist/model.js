export const title='銅柱凸塊製作',duration=32,overview=29;
export const ramp=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a))),smooth=n=>n*n*(3-2*n);
export const stages=[
 {start:0,end:2,title:'原始焊墊進場',key:1.8,watch:'兩個相鄰焊墊位於已完成鈍化開口的晶圓表面。',detail:'同一對焊墊全程保留；此站只做凸塊，尚未翻面接合。'},
 {start:2,end:5,title:'凸塊下金屬與種子層',key:4.8,watch:'建立相容的凸塊下金屬（UBM）及連續銅種子層，接觸原有焊墊。',detail:'薄金屬沿鈍化開口接到底部焊墊；實際附著層配方依元件選擇，本例不指定廠商配方。'},
 {start:5,end:8,title:'厚光阻開口',key:7.8,watch:'厚光阻留下兩個垂直開口，限定後續銅柱的位置與直徑。',detail:'光阻是暫時模具；開口底部露出導電種子層。'},
 {start:8,end:14,title:'電鍍銅柱',key:13.8,watch:'外部電源經連續種子層供電，銅只在兩個開口內逐步增高。',detail:'此處是垂直接點，沒有向外拉線。兩根柱體從各自的底部金屬長出。'},
 {start:14,end:16,title:'鍍鎳阻障層',key:15.8,watch:'在銅柱頂部形成鎳層，作為銅與錫系焊料之間的擴散阻障。',detail:'本例選用含鎳阻障層的結構；並非所有銅柱製程都必須採同一層序。'},
 {start:16,end:19,title:'鍍錫銀焊料帽',key:18.8,watch:'焊料在鎳層上繼續長厚，形成尚未整形的平頂焊料帽。',detail:'銅、鎳與焊料顏色分開；頂部焊料尚未經迴焊潤濕整形。'},
 {start:19,end:23,title:'去光阻與底層蝕刻',key:22.8,watch:'先移除厚光阻，再蝕除外露種子層與底層金屬。',detail:'柱下金屬保留；柱間外露金屬被移除，兩個接點隔離。'},
 {start:23,end:27,title:'焊料迴焊整形',key:26.8,watch:'助焊與受控加熱使頂部錫銀焊料潤濕、圓化。',detail:'銅柱與鎳層保持固態；只有焊料變形。圓化過程維持示意焊料體積。'},
 {start:27,end:30,title:'冷卻完成凸塊',key:29,watch:'焊料凝固為圓頂，銅柱仍直立；每柱下方保留原焊墊與金屬接觸。',detail:'沒有橋接、底填或翻面接合。此畫面停在晶圓凸塊製作完成。'},
 {start:30,end:32,title:'完成區域退場',key:31,watch:'已完成凸塊的晶圓區域整體退出，下一輪換入新區域。',detail:'銅柱不縮回原始焊墊，凝固焊料不倒轉成原料。'}
];
export function stateAt(t){t=Math.min(duration-.000001,Math.max(0,t));const index=stages.findIndex(s=>t<s.end);return {t,index,stage:stages[index],enter:smooth(ramp(t,0,1.5)),exit:smooth(ramp(t,30,32)),seed:ramp(t,2.2,4.5),resist:ramp(t,5.2,7.2)*(1-ramp(t,19,20.5)),copper:ramp(t,8.2,13.5),nickel:ramp(t,14.1,15.6),solder:ramp(t,16.2,18.5),etch:ramp(t,20.5,22.5),round:smooth(ramp(t,23.4,26.5)),heat:ramp(t,23,24)*(1-ramp(t,27,28.3)),isolated:t>=22.5,solid:t>=28.3};}
// Axisymmetric top interpolation preserves volume: both endpoints enclose pi*r^2*20.
export function solderProfile(q,r=35){let lo=0,hi=r;for(let i=0;i<55;i++){const h=(lo+hi)/2;if(h*(3*r*r+h*h)/6>r*r*20)hi=h;else lo=h;}const h=(lo+hi)/2,R=(r*r+h*h)/(2*h);return {height:h,radius:R,z:x=>(1-q)*20+q*(Math.sqrt(Math.max(0,R*R-x*x))-(R-h))};}
