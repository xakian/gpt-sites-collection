export function allowedGalleryParent(parentOrigin,childOrigin){
 if(['https://xakian.com','https://www.xakian.com'].includes(parentOrigin))return true;
 try{
  const parent=new URL(parentOrigin),child=new URL(childOrigin);
  return parent.origin===parentOrigin&&parent.protocol==='http:'&&child.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(child.hostname)&&parent.hostname===child.hostname;
 }catch{return false;}
}
export function validGalleryControl(event,parentWindow,parentOrigin){
 const data=event.data;
 if(event.source!==parentWindow||event.origin!==parentOrigin||data?.type!=='gallery-control'||data.id!=='wafer-test'||!Array.isArray(data.args))return false;
 if(data.method==='setActive')return data.args.length===2&&data.args.every(value=>typeof value==='boolean');
 if(data.method==='command')return data.args.length===1&&['play','pause','replay','flow','schematic'].includes(data.args[0]);
 if(data.method==='restore')return data.args.length===1&&data.args[0]&&typeof data.args[0]==='object'&&Number.isFinite(data.args[0].total)&&data.args[0].total>=0&&['schematic','flow'].includes(data.args[0].mode)&&[0.5,1,1.5,2].includes(data.args[0].rate);
 return false;
}
