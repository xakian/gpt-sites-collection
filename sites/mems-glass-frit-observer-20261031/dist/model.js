export const title='MEMS 空腔玻璃釉封裝',duration=34,overview=29;
export const ramp=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a))),smooth=x=>x*x*(3-2*x);
export const stages=[
{start:0,end:3,title:'預製器件與凹槽蓋片',key:2.5,watch:'下方微結構由錨點支撐，中間懸空；上方是已加工凹槽的蓋片。',detail:'固定剖面呈現上下間隙。蓋片先以凹槽朝上準備印刷，器件在另一承載區等待。'},
{start:3,end:7,title:'周邊印玻璃釉膏',key:6.8,watch:'網版刮印只在蓋片周邊留下釉膏，俯視圖顯示環繞凹槽的閉合圖樣。',detail:'印刷在較耐受接觸的蓋片進行；網版不碰下方脆弱微結構。俯視小圖是同一蓋片的資訊視圖。'},
{start:7,end:11,title:'乾燥與有機物排除',key:10,watch:'未封合的蓋片先乾燥、排除釉膏中的有機物，氣體離開開放表面。',detail:'灰色粒子只代表排出的揮發物，向上通往排氣；此時空腔尚未封閉。'},
{start:11,end:14,title:'預玻璃化',key:13.5,watch:'預處理後留下連續的玻璃釉環，仍保持蓋片與器件分離。',detail:'本例採傳統印刷、排膠、預玻璃化的代表次序，未採來源論文研究的噴印變體。'},
{start:14,end:20,title:'翻面對準與落位',key:19.8,watch:'同一蓋片翻至凹槽朝下，在受控氣氛中對準器件外圍承載區。',detail:'本例以受控乾燥氮氣作示意；受控氣氛不等於真空，沒有顯示抽真空。'},
{start:20,end:26,title:'熱與壓力接合',key:24,watch:'壓頭在蓋片邊框上方施力，玻璃釉潤濕外圍接合面。',detail:'熱與壓力使周邊接合，不把玻璃灌進腔內。載台從下方承托，壓頭不接觸可動結構。'},
{start:26,end:31.5,title:'冷卻並保留空腔',key:29,watch:'周邊釉環持續閉合，中央上下空間仍在。微幅位移示意結構沒有被填住。',detail:'只用小幅活動呈現間隙，不模擬感測電路。未進行洩漏檢測，不能據此宣稱達到氣密規格。'},
{start:31.5,end:34,title:'完成件退出',key:32.7,watch:'蓋片、釉環與器件作為同一件封裝退出，新器件與新蓋片進入下一輪。',detail:'已形成的釉環不自行打開，空腔不在接縫中被填滿。'}];
export function stateAt(t){t=Math.max(0,Math.min(duration-.000001,t));const index=stages.findIndex(x=>t<x.end),wet=smooth(ramp(t,21,25));return {t,index,stage:stages[index],enter:smooth(ramp(t,0,1.5)),exit:smooth(ramp(t,31.5,34)),print:ramp(t,3.3,6.7),burn:t>=7&&t<11,pre:ramp(t,11,14),flip:smooth(ramp(t,14,17)),lower:smooth(ramp(t,17,20)),wet,pressure:ramp(t,20,21)*(1-ramp(t,25,26)),heat:ramp(t,7,8)*(1-ramp(t,13,14))+ramp(t,20,21)*(1-ramp(t,25,27)),motion:t>=27&&t<31.5?3*Math.sin((t-27)*4)*Math.sin(Math.PI*ramp(t,27,31.5)):0};}
