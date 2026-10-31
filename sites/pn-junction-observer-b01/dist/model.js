import {smooth} from './svg.js';
export function stateAt(t){const f=t<6?0:t<8?smooth((t-6)/2):t<14?1:t<17?1-smooth((t-14)/3):0,r=t<17?0:t<20?smooth((t-17)/3):t<26?1:1-smooth((t-26)/4);return{forward:f,reverse:r,bias:f-r,width:.30-.16*f+.20*r,barrier:1-.60*f+.55*r,current:f>.01?'forward':r>.01?'reverse':'zero'};}
