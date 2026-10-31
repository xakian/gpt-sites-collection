export const DURATION=32000;
export const OVERVIEW=29200;
export const STEPS=[
 {start:0,end:3000,key:2100,title:'準備表面',main:'矽基板上已有一整層二氧化矽薄膜。本輪持續觀察同一個局部，中央是預定開口的位置。',points:['薄膜的形成不在本輪範圍。','左右與中央起初具有相同的薄膜厚度。']},
 {start:3000,end:7000,key:6400,title:'塗佈與軟烤',main:'正型光阻鋪覆薄膜，再經短暫軟烤形成穩定薄層。它是之後用來保護部分表面的暫時材料。',points:['淡紫色是光阻，淡藍色是待蝕刻薄膜。','塗佈與軟烤壓縮呈現，沒有模擬整片晶圓旋轉。']},
 {start:7000,end:12000,key:11200,title:'曝光',main:'光罩的透光區經簡化投影對應到中央光阻。受光後，正型光阻的性質改變；表面高度仍保持不變。',points:['細點紋表示受光區，不是新加入的一層材料。','曝光完成後先停留，顯影尚未開始。','光罩與光阻始終分離。']},
 {start:12000,end:17000,key:16400,title:'顯影',main:'顯影液溶去正型光阻中受曝光的部分，再沖洗與乾燥。中央出現窗口，下面的二氧化矽薄膜仍是一整層。',points:['這一步移除的是光阻。','下方淡藍薄膜還沒有被蝕刻。','左右未受曝光的光阻仍覆蓋表面。']},
 {start:17000,end:23000,key:22200,title:'蝕刻',main:'光阻的窗口讓中央薄膜暴露於乾式蝕刻，薄膜逐漸向下移除；左右被光阻覆蓋的區域保留。',points:['圖案從光阻轉移到下方薄膜。','光阻在蝕刻中也會略微消耗，仍保持足夠厚度。','示意在基板表面停止，實際需控制終點與選擇性。']},
 {start:23000,end:27000,key:26600,title:'去膠',main:'移除完成保護任務的剩餘光阻。下方薄膜已經形成的開口與保留區維持原狀。',points:['光阻是暫時的，薄膜圖案才是本輪結果。','去膠不會把已移除的薄膜補回。']},
 {start:27000,end:32000,key:29200,title:'觀看結果',main:'淡紫色光阻已離開，淡藍薄膜的中央開口仍在。完成樣品從出口離場，下一輪由新樣品進場。',points:['目前只完成一層薄膜圖形。','結果停留後才離場，製程不會倒轉回原料。']}
];
export const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const window=(t,a,b)=>ease((t-a)/(b-a));
export function evaluate(ms){
 const t=Math.max(0,Math.min(DURATION-.001,ms)),index=STEPS.findIndex(s=>t<s.end);
 const coat=window(t,3200,4900),expose=window(t,8200,10300),develop=window(t,12900,15100),etch=window(t,17900,21400),strip=window(t,23700,25500);
 const entry=window(t,0,1200),exit=window(t,30200,31600),resist=coat*(1-.08*etch)*(1-strip);
 const optical=t<7000?0:t<7800?window(t,7000,7800):t<11300?1:1-window(t,11300,11900);
 return{t,index,title:t>=30200?'樣品離場':STEPS[index].title,entry,exit,offset:entry-1+exit,sampleVisible:entry>0&&exit<1,coat,expose,develop,etch,strip,resist,centerResist:resist*(1-develop),filmCenter:1-etch,optical,
 light:window(t,7950,8250)*(1-window(t,10300,10600)),developer:window(t,12100,12700)*(1-window(t,15600,16300)),plasma:window(t,17100,17700)*(1-window(t,21600,22400)),stripper:window(t,23100,23700)*(1-window(t,25800,26500)),latent:expose*(1-develop)*(1-strip),bake:window(t,5100,5400)*(1-window(t,6200,6550)),nozzle:window(t,3050,3250)*(1-window(t,4800,5100))};
}
