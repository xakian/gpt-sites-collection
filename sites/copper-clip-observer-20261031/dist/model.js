export const title='功率封裝銅夾接合',duration=30,overview=26;
export const ramp=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a))),smooth=n=>n*n*(3-2*n);
export const stages=[
 {start:0,end:3,title:'框架與晶粒進場',key:2.7,watch:'兩個獨立端子由載具支撐；晶粒的頂面與底面都有可接合金屬。',detail:'本例是雙端功率晶粒的互連示意，只觀察封裝，不展開導通原理。'},
 {start:3,end:7,title:'晶粒放置',key:6.8,watch:'晶粒落在端子 A 承載墊的焊料層上，底面電極朝下。',detail:'晶粒由承載墊與載具支撐。底面焊料稍後與銅夾接點一起進入代表性迴焊。'},
 {start:7,end:10,title:'準備兩端焊料',key:9.8,watch:'在晶粒頂面可焊金屬及右側端子 B 放置接合材料。',detail:'頂面接合區位於金屬化區域，不能把裸矽畫成可直接焊接表面。'},
 {start:10,end:15,title:'預成形銅夾對準',key:14.8,watch:'工具帶入已彎折成形的銅夾，對準晶粒頂面與端子 B，逐步下降。',detail:'銅夾跨越晶粒側壁與端子間隙；跨越區保持淨空，不碰到下方端子 A。'},
 {start:15,end:18,title:'銅夾落位與鬆夾',key:17.5,watch:'銅夾兩端落在焊料上，取放工具退出；載具與承托仍保留。',detail:'銅夾是一整片金屬橋，不是在現場拉粗的金線。'},
 {start:18,end:23,title:'焊料潤濕接合',key:22.5,watch:'受控迴焊讓三處焊料接合：晶粒底面、晶粒頂面與銅夾腳。',detail:'焊料潤濕相容金屬面；銅夾保持形狀，不能熔成液滴。'},
 {start:23,end:27.5,title:'冷卻與路徑觀察',key:26,watch:'冷卻後，頂面經銅夾連到端子 B；底面連到端子 A。',detail:'兩端子沒有被銅夾或溢出焊料短接。虛線只標示幾何連接，並非電流。組件接著待模封。'},
 {start:27.5,end:30,title:'接合件退場',key:28.5,watch:'完成組件連同固定銅夾退出，新框架、晶粒及銅夾進入下一輪。',detail:'循環不拆開已形成的焊點。模封、後段測試與元件電路省略。'}
];
export function stateAt(t){t=Math.max(0,Math.min(duration-.000001,t));const index=stages.findIndex(x=>t<x.end);return {t,index,stage:stages[index],enter:smooth(ramp(t,0,1.5)),exit:smooth(ramp(t,27.5,30)),die:smooth(ramp(t,3.2,6.5)),bottomSolder:ramp(t,1.8,2.8),topSolder:ramp(t,7.2,9.2),clipEnter:smooth(ramp(t,10,12)),clipDown:smooth(ramp(t,12,15)),toolExit:smooth(ramp(t,15.6,17.4)),wet:smooth(ramp(t,18.3,22.5)),heat:ramp(t,18,19)*(1-ramp(t,23,24.5)),cooled:t>=24.5};}
