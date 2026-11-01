export function layout({w,h}){const mobile=w<650;const scale=Math.min(1.15,(h-140)/192);const total=192*scale;return{w,h,mobile,font:mobile?15:17,scale,x:mobile?22:w*.14,y:Math.max(78,(h-total)/2),width:mobile?w*.52:w*.43,legendX:mobile?w*.66:w*.68};}

