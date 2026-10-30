(function (root) {
  'use strict';
  const stages = [
    [0,2,'同一委託，三種關係','先認識四個角色，再追蹤同一批次 A。'],
    [2,5,'規格與委託資料先送達','資料可傳送副本；設計公司仍保留原件。'],
    [5,7,'服務：誰替誰完成工作','封測廠為設計公司提供封測；此時仍在待料。'],
    [7,11,'晶圓送到工作地點','同一批次離開代工廠，前往封測廠。'],
    [11,16,'服務在封測廠內執行','投入已備材料，合併示意切割與封裝。'],
    [16,19,'測試產生紀錄','實物留在工作區；測試結束才產生報告。'],
    [19,23,'報告回傳，實物仍在原地','報告回設計公司；成品仍留在封測廠。'],
    [23,25,'本例：確認後出貨','設計公司確認後，指示送往指定系統廠。'],
    [25,28,'成品送到指定收貨方','實物前往系統廠；報告仍在兩端保留。'],
    [28,31,'成品給收貨方；報告回委託方','工作在封測廠，三種關係可以同時存在。'],
    [31,32,'重新示範同一案例','遮蔽後回到起點，重新講解同一個例子。']
  ];
  const keyframes = [
    [4.5,'資訊可保留','規格在兩端各留一份；晶圓仍在代工廠。'],
    [6,'服務為誰做','固定箭頭由封測廠指向委託方，線上不運送物件。'],
    [10.5,'實物已到廠','批次 A 唯一位於封測廠，材料尚未投入。'],
    [17.5,'測試工作','托盤外形不變，測試尚未產生完成報告。'],
    [22,'資料與實物分離','報告在兩端；成品留在封測廠，還沒有出貨指示。'],
    [26,'依指示出貨','成品正在前往系統廠，兩端仍保留報告。'],
    [29,'三類關係總覽','成品給系統廠，報告回設計公司，工作在封測廠。']
  ];
  const clamp = (n,a=0,b=1) => Math.max(a,Math.min(b,n));
  const ease = u => {u=clamp(u);return u*u*(3-2*u);};
  function stateAt(input) {
    const t=clamp(Number(input)||0,0,32);
    const reset=t>=31 && t<32;
    const q=t===32?0:reset?(t<31.5?29:0):t;
    const opacity=!reset?1:t<31.35?1-(t-31)/.35:t<=31.65?0:(t-31.65)/.35;
    const phase=t===32?0:stages.findIndex(s=>t>=s[0]&&t<s[1]);
    let location=q<7?'F':q<10?'M_FO':q<25?'O':q<27.5?'M_OC':'C';
    const progress=location==='M_FO'?ease((q-7)/3):location==='M_OC'?ease((q-25)/2.5):0;
    const work=q<4?'待本批資料':q<5?'資料確認':q<10?'待料':q<11?'入料確認':q<16?'封裝中':q<19?'測試中':'封測工作完成';
    return {t,q,reset,opacity:clamp(opacity),phase,title:stages[phase][2],caption:stages[phase][3],
      lot:{id:'A',location,progress,form:q<12?'wafer':q<15?'covered':'packages',cover:q<11?0:q<12?ease(q-11):q<15?1:q<16?1-ease(q-15):0},
      material:{state:q<11?'已備':q<12?'投入中':'已投入',progress:ease(q-11),visible:q<12},
      spec:{D:true,O:q>=4,transit:q>=2&&q<4,progress:ease((q-2)/2)},
      report:{O:q>=19,D:q>=21,transit:q>=19&&q<21,progress:ease((q-19)/2)},
      release:{D:q>=23,O:q>=24.5,transit:q>=23&&q<24.5,progress:ease((q-23)/1.5)},
      work,fixture:q>=16&&q<19,fixtureInset:q>=16&&q<19?ease(Math.min(q-16,19-q)/.45):0,
      delivery:q<23?'':q<24.5?'指示：送往系統廠 C':q<25?'收到出貨指示 → C':q<27.5?'已出貨 → 系統廠 C':'已交付系統廠 C',
      active:reset?'':q>=2&&q<4||q>=23&&q<24.5?'infoDown':q>=5&&q<7||q>=11&&q<19?'service':q>=7&&q<10?'materialFO':q>=19&&q<21?'infoUp':q>=25&&q<27.5?'materialOC':''};
  }
  function pointOn(points,p) {
    const lengths=points.slice(1).map((b,i)=>Math.hypot(b[0]-points[i][0],b[1]-points[i][1]));
    let d=lengths.reduce((a,b)=>a+b,0)*clamp(p);
    for(let i=0;i<lengths.length;i++){if(d<=lengths[i]||i===lengths.length-1){const u=lengths[i]?d/lengths[i]:0;return [points[i][0]+(points[i+1][0]-points[i][0])*u,points[i][1]+(points[i+1][1]-points[i][1])*u];}d-=lengths[i];}
  }
  const api={version:'1.0.0',duration:32,stages,keyframes,stateAt,pointOn,ease};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SupplyChain=api;
})(typeof window!=='undefined'?window:globalThis);
