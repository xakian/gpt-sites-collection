import {ramp,ease,lerp} from './view.js';
export const state=t=>({melt:ramp(t,4,8),gas:ramp(t,6,9),vacuum:ramp(t,10,15)*(1-ramp(t,22,25)),escape:ramp(t,15,21),cool:ramp(t,24,27),exit:ease(ramp(t,28,30)),incoming:ease(ramp(t,30,31)),open:ramp(t,27,28)*(1-ramp(t,31,32))});
export function bubbles(t){const s=state(t),rows=[{x:170,y:122,r:6,side:-1},{x:245,y:126,r:7,side:1},{x:300,y:120,r:5,side:1}];return rows.map((b,i)=>{const end=19+i*.8,e=ramp(t,15+i*.7,end),out=ramp(t,end,end+1.1);return {...b,x:lerp(b.x,b.side<0?48:432,e),y:b.y-100*out,r:lerp(b.r*(1+.65*ramp(t,10,15)),3,out),opacity:s.gas*(1-ramp(t,end+.8,end+1.2))}}).concat([{x:210,y:130,r:4,opacity:s.gas},{x:275,y:132,r:3,opacity:s.gas}]);}
export const topic={title:'真空迴焊減少空洞',question:'焊料熔化時，降壓怎麼幫助氣泡離開？',duration:32,overview:20,intro:'採晶粒對金屬化基板的焊膏接合示例，固定使用Sn96Ag4合金與GENMA T220-FLV-1B-T3的ROL1助焊體系作材料依據；腔體與接合層放大圖追蹤同一批氣泡。',simplifications:'金屬化晶粒背面與基板視為可潤濕；材料依廠商公開應用選定，不代表採用廠商所有性能主張。焊膏顆粒、助焊劑反應與揮發合併為定性氣體符號，放大接合層厚度與氣泡尺寸；不是設備熱曲線、數值壓力或實測空洞率。以受控降壓、停留、惰性氣體回填與冷卻概括流程。沒有用管子伸進焊點，固化後殘餘空洞保留。',sources:[{title:'GENMA · T220-FLV-1B-T3',url:'https://www.genma.eu/en/solder-paste/details/t220-flv-1b-t3-t220.html',claim:'產品資料列出Sn96Ag4、ROL1助焊體系及真空爐、DIE／功率元件接合應用；不引用其低空洞性能數字。'},{title:'Heller · Controlled Vacuum Reflow',url:'https://hellerindustries.com/wp-content/uploads/2022/04/Void-Reduction-Warpage-Vacuum-Reflow-Soldering.pdf',claim:'焊料液態時受控降壓，氣泡膨脹並接近邊緣逸出；過快降壓可能飛濺，需控制壓力與回填歷程。'}],steps:[
{start:0,key:2,title:'未熔化焊膏與承托',what:'晶粒已定位在焊膏層上，基板由承托台支撐。右側／下方是同一接合層放大圖。',detail:'固定材料為Sn96Ag4／ROL1助焊體系；灰色顆粒示意尚未熔化的合金，尺寸不按比例。'},
{start:4,key:9,title:'液態潤濕與含氣泡',what:'升溫使合金熔化並潤濕金屬化接合面，助焊體系揮發或反應產生部分氣體。',detail:'晶粒與基板仍留在承托位置；有氣泡不代表材料整層消失。'},
{start:10,key:14.8,title:'液態階段受控降壓',what:'腔內壓力逐步降低，液態焊料中的氣泡膨脹。',detail:'壓力條是定性指示，沒有設備參數；過快降壓可能飛濺或造成位移，並非越快越好。'},
{start:15,key:20,title:'氣泡移往邊緣排出',what:'部分氣泡移到接合層左右自由邊緣，逸入腔體並經上方管路抽走。',detail:'排氣繞過晶粒外緣，不穿透完整固態晶粒或基板。仍有兩個小氣泡保留。'},
{start:22,key:26.8,title:'回填冷卻，保留空洞',what:'受控惰性氣體回填後冷卻，焊料凝固，剩餘氣泡成為固態接合中的空洞。',detail:'這是較少空洞的示例，不能由此宣稱完全潤濕或可靠度必然合格；已凝固空洞不再被真空抽走。'},
{start:28,key:29,title:'接合件帶殘餘狀態離場',what:'接合件帶著殘餘空洞移出，新材料進場。',detail:'抽走的氣體不倒灌，完成件不倒退變回焊膏。'}]};

