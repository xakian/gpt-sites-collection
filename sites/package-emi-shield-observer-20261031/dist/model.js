export const title='封裝表面 EMI 屏蔽',duration=30,overview=27;
export const ramp=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a))),smooth=x=>x*x*(3-2*x);
export const stages=[
{start:0,end:3,title:'側面地層已露出',key:2.5,watch:'已切單的模封件露出側邊地層，底部有各自獨立的信號接點與接地接點。',detail:'局部剖切顯示地層到接地接點的實際通路；信號通孔穿越地層處保留絕緣間隙。'},
{start:3,end:6,title:'底部遮蔽與承載',key:5.8,watch:'載具包住底部接點及不能鍍覆的區域，保留上表面與四側可沉積區。',detail:'遮蔽邊界停在側面接地層下方，讓銅膜能接觸地層，且不串接底部信號端子。'},
{start:6,end:9,title:'表面準備',key:8.5,watch:'在遮蔽保留時整理待鍍表面，為後續覆層附著與接地接觸作準備。',detail:'只示意表面處理的目的，不指定清潔配方或重講濺鍍靶材原理。'},
{start:9,end:18,title:'頂面與四側銅屏蔽',key:17.8,watch:'銅薄層在頂面與四側逐漸連續，側邊覆層接到露出的地層。',detail:'主圖作局部剖切；旁邊資訊圖補出完整四側。採來源的濺鍍銅方案，未指定其他未查證薄膜層。'},
{start:18,end:23,title:'取出與去除遮蔽',key:22.5,watch:'夾持件保持零件位置，底部遮蔽載具退出；原有信號接點仍各自分離。',detail:'銅殼保持連續，不隨遮蔽一起消失；底面沒有鋪成導電整片。'},
{start:23,end:25,title:'代表性接地連接',key:24.8,watch:'示意測試板接住底部接地端，實際通路是銅殼 → 側邊地層 → 地通孔 → 接地端。',detail:'兩個信號端仍走獨立接點；接地符號只是這條實際結構路徑的末端標記。'},
{start:25,end:28,title:'耦合降低與漏場',key:27,watch:'相同示意場源在屏蔽外的場線淡化；底部開口仍可有漏場。',detail:'場線是電磁場示意，並非粒子沿接地線排出。反射、吸收與結構邊界共同影響結果，不代表所有頻率完全阻擋。'},
{start:28,end:30,title:'完成件退場',key:29,watch:'銅層與封裝一起退出，下一輪由新的未鍍覆件進場。',detail:'不在同一物件上淡出屏蔽層來假裝回到原料。'}];
export function stateAt(t){t=Math.max(0,Math.min(duration-.000001,t));const index=stages.findIndex(x=>t<x.end);return {t,index,stage:stages[index],enter:smooth(ramp(t,0,1.3)),exit:smooth(ramp(t,28,30)),seat:smooth(ramp(t,3,5.8)),clean:ramp(t,6,9),top:ramp(t,9,12),sides:ramp(t,11,18),unmask:smooth(ramp(t,18.5,22.5)),board:smooth(ramp(t,23,25)),field:t<3||t>=25&&t<28,shield:t>=25};}
