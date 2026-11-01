import {ramp,smooth} from './svg.js';
export const duration=36;
export const info={shortTitle:'SOI 薄層轉移',title:'SOI 薄層轉移｜把A的薄矽留在B上',label:'A供體薄矽經植入、翻面、直接接合及內部分離，成為B承載矽上的SOI',overview:31.5,summary:'固定矽SOI的Smart Cut類型代表流程，依Soitec技術頁及2023 Capital Markets Day第62頁。A表面預先有氧化層，H⁺輕離子在A內形成預定分離區，不是此處的導電摻雜。清潔、表面準備與後續熱處理合併示意；直接接合不使用膠水或焊球。膜厚、植入區與間距大幅放大，時間壓縮；翻面以繞水平軸180°的剖面投影表示，中途厚度投影變薄，並非材料被壓縮。供體、薄矽與氧化物一直使用相同幾何群組及材料色。A薄矽以小圓點追蹤，整理時少量減薄。供體餘料較薄，需再整備後才可利用，不宣稱無限循環或品質保證。省略微裂紋動力學、鍵結細節、異質材料與器件操作。',sources:[{title:'Soitec — Smart Cut Technology',url:'https://www.soitec.com/home/technology/innovation/smart-cut',note:'輕離子植入、分子附著接合、薄層轉移與供體再整備。'},{title:'Soitec 2023 Capital Markets Day — 第62頁',url:'https://www.soitec.com/docs/default-source/financial-reports/2022-2023/en/soitec-fy23-cmd.pdf?Status=Master&sfvrsn=32553046_1',note:'氧化、植入、翻面／清潔、接合、熱分離與整理的圖序。'}],supplement:'<details><summary>補充：兩個界面不可混淆</summary><p>接合面是氧化層與B之間的界面；分離區則在A的矽內。分離後，原本A的一段薄單晶矽留在氧化層上，氧化層成為埋氧層（BOX）。</p><p>完成層序由上而下為：A薄矽／埋氧層／B承載矽。A餘料離開後需要表面再整備，本動畫沒有把薄矽吸回A或恢復A原厚度。</p></details>'};
export const stages=[
{at:0,key:1,title:'供體A與承載B',what:'A表面已有氧化層，橘色小點標出本次追蹤的薄矽。B準備承載。',detail:'A的薄矽和餘料同為單晶矽；色深僅用於追蹤來源。'},
{at:3,key:7.9,title:'在A內植入分離區',what:'H⁺穿過表面氧化層，在A矽內形成預定分離區。',detail:'分離區和表面接合位置不同，不是把氧化層當成裂開面。'},
{at:8,key:13.9,title:'清潔並翻面',what:'完成必要表面準備，A翻轉180°，氧化層改朝向B。',detail:'剖面投影中途變薄，材料順序與小點連續保留；未刪除材料。'},
{at:14,key:18.9,title:'氧化面與B直接接合',what:'A向B靠近，清潔的氧化面與B形成直接接合。',detail:'無膠水、無焊球，接合面在氧化層與B之間。'},
{at:19,key:23,title:'熱處理與內部分離',what:'後續處理使A沿內部植入區分離，薄矽仍連在氧化層上。',detail:'裂開面在A內，不會撕開氧化層與B的接合。'},
{at:24,key:27.5,title:'薄矽留下，餘料分開',what:'A餘料向上移，帶小點的A薄矽留在B上。',detail:'餘料已少了轉移出去的厚度，需要再整備才可利用。'},
{at:29,key:31.5,title:'表面整理成SOI',what:'薄矽表面整理後略減薄，完成A薄矽／埋氧層／B承載矽。',detail:'保留薄矽身分與完整三層順序。'},
{at:32,key:33,title:'兩個產物分流',what:'SOI向右、供體餘料向左離開，下一組A與B進場。',detail:'新一輪換料，不將轉移倒播。'}];
export function state(t){return{t,index:Math.max(0,stages.findLastIndex(x=>t>=x.at)),implant:ramp(t,3,8),flip:smooth(ramp(t,9,14)),bond:smooth(ramp(t,14,19)),split:smooth(ramp(t,22,27)),finish:ramp(t,29,32),out:smooth(ramp(t,32,34)),incoming:smooth(ramp(t,34,36)),newWafer:t>=34};}
