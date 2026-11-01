export function layout({w,h}){const mobile=w<650;return{w,h,mobile,font:mobile?15:17,x:mobile?30:w*.20,width:mobile?w-60:w*.60,y:h*.52,k:Math.min(1.25,(h-90)/210)};}
