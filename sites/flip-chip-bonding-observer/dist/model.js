export const DURATION=36000;
export const clamp=x=>Math.max(0,Math.min(1,x));
export const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
export const between=(t,a,b)=>clamp((t-a)/(b-a));
export const stages=[
 {start:0,end:2.8,key:1.8,title:'辨認晶粒與凸塊',watch:'藍灰色是同一顆晶粒，帶金色接點的一面是接合面。四個代表凸塊已在進場前製備完成；下方是同一片封裝基板。',detail:'A 到 D 是追蹤用編號，不是腳位規格。接合面有電路與接點，背面沒有這一排凸塊。晶粒上的深色角標也會跟著翻轉。'},
 {start:2.8,end:7,key:5.2,title:'晶粒翻面',watch:'晶粒沿畫面左右方向的軸翻轉半圈，讓原本朝上的接合面朝下。凸塊跟著晶粒轉動，沒有另外換一組。',detail:'固定側視投影會讓中途的面與凸塊互相遮擋；A、B、C、D 的左右順序不變。此處省略取放頭，翻轉動作由設備完成。'},
 {start:7,end:12,key:11.8,title:'助焊、對位與放置',watch:'紫色薄層示意少量免清洗助焊劑加到基板焊墊，再將每顆凸塊對準自己的焊墊，平穩下降放置。',detail:'本例選用與毛細底填膠相容的超低殘留免清洗助焊路線。放置接觸還不等於已形成穩定焊點；本例的冶金接合接著由迴焊完成。'},
 {start:12,end:18,key:15.5,title:'迴焊、潤濕與冷卻',watch:'加熱使焊料熔融並潤濕上下接點，晶粒略微下沉。冷卻後焊料凝固，形成持續連接晶粒與基板的焊點。',detail:'焊料外形改變時，上端始終接著晶粒接點，下端接著基板焊墊。省略爐體、溫度曲線與界面金屬間化合物；顏色只提示狀態，不代表溫度。'},
 {start:18,end:27,key:22.8,title:'毛細底填',watch:'點膠針在晶粒邊緣供膠。底填膠靠毛細作用沿間隙前進，包圍已形成的焊點；不是把焊點推走。',detail:'膠會從焊點前後的三維空隙繞行，所以剖面裡可在焊點另一側繼續出現。下方俯視圖示意這條繞行路徑。膠不穿過晶粒、基板或實心焊點。'},
 {start:27,end:30,key:29.5,title:'填滿後固化',watch:'間隙填滿後加熱，使底填膠固化。綠色逐漸加深與細紋用來區分液態、固化態。焊點一直留在原位。',detail:'底填膠提供保護與機械支撐，分散熱膨脹差異帶來的應力。電性連接仍由焊點形成；底填膠不是導線。'},
 {start:30,end:33,key:31.5,title:'接合完成',watch:'觀察晶粒接點、焊點、基板焊墊及基板線路形成的一條連接路徑。四個代表焊點與固化底填膠保持分明。',detail:'亮線僅是連接路徑示意，不是模擬真實電流、電子移動速度或測試結果。基板線路只畫代表片段，不是完整配線設計。'},
 {start:33,end:36,key:34,title:'完成組件離場',watch:'完成組件保持焊接與固化狀態，整組離開畫面。下一輪再由新的晶粒與新的基板進場。',detail:'循環不把成品倒轉回原料。短暫空場用來清楚區隔兩組材料；拖曳定位是回看示範時間，不是逆向加工。'}
];
export function stateAt(ms){
 const t=Math.max(0,Math.min(35.999999,ms/1000));
 const stage=stages.findIndex(s=>t<s.end);
 return {t,stage,flip:ease(between(t,2.8,7)),align:ease(between(t,8.2,9.4)),place:ease(between(t,9.4,11.8)),wet:ease(between(t,12.8,15.2)),hot:between(t,12,13.8)*(1-between(t,16,18)),flux:ease(between(t,7,8.2)),residue:1-.82*ease(between(t,12,16)),fill:ease(between(t,18.7,26.5)),cure:ease(between(t,27,30)),trace:between(t,30.2,32),offset:t<.9?-1.35*(1-ease(t/.9)):t>=33?1.35*ease(between(t,33,35.2)):0,visible:t<35.2};
}
export const CONTACTS=['A','B','C','D'];
export function contactGeometry(s,layout){
 const {cx,dieWidth,subY,hoverY}=layout;
 const angle=s.flip*Math.PI;
 const cy=hoverY+(subY-64-hoverY)*s.place+8*s.wet;
 const dx=-28*(1-s.align);
 return CONTACTS.map((id,i)=>({id,x:cx+dx+dieWidth*(-.36+i*.24),padX:cx+dieWidth*(-.36+i*.24),cy,angle,top:cy+26,bottom:subY,gap:38-8*s.wet}));
}
export function jointPath(x,top,bottom,wet,r){
 const h=bottom-top,tip=r*(.12+.70*wet),neck=r*(.9-.08*wet);
 return `M ${x-r*.65} ${top} C ${x-neck*1.25} ${top+h*.22},${x-neck*1.2} ${bottom-h*.25},${x-tip} ${bottom} L ${x+tip} ${bottom} C ${x+neck*1.2} ${bottom-h*.25},${x+neck*1.25} ${top+h*.22},${x+r*.65} ${top} Z`;
}
