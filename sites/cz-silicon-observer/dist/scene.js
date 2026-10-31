import {profilePoints,radiusAt,smooth} from './model.js';
const furnace=(id)=>`<g id="${id}">
 <path class="heater" d="M53 315V424Q53 459 100 459H260Q307 459 307 424V315"/>
 <path class="vessel" d="M60 313H73V407Q73 447 118 447H242Q287 447 287 407V313H300V411Q300 461 246 461H114Q60 461 60 411Z"/>
 <path class="quartz" d="M72 312H83V407Q83 437 121 437H239Q277 437 277 407V312H288V409Q288 448 241 448H119Q72 448 72 409Z"/>
 <g clip-path="url(#bowl)"><path id="${id}-melt" class="melt"/><g id="${id}-raw">${Array.from({length:19},(_,i)=>{let x=91+(i%6)*31+(Math.floor(i/6)%2)*6,y=345+Math.floor(i/6)*26;return `<path d="M${x} ${y}l21 -5 10 17 -13 12 -21 -8Z" fill="${i%2?'#aebac3':'#c3cdd2'}" stroke="#8797a1" stroke-width="1"/>`;}).join('')}</g></g>
 <path id="${id}-surface" d="" fill="none" stroke="#c19b76" stroke-width="1.2"/>
 <path class="guide" d="M288 428L320 441"/><text id="${id}-label" x="320" y="464" text-anchor="end">石英坩堝</text></g>`;
export function createScene(svg){svg.innerHTML=`<defs>
 <linearGradient id="silicon"><stop stop-color="#a3b8c4"/><stop offset=".33" stop-color="#dce7ec"/><stop offset=".67" stop-color="#c2d3dd"/><stop offset="1" stop-color="#8ca6b5"/></linearGradient>
 <clipPath id="bowl"><path d="M83 310H277V407Q277 437 239 437H121Q83 437 83 407Z"/></clipPath>
 <clipPath id="process-window"><rect x="0" y="24" width="360" height="446"/></clipPath><clipPath id="crystal-clip"><path id="clip-profile"/></clipPath><clipPath id="atom-clip"><rect x="20" y="58" width="125" height="130"/></clipPath>
 <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1L8 5 1 9" fill="none" stroke="#79949b" stroke-width="1.5"/></marker>
 </defs><g id="equipment"><text id="view-note" x="20" y="20" class="muted">CZ 直拉法 · 固定剖視</text>
 <g clip-path="url(#process-window)"><g id="old-batch">${furnace('furnace')}<text id="melt-label" x="100" y="408">熔融矽</text></g>
 <g id="new-batch">${furnace('new-furnace')}<text x="100" y="410" id="raw-label">新多晶矽原料</text></g>
 <g id="crystal"><path id="shaft" class="guide"/><rect id="holder" x="168" width="24" height="14" rx="3" fill="#d2dbdf" stroke="#8d9aa1"/>
 <rect id="seed" class="seed" x="172" width="16" height="22" rx="2"/><path id="ingot" class="solid"/><g id="growth-lines" clip-path="url(#crystal-clip)"></g>
 <path id="seed-leader" class="guide"/><text id="seed-label">晶種</text><path id="body-leader" class="guide"/><text id="body-label" x="16">單晶矽棒</text>
 <g id="pull-arrow"><path class="rotation" d="M126 147V115"/><text x="112" y="105" text-anchor="end" class="muted">向上拉</text></g>
 <g id="spin"><path class="rotation" d="M160 0C146 -14 214 -14 201 0"/><circle id="spin-dot" r="2.7" fill="#78959c"/></g></g>
 <g id="boundary"><path id="meniscus" d="" fill="#f1d6bc" stroke="#c19b76" stroke-width="1"/><path id="interface" class="interface"/><path id="boundary-leader" class="guide"/><text id="boundary-label" x="342" text-anchor="end">固液界面</text><text id="boundary-small" x="342" text-anchor="end" class="muted">持續凝固</text></g>
 <g id="fresh-seed"><path class="guide" d="M180 35V231"/><rect x="168" y="234" width="24" height="14" rx="3" fill="#d2dbdf" stroke="#8d9aa1"/><rect class="seed" x="172" y="248" width="16" height="22" rx="2"/><text x="207" y="263">新晶種</text></g>
 <text id="cycle-note" x="20" y="55" class="muted"></text></g></g>
 <g id="atoms"><text x="0" y="18">局部排列示意</text><text x="0" y="40" class="muted" font-size="12">取向延續 · 非設備比例</text>
 <rect x="16" y="55" width="133" height="60" rx="4" fill="#e2ebef"/><rect x="16" y="115" width="133" height="75" rx="4" fill="#f5e4d2"/>
 <path d="M16 115H149" class="interface"/><g id="atom-particles" clip-path="url(#atom-clip)"></g>
 <text x="166" y="78" class="muted" font-size="14">固體</text><text x="166" y="101" class="muted" font-size="13">同一取向</text>
 <text x="166" y="143" class="muted" font-size="14">熔體</text><text x="166" y="166" class="muted" font-size="13">尚未排定</text>
 <text id="atom-caption" x="0" y="213" class="muted" font-size="12">排列方向示意，非矽的實際晶格</text>
 <text id="control-note" x="0" y="246" font-size="14">溫度梯度 × 拉速 × 旋轉</text></g>`;}
function el(svg,id){return svg.querySelector('#'+id);}function attrs(e,values){for(const [key,v] of Object.entries(values))e.setAttribute(key,String(v));}
export function drawScene(svg,s,l){const get=id=>el(svg,id),f=(id,a)=>attrs(get(id),a);
 f('equipment',{transform:`translate(${l.x} ${l.y}) scale(${l.scale})`});get('equipment').querySelectorAll('text').forEach(e=>e.setAttribute('font-size',e.id==='boundary-small'||e.id==='view-note'||e.id==='cycle-note'?l.small:l.font));
 f('old-batch',{transform:`translate(${s.oldOffset} 0)`});f('new-batch',{transform:`translate(${s.newOffset} 0)`,visibility:s.t>=45?'visible':'hidden'});
 const surface=s.surface;f('furnace-melt',{d:`M83 ${surface}H277V440H83Z`,opacity:s.melt});f('furnace-surface',{d:`M83 ${surface}H277`,opacity:s.melt});f('furnace-raw',{opacity:1-s.melt,transform:`translate(0 ${s.melt*15})`});f('new-furnace-melt',{d:'',opacity:0});f('new-furnace-surface',{d:''});
 get('melt-label').textContent=s.t<2?'多晶矽原料':'熔融矽';f('melt-label',{y:Math.min(422,surface+59)});f('crystal',{visibility:s.crystalVisible?'visible':'hidden'});
 f('shaft',{d:`M180 35V${s.seedBottom-37}`});f('holder',{y:s.seedBottom-36});f('seed',{y:s.seedBottom-22});
 const pts=profilePoints(s.growth),p='M'+pts.map(([r,z])=>`${180-r},${s.top+z}`).join('L')+'L'+pts.slice().reverse().map(([r,z])=>`${180+r},${s.top+z}`).join('L')+'Z';
 f('ingot',{d:p,visibility:s.growth>.01?'visible':'hidden'});f('clip-profile',{d:p});get('growth-lines').innerHTML=Array.from({length:Math.floor(s.growth/22)},(_,i)=>{const z=(i+1)*22,r=radiusAt(z);return `<path class="growth-line" d="M${180-r} ${s.top+z}Q180 ${s.top+z+4} ${180+r} ${s.top+z}"/>`;}).join('');
 f('seed-label',{x:216,y:s.seedBottom-6});f('seed-leader',{d:`M190 ${s.seedBottom-11}H208`});const by=s.top+Math.min(s.growth*.55,150);f('body-leader',{d:`M100 ${by}H${180-radiusAt(Math.min(s.growth*.55,150))-5}`,opacity:s.growth>25?1:0});f('body-label',{y:by-10,opacity:s.growth>25?1:0});
 f('pull-arrow',{transform:`translate(0 ${Math.min(100,Math.max(-40,s.top-90))})`,opacity:s.t>=7&&s.t<36?1:0});f('spin',{transform:`translate(0 ${s.seedBottom-44})`,opacity:s.t>=7&&s.t<36?1:0});f('spin-dot',{cx:180+23*Math.sin(s.rotation*1.8),cy:-6+5*Math.cos(s.rotation*1.8)});
 const r=radiusAt(s.growth);f('boundary',{opacity:s.interfaceVisible?1:0});f('meniscus',{d:`M${180-r-10} ${surface+3}Q${180-r-3} ${surface} ${180-r} ${surface-3}H${180+r}Q${180+r+3} ${surface} ${180+r+10} ${surface+3}`});f('interface',{d:`M${180-r} ${surface}H${180+r}`});f('boundary-leader',{d:`M${180+r+5} ${surface}L${Math.max(242,180+r+18)} ${surface-29}H342`});f('boundary-label',{y:surface-48});f('boundary-small',{y:surface-31});
 f('fresh-seed',{opacity:s.seedNewOpacity,visibility:s.reset?'visible':'hidden'});get('cycle-note').textContent=s.t>=43?'下一爐次 · 新原料':s.t>=38?'冷卻後取出':s.t>=36?'已脫離熔體':'';
 f('atoms',{visibility:l.inset&&l.wide?'visible':'hidden',transform:`translate(${l.atomX} ${l.atomY}) scale(${l.atomScale})`});
 get('atoms').querySelectorAll('text').forEach(e=>{e.dataset.baseFont??=e.getAttribute('font-size')||'16';e.setAttribute('font-size',Math.max(Number(e.dataset.baseFont),12/l.atomScale));});
 const progress=s.t>=7&&s.t<36?(s.t-7)*.48:0,particles=[];for(let j=0;j<4;j++)for(let i=0;i<7;i++){const y=58+((i*20-progress*20)%140+140)%140,liquid=smooth((y-115)/55),x=38+j*29+liquid*(Math.sin(i*2.1+j*7+progress)*7);particles.push(`<circle cx="${x}" cy="${y}" r="4" class="${y<=115?'atom-solid':'atom-liquid'}"/>`);}get('atom-particles').innerHTML=particles.join('');
}

