import {add,transfer,smooth,lerp,travel} from './layouts.js';
export const clamp=x=>Math.max(0,Math.min(1,x));
export const progress=(t,a,b)=>clamp((t-a)/(b-a));
export const stages=[
 {id:'dicing',label:'晶圓切割',time:1700,io:'膠帶環框上的晶圓 → 可拾取的晶粒',description:'一片已完成電路製作的晶圓，被分成可個別取出的晶粒。切割後晶粒仍固定在膠帶上，這一輪只取出其中一顆。',points:['其餘晶粒留在膠帶上，送往待續處理區。','切割分開已存在的晶粒，不在這一步製造電路。'],simplification:'只展示八條代表刀路；冷卻水、清洗、乾燥與詳細刀具動作未展開。晶圓測試、所需薄化與貼膜已在場景開始前完成。'},
 {id:'attach',label:'固晶',time:5300,io:'晶粒＋導線架＋固晶膠 → 固定的晶粒',description:'把晶粒放到導線架中央的承晶墊上，以環氧固晶膠形成接合。這一步提供支撐與定位，通往封裝引腳的接線接著才會形成。',points:['中央承晶墊與兩側引腳內端之間保留空隙。','此時金線數為零；料條外框仍然存在。'],simplification:'膠材固化併入停留時間；實際導線架常以料條批次處理，畫面只放大其中一個工作單元。'},
 {id:'bond',label:'打線',time:8300,io:'已固晶的料條 → 八條內部連線',description:'金線逐條連接晶粒上的接線墊與導線架引腳。圖中用八條示意線一對一對應八個引腳，形成通往封裝外部的電性連接。',points:['每條金線都有晶粒端與引腳端接點。','主場景是俯視；下圖補充線弧的高度。'],simplification:'八個接線墊是教學配置，不是真實 IC pinout。採金線示例，實際產品也可能使用其他線材；不演示真實線徑與多層線弧。'},
 {id:'mold',label:'封膠',time:11300,io:'完成打線的料條 → 模封料條',description:'環氧模封材料在模穴內包覆晶粒和金線，固化後形成實心保護體。內部結構仍然存在，只是被不透明材料遮住。',points:['外引腳與待剪除的料條結構仍留在外側。','包覆材料不是套上一個空心蓋子。'],simplification:'用覆蓋動畫表示填充，沒有求解真實流場；固化時間已壓縮，清洗與去溢膠未另設站。'},
 {id:'trim',label:'剪切成形',time:14300,io:'模封料條 → 獨立的八腳 SOIC',description:'剪除引腳之間的暫時連接筋與外框，形成可獨立搬運的封裝，並把外引腳整理成所需形狀。本例保留兩側各四個引腳。',points:['剪掉外部共接金屬；保留八條有效內線。','框料進入本站回收口，不隨成品進入測試座。'],simplification:'多個機械工序合併成一站；gull-wing 引腳的垂直折彎由側視示意說明。選用預鍍導線架，沒有另設鍍腳站。'},
 {id:'test',label:'成品測試',time:17300,io:'獨立封裝 → 電性檢測通過的成品',description:'成品進入測試座，接點接觸八個外引腳以檢查電性功能與規格。測試結束後，成品從獨立出口離開。',points:['通過只改變檢測狀態，不改變材料或幾何。','只演示一顆通過案例，不代表良率 100%。'],simplification:'此處不等同完整可靠度資格驗證。未演示捲帶、裝管、出貨與 PCB 組裝；下一輪由新晶圓開始。'}
];
export const pads=Array.from({length:8},(_,i)=>({id:(i<4?'L':'R')+(i%4+1),side:i<4?-1:1,pad:[i<4?-10:10,[-9,-3,3,9][i%4]],finger:[i<4?-24:24,[-27,-9,9,27][i%4]]}));
export const topic={id:'soic-8',title:'SOIC-8 封裝觀察',durationMs:18000,keyframes:stages.map(s=>({id:s.id,label:s.label,timeMs:s.time})),learningGoals:['晶粒原先就在已加工晶圓上。','封裝逐步加入支撐、內部連接與保護材料。','最終測試檢查功能與規格。'],evaluate};
export function evaluate(ms,layout,cycleId=0){
 const t=(((ms%18000)+18000)%18000)/1000,a=layout.anchors;
 const ingress=progress(t,0,.35),remaining=progress(t,3,3.6);
 const waferPos=t<3?add(a[0],[0,-200*(1-smooth(ingress))]):add(a[0],[-220*smooth(remaining),0]);
 let assemblyPos=a[1];
 if(t<2.8)assemblyPos=add(a[1],[0,-180*(1-smooth(progress(t,2.4,2.8)))]);
 if(t>=5.4&&t<6)assemblyPos=travel(layout,1,progress(t,5.4,6));
 if(t>=6)assemblyPos=a[2];
 if(t>=8.4&&t<9)assemblyPos=travel(layout,2,progress(t,8.4,9));
 if(t>=9)assemblyPos=a[3];
 if(t>=11.4&&t<12)assemblyPos=travel(layout,3,progress(t,11.4,12));
 if(t>=12)assemblyPos=a[4];
 if(t>=14.4&&t<15)assemblyPos=travel(layout,4,progress(t,14.4,15));
 if(t>=15)assemblyPos=a[5];
 if(t>=17.4)assemblyPos=add(a[5],[(layout.id==='wide'?-1:1)*220*smooth(progress(t,17.4,17.9)),0]);
 const pick=progress(t,1.7,2.2),wait=add(a[1],[-78,-70]);
 let diePos=t<=1.7?waferPos:add(a[0],[0,-70*smooth(pick)]);
 if(t>=2.4)diePos=transfer(add(a[0],[0,-70]),wait,progress(t,2.4,3));
 if(t>=3)diePos=wait;
 if(t>=3.45)diePos=lerp(wait,a[1],smooth(progress(t,3.45,4.25)));
 if(t>=4.25)diePos=assemblyPos;
 const wires=pads.map((_,i)=>progress(t,6.2+i*.24+.048,6.2+i*.24+.192));
 const trim=progress(t,12.2,12.95),scrap=progress(t,12.95,13.55),formed=progress(t,13.55,14.2);
 const phase=t>=17.9?'idle':t>=17.4?'exit':t%3>=2.4?'transfer':t%3>=2.2?'hold':'process';
 return {t,stageId:Math.min(5,Math.floor(t/3)),phase,ids:{cycleId,waferId:`${cycleId}:wafer`,dieId:`${cycleId}:die`,assemblyId:`${cycleId}:assembly`},waferPos,waferVisible:t>0&&t<3.6,waferCutProgress:Array.from({length:8},(_,i)=>progress(t,.5+i*.15,.5+(i+1)*.15)),pickedDieVisible:t>1.7&&t<17.9,dieVisible:t>0&&t<17.9,diePos,sourceHole:t>1.7,assemblyPos,assemblyVisible:t>2.4&&t<17.9,attached:t>=4.25,adhesive:progress(t,3.12,3.45),wireProgress:wires,bondCount:wires.filter(p=>p===1).length,encapsulantCoverage:progress(t,9.2,10.5),hasEncapsulant:t>=10.5,trimProgress:trim,scrapProgress:scrap,formed,temporaryMetal:t<13.55,testStatus:t>=16.8&&t<17.9?'pass':t>=15.4&&t<16.8?'testing':'idle',testProgress:progress(t,15.4,16.8),contact:t>=15&&t<16.8?progress(t,15,15.4):t>=16.8&&t<17.2?1-progress(t,16.8,17.2):0,toolPoses:{saw:t>=.5&&t<1.7,pickup:t>1.7&&t<4.6,dispenser:t>=3&&t<3.45,bond:t>=6.2&&t<8.2,trim:t>=12.2&&t<12.95},portVisibility:{wafer:t>0&&t<3.6,frame:t>2.4&&t<3,scrap:t>=12.95&&t<13.55,exit:t>=17.4&&t<17.9}};
}
