import {ramp,smooth} from './svg.js';
export const duration=36;
export const info={shortTitle:'淺溝槽隔離 STI',title:'淺溝槽隔離｜矽表面的絕緣邊界',label:'固定剖面追蹤同一淺溝槽從矽移除到氧化物隔離區形成',overview:30,summary:'傳統平面bulk silicon STI代表流程，依Pan等1998年整合研究選擇O₃-TEOS SACVD氧化物填充。歷史流程不外推所有現代節點。膜厚與熱襯層放大、時間壓縮；選淺寬溝槽，以表面連續增厚的幾何近似填充，不模擬孔洞、應力、局部鳥嘴或密度相依CMP。熱氧化厚度L約消耗0.44L矽，其餘約0.56L向槽內擴展。襯層與填充同為氧化物，以深淺區分來源。停止層為SiN；去墊氧化層也少量降低槽氧化物頂面。完成態略凸，底部矽始終連通，不代表所有漏電消失。',sources:[{title:'Pan 等 — Planarization and Integration of Shallow Trench Isolation (1998)',url:'https://boning.mit.edu/wp-content/uploads/2022/11/Planarization-and-Integration-of-Shallow-Trench-Isolation.pdf',note:'第1–3頁：流程、停止層、SACVD填充與後續蝕刻高度。'},{title:'University of Alberta nanoFAB — Silicon thermal oxidation',url:'https://toolbox.nanofab.ualberta.ca/sithox/',note:'氧化物成長的矽消耗比例。'}],supplement:'<details><summary>補充：三種氧化物與兩次移除</summary><p>薄墊氧化層位於SiN下方；熱襯層沿槽壁與槽底形成；CVD氧化物在所有暴露表面增厚並填槽。它們都是氧化物，製作來源不同。</p><p>CMP先移除表面過量填充物，停在SiN附近。之後移除SiN，再移除薄墊氧化層；最後一段也會蝕去一點槽內氧化物，不能讓同材料永遠免於反應。</p></details>'};
export const stages=[
{at:0,key:1,title:'已圖案化的保護層',what:'SiN硬遮罩下有薄墊氧化層；中央開口對準本次要形成的槽。',detail:'兩側是預定器件區，下方連續矽不是懸空支架。'},
{at:3,key:7.9,title:'沿開口移除矽',what:'開口內矽逐步移除，形成淺槽；反應產物由排氣離開。',detail:'底部保留連續矽，沒有把兩側切成分離零件。'},
{at:8,key:11.9,title:'形成熱氧化襯層',what:'薄氧化物沿槽壁與槽底生長，同時消耗界面處一小部分矽。',detail:'原槽輪廓短暫以虛線標示；氧化層同時向矽內與空槽延伸。'},
{at:12,key:18.9,title:'表面增厚並填槽',what:'O₃-TEOS SACVD氧化物從表面連續增厚，填滿槽並留下過量覆蓋。',detail:'用淺寬幾何近似共形增厚；不是把液體直接灌進去。'},
{at:19,key:23.9,title:'整平至SiN附近',what:'CMP移除高處的多餘氧化物，保留槽內填充。',detail:'SiN作為停止層，實際停止行為受選擇性與時間影響。'},
{at:24,key:26.9,title:'移除SiN遮罩',what:'選擇性去除SiN，露出其下薄墊氧化層。',detail:'此步和CMP分開，槽內絕緣物持續保留。'},
{at:27,key:30,title:'去墊氧化層，保留隔離區',what:'薄墊氧化層移除；槽氧化物頂面也少量下降，留下略凸的絕緣區。',detail:'兩側矽表面可辨，底部仍是連續bulk silicon。'},
{at:32,key:33,title:'完成件退出',what:'完成隔離結構離開，新圖案化矽基板進場。',detail:'沒有將氧化物倒轉成原本的矽。'}];
export function state(t){return{t,index:Math.max(0,stages.findLastIndex(x=>t>=x.at)),etch:ramp(t,3,8),liner:ramp(t,8,12),fill:ramp(t,12,19),cmp:ramp(t,19,24),strip:ramp(t,24,27),pad:ramp(t,27,29),out:smooth(ramp(t,32,34)),incoming:smooth(ramp(t,34,36)),newWafer:t>=34};}
