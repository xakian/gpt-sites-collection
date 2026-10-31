// Pure scientific state; all transitions use the shared player's single clock.
export const DURATION=44000;
export const stages=[
 {start:0,end:3,key:1.6,title:'光阻開口',line:'先把線路位置，定在絕緣層上',what:'起點是已曝光、顯影的光阻。兩個開口標出要蝕刻的位置，下面仍是一整層絕緣材料。',detail:'這是兩條相鄰線路的橫截面；線路沿畫面前後方向延伸。光阻是暫時的遮罩，不是互連材料。'},
 {start:3,end:8,key:7.8,title:'蝕刻開槽',line:'開口向下轉移，形成兩道溝槽',what:'開口處的絕緣材料被蝕刻移除，受光阻保護的部分保留下來。開槽完成後去除光阻並清潔。',detail:'溝槽位置沿用起點的開口；不是在銅裡刻出線。去膠與清潔合併示意，槽底下仍有絕緣材料。'},
 {start:8,end:12,key:11.5,title:'覆上阻障層',line:'先隔開銅與絕緣材料',what:'薄薄的阻障／襯層沿表面、槽壁與槽底覆上。本例以傳統 TaN／Ta 系統作代表，合併畫成一層。',detail:'阻障層抑制銅擴散到絕緣層，襯層有助附著。它是導電的薄膜，並不是另一層絕緣材料。'},
 {start:12,end:16,key:15.5,title:'鋪銅種子層',line:'薄銅先鋪底，讓電鍍接著長',what:'在阻障／襯層之上沉積連續的薄銅種子層，提供後續電鍍所需的導電表面。',detail:'種子層本身就是銅。用較深的銅色只為分辨來源；它會和後來鍍上的銅成為同一導體，不是可剝離的另一種材料。'},
 {start:16,end:24,key:23.5,title:'電鍍填銅',line:'槽內填滿，表面也長出多餘銅',what:'電鍍把溶液中的銅離子還原成金屬銅。適當添加劑讓槽底填充較快，降低空洞與接縫風險；同時表面仍會鍍上銅。',detail:'不是把熔融銅倒進槽。最後形成連續的表面銅層，將本來應分開的兩條線暫時連在一起。'},
 {start:24,end:30,key:27.5,title:'CMP 移除表面銅',line:'磨去表面多餘銅，槽內銅留下',what:'化學機械平坦化（CMP）用研磨液的化學作用與研磨墊的機械作用，一起移除表面銅。移除的材料由研磨液帶走。',detail:'墊片畫在上方只是接觸關係示意，並非整台設備的真實方向。不是銑刀切削；也不是將槽內的銅挖空。'},
 {start:30,end:34,key:33.8,title:'CMP 清除表面阻障',line:'表面阻障也要清掉，線路才分開',what:'表面銅清除後，仍有露出的導電阻障／襯層。接續拋光清除場區薄膜，露出線與線之間的絕緣層。',detail:'槽壁與槽底的阻障仍保留。實際可有多個拋光與終點控制步驟；本圖將結果理想化為齊平表面。'},
 {start:34,end:40,key:37,title:'槽內互連留下',line:'留下槽內的銅，分開相鄰線路',what:'兩條銅線嵌在原先的溝槽裡；表面多餘的銅與場區阻障已移除，絕緣材料把相鄰線路分開。',detail:'這只是單層局部結果，不能據此判定整個電路導通。後續通常還有清潔、蓋層及下一層互連，本版不展開。'},
 {start:40,end:44,key:43.8,title:'換入下一段',line:'成品退場，下一段重新開始',what:'完成的整段結構退場，再換入另一段待加工材料。時間回到起點後，開始新一輪示範。',detail:'這是播放安排，不是製程倒轉；槽內銅不會變回絕緣層，移除的材料也不會回填。'}
];
export const clamp=v=>Math.max(0,Math.min(1,v));
export const ramp=(t,a,b)=>clamp((t-a)/(b-a));
export const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
export function stateAt(seconds){
 const t=Math.max(0,Math.min(43.999999,seconds));
 const stage=Math.max(0,stages.findIndex(s=>t<s.end));
 const etch=ramp(t,3.5,6.5),mask=1-ramp(t,6.7,7.6);
 const barrier=ramp(t,8.5,10.8),seed=ramp(t,12.5,14.8),fill=ramp(t,16.6,22.7);
 const copperPolish=ramp(t,24.8,29.5),barrierPolish=ramp(t,30.5,33.5);
 const exit=smooth(ramp(t,40.2,41.7)),entry=smooth(ramp(t,42.1,43.7));
 return {t,stage,etch,mask,barrier,seed,fill,copperPolish,barrierPolish,exit,entry,
  pad:t>=24&&t<34?Math.min(ramp(t,24,24.6),1-ramp(t,33.5,34)):0,
  bath:t>=16&&t<24?Math.min(ramp(t,16,16.6),1-ramp(t,23.2,24)):0};
}
