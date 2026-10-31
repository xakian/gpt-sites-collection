import {createShell,ObserverPlayer} from './shared/observer.js';

// The geometry is fixed for one device. All changes below are derived from one playback time.
const DURATION=24000;
const shell=createShell({title:'MOSFET：閘極怎麼控制電流？',sceneLabel:'單顆平面增強型 nMOS 剖面，閘極電場控制矽表面通道'});
const svg=shell.svg;
let geometry,refs,player;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const mix=(a,b,p)=>a+(b-a)*p;
const number=n=>Number(n).toFixed(1);

function gateVoltage(t){
  if(t<3)return 0;
  if(t<11)return smooth((t-3)/8);
  if(t<17)return 1;
  if(t<22)return 1-smooth((t-17)/5);
  return 0;
}

function buildScene(){
  const box=shell.host.getBoundingClientRect();
  const ratio=box.width/Math.max(1,box.height);
  const portrait=ratio<1.08;
  const tall=portrait&&ratio<.70;
  const wide=ratio>2.35;
  const W=portrait?480:wide?950:900;
  const H=tall?790:portrait?570:wide?350:530;
  const left=portrait?25:wide?90:90;
  const right=W-left;
  const width=right-left;
  const gateL=left+width*.29,gateR=right-width*.29;
  const sy=tall?390:portrait?268:wide?160:235;
  const by=tall?680:portrait?468:wide?285:430;
  const gy=tall?260:portrait?146:wide?70:112;
  const ox=sy-23;
  const sourceX=(left+gateL)/2,drainX=(gateR+right)/2,gateX=(gateL+gateR)/2;
  geometry={W,H,left,right,width,gateL,gateR,sy,by,gy,ox,sourceX,drainX,gateX,portrait};
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  const ionXs=Array.from({length:9},(_,i)=>gateL+24+(gateR-gateL-48)*i/8);
  const surfaceHoles=ionXs.map((x,i)=>`<circle id="surface-hole-${i}" class="hole" cx="${number(x)}" cy="${sy+29+(i%2)*10}" r="6"/>`).join('');
  const bulkHoles=Array.from({length:12},(_,i)=>{
    const column=i%4;
    const x=left+width*[.08,.20,.80,.92][column];
    const y=sy+93+Math.floor(i/4)*Math.min(24,(by-sy-110)/2);
    return `<circle class="hole" cx="${number(x)}" cy="${number(y)}" r="4.6" opacity=".44"/>`;
  }).join('');
  const electrons=Array.from({length:16},(_,i)=>`<circle id="flow-${i}" class="electron" r="5.5"/>`).join('');
  const field=Array.from({length:5},(_,i)=>{
    const x=mix(gateL+28,gateR-28,i/4);
    return `<path id="field-${i}" d="M ${number(x)} ${gy+48} V ${sy+5}" stroke="#7e99a2" stroke-width="1.8" stroke-dasharray="4 5" marker-end="url(#field-tip)"/>`;
  }).join('');
  const top=tall?75:portrait?42:wide?22:30;
  const legend1=by+(wide?29:portrait?40:36),legend2=by+(wide?52:portrait?72:62);
  svg.innerHTML=`
    <defs>
      <marker id="electron-tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="#397fa0" stroke-width="1.7"/></marker>
      <marker id="current-tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="#b98464" stroke-width="1.7"/></marker>
      <marker id="field-tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="#7e99a2" stroke-width="1.4"/></marker>
    </defs>
    <text x="${number(sourceX)}" y="${top}" text-anchor="middle" class="terminal">源極 S</text>
    <text x="${number(sourceX)}" y="${top+25}" text-anchor="middle" class="bias">0 V</text>
    <text x="${number(gateX)}" y="${top}" text-anchor="middle" class="terminal">閘極 G</text>
    <text id="gate-bias" x="${number(gateX)}" y="${top+25}" text-anchor="middle" class="bias">VGS = 0.00 V</text>
    <text x="${number(drainX)}" y="${top}" text-anchor="middle" class="terminal">汲極 D</text>
    <text x="${number(drainX)}" y="${top+25}" text-anchor="middle" class="bias">+0.10 V</text>
    <path d="M ${number(sourceX)} ${top+33} V ${sy-5} M ${number(drainX)} ${top+33} V ${sy-5} M ${number(gateX)} ${top+34} V ${gy}" fill="none" stroke="#73858b" stroke-width="2"/>
    <rect x="${left}" y="${sy}" width="${width}" height="${by-sy}" rx="5" fill="#f0e6df" class="device-outline"/>
    <rect x="${left}" y="${sy}" width="${gateL-left}" height="83" fill="#d9e8eb" class="device-outline"/>
    <rect x="${gateR}" y="${sy}" width="${right-gateR}" height="83" fill="#d9e8eb" class="device-outline"/>
    <text x="${number(sourceX)}" y="${sy+58}" text-anchor="middle" class="scene-label">n⁺</text>
    <text x="${number(drainX)}" y="${sy+58}" text-anchor="middle" class="scene-label">n⁺</text>
    <rect id="depletion" x="${number(gateL)}" y="${sy}" width="${number(gateR-gateL)}" height="70" fill="#eadfda" opacity="0"/>
    <rect id="channel" x="${number(gateL)}" y="${sy+2}" width="${number(gateR-gateL)}" height="17" rx="8" fill="#8ac6d5" opacity="0"/>
    ${bulkHoles}${surfaceHoles}${electrons}
    <rect x="${number(gateL)}" y="${ox}" width="${number(gateR-gateL)}" height="${sy-ox}" fill="#f1dcab" class="device-outline"/>
    <rect x="${number(gateL)}" y="${gy}" width="${number(gateR-gateL)}" height="47" rx="3" fill="#bccbd1" class="device-outline"/>
    ${field}
    <text x="${number(gateX)}" y="${ox-8}" text-anchor="middle" class="scene-small">完整絕緣層</text>
    <text x="${number(gateX)}" y="${by-16}" text-anchor="middle" class="scene-label">p 型矽基體 B · 0 V</text>
    <g id="flow-directions" opacity="0">
      <path d="M ${number(left+5)} ${legend1-6} H ${number(left+width*.38)}" class="electron-line" marker-end="url(#electron-tip)"/>
      <text x="${number(left+width*.41)}" y="${legend1}" class="scene-small">電子：源 → 汲</text>
      <path d="M ${number(left+width*.38)} ${legend2-6} H ${number(left+5)}" class="current-line" marker-end="url(#current-tip)"/>
      <text x="${number(left+width*.41)}" y="${legend2}" class="scene-small">傳統電流：汲 → 源</text>
    </g>
    <text id="surface-note" x="${number(gateX)}" y="${sy+(wide?78:98)}" text-anchor="middle" class="scene-small">閘下表面：電洞較多</text>`;
  refs={
    gateBias:svg.querySelector('#gate-bias'),
    depletion:svg.querySelector('#depletion'),channel:svg.querySelector('#channel'),
    holes:ionXs.map((_,i)=>svg.querySelector(`#surface-hole-${i}`)),
    flows:Array.from({length:16},(_,i)=>svg.querySelector(`#flow-${i}`)),
    fields:Array.from({length:5},(_,i)=>svg.querySelector(`#field-${i}`)),
    surfaceNote:svg.querySelector('#surface-note'),directions:svg.querySelector('#flow-directions')
  };
  if(player)player.redraw();
}

function render(frame){
  const t=frame.local/1000;
  const v=gateVoltage(t);
  const depletion=smooth(v/.50);
  const inversion=smooth((v-.37)/.36);
  const conduction=smooth((v-.40)/.38);
  const g=geometry;
  refs.gateBias.textContent=`VGS = ${v.toFixed(2)} V`;
  refs.depletion.setAttribute('opacity',number(depletion*.88));
  refs.channel.setAttribute('opacity',number(inversion*.72));
  refs.channel.setAttribute('height',number(5+14*inversion));
  refs.holes.forEach((hole,i)=>{
    hole.setAttribute('cy',number(g.sy+29+(i%2)*10+depletion*35));
    hole.setAttribute('opacity',number(1-depletion*.42));
  });
  refs.fields.forEach(field=>field.setAttribute('opacity',number(v*.78)));
  refs.directions.setAttribute('opacity',number(conduction));
  refs.flows.forEach((dot,i)=>{
    // Source and drain are reservoirs; each dot is a representative carrier group.
    const phase=(i/16+t*(.115+.055*conduction))%1;
    const reservoirFade=smooth(Math.min(phase*9,(1-phase)*9));
    dot.setAttribute('cx',number(mix(g.gateL-7,g.gateR+7,phase)));
    dot.setAttribute('cy',number(g.sy+10+(i%3-1)*4));
    dot.setAttribute('opacity',number(conduction*reservoirFade*(.50+.4*(i%3)/2)));
  });
  refs.surfaceNote.textContent=v<.22?'閘下表面：電洞較多':v<.56?'電洞退開 · 表面逐漸耗盡':v<.78?'電子在表面增多 · 反轉形成':'反轉通道連接源汲';
  svg.dataset.gateVoltage=v.toFixed(3);
  svg.dataset.channel=inversion.toFixed(3);
  svg.dataset.current=conduction.toFixed(3);
  const index=t<3?0:t<8?1:t<12?2:t<17?3:t<22?4:5;
  const titles=['低閘壓 · 通道尚未形成','閘極升壓 · 表面逐漸耗盡','表面反轉 · 通道形成','源汲偏壓 · 載子流動','閘極降壓 · 通道消退','回到關閉狀態'];
  return {title:titles[index],index,count:6};
}

buildScene();
player=new ObserverPlayer({shell,durationMs:DURATION,overviewMs:14500,restartFromOverview:true,qa:location.hostname==='127.0.0.1'||location.hostname==='localhost',render,onInfo:()=>player.openPanel()});
shell.get('panel-content').addEventListener('click',event=>{
  const button=event.target.closest('[data-time]');
  if(button)player.seek(Number(button.dataset.time));
});
const resize=new ResizeObserver(()=>buildScene());
resize.observe(shell.host);
