import {AXES} from './core.mjs';

const clone = value => JSON.parse(JSON.stringify(value));
const identity = s => JSON.stringify([s.view,s.x,s.y,s.selected,s.q,s.type,s.relationType,s.route]);
const finite = (v,min,max) => typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;
const panels = ['controls','detail','navigator','legend'];
const sections = ['axis-section','axis-definition','list-section','relationship-section','display-section','info-section','history-section'];

// Only accept snapshots for the currently loaded dataset. Storage is optional.
export function snapshotValidator(data) {
  const ids = new Set(data.topics.map(t=>t.id));
  const types = new Set(['',...data.topics.flatMap(t=>t.types)]);
  const kinds = new Set(['',...data.relations.map(e=>e.kind)]);
  return s => {
    if (!s || !['coordinates','relations'].includes(s.view) || !AXES[s.x] || !AXES[s.y] || s.x===s.y) return null;
    if (s.selected!==null && !ids.has(s.selected)) return null;
    if (s.view==='relations' && !s.selected && ids.size) return null;
    if (typeof s.q!=='string' || s.q.length>2000 || !types.has(s.type) || !kinds.has(s.relationType)) return null;
    if (!finite(s.zoom,.55,5) || !finite(s.panX,-1e7,1e7) || !finite(s.panY,-1e7,1e7) || !finite(s.width,1,1e5) || !finite(s.height,1,1e5)) return null;
    if (!Array.isArray(s.route) || s.route.length>100 || !s.route.every(id=>ids.has(id))) return null;
    return {
      view:s.view,x:s.x,y:s.y,selected:s.selected,q:s.q,type:s.type,relationType:s.relationType,
      zoom:s.zoom,panX:s.panX,panY:s.panY,width:s.width,height:s.height,route:[...s.route],
      panels:Object.fromEntries(panels.map(k=>[k,!!s.panels?.[k]])),
      controlSections:sections.filter(k=>s.controlSections?.includes(k)),
      detailSections:['scores','scope','relations','sources'].filter(k=>s.detailSections?.includes(k))
    };
  };
}

export function restoreCamera(s,width,height) {
  return {zoom:s.zoom,panX:s.panX*width/s.width,panY:s.panY*height/s.height};
}

export class ExplorationHistory {
  constructor(initial,{limit=60,validate=s=>s}={}) {
    this.limit=Math.max(2,limit);this.validate=validate;this.entries=[clone(initial)];this.index=0;
  }
  get current(){return clone(this.entries[this.index]);}
  refresh(snapshot){this.entries[this.index]=clone(snapshot);}
  push(snapshot){
    if(identity(snapshot)===identity(this.entries[this.index])){this.refresh(snapshot);return false;}
    this.entries.splice(this.index+1);this.entries.push(clone(snapshot));
    if(this.entries.length>this.limit)this.entries.splice(0,this.entries.length-this.limit);
    this.index=this.entries.length-1;return true;
  }
  go(index){
    if(!Number.isInteger(index)||index<0||index>=this.entries.length)return null;
    this.index=index;return this.current;
  }
  clear(snapshot){this.entries=[clone(snapshot)];this.index=0;}
  serialize(){return JSON.stringify({version:1,index:this.index,entries:this.entries});}
  load(raw){
    try{
      const s=JSON.parse(raw);
      if(s?.version!==1||!Array.isArray(s.entries)||!s.entries.length||s.entries.length>this.limit||!Number.isInteger(s.index)||s.index<0||s.index>=s.entries.length)return false;
      const entries=s.entries.map(this.validate);if(entries.some(e=>!e))return false;
      this.entries=clone(entries);this.index=s.index;return true;
    }catch{return false;}
  }
}
