// Replace this isolated sample with the user's formal content Word when supplied.
export const content={
 id:'foundry-sample-v1',version:'sample-1.0.0',title:'半導體製程實驗基地',sample:true,
 materials:[
  {id:'raw',name:'試驗晶圓',short:'原',color:'#bfa877'},
  {id:'processed',name:'已加工試驗片',short:'製',color:'#729c92'},
  {id:'suspect',name:'待檢試驗片',short:'待',color:'#bd9269'},
  {id:'accepted',name:'已檢合格試驗片',short:'合',color:'#087d91'},
  {id:'rejected',name:'不合格試驗片',short:'退',color:'#b56c56'}
 ],
 buildings:[
  {id:'depot',name:'物料庫',label:'供料',shape:'depot',behavior:'supply',footprint:[{q:0,r:0}],entrance:{q:1,r:0},cost:12,capacity:60,recipes:[],power:0,unlock:null},
  {id:'process',name:'製程示意站',label:'加工',shape:'process',behavior:'process',footprint:[{q:0,r:0}],entrance:{q:1,r:0},cost:18,capacity:9,recipes:['process'],power:2,unlock:null},
  {id:'inspection',name:'檢測站',label:'檢測',shape:'inspection',behavior:'inspection',footprint:[{q:0,r:0}],entrance:{q:1,r:0},cost:16,capacity:9,recipes:['inspect','inspect-risk'],power:1,unlock:null},
  {id:'dispatch',name:'交付站',label:'交付',shape:'dispatch',behavior:'delivery',footprint:[{q:0,r:0}],entrance:{q:1,r:0},cost:12,capacity:12,recipes:[],power:0,unlock:null},
  {id:'utility',name:'廠務中心',label:'廠務',shape:'utility',behavior:'utility',footprint:[{q:0,r:0},{q:0,r:1}],entrance:{q:1,r:0},cost:28,capacity:0,recipes:[],power:0,unlock:'stable'}
 ],
 recipes:[
  {id:'process',name:'示意加工',building:'process',inputs:{raw:1},outputs:{processed:1},duration:8,power:2,qualityRule:'cadence',fast:{durationMultiplier:.625,powerMultiplier:2,every:3,improvedEvery:5,technology:'stable',outputs:{suspect:1}},knowledge:'process'},
  {id:'inspect',name:'檢測',building:'inspection',inputs:{processed:1},outputs:{accepted:1},duration:4,power:1,qualityRule:'classify',knowledge:'inspection'},
  {id:'inspect-risk',name:'異常批次檢測',building:'inspection',inputs:{suspect:1},outputs:{rejected:1},duration:4,power:1,qualityRule:'classify',knowledge:'inspection'}
 ],
 technologies:[{id:'stable',name:'製程穩定化',requires:[],delivered:4,cost:22,duration:12,description:'快速模式每第 3 批異常，改善為每第 5 批；屬教學規則。'}],
 orders:[
  {id:'first',name:'首批試驗片',target:1,reward:20,description:'親自完成取料、加工、檢測與交付。',unlock:'workers'},
  {id:'team',name:'小量驗證',target:4,reward:32,description:'安排搬運與操作，觀察等待及供電。',unlock:'research'},
  {id:'pilot',name:'試驗線運轉',target:8,reward:60,description:'交付共 8 片合格試驗片，可繼續自由經營。',unlock:'freeplay'}
 ],
 routes:[{material:'raw',from:'depot',to:'process'},{material:'processed',from:'process',to:'inspection'},{material:'suspect',from:'process',to:'inspection'},{material:'accepted',from:'inspection',to:'dispatch'}],
 map:{radius:8,player:{q:-3,r:1},workers:[{q:-3,r:3},{q:-2,r:3}],buildings:[{type:'depot',q:-4,r:1,inventory:{raw:24}},{type:'process',q:-1,r:-1},{type:'inspection',q:2,r:-1},{type:'dispatch',q:4,r:1},{type:'utility',q:0,r:3}],terrain:[{q:-6,r:-1,level:2},{q:-6,r:0,level:1},{q:5,r:-4,level:1},{q:6,r:-4,level:2},{q:4,r:3,level:-1}]},
 knowledge:[
  {id:'process',name:'製程與製程窗',fact:'晶片製造在晶圓上反覆建立圖形與薄層，包含成膜、微影、蝕刻及其他步驟。',observe:'比較穩定與快速模式：時間與用電改變，快速模式按批次出現異常。',simplification:'本站把多個製程抽象成一個示意站；秒數、電力點與每第幾批異常均為遊戲規則。產物是試驗片，並非完成晶片。',source:'https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made',sourceName:'ASML — How microchips are made'},
  {id:'inspection',name:'檢測不會修復缺陷',fact:'量測與檢測可發現製程偏差，協助控制製程；檢測本身不會把有缺陷的元件修好。',observe:'待檢異常片經檢測後成為不合格片；合格交付數不增加。',simplification:'檢測在遊戲中完全準確，且只分合格與不合格；沒有真實的量測誤差、抽樣與多項規格。',source:'https://www.asml.com/en/technology/lithography-principles',sourceName:'ASML — Lithography principles'},
  {id:'logistics',name:'搬運與等待',fact:'半導體製造需要設備間的物料搬運，並在多個製程階段進行量測。',observe:'移動設備，觀察工人走行格數與累計搬運時間；更長路徑占用更多時間。',simplification:'工人步行與六角格代替真實廠內自動搬運系統；不模擬粒子污染或完整潔淨室。',source:'https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made',sourceName:'ASML — How microchips are made'}
 ]
};
