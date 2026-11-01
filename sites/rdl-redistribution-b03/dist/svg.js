export const rect=(x,y,w,h,c,extra='')=>`<rect x="${x}" y="${y}" width="${Math.max(0,w)}" height="${Math.max(0,h)}" rx="2" class="${c} outline" ${extra}/>`;
export const text=(x,y,s,c='',anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" class="${c}">${s}</text>`;
export const line=(x,y,X,Y,c='guide',extra='')=>`<path d="M${x} ${y}L${X} ${Y}" class="${c}" ${extra}/>`;
export const circle=(x,y,r,c,extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" class="${c} outline" ${extra}/>`;
export const path=(d,c,extra='')=>`<path d="${d}" class="${c}" ${extra}/>`;
export function legend(items,W){const cols=W<600?Math.min(items.length,3):items.length,cw=W<600?Math.min(115,(W-14)/cols):130,left=(W-cols*cw)/2;return items.map(([c,s],i)=>{const x=left+i%cols*cw,y=23+Math.floor(i/cols)*27;return rect(x,y-11,12,10,c)+text(x+18,y,s,'material','start');}).join('');}
