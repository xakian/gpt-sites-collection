import{smooth}from'./svg.js';
export function stateAt(t){
 const programming=t>=4&&t<9,erasing=t>=22&&t<27,read0=t>=14&&t<20,read1=t>=28;
 const charge=t<4?0:t<9?smooth((t-4)/5):t<22?1:t<27?1-smooth((t-22)/5):0;
 return{charge,programming,erasing,power:!(t>=10&&t<14),read:read0||read1,conduct:read1,bit:charge>.5?0:1,vth:.25+.55*charge,vread:.5,
 mode:t<4?'抹除態 · 1':programming?'頁寫入 · 電子穿隧進入浮動閘':t<10?'寫入完成 · 0':t<14?'斷電 · 電荷仍保留':read0?'讀取 · 高臨界電壓，通道不導通':t<22?'讀後電荷不變':erasing?'區塊抹除 · 電子穿隧離開浮動閘':t<28?'抹除完成 · 1':'讀取 · 低臨界電壓，通道導通'};
}
