import {config as defaults} from './config.mjs';
const smooth=(v)=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
export const currentPass=(v,limit)=>Number.isFinite(v)?v<=limit:null;
export function logicOf(v,c=defaults){if(v===null)return null;const {low,high}=c.conditions;return v>=low[0]&&v<=low[1]?0:v>=high[0]&&v<=high[1]?1:'無有效邏輯';}
export function sampleTopic(time,c=defaults){
 const raw=Math.max(0,Math.min(c.duration,time));
 const reset=raw>=37&&raw<40;
 const t=raw>=38.5?0:raw;
 const phaseIndex=raw===40?0:c.phases.findIndex(p=>raw>=p[0]&&raw<p[1]);
 let z=0;
 if(t>=1&&t<2)z=smooth(t-1);else if(t>=2&&t<15.5)z=1;
 else if(t>=15.5&&t<16)z=1-smooth((t-15.5)/.5);
 else if(t>=17.5&&t<18.25)z=smooth((t-17.5)/.75);
 else if(t>=18.25&&t<31.5)z=1;
 else if(t>=31.5&&t<32.5)z=1-smooth(t-31.5);
 const contact=(t>=2&&t<15.5)||(t>=18.25&&t<31.5);
 const x=t<16?0:t<17.5?-288*smooth((t-16)/1.5):-288;
 const aligned=t<16?'A':t<17.5?null:'B';
 const supply=(t>=2.25&&t<15.15)||(t>=18.5&&t<31.15);
 const driven=(t>=2&&t<15.35)||(t>=18.25&&t<31.35);
 const input=driven?((t>=5.5&&t<8)||(t>=21.5&&t<24)?1:0):null;
 const active=t<17.5?'A':'B';
 const u=t-(active==='A'?8:24);
 const mode=supply?(u>=0&&u<4?(u<1?'建立靜態條件':u<2.5?'等待穩定':'電流已取樣'):((t>=3&&t<8)||(t>=19&&t<24))?'功能測試':'供電就緒'):'停止施加';
 const dies={};
 for(const [id,data] of Object.entries(c.cases)){
   const o=id==='A'?0:16;
   const rows=[0,1].map((expected,i)=>{const start=3+o+i*2.5,sample=3.75+o+i*2.5,compare=4.25+o+i*2.5;const v=t>=sample?data.voltages[i]:null;return {expected:t>=start?expected:null,logic:logicOf(v,c),voltage:v,result:t>=compare?logicOf(v,c)===expected:null};});
   const functional=t>=7+o?rows.every(r=>r.result===true):null;
   const current=t>=10.5+o?data.current:null;
   const electrical=t>=12.5+o?currentPass(current,c.limits.current):null;
   const total=t>=13+o&&functional!==null&&electrical!==null?functional&&electrical:null;
   const map=t>=14+o?(total?'pass':'fail'):t>=3+o?'testing':'untested';
   dies[id]={rows,functional,current,electrical,total,map,currentOpacity:current===null?0:Math.min(1,(t-(10.5+o))/.25),recorded:t>=14+o};
 }
 let opacity=1;if(raw>=38&&raw<38.4)opacity=1-(raw-38)/.4;else if(raw>=38.4&&raw<39)opacity=0;else if(raw>=39)opacity=raw-39;
 return {time:raw,phaseIndex,phase:c.phases[phaseIndex],activeDieId:active,alignedDieId:aligned,stageX:x,stageZ:z,contactState:contact,supplyEnabled:supply,inputDriveState:input,measurementMode:mode,dies,presentationOpacity:opacity,isResetPresentation:reset,displayAsRecorded:t>=31.35,mapSelection:t>=32.5?null:aligned,effectiveTime:t};
}
