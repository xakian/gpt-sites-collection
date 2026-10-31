export const DURATION=48000;
export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
export const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
export const stages=[
 {start:0,end:4,title:'新原料熔化',key:3,what:'高純度多晶矽裝入石英坩堝，經加熱成為熔體。這是新爐次的原料。',detail:'原料本來含有不同晶向；熔化後不再保留原來各晶粒的排列。加熱、氣氛建立與穩溫在此大幅縮時。'},
 {start:4,end:7,title:'晶種接觸熔體',key:6.9,what:'小晶種慢慢下降到熔體表面。合適的溫度條件讓矽開始在晶種上結晶。',detail:'拉升不是把液體拉成固體：固液界面需要移走凝固熱，才會有新的固體形成。'},
 {start:7,end:12,title:'先長出細頸',key:10,what:'先拉出一段細頸。晶種及已凝固的部分向上移，新材料持續從下端的固液界面加入。',detail:'工業上細頸用來協助排除接種時引入的差排。此圖不模擬差排運動或頸部承重。'},
 {start:12,end:18,title:'肩部逐漸展寬',key:16,what:'調整熱場與拉速，讓固液界面的生長直徑逐漸增加，形成肩部。',detail:'肩部在下端依序形成，已經形成的細頸不會橫向膨脹。不是把原本的細棒拉粗。'},
 {start:18,end:31,title:'等徑段持續生長',key:27,what:'晶棒長出近似固定直徑的主體。你可以追蹤晶棒上的細線：它們隨固體向上移，新的材料仍只在下端加入。',detail:'溫度梯度、拉速與旋轉需要共同維持適當的界面條件。熔體減少，液面隨之下降；實機也可能升降坩堝補償液面。'},
 {start:31,end:36,title:'縮小直徑，形成尾錐',key:34.5,what:'等徑段完成後，逐漸縮小生長直徑，留下錐形尾部，再脫離熔體。',detail:'晶棒已有的主體保留原形；縮細的是最後正在形成的下端。圖中將界面畫成平面，以便觀察位置。'},
 {start:36,end:43,title:'脫離、冷卻與取出',key:38.5,what:'尾部離開熔體，這根晶棒不再增長。先展示完整形狀，再向上取出。',detail:'冷卻與取出大幅縮時；沒有表示熱晶棒能立即接觸空氣。實機有爐室、氣氛與搬運設備。'},
 {start:43,end:48,title:'換爐次，裝入新原料',key:47,what:'完成的晶棒已離場。殘餘熔體與舊坩堝退出示意畫面，新坩堝、原料與晶種進場。',detail:'這是不同爐次的時間跳接，不是將晶棒倒回熔體；也不是連續補料 CZ。清爐、冷卻和裝料設備省略。'}
];
export function radiusAt(s){if(s<=30)return 6;if(s<=75)return 6+40*smooth((s-30)/45);if(s<=235)return 46;return 46*(1-smooth((s-235)/40))+1*smooth((s-235)/40);}
// Integral of r² dz, omitting pi on both sides. Fixed samples make every frame seekable.
const areaTable=[0];for(let i=1;i<=1100;i++){let a=(i-1)/4,b=i/4;areaTable[i]=areaTable[i-1]+(radiusAt(a)**2+4*radiusAt((a+b)/2)**2+radiusAt(b)**2)*(b-a)/6;}
export function volumeAt(g){const i=Math.min(1099,Math.floor(g*4)),f=g*4-i;return areaTable[i]+(areaTable[i+1]-areaTable[i])*f;}
export function stateAt(seconds){
 const t=clamp(seconds,0,48),index=stages.findIndex(s=>t<s.end),stage=stages[index<0?7:index];
 let growth=t<7?0:t<12?30*(t-7)/5:t<18?30+45*(t-12)/6:t<31?75+160*(t-18)/13:t<36?235+40*(t-31)/5:275;
 const meltDrop=volumeAt(growth)/(108**2),surface=330+meltDrop;
 const detached=t>=36;
 const lift=t<36?0:t<38?30*smooth((t-36)/2):t<40?30:30+500*smooth((t-40)/3);
 const tip=t<7?270+60*smooth((t-4)/3):surface-lift;
 const top=tip-growth,seedBottom=t<7?tip:top;
 const reset=t>=43,oldOffset=reset?-480*smooth((t-43)/2):0,newOffset=t>=45?480*(1-smooth((t-45)/2)):480;
 return {t,index:index<0?7:index,stage,growth,meltDrop,surface,tip,top,seedBottom,detached,lift,reset,oldOffset,newOffset,
  melt:smooth(t/4),crystalVisible:t<43,interfaceVisible:t>=6.99&&t<36,rotation:t<7?0:Math.min(t,36)-7,
  seedNewOpacity:t>=46?smooth((t-46)/1.5):0};
}
export function profilePoints(g){const points=[];for(let s=0;s<g;s+=1)points.push([radiusAt(s),s]);points.push([radiusAt(g),g]);return points;}
