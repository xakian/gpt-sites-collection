import{smooth}from'./svg.js';
export function stateAt(t){const drive=t<3?0:t<5?smooth((t-3)/2):t<20?1:t<22?1-smooth((t-20)/2):0;
 const events=Array.from({length:23},(_,i)=>({id:i,born:4.4+i*.7,age:t-(4.4+i*.7),radiative:i%3!==2,trapped:i%5===3})).filter(e=>e.age>=0&&e.age<5.2);
 return{drive,events,injecting:events.some(e=>e.age<1.8),light:events.some(e=>e.radiative&&e.age>=2.2&&e.age<5.2),mode:t<3?'未加正向驅動':t<5?'建立正向偏壓':t<9?'電子與電洞注入發光區':t<16?'複合 · 釋放能量':t<20?'出射光與內部損失':t<22?'降低驅動 · 注入停止':t<26?'剩餘載子複合，光離開':'同一元件，回到關閉'};
}
