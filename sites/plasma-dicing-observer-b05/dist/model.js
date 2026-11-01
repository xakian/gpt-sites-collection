import {ramp,ease} from './view.js';
export const state=t=>({etch:ramp(t,4,14),mask:1-ramp(t,17,20),tool:ease(ramp(t,19,21)),lift:ease(ramp(t,21,24)),pin:ramp(t,20,21)*(1-ramp(t,22,23)),pickExit:ease(ramp(t,25,27)),frameExit:ease(ramp(t,27,30)),incoming:ease(ramp(t,30,32))});
export const topic={title:'電漿晶圓分割',question:'矽已分開，晶粒為什麼仍整齊留在原位？',duration:32,overview:16,intro:'選用已磨薄晶圓的正面電漿分割路線。相容膠帶與框架持續承托，街道金屬／阻擋層已預先開通；三顆代表晶粒顯示全片街道同步蝕刻的概念。',simplifications:'採代表剖視，非比例的三顆晶粒代替整片晶圓；正面元件與遮罩、街道前處理均已備妥。省略Bosch週期與側壁細紋，氣體為符號，不是固體刀屑。選擇可相容去遮罩／清理及直接取晶的膠帶流程，未假定所有膠帶都需UV或擴膜；量產黏著力、清理與溫控須按材料驗證。頂針僅頂起膠帶協助剝離，沒有刺穿膠帶。不宣稱所有晶圓無損傷。',sources:[{title:'Plasma-Therm · Plasma Dicing on Tape',url:'https://www.plasmatherm.com/process/plasma-dicing/pdot/',claim:'膠帶框架上全片電漿分割；溫度與膠帶完整性需控制，完成後可取晶。'},{title:'Panasonic · Plasma Dicing',url:'https://eu.connect.panasonic.com/sites/default/files/media/document/2025-01/Panasonic%20Plasma%20Dicing%204-seiter%20DIN%20A4%20online%2001.pdf',claim:'遮罩圖案、電漿分割與相容去遮罩／清理順序。'},{title:'ASMPT ALSI · Scribing',url:'https://alsi.semi.asmpt.com/en/process/scribing/',claim:'街道上層金屬／阻擋膜需先以適當工法移除，不能假設矽蝕刻能一併清除。'}],steps:[
{start:0,key:2,title:'遮罩開口與膠帶承托',what:'正面元件在遮罩下，兩條示意街道已清除上層金屬與阻擋膜，露出矽。',detail:'此時街道底部仍連成一片矽；背面完整黏在相容膠帶，膠帶固定於框架。'},
{start:4,key:9,title:'街道同步蝕刻',what:'所有示意街道的矽同步向下移除。上升的小圓點代表揮發性反應產物。',detail:'被保護的晶粒保留，溝底未貫穿前仍連成一體；這不是逐條刀片切割。'},
{start:14,key:14.5,title:'剛貫穿，膠帶留晶',what:'矽街道已貫穿，晶粒分離，但仍黏在膠帶原位。',detail:'電漿加工結束；不把完整膠帶或框架切斷，晶粒也不立即散落。'},
{start:17,key:19.8,title:'相容去遮罩與清理',what:'遮罩在選定相容流程中移除，保留元件層與下方膠帶。',detail:'以遮罩逐漸變淡概括去除，不模擬清理化學；其產物另行排走，不變成晶粒。'},
{start:20,key:23.5,title:'支撐配合取晶',what:'吸嘴接觸代表晶粒A，頂針從膠帶下方協助剝離，再把晶粒提起。',detail:'頂針不刺穿膠帶；其他晶粒仍黏在框架上。未貫穿時不能提前取晶。'},
{start:25,key:26,title:'晶粒與框架分流',what:'A隨吸嘴先向右送出；剩餘框架隨後移交下一步，新晶圓從左側進場。',detail:'已分開的矽不長回街道。新料是另一片完整晶圓，保留明確進出場。'}]};
