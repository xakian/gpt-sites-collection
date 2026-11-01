export function layout({w,h}){const mobile=w<650;const chipW=mobile?Math.min(154,w*.43):Math.min(216,w*.22);const chipH=mobile?26:30;const offset=mobile?27:36;return{w,h,mobile,chipW,chipH,offset,source:{x:mobile?w/2-chipW/2:w*.19-chipW/2,y:mobile?Math.max(105,h*.24):h*.54},target:{x:mobile?w/2-chipW/2-offset:w*.64-chipW/2,y:Math.min(mobile?h*.76:h*.69,h-chipH-64)},font:mobile?15:17};}

