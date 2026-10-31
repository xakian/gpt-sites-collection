import{clamp,smooth}from'./svg.js';
export function stateAt(t){
 const exposure=t>=3&&t<12,transfer=t>=16&&t<19,reset=t<3||(t>=12&&t<14)||t>=27;
 const clear=t>=27?smooth((t-27)/2):0;
 const carriers=Array.from({length:12},(_,i)=>({id:i,created:3.8+i*.65,p:clamp((t-16-i*.08)/1.8),exit:clamp((t-27-i*.08)/1.1)})).filter(e=>t>=e.created&&e.exit<1);
 const moved=carriers.reduce((n,e)=>n+e.p*(1-e.exit),0),fdVoltage=1-.6*moved/12;
 return{exposure,transfer,tx:t<3||transfer||t>=27,rst:reset,sel:t>=14&&t<27,carriers,fdVoltage,ppd:carriers.filter(e=>e.p===0).length,fd:carriers.filter(e=>e.p===1).length,
 reference:t>=14.5&&t<30?1:null,signal:t>=20&&t<30?.4:null,cds:t>=21&&t<30?.6:null,code:t>=24&&t<30?153:null,outputProgress:clamp((t-26)/4),clear,
 mode:t<3?'準備像素':t<12?'固定光強 · 曝光累積':t<14?'只重設 FD，PPD 電荷保留':t<16?'參考取樣 · TX 關閉':t<19?'TX 開啟 · 電荷轉移':t<21?'訊號取樣 · FD 電壓降低':t<24?'兩次電壓取樣相減':t<27?'欄 ADC 量化 · 輸出灰階值':t<30?'重設像素 · 資料送往後端':'準備好，等待新的入射光'};
}
