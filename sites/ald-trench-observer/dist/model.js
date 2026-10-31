export const DURATION=50000;
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
export const STAGES=[
 {title:'起點 · 帶有反應位點的表面',time:1000,what:'帶凹槽的基板表面具有可反應的羥基（–OH）。本示範從理想、已準備好的表面開始，追蹤同一塊基板。',detail:'凹槽是開放剖面，不是實際切開後才沉積。青色短端基代表 –OH；基板本體是灰藍色。'},
 {title:'TMA · 與表面結合',time:4400,what:'三甲基鋁（TMA）先到達表面，再與羥基反應。含鋁物種留在表面，部分甲基以甲烷（CH₄）離開。',detail:'由開口、側壁到深處，氣體到達與反應有先後。圖中路徑只幫助追蹤，不是實際分子的運動軌跡。'},
 {title:'TMA · 表面飽和',time:6700,what:'在此溫度與理想條件下，可用位點被佔據後，繼續送入 TMA 不會讓同一半反應無限生長。',detail:'自限與表面端基、位阻及反應條件有關，不表示每個幾何位置都恰好堆滿一整層原子。多餘氣體仍可經過已反應表面。'},
 {title:'第一次清除 · 結合物留下',time:8600,what:'惰性氣體與抽氣帶走多餘 TMA 和氣態副產物。紫色含鋁表面物種與既有薄膜保留。',detail:'清除的是未結合的氣體；表面上的甲基端基仍在，等待下一個反應物。兩種反應氣體在時間上分開。'},
 {title:'水蒸氣 · 轉換表面',time:11900,what:'水蒸氣到達後與表面的甲基配體反應，釋出甲烷，形成氧化鋁網絡並恢復可供後續循環反應的羥基端基。',detail:'粉紫色表面結合物轉為連續的淡紫色膜。圖示是局部反應的概念模型，並非完整分子計量或晶格。'},
 {title:'第二次清除 · 完成一循環',time:15700,what:'清除剩餘水蒸氣與甲烷。這次循環加入的材料保留，表面準備接受下一次 TMA。',detail:'一循環包含兩次自限表面反應與兩次清除，不保證生成完整一個原子層。'},
 {title:'重複循環 · 沿輪廓增厚',time:43600,what:'同一塊基板重複三個示意循環。新反應發生在薄膜最外側；凹槽側壁、底部與平面逐步增厚。',detail:'均勻覆蓋假設每一半反應在此凹槽的所有位置都得到足夠曝露。高深寬比、短脈衝、反應或傳輸不足時，深處可能較薄。'},
 {title:'完成退場 · 換新基板',time:47000,what:'完成的基板帶著薄膜整塊離開。新基板接著進場，開始下一輪觀看。',detail:'這是觀看循環的換片，不是把已沉積的材料消除、溶解或倒轉成原料。'}
];
export function stateAt(ms){
 const t=clamp(ms/1000,0,50);
 if(t<2)return{t,kind:'intro',cycle:0,completed:0,phase:-1,p:0,stage:0,shift:0};
 if(t>=44)return{t,kind:t<46?'hold':t<48?'exit':'entry',cycle:2,completed:t<48?3:0,phase:4,p:0,stage:t<46?6:7,shift:t<46?0:t<48?ease((t-46)/2):ease((t-48)/2)-1};
 const cycle=Math.floor((t-2)/14),u=(t-2)-cycle*14;
 const phase=u<5?0:u<7?1:u<12?2:3;
 const p=phase===0?u:phase===1?u-5:phase===2?u-7:u-12;
 return{t,kind:'react',cycle,completed:cycle,phase,p,u,stage:phase===0?(p>4.1?2:1):phase===1?3:phase===2?4:5,shift:0};
}
export function reactionTime(site){return 1.0+site.depth*2.2+(site.index%3)*.13;}
export function siteState(s,site){
 if(s.kind!=='react')return{thickness:s.completed,al:0,oh:1,water:0};
 const r=reactionTime(site);
 const al=s.phase===0?ease((s.p-r)/.36):s.phase===1?1:s.phase===2?1-ease((s.p-r)/.36):0;
 const water=s.phase<2?0:s.phase===2?ease((s.p-r)/.36):1;
 return{thickness:s.completed+water,al,oh:1-al,water};
}
