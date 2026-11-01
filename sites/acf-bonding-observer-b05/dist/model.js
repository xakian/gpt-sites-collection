import {ramp,ease} from './view.js';
export function state(t){return {film:ease(ramp(t,0,3)),peel:ease(ramp(t,3,6)),align:ease(ramp(t,6,9)),approach:ease(ramp(t,9,12)),press:ease(ramp(t,12,14)),cure:ramp(t,14,19),unload:ease(ramp(t,21,23)),verify:ramp(t,23,24),exit:ease(ramp(t,27,29)),incoming:ease(ramp(t,29,30))}}
export const topic={title:'ACF 異向導電膜接合',question:'同一張膠膜，為什麼上下通、左右不通？',duration:30,overview:25,intro:'追蹤兩對晶片凸塊、玻璃端子與六顆代表顆粒。局部剖視讓接合間隙可見；完成件從右側退場，再由左側送入新材料。',simplifications:'本例使用金屬包覆聚合物球與熱固性絕緣樹脂的代表結構，不額外採用絕緣外殼。不是特定廠牌配方；Dexerials 的絕緣包覆顆粒產品屬另一變體。顆粒數、尺寸、壓縮量及間隙放大；不提供通用溫度、壓力或粒徑。綠色只表示已形成的接觸路徑，不是電流模擬。樹脂流動與固化用輪廓和網狀線概括；顆粒不熔化，樹脂仍絕緣。',sources:[{title:'Dexerials · ACF 接合與 COG',url:'https://www.dexerials.jp/en/rd/tech/tech02.html',claim:'上下接點捕捉顆粒、熱固化膠固定間隙；COG 用於晶片與玻璃接合。此來源的絕緣包覆變體未直接套入本例。'},{title:'Samsung Display · ACF 結構',url:'https://global.samsungdisplay.com/29970',claim:'導電金屬包覆聚合物顆粒分散在不導電黏著材料中；包含熱固性樹脂體系。'},{title:'AMADA WELD TECH · ACF Final Bonding',url:'https://www.amadaweldtech.eu/knowlegde-base/heat-sealingacf-final-bonding',claim:'受熱受壓形成接觸，保持壓縮並完成冷卻與固化，以穩定接合。'}],steps:[
{start:0,key:2.8,title:'貼膜',what:'帶離型膜的 ACF 貼在玻璃端子區。晶片仍在上方，沒有上下導通。',detail:'金色外圈是導電金屬，淡色核心是聚合物。相鄰顆粒保持分散，樹脂不導電。'},
{start:3,key:5.7,title:'移除離型膜',what:'離型膜從膠膜表面揭開並送離，導電顆粒與樹脂留在端子區。',detail:'離型膜只是搬運保護層，不留在晶片與端子之間。'},
{start:6,key:8.8,title:'凸塊對準',what:'工具將兩個凸塊對準下方端子；同一組顆粒仍在原膠層中。',detail:'對準還不等於導通。要等顆粒同時接觸上、下金屬面。'},
{start:9,key:13.9,title:'受熱受壓',what:'凸塊下壓，樹脂讓出接觸區，四顆夾住的顆粒壓扁並接觸上下端子。',detail:'顆粒的金屬外層可以向不同方向導電；異向性來自接觸分布。中間兩顆沒有連成橫向鏈。'},
{start:14,key:18.8,title:'樹脂固化',what:'持壓時樹脂逐步固化，固定接合間隙與顆粒位置。',detail:'網狀線表示固化程度，不是新增金屬線；樹脂不變成導體。'},
{start:19,key:22.8,title:'冷卻卸載',what:'先保持壓縮冷卻，再把加壓工具抬起；晶片與玻璃維持接合。',detail:'卸載後四顆接觸顆粒仍被固化膠固定。接點不反彈分開。'},
{start:23,key:25,title:'上下導通 · 左右隔離',what:'沿金屬凸塊、受壓顆粒、玻璃端子高亮兩組垂直接觸。',detail:'相鄰端子之間沒有連續導電鏈；未受夾持的兩顆粒仍各自分離。'},
{start:27,key:28.4,title:'成品退場 · 新料進場',what:'接合件保留固化膠和顆粒形狀離開，新玻璃、新膜與新晶片接續進場。',detail:'循環代表另一件產品，不把固化樹脂變回軟膠。'}]};
