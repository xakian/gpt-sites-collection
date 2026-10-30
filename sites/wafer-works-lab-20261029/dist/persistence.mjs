import {clone,validateWorld} from './core.mjs';
export const PREFIX='wafer-works-v1:';
export function decode(text,c){
 if(new TextEncoder().encode(text).length>5*1024*1024)throw Error('檔案超過 5 MiB 上限');
 let data;try{data=JSON.parse(text);}catch{throw Error('不是有效的 JSON 存檔');}
 if(data.formatVersion!==1)throw Error('不支援此存檔封裝版本');validateWorld(data.current,c);
 if(data.operatingCheckpoint!==null){validateWorld(data.operatingCheckpoint,c);if(data.operatingCheckpoint.worldId!==data.current.worldId)throw Error('檢查點屬於其他世界');}
 return clone(data);
}
export function encode(engine){validateWorld(engine.w,engine.c);if(engine.checkpoint)validateWorld(engine.checkpoint,engine.c);return JSON.stringify({formatVersion:1,current:engine.w,operatingCheckpoint:engine.checkpoint});}
export class Saves{
 constructor(storage,content){this.storage=storage;this.c=content;this.error=null;this.lastTick=null;this.conflict=false;}
 save(engine){try{if(this.conflict)throw Error('另一分頁變更了存檔，請先重新載入');const text=encode(engine),old=this.storage.getItem(PREFIX+'current');if(old){try{decode(old,this.c);this.storage.setItem(PREFIX+'previousGood',old);}catch(e){if(e.name==='QuotaExceededError'||e.name==='SecurityError')throw e;}}
 this.storage.setItem(PREFIX+'current',text);this.lastTick=engine.w.tick;this.error=null;return true;
 }catch(e){this.error='未保存：'+e.message;return false;}}
 load(which='current'){const text=this.storage.getItem(PREFIX+which);if(!text)throw Error('尚無這份存檔');return decode(text,this.c);}
 apply(engine,data){validateWorld(data.current,this.c);if(data.operatingCheckpoint)validateWorld(data.operatingCheckpoint,this.c);engine.setWorld(data.current);engine.checkpoint=data.operatingCheckpoint?clone(data.operatingCheckpoint):null;this.conflict=false;}
 reset(engine){for(const key of ['current','previousGood'])this.storage.removeItem(PREFIX+key);this.conflict=false;return this.save(engine);}
}
