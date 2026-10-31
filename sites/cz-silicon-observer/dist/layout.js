export function layout(w,h){
 const wide=w/h>1.35&&w>630;
 const inset=wide;
 const reserve=0;
 const scale=Math.min((wide?w*.56:w)/360,(h-reserve)/470,1.55);
 const x=wide?Math.max(12,(w*.57-360*scale)/2):(w-360*scale)/2;
 const y=Math.max(0,(h-reserve-470*scale)/2);
 const atomScale=wide?Math.min(1.35,(w*.39)/240,(h-32)/255):Math.min(1,(w-30)/325);
 return {wide,inset,scale,x,y,atomScale,atomX:wide?w*.61:(w-325*atomScale)/2,atomY:wide?(h-245*atomScale)/2:h-140,font:Math.max(15/scale,14),small:Math.max(12/scale,12)};
}
