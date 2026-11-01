export const title='矽光子光纖主動對準',duration=34,overview=29;
export const ramp=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a))),smooth=x=>x*x*(3-2*x);
export const positions=[[0,24],[4,24],[6,8],[8,-16],[10,10],[12,-7],[14,2],[18,2],[20,.8],[21,6],[23.5,1.2],[34,1.2]];
export function offsetAt(t){if(t>=23.5)return 1.2;for(let i=1;i<positions.length;i++){const[a,x]=positions[i-1],[b,y]=positions[i];if(t<=b)return x+(y-x)*smooth(ramp(t,a,b));}return 1.2;}
export const stages=[
{start:0,end:4,title:'粗略位置與測試光',key:3,watch:'透鏡端光纖與晶片邊緣之間保留工作間隙，光纖模場偏離耦合器。',detail:'測試光由左側注入；晶片波導右端的接收器保持固定。未耦入部分以散射等損失示意。'},
{start:4,end:10,title:'小幅搜尋',key:8,watch:'定位架緩慢搜尋，模場重疊隨位置改變；短條顯示同一條固定接收路徑的相對收光。',detail:'這是量測回饋指引機械對位，光束不會自行追逐目標。本圖只展開一個橫向自由度。'},
{start:10,end:15,title:'找較佳耦合位置',key:14.5,watch:'縮小搜尋幅度，逐步接近較佳模場重疊，收光變強但不達百分之百。',detail:'邊緣逆向漸變波導的窄尖端面對光纖，光場再逐漸收進晶片波導；圖形非精確模擬。'},
{start:15,end:20,title:'固定區點膠與細調',key:18.8,watch:'在光纖後方與支座間點膠，光學端面與工作間隙保持清楚；未固化時仍可細調。',detail:'固定膠沒有填入光學通道。本例膠形狀隨尚未鎖定的光纖位置改變，表示液態可調階段。'},
{start:20,end:24,title:'UV 初期監看與補償',key:21,watch:'UV 固化初期的示意偏移讓收光下降，定位架在仍可調期間補償偏移。',detail:'持續量測，不假設膠毫無收縮。補償只在本例尚可調的時間窗口進行，並非任意固化膠皆可移動。'},
{start:24,end:27,title:'維持位置並完成固化',key:26.5,watch:'位置停止調整，持續監看並完成固化，固定膠形成支撐。',detail:'此後光纖不再穿過固體膠繼續移動；UV 劑量、配方與凝膠時點均未給通用數值。'},
{start:27,end:31.5,title:'鬆夾後再次量測',key:29,watch:'定位架鬆開，光纖由固定膠與支座維持位置；固定接收器再次量測。',detail:'畫面展示這一件重測仍有耦合，不保證所有產品無偏移或完全耦合；量產仍須依實際規格判定。'},
{start:31.5,end:34,title:'固定組件退出',key:32.5,watch:'晶片、光纖與固化膠一同退出，下一輪才換新件搜尋。',detail:'不解除已固化膠，不在原件上重置已完成的固定關係。'}];
export function stateAt(t){t=Math.max(0,Math.min(duration-.000001,t));const index=stages.findIndex(x=>t<x.end),offset=offsetAt(t),power=.85*Math.exp(-((offset/14)**2));return {t,index,stage:stages[index],offset,power,loss:1-power,enter:smooth(ramp(t,0,1.3)),exit:smooth(ramp(t,31.5,34)),glue:ramp(t,15.2,18),cure:ramp(t,20,26),release:smooth(ramp(t,27,28.5)),uv:t>=20&&t<26,feedback:t>=4&&t<24};}

