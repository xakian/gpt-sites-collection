export const duration=32;
export const config={title:'扇出重組晶圓',sceneLabel:'三顆晶粒以主動面朝下排片，壓縮模封後釋放共同加工面',question:'小晶粒，重新排成一大片',overview:26,notes:['採 chip-first、face-down 的 eWLB 代表路線：黏著釋放膜覆於載板，晶粒朝下排放，再壓縮模封、固化，最後移除載板與膜。只展示共同加工表面，尚未製作 RDL。','主場景為固定剖切略帶厚度的側視，三顆代表晶粒保持尺寸、朝向、角標及間距。背部吸持與邊緣支撐是設備功能簡化；釋放方法依膜材，未指定材料配方或任意熱條件。','矽、模封材料及膜為不同材料；模封體絕緣，不是重新長出的矽。薄層放大、時間壓縮；省略翹曲、晶粒偏移及固化化學，實際需控制這些因素。'],sources:[['ASE：chip-first face-down fan-out','https://ase.aseglobal.com/fan-out-packaging/'],['JCET研究：貼膜、排片、壓縮模封、移除載板與膜','https://imapsource.org/article/94701-characterizations-for-ewlb-embedded-wafer-level-ball-grid-array-antenna-in-molded-package-integrations-in-77ghz-automotive-applications.pdf']]};
export const steps=[
{end:9,title:'主動面朝下排片',key:8.5,what:'工具依序放下三顆已切割晶粒。焊墊朝向釋放膜，晶粒間保留設計間距。',detail:'第一顆有金色角標，整輪不交換晶粒或鏡射焊墊。'},
{end:15,title:'壓縮模封',key:12.5,what:'模具閉合，模封材料填滿晶粒周邊及背面空間。',detail:'本圖剖切顯示內部；主動面貼膜，模封材料不能流到焊墊下方。'},
{end:19,title:'固化與承托',key:17.5,what:'模封材料固化成共同支撐體。背面吸持工具接手，為釋放準備。',detail:'晶粒仍是三個獨立的矽物件；周圍新材料是絕緣模封體。'},
{end:24,title:'移除載板與膜',key:22.5,what:'在背面持續承托下，載板與釋放膜向下移走，露出晶粒主動面。',detail:'固化模封體把晶粒固定成一片；不讓裸晶粒掉落或懸空。'},
{end:28,title:'共同加工表面',key:26,what:'晶粒主動面與模封材料形成可作後續配線的共同表面。',detail:'虛線只標出未來扇出範圍，並不是已形成的金屬線。RDL 尚未製作。'},
{end:32,title:'重組件移交',key:28.5,what:'重組件連同承托離開，下一輪送入新載板與新晶粒。',detail:'固化材料不倒流回去，晶粒不變回未切割的矽晶圓。'}];
export const ramp=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a)));export const ease=x=>x*x*(3-2*x);
export function stateAt(t){t=Math.max(0,Math.min(duration-.0001,t));const index=steps.findIndex(s=>t<s.end);return {t,index,step:steps[index],die:[0,1,2].map(i=>ease(ramp(t,1+i*2.5,3+i*2.5))),mold:ramp(t,9.5,14),cure:ramp(t,15,17),hold:ease(ramp(t,17,18.5)),release:ease(ramp(t,19,23.5)),exit:ease(ramp(t,29,31.5)),entry:ease(ramp(t,0,1))};}
