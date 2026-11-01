export const R=(x,y,w,h,c,extra='')=>'<rect x="'+x+'" y="'+y+'" width="'+Math.max(0,w)+'" height="'+Math.max(0,h)+'" fill="'+c+'" '+extra+'/>';
export const P=(d,c='none',extra='')=>'<path d="'+d+'" fill="'+c+'" '+extra+'/>';
export const T=(x,y,text,size=16,extra='')=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="'+size+'" fill="#253039" '+extra+'>'+text+'</text>';
export const C=(x,y,r,c,extra='')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'" '+extra+'/>';
