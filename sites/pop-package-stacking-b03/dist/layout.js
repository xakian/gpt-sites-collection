export function layout(width,height){return {width,height,x:width*.1,w:width*.8,y:height<300?158:Math.min(Math.max(255,height*.58),height-125),k:height<300?.55:1};}
