export const C={ink:'#253039',muted:'#5B6B75',line:'#647985',copper:'#D9AA8E',ceramic:'#E6E5DC',silicon:'#ADC3D0',tin:'#C4D0D5',purple:'#B6A1C5',water:'#9FC5D9',heat:'#C78463',green:'#BFD1C1',tool:'#E2E8EC',paper:'#F7F9FA'};
export const clamp=x=>Math.max(0,Math.min(1,x));export const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
export const rect=(x,y,w,h,fill,extra='')=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="${Math.max(0,h)}" rx="2" fill="${fill}" stroke="${C.line}" stroke-width="1.2" ${extra}/>`;
export const text=(x,y,s,f=16,fill=C.ink,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${f}" fill="${fill}">${s}</text>`;
export const line=(x1,y1,x2,y2,color=C.line,width=1.4,extra='')=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" ${extra}/>`;
export function arrow(x1,y1,x2,y2,color=C.heat,width=2){const a=Math.atan2(y2-y1,x2-x1),l=7;return line(x1,y1,x2,y2,color,width)+`<path d="M${x2-l*Math.cos(a-.5)} ${y2-l*Math.sin(a-.5)}L${x2} ${y2}L${x2-l*Math.cos(a+.5)} ${y2-l*Math.sin(a+.5)}" fill="none" stroke="${color}" stroke-width="${width}"/>`;}
export function swap(t,start,end,w){const mid=(start+end)/2;if(t<start)return{x:0,fresh:false};if(t<mid)return{x:ease((t-start)/(mid-start))*(w+400),fresh:false};return{x:-(1-ease((t-mid)/(end-mid)))*(w+400),fresh:true};}
export const stageAt=(t,stages)=>Math.max(0,stages.findLastIndex(s=>t>=s.start));
