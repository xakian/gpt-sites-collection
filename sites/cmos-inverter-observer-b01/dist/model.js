import{smooth}from'./svg.js';
export function stateAt(t){const input=t<6?0:t<8?smooth((t-6)/2):t<16?1:t<18?1-smooth((t-16)/2):0,output=t<7?1:t<10?1-smooth((t-7)/3):t<17?0:t<20?smooth((t-17)/3):1;return{input,output,pOn:input<.65,nOn:input>.35,charging:t>17&&t<20,discharging:t>7&&t<10,transition:input>.05&&input<.95};}
