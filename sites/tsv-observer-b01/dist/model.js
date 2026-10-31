import{smooth}from'./svg.js';
const ramp=(t,a,b)=>smooth((t-a)/(b-a));
export function stateAt(t){const fresh=t>=44,u=fresh?0:t;return{fresh,etch:ramp(u,2,6),liner:ramp(u,6,8),barrier:ramp(u,8,10),seed:ramp(u,10,12),fill:ramp(u,12,16),planar:ramp(u,16,18),front:ramp(u,18,21),carrier:ramp(u,21,23),thin:ramp(u,23,28),backDie:ramp(u,28,30),open:ramp(u,30,32),backMetal:ramp(u,32,35),holder:ramp(u,35,36),debond:ramp(u,36,38),connected:u>=38,exit:ramp(t,42,44),entry:ramp(t,44,46),
 etching:u>=2&&u<6,plating:u>=12&&u<16,polishing:u>=16&&u<18,grinding:u>=23&&u<28,
 caption:u<2?'前側開口，背側仍完整':u<6?'蝕刻移除矽 · 孔底未穿透':u<8?'孔壁與孔底絕緣':u<10?'阻障限制銅擴散':u<12?'導電種子層供電鍍使用':u<16?'電鍍填銅':u<18?'去除表面多餘金屬':u<21?'正面介電保護與布線':u<23?'接合臨時載板':u<28?'載板承托 · 背面減薄':u<30?'背面絕緣 · 端面尚未接通':u<32?'開窗清理銅端面':u<35?'形成背面布線與接墊':u<36?'背側承托接手':u<38?'有承托再移除載板':'前後接點已連通'};}
