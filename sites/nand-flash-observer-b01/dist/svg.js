export const C={ink:'#506571',si:'#BBCBD8',oxide:'#D6E8DB',copper:'#D9AC91',metal:'#ABBCC7',electron:'#5A8EB0',hole:'#C58E86',gold:'#DABF7F',purple:'#B3A6CA',muted:'#5B6B75',paper:'#F7F9FA',on:'#5D9B87'};
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const mix=(a,b,t)=>a+(b-a)*t;
export const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
export const rect=(x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="${Math.max(0,h)}" fill="${fill}" stroke="${C.ink}" stroke-width="1.2" ${extra}/>`;
export const line=(x1,y1,x2,y2,color=C.ink,extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.5" ${extra}/>`;
export const text=(x,y,s,cls='',anchor='middle')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${s}</text>`;
export const circle=(x,y,r,fill,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${C.ink}" stroke-width="1" ${extra}/>`;
export const path=(d,color=C.ink,width=2,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
export function arrow(x1,y1,x2,y2,color=C.ink,width=1.5){const a=Math.atan2(y2-y1,x2-x1),r=6;return line(x1,y1,x2,y2,color,`style="stroke-width:${width}"`)+path(`M${x2-r*Math.cos(a-.5)},${y2-r*Math.sin(a-.5)} L${x2},${y2} L${x2-r*Math.cos(a+.5)},${y2-r*Math.sin(a+.5)}`,color,width);}
export const electron=(x,y)=>circle(x,y,4.5,C.electron)+line(x-2,y,x+2,y,'#fff');
export const hole=(x,y)=>circle(x,y,5,C.paper,`style="stroke:${C.hole};stroke-width:1.7"`);
