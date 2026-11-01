export function layout({w,h}){return{w,h,mobile:w<600,f:w<600?14:16,bw:w<600?w-76:Math.min(680,w*.64),cx:w/2,cy:h*.42,k:Math.min(1.4,(h-96)/284)};}
