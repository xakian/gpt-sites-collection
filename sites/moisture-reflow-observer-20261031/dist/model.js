export const title='封裝吸濕與迴焊爆米花效應',duration=36,overview=30;
export const ramp=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a))),smooth=x=>x*x*(3-2*x);
export const stages=[
{start:0,end:3,title:'兩件完整封裝',key:2,watch:'A、B是相同結構的代表試件。塑膠模封外表完整，還沒有裂縫。',detail:'固定剖視讓內部可見；灰藍是模封、深藍是晶粒、柔銅色是金屬墊及引腳。沒有實際切開兩件產品。'},
{start:3,end:10,title:'水分擴散進入模封',key:8.8,watch:'水分符號從完整模封表面向內分布，A、B都吸濕。',detail:'藍點是水分含量與遷移的教學符號，不是樹脂內的可見水滴；無須先有裂縫才能吸濕。'},
{start:10,end:16,title:'B 受控乾燥',key:13,watch:'A維持較高含水狀態；B在適用的乾燥條件下讓水分逐漸向外移出。',detail:'處理歷史不同，試件身分不交換。乾燥條件須依實際器件與載具指引，本圖不提供烘烤配方。'},
{start:16,end:18,title:'B 維持乾燥保存',key:17,watch:'B乾燥後避免再吸濕，仍留少量水分符號；A保留較高含水狀態。',detail:'框線代表乾燥保存環境。防潮袋、乾燥劑及濕度卡可協助管理，但卡片不能直接量出封裝內部含水。'},
{start:18,end:22,title:'共同迴焊升溫',key:21,watch:'兩件經過相同示意熱歷程。A較多水分帶來較高的內部蒸氣壓風險，界面同時受熱應力。',detail:'熱膨脹不匹配與蒸氣壓都可能推動界面分離；真正風險取決於材料、結構、含水及熱歷程。'},
{start:22,end:27,title:'本例 A 分層與裂紋',key:25.5,watch:'A金屬墊下方先出現界面分離，之後裂紋向模封外表面延伸；B在本例保持完整。',detail:'這是可能結果，不是每件受潮封裝都開裂，也不是乾燥保證所有失效都不會發生。水分不是直接變成裂縫。'},
{start:27,end:33,title:'冷卻後保留結果',key:30,watch:'熱與水氣壓減弱，A的分層與裂紋仍在，B保持此例的完整狀態。',detail:'乾燥是迴焊前的預防措施，不是裂開之後的修補；冷卻不讓受損封裝自行癒合。'},
{start:33,end:36,title:'原件退出，新件接續',key:34,watch:'A帶著損傷、B保持完整，分別退出；下一輪換成新的一對試件。',detail:'新原料並非原件倒轉修復。沒有電路、爆炸、火花或良率分數。'}];
export function stateAt(t){t=Math.max(0,Math.min(duration-.000001,t));const index=stages.findIndex(x=>t<x.end),absorb=smooth(ramp(t,3,9)),dry=smooth(ramp(t,10,16)),heat=smooth(ramp(t,18,22))*(1-smooth(ramp(t,27,31))),delam=smooth(ramp(t,22,24)),crack=smooth(ramp(t,24,26));return {t,index,stage:stages[index],absorb,dry,heat,delam,crack,enter:smooth(ramp(t,0,1.2)),exit:smooth(ramp(t,33,36)),stored:t>=16&&t<18,waterA:absorb*(1-.65*smooth(ramp(t,22,28))),waterB:absorb*(1-.88*dry),pressureA:heat*absorb*(1-.8*crack),pressureB:heat*absorb*(1-.88*dry)*.3};}
export const waterPoints=[[65,65],[95,62],[128,64],[162,61],[197,64],[232,62],[266,64],[297,65],[68,91],[92,97],[280,94],[300,94],[67,132],[88,145],[120,145],[152,146],[188,145],[223,145],[256,146],[286,143],[306,130],[310,78]];
