export const duration=36;
export const steps=[
 {at:0,end:5,title:'正面接合',key:2.5,what:'元件正面朝下，以接合膠固定到具有釋放層的透明載板。吸持工具在接合完成後才退出。',detail:'左側金色角標追蹤同一晶圓。從下往上是玻璃、釋放層、接合膠、元件正面與矽背面。'},
 {at:5,end:12,title:'背面磨薄',key:9,what:'磨輪從背面移除矽，載板持續承托。灰色碎屑代表離開的矽材料。',detail:'正面元件與角標保留。厚度變小是移除材料，不是壓縮整片矽。'},
 {at:12,end:17,title:'框架接手',key:16.5,what:'相容膠帶連同框架下降，黏附薄晶圓背面。新支撐到位後才解接合。',detail:'綠色膠帶與黃色接合膠是不同材料。框架邊緣由工具承托。'},
 {at:17,end:22,title:'雷射釋放',key:20,what:'雷射穿過透明玻璃，掃描指定釋放層，使界面失去黏著。',detail:'光束止於釋放結構，不燒除晶圓。尚未掃到的部分仍接合。'},
 {at:22,end:26,title:'載板分離',key:25,what:'薄晶圓留在框架上，玻璃由工具向下取走，另送清潔回用。',detail:'畫面不翻轉；正面朝下，背面始終貼著框架膠帶。'},
 {at:26,end:31,title:'去除殘膠',key:29.5,what:'框架持續支撐，清潔液帶走殘膠，露出元件面。',detail:'採相容的耐化學膠帶。此圖只畫材料去向，實際清潔配方與相容性須個別驗證。'},
 {at:31,end:36,title:'薄晶圓移交',key:32,what:'薄晶圓連同框架離開，下一輪送入新厚晶圓與新載板。',detail:'磨除的矽不會長回成品。載板另循清潔回用流程。'}
];
export const clamp=x=>Math.max(0,Math.min(1,x));
export const ramp=(t,a,b)=>clamp((t-a)/(b-a));
export const ease=x=>x*x*(3-2*x);
export function stateAt(t){t=Math.max(0,Math.min(duration-.000001,t));const index=steps.findIndex(s=>t<s.end);return {t,index,step:steps[index],bond:ease(ramp(t,1,4)),thin:ramp(t,6,11),tape:ease(ramp(t,12.8,16)),release:ramp(t,17.8,21.2),separate:ease(ramp(t,22,25.5)),clean:ramp(t,26.3,30.3),exit:ease(ramp(t,32.2,34.7)),entry:ease(ramp(t,0,1)),supportedBy:t<4?'吸持工具與載板':t<16?'載板':t<22?'載板與膠帶框架':'膠帶框架'};}
