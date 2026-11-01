export function layout({w,h}){return{w,h,mobile:w<600,f:w<600?14:16,bw:Math.min(340,w*.52),x:w/2,y:h*.51,k:Math.min(1.35,(h-125)/200)};}
