export const title='X 光 CT 焊點孔洞檢測',duration=36,overview=27;
export const ramp=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a))),smooth=x=>x*x*(3-2*x);
// Known schematic object; these coordinates generate forward illustrations, never CT inversion.
export const joints=[{d:-24,u:0,v:0,r:18,name:'A'},{d:24,u:0,v:0,r:18,name:'B'}],voidPoint={d:24,u:7,v:3,r:7};
export function rotate(p,a){const x=a*Math.PI/180;return {...p,d:p.d*Math.cos(x)-p.u*Math.sin(x),u:p.d*Math.sin(x)+p.u*Math.cos(x)};}
const chord=(r,u,v)=>2*Math.sqrt(Math.max(0,r*r-u*u-v*v));
export function transmission(u,v,a){let metal=0;for(const j of joints){const q=rotate(j,a);metal+=chord(j.r,u-q.u,v-q.v);}const q=rotate(voidPoint,a);metal-=chord(q.r,u-q.u,v-q.v);return Math.exp(-.035*Math.max(0,metal));}
export function sliceAt(d){return {disks:joints.map(j=>({...j,r:Math.sqrt(Math.max(0,j.r*j.r-(d-j.d)**2))})).filter(j=>j.r>0),hole:Math.abs(d-voidPoint.d)<voidPoint.r?{...voidPoint,r:Math.sqrt(voidPoint.r**2-(d-voidPoint.d)**2)}:null};}
export const stages=[
{start:0,end:4,title:'試件與既有孔洞',key:3,watch:'兩個位於不同深度的金屬焊點 A、B，只有 B 內有一處既有孔洞。試件由旋轉載台承托。',detail:'儀器視角固定。主圖用半透明定位示意讓人追蹤內部，並不是肉眼能穿透封裝。'},
{start:4,end:8,title:'單張投影的重疊',key:6,watch:'0°方向的 A、B 在透射圖中重疊，這張圖不能單獨決定亮區位於哪個深度。',detail:'投影採透射亮度：穿透較多較亮，金屬路徑較長較暗；亮不等於一律不良。'},
{start:8,end:20,title:'分角度擷取投影',key:15,watch:'載台帶同一試件旋轉，光源與偵測器不動；投影位置隨角度改變。',detail:'只展示少數角度，實際掃描需要更多投影與充分角度覆蓋。此例使用平行束前向示意，不是設備精確光路。'},
{start:20,end:23,title:'多投影與示意體積',key:21.5,watch:'多角度投影提供重建資訊；接著顯示同一已知物件的預製體積資料。',detail:'本版沒有執行真正 CT 反算。投影及切片由同一組已知座標產生，只用來說明資訊差異。'},
{start:23,end:25.5,title:'資料切片 A',key:24,watch:'切到原試件深度 A，只有完整金屬焊點，沒有 B 內的孔洞。',detail:'切片是資料，試件沒有被 X 光切開；深度方向以原始0°試件座標為準，並非畫面左右。'},
{start:25.5,end:28.5,title:'資料切片 B：孔洞',key:27,watch:'切到 B 中心深度，顯示同一孔洞在該焊點內的位置。',detail:'切片採衰減反相灰階：金屬較暗、空腔較亮。顯示孔洞不等於自動判定失效。'},
{start:28.5,end:31,title:'離開孔洞所在深度',key:30,watch:'深度再移到 C，仍穿過 B 的部分金屬，但已離開孔洞範圍。',detail:'孔洞並未消失或修復，只是不再與這張切片相交。解析度與金屬偽影可能影響真實判讀。'},
{start:31,end:33,title:'保存影像與待判讀標記',key:32,watch:'留下 B 切片的資料副本並標記待判讀；實體試件仍保留原孔洞。',detail:'影像保存為動畫敘事示意，沒有真實設備量測，也沒有通用合格孔洞率。'},
{start:33,end:36,title:'試件退出，資料保留',key:34,watch:'原試件帶著孔洞退出，資料副本另存；下一輪才進入新試件與新掃描。',detail:'不在循環接縫中填平缺陷，也不把資料切片當成實體切除。'}];
export function stateAt(t){t=Math.max(0,Math.min(duration-.000001,t));const index=stages.findIndex(x=>t<x.end);let angle=30*smooth(ramp(t,8,10))+45*smooth(ramp(t,12,14))+45*smooth(ramp(t,16,18));let depth=t<25.5?-24:t<28.5?24:t<31?34:24;return {t,index,stage:stages[index],angle,depth,slice:t>=23,reconstruct:t>=20&&t<23,saved:t>=31,beam:t>=1.3&&t<20,enter:smooth(ramp(t,0,1.3)),exit:smooth(ramp(t,33,36))};}
