export const duration=34;
export const clamp=n=>Math.max(0,Math.min(1,n));
export const ramp=(t,a,b)=>clamp((t-a)/(b-a));
export const smooth=n=>n*n*(3-2*n);
export const stages=[
 {start:0,end:2,title:'原載板進場',key:1.8,watch:'追蹤中央捕捉墊與右側相鄰銅墊。這一輪始終是同一塊有機載板。',detail:'原有銅墊位於既有絕緣基材上，兩墊原本分離。'},
 {start:2,end:6,title:'覆壓與固化',key:5.8,watch:'淡色 ABF 絕緣膜覆蓋銅墊，熱壓後形成增層。',detail:'ABF 是絕緣樹脂系統；膜並不是銅。支撐基材與原有銅墊仍保留。'},
 {start:6,end:10,title:'雷射開微盲孔',key:9.8,watch:'雷射由上而下移除局部樹脂，孔底停在同一個捕捉墊。',detail:'孔沒有穿過銅墊。雷射後仍可能留有殘膠，不能立刻當成可靠金屬接點。'},
 {start:10,end:13,title:'去膠與表面處理',key:12.8,watch:'去除孔底殘膠，露出可接觸的銅面，並完成表面調理與活化。',detail:'處理液帶走殘渣；活化與清洗合併示意，沒有畫成電鍍電流。'},
 {start:13,end:17,title:'化學鍍連續薄銅',key:16.8,watch:'薄銅沿表面、孔壁與孔底連續形成，接到下層捕捉墊。',detail:'這一步是化學鍍，沒有外加電源。表面薄銅尚連成一片，不能宣稱上層圖形已隔離。'},
 {start:17,end:20,title:'圖案化抗鍍層',key:19.8,watch:'抗鍍層留下填孔與上層焊墊的開口，其他位置受保護。',detail:'曝光、顯影合併為開口形成；畫面只保留本題所需的圖形。'},
 {start:20,end:25,title:'通電填孔與鍍厚',key:24.8,watch:'外部電源經連續薄銅供電，銅逐步填入盲孔並在開口內長厚。',detail:'填孔與圖案銅的形貌是定性示意；孔內連接不能與下層捕捉墊分離。'},
 {start:25,end:28,title:'去膜與薄銅蝕除',key:27.9,watch:'先去除抗鍍層，再蝕除外露薄銅；圖形下方的銅保留。',detail:'只有外露薄銅完全移除後，兩個上層金屬圖形才隔離。'},
 {start:28,end:31.5,title:'層間連通與隔離',key:30,watch:'中央上層焊墊經填銅盲孔接到原捕捉墊，旁邊圖形保持分離。',detail:'綠色虛線只標示連接路徑，不代表實際電流或電測數值。'},
 {start:31.5,end:34,title:'完成件退場',key:32.5,watch:'已完成的載板連同增層與銅孔一起退出；下一輪換入新載板。',detail:'材料變化沒有倒轉。此例只展示一層增層與一個代表孔。'}
];
export function stateAt(t){t=Math.max(0,Math.min(duration-.000001,t));const index=stages.findIndex(s=>t<s.end);return {t,index,stage:stages[index],enter:smooth(ramp(t,0,1.5)),exit:smooth(ramp(t,31.5,34)),film:ramp(t,2,5),cured:t>=5.5,hole:ramp(t,6.6,9.5),clean:ramp(t,10.3,12.3),seed:ramp(t,13.3,16.3),resist:ramp(t,17.2,19.2)*(1-ramp(t,25,26)),fill:ramp(t,20.2,23.3),pad:ramp(t,23.3,24.6),etch:ramp(t,26,27.8),connected:t>=16.3,isolated:t>=27.8};}

