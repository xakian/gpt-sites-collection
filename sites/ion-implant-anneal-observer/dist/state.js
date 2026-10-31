export const DURATION=40;
export const clamp=x=>Math.max(0,Math.min(1,x));
export const smooth=x=>{const p=clamp(x);return p*p*(3-2*p);};
export const steps=[
 {start:0,key:2,title:'開窗選區',body:'這是一塊近乎本徵的矽。已完成圖案化的光阻遮住兩側，中央開窗露出要摻雜的區域。',detail:'追蹤的是同一塊代表材料。光阻需有足夠厚度，才能阻擋選定能量的離子；本輪從已開窗的光阻開始，省略微影。'},
 {start:3,key:10.5,title:'佈植與局部損傷',body:'加速的磷離子穿過開口，在矽中逐漸失去能量並停下。兩側離子停在光阻內；中央部分矽原子被撞離原位，留下空位與間隙原子。',detail:'磷進入材料，不等於已全部電性活化。三顆有標記的磷用來追蹤身分；實際離子很多，停止深度有分布。虛線圈表示空的晶格位置。'},
 {start:12,key:14.8,title:'去除光阻',body:'佈植結束後移除光阻，再清潔表面。被光阻攔住的磷隨去除的材料帶走；進入矽中的磷和局部損傷仍然留在原處。',detail:'畫面以光阻淡化並向上離開表示去膠與清洗，不表示整片光阻被機械剝起。本流程在高溫退火前先去除光阻。'},
 {start:16,key:23.8,title:'退火修復與活化',body:'熱處理讓原子能重新排列，減少佈植缺陷。追蹤的磷移入矽的晶格位置，成為可提供電子的施體；鄰近被擾動的晶格逐步恢復。',detail:'修復與活化是相關但不同的結果，不保證完全同步或百分之百。多餘矽移往表面代表缺陷匯；真實路徑還包括空位與間隙原子復合。'},
 {start:25,key:27,title:'冷卻，保留摻雜',body:'加熱結束，材料回到室溫。磷仍在晶格內，摻雜不會隨著熱色消退而消失。',detail:'這裡把冷卻獨立呈現，以區分永久的製程改變與溫度造成的即時載子變化。電子符號稍後才顯示，並非冷卻時沒有電子。'},
 {start:28,key:32,title:'更多可移動電子',body:'在室溫、適當摻雜條件下，活化的磷能提供容易脫離束縛的電子，形成 n 型區域。施體留在晶格中，可移動電子增加，使導電特性改變。',detail:'青色小點是電子；P⁺ 是已提供電子的施體，仍固定在晶格位置。沒有外加電場，這裡不畫單向電流。導電率也取決於遷移率、溫度與補償摻雜。'},
 {start:35,key:36,title:'完成材料退場',body:'完成佈植與退火的材料向右離開。另一塊已開窗的新材料從左進場，開始下一輪示範。',detail:'循環不會把活化磷變回入射離子，也不會倒轉晶格修復。新材料是另一塊，並非把同一塊矽還原。'}
];
export const dopants=[{c:4,r:1,launch:3.6,hit:5.6},{c:6,r:2,launch:5.8,hit:7.8},{c:5,r:3,launch:8,hit:10}];
export function sceneState(t){
 t=Math.min(DURATION,Math.max(0,t));
 const index=steps.reduce((a,s,i)=>t>=s.start?i:a,0);
 const fresh=t>=37.5,local=fresh?0:t;
 return {t,local,index,fresh,shift:fresh?-(1-smooth((t-37.5)/2.5)):smooth((t-35)/2.2),mask:1-smooth((local-12.5)/2.5),strip:smooth((local-12.5)/2.5),repair:smooth((local-18)/6),heat:smooth((local-16)/2)*(1-smooth((local-25)/3)),electrons:smooth((local-28)/1.7),damage:dopants.map(d=>smooth((local-d.hit)/.7)),arrivals:dopants.map(d=>clamp((local-d.launch)/(d.hit-d.launch)))};
}
