export function layout({w,h}){const mobile=w<600,L=mobile?27:w*.15,R=mobile?w-27:w*.85;return{w,h,mobile,f:mobile?14:16,L,R,top:Math.max(85,h*.20),y:h*.58,xl:L+(R-L)*.14,xr:R-(R-L)*.14};}
