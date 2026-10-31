export function layoutFor(width,height){
 const compact=width<700,x=compact?14:32,w=compact?width-28:width-240;
 const siliconY=Math.round(height*(compact?.68:.72)),siliconH=Math.max(42,Math.min(compact?132:84,height*(compact?.22:.19))),filmH=Math.max(30,Math.min(compact?116:62,height*(compact?.2:.14))),resistH=Math.max(32,Math.min(compact?94:56,height*(compact?.16:.125)));
 const filmY=siliconY-filmH,resistY=filmY-resistH,gap=Math.max(92,Math.min(compact?138:220,w*.26)),cx=x+w/2;
 const maskY=Math.max(34,Math.min(66,resistY*.25)),lensOffset=Math.min(57,Math.max(30,(resistY-maskY)*.38));
 return{width,height,compact,x,w,cx,left:cx-gap/2,right:cx+gap/2,gap,siliconY,siliconH,filmY,filmH,resistY,resistH,maskY,lensOffset,font:compact?16:18,small:compact?12:13,labelX:compact?x+10:x+w+26};
}
