import {sampleTopic} from '../model.mjs';
export function describe(f){const s=sampleTopic(f.local/1000);return {...s,label:s.isResetPresentation?'同一案例重播 · 不修復晶粒':s.displayAsRecorded?'A／B 數據已記錄 · 晶圓完整':`${s.activeDieId} · ${s.measurementMode} · ${s.contactState?'已接觸':'未接觸'}`};}
