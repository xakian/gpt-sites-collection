(() => {
  'use strict';
  const M=window.SupplyChain, $=id=>document.getElementById(id), scene=$('scene');
  const motion=matchMedia('(prefers-reduced-motion: reduce)'), narrow=matchMedia('(max-width: 759px)');
  let t=motion.matches?29:0, playing=!motion.matches, speed=1, initialOverview=motion.matches;
  let raf=0,last=null,layout,previousPhase=-1,renderCount=0,cycles=0,destroyed=false;
  const listeners=new AbortController(), on=(el,name,fn)=>el.addEventListener(name,fn,{signal:listeners.signal});
  const text=(id,value)=>{const n=$(id);if(n.textContent!==value)n.textContent=value;};
  const attr=(id,key,value)=>$(id).setAttribute(key,value);
  const show=(id,visible)=>{ $(id).style.display=visible?'':'none'; };
  const move=(id,p)=>attr(id,'transform',`translate(${p[0]} ${p[1]})`);
  const path=points=>'M'+points.map(p=>p.join(',')).join(' L');
  const LAYOUTS={
    desktop:{x:20,width:1080,height:384,actors:{D:[395,6,330,130],F:[40,200,200,165],O:[395,200,330,165],C:[880,200,200,165]},
      lots:{F:[140,317],O:[560,317],C:[980,317]}, mats:[677,317],
      docs:{specD:[438,98],reportD:[682,98],releaseD:[500,98],specO:[438,260],reportO:[682,260],releaseO:[500,250]},
      releasePath:[[500,98],[500,130],[438,130],[438,230],[500,230],[500,250]],
      routes:{materialFO:[[140,317],[560,317]],materialOC:[[560,317],[980,317]],infoDown:[[438,98],[438,260]],infoUp:[[682,260],[682,98]],service:[[560,200],[560,136]]},
      labels:{down:[400,174],up:[724,174],service:[560,171],fo:[315,289],oc:[805,289]},
      work:[560,249],materialLabel:[677,353],delivery:[560,375],lotScale:1,docScale:1},
    mobile:{x:4,width:358,height:456,actors:{D:[6,156,144,164],F:[216,4,144,98],O:[216,145,144,180],C:[216,350,144,104]},
      lots:{F:[288,73],O:[288,230],C:[288,421]},mats:[252,312],
      docs:{specD:[34,246],reportD:[78,296],releaseD:[122,246],specO:[242,286],reportO:[287,286],releaseO:[332,286]},
      releasePath:[[122,246],[141,246],[141,132],[210,132],[210,266],[332,266],[332,286]],
      routes:{materialFO:[[288,73],[346,73],[346,230],[288,230]],materialOC:[[288,230],[346,230],[346,421],[288,421]],infoDown:[[34,246],[14,246],[14,120],[210,120],[210,286],[242,286]],infoUp:[[287,286],[287,337],[78,337],[78,296]],service:[[216,213],[150,213]]},
      labels:{down:[100,111],up:[117,351],service:[183,190]},work:[288,185],materialLabel:[287,324],delivery:[105,381],lotScale:.76,docScale:.85}
  };
  function actor(id,box) {
    const [x,y,w,h]=box, label={D:['設計公司','本例委託方'],F:['晶圓代工廠','出貨端'],O:['封測廠',''],C:['系統廠','本例指定收貨方']}[id];
    const mobile=narrow.matches, nameY=y+(mobile?20:28),roleY=nameY+(mobile?17:22);
    const k=mobile?10:13;
    const corners=`M${x+k},${y} H${x} V${y+k} M${x+w-k},${y} H${x+w} V${y+k} M${x},${y+h-k} V${y+h} H${x+k} M${x+w-k},${y+h} H${x+w} V${y+h-k}`;
    return `<g id="actor_${id}"><path class="actor-outline" d="${corners}"/><text class="actor-name" x="${x+w/2}" y="${nameY}" text-anchor="middle">${label[0]}</text>${id!=='O'?`<text class="actor-role" x="${x+w/2}" y="${roleY}" text-anchor="middle">${label[1]}</text>`:''}</g>`;
  }
  function documentShape(id,label) {
    return `<g id="${id}" class="document" data-document="${id}"><g transform="scale(${layout.docScale})"><path d="M-14,-19 H5 L14,-10 V9 H-14 Z M5,-19 V-10 H14" fill="var(--paper)" stroke="#4e7086" stroke-width="1.6"/><path d="M-8,-4 H7 M-8,1 H4" stroke="#4e7086" stroke-width="1.2"/><text class="doc-label" x="0" y="25" text-anchor="middle">${label}</text></g></g>`;
  }
  function buildScene() {
    layout=narrow.matches?LAYOUTS.mobile:LAYOUTS.desktop;
    const r=layout.routes,lp=layout.labels;
    scene.setAttribute('viewBox',`${layout.x||0} 0 ${layout.width} ${layout.height}`);
    scene.innerHTML=`<title id="scene-title">同一委託，三種關係</title><desc id="scene-description">成品給系統廠，報告回設計公司，工作在封測廠。實物沿實線移交，資訊沿虛線傳送並可保留，服務用固定點線箭頭由提供者指向委託方。</desc>
      <defs><marker id="arrow-material" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#526875" stroke-width="1.5"/></marker><marker id="arrow-info" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#4e7086" stroke-width="1.5"/></marker><marker id="arrow-service" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="#746d60" stroke-width="1.5"/></marker></defs>
      ${Object.entries(layout.actors).map(([id,b])=>actor(id,b)).join('')}
      <g id="routes">${Object.entries(r).map(([id,p])=>{const kind=id.startsWith('material')?'material':id==='service'?'service':'info';return `${id==='service'?`<path d="${path(p)}" stroke="var(--paper)" stroke-width="8" fill="none"/>`:''}<path id="route-${id}" class="route ${kind}" d="${path(p)}" marker-end="url(#arrow-${kind})"/>`;}).join('')}</g>
      <g aria-hidden="true"><text class="route-label info" x="${lp.down[0]}" y="${lp.down[1]}" text-anchor="middle">規格／出貨指示</text><text class="route-label info" x="${lp.up[0]}" y="${lp.up[1]}" text-anchor="middle">報告</text><text class="route-label service" x="${lp.service[0]}" y="${lp.service[1]}" text-anchor="middle">${narrow.matches?'提供':'提供封測服務'}</text>${narrow.matches?`<text class="route-label service" x="183" y="204" text-anchor="middle">封測服務</text>`:`<text class="route-label" x="${lp.fo[0]}" y="${lp.fo[1]}" text-anchor="middle">實物移交</text><text class="route-label" x="${lp.oc[0]}" y="${lp.oc[1]}" text-anchor="middle">實物移交</text>`}</g>
      <g id="dynamic" aria-hidden="true">
        <text id="work-state" class="state-label" x="${layout.work[0]}" y="${layout.work[1]}" text-anchor="middle"></text>
        <text id="delivery-state" class="small" x="${layout.delivery[0]}" y="${layout.delivery[1]}" text-anchor="middle"></text>
        ${Object.entries(layout.docs).map(([id])=>documentShape(id,id.startsWith('spec')?'規格 A':id.startsWith('report')?'報告 A':'指示 A→C')).join('')}
        ${documentShape('spec-transit','規格 A')}${documentShape('report-transit','報告 A')}${documentShape('release-transit','指示 A→C')}
        <g id="materials"><g transform="scale(${layout.lotScale})"><path d="M-18,-9 L0,-17 L18,-9 L0,-1 Z M-18,-1 L0,7 L18,-1 M-18,7 L0,15 L18,7" fill="#e3eaee" stroke="#718592" stroke-width="1.5"/></g></g>
        <text id="material-state" class="small" x="${layout.materialLabel[0]}" y="${layout.materialLabel[1]}" text-anchor="middle"></text>
        <g id="lot_A" data-lot-id="A"><g transform="scale(${layout.lotScale})"><rect x="-48" y="-39" width="96" height="78" fill="var(--paper)" stroke="#526875" stroke-width="1.5" rx="5"/><path d="M-43,-39 H43 Q48,-39 48,-34 V-17 H-48 V-34 Q-48,-39 -43,-39" fill="#526875"/><text class="batch-label" x="0" y="-23" text-anchor="middle">批次 A</text>
          <g id="wafer"><circle cy="10" r="23" fill="#435661"/><path d="M-21,2 H21 M-21,13 H21 M-15,24 H15 M-12,-9 V29 M0,-13 V32 M12,-9 V29" stroke="#bdcbd3" stroke-width=".8"/><path d="M-4,32 L0,28 L4,32" fill="var(--paper)"/></g>
          <g id="packages"><rect x="-30" y="-10" width="60" height="40" fill="#e3ebef" stroke="#8496a1" rx="2"/>${[-18,0,18].map(x=>[-1,18].map(y=>`<g transform="translate(${x},${y})"><rect x="-6" y="-6" width="12" height="12" rx="1" fill="#3f515d"/><path d="M-8,-3 H-6 M6,-3 H8 M-8,2 H-6 M6,2 H8" stroke="#3f515d" stroke-width="2"/></g>`).join('')).join('')}</g>
          <g id="cover"><rect id="cover-left" x="-46" y="-15" width="46" height="52" fill="#e9eff2"/><rect id="cover-right" x="0" y="-15" width="46" height="52" fill="#e9eff2"/><g id="cover-words"><text x="0" y="5" text-anchor="middle" style="font-size:12px;fill:#746d60">切割與封裝</text><text x="0" y="22" text-anchor="middle" style="font-size:10px;fill:#5b717f">合併示意</text></g></g>
          <g id="fixture" fill="none" stroke="#746d60" stroke-width="2"><path id="fixture-left" d="M-50,-8 H-37 V28 H-50"/><path id="fixture-right" d="M50,-8 H37 V28 H50"/></g>
        </g></g>
      </g>`;
    for(const [id,p] of Object.entries(layout.docs))move(id,p);
    previousPhase=-1;
    render();
  }
  function render() {
    const s=M.stateAt(t); renderCount++;
    attr('dynamic','opacity',s.opacity);
    let lotPoint=layout.lots[s.lot.location];
    if(!lotPoint)lotPoint=M.pointOn(layout.routes[s.lot.location==='M_FO'?'materialFO':'materialOC'],s.lot.progress);
    move('lot_A',lotPoint);attr('lot_A','data-location',s.lot.location);attr('lot_A','data-form',s.lot.form);
    show('wafer',s.q<15);show('packages',s.q>=15);show('cover',s.lot.cover>0);
    attr('cover-left','width',46*s.lot.cover);attr('cover-right','x',46*(1-s.lot.cover));attr('cover-right','width',46*s.lot.cover);attr('cover-words','opacity',Math.max(0,(s.lot.cover-.6)/.4));
    show('fixture',s.fixture);attr('fixture-left','transform',`translate(${-10*(1-s.fixtureInset)} 0)`);attr('fixture-right','transform',`translate(${10*(1-s.fixtureInset)} 0)`);
    show('materials',s.material.visible);move('materials',M.pointOn([layout.mats,layout.lots.O],s.material.progress));
    text('material-state',`封裝材料／${s.material.state}`);text('work-state',s.work);text('delivery-state',s.delivery);
    for(const kind of ['spec','report','release']) {
      for(const end of ['D','O'])show(kind+end,!!s[kind][end]);
      show(kind+'-transit',s[kind].transit);
      if(s[kind].transit) {
        let points=layout.routes[kind==='report'?'infoUp':'infoDown'];
        if(kind==='release')points=layout.releasePath;
        move(kind+'-transit',M.pointOn(points,s[kind].progress));
      }
    }
    for(const id of Object.keys(layout.routes)){
      const node=$('route-'+id);node.classList.toggle('active',id===s.active);
    }
    if(previousPhase!==s.phase){text('stage-title',s.title);text('stage-caption',s.caption);text('stage-index',`${String(s.phase+1).padStart(2,'0')} / 11`);text('scene-title',s.title+'。成品給系統廠，報告回設計公司，工作在封測廠。');previousPhase=s.phase;}
    text('reset-note',s.reset?'重新示範同一案例':'');
    $('timeline').value=t.toFixed(3);$('timeline').style.setProperty('--progress',`${t/32*100}%`);$('timeline').setAttribute('aria-valuetext',`${t.toFixed(1)} 秒，共 32 秒`);
    const whole=t.toFixed(1).padStart(4,'0');$('time').innerHTML=`${whole} <span>/ 32 秒</span>`;
    const pausePath='M8 5 V19 M16 5 V19',playPath='M8 5 L19 12 L8 19 Z';
    const icon=$('play-icon').firstElementChild;if(icon.getAttribute('d')!==(playing?pausePath:playPath))icon.setAttribute('d',playing?pausePath:playPath);
    text('play-label',playing?'暫停':'播放');$('play').setAttribute('aria-label',playing?'暫停動畫':'播放動畫');$('play').setAttribute('title',playing?'暫停':'播放');
    text('motion-note',initialOverview?'靜態總覽，播放將從頭示範':'');
  }
  function schedule(){if(!destroyed&&playing&&!document.hidden&&!raf)raf=requestAnimationFrame(frame);}
  function frame(now){raf=0;if(destroyed||!playing||document.hidden){last=null;return;}if(last!==null){t+=(now-last)/1000*speed;if(t>=32){cycles+=Math.floor(t/32);t%=32;}}last=now;render();schedule();}
  function stopFrame(){if(raf)cancelAnimationFrame(raf);raf=0;last=null;}
  function pause(){playing=false;stopFrame();render();}
  function closePanel(returnFocus=true){$('explanation').hidden=true;$('explain').setAttribute('aria-expanded','false');if(returnFocus)$('explain').focus();}
  function play(){if(initialOverview){t=0;initialOverview=false;}if(t===32)t=0;closePanel(false);playing=true;last=null;render();schedule();}
  function seek(value){pause();initialOverview=false;t=Math.min(32,Math.max(0,Number(value)||0));render();}
  const steps=[...M.keyframes,...[[1,0],[13.5,4],[24,7],[31.5,10]].map(([time,index])=>[time,M.stages[index][2],M.stages[index][3]])].sort((a,b)=>a[0]-b[0]);
  $('steps').innerHTML=steps.map(([time,title,caption])=>`<div class="step"><strong>${title}<span>${time} 秒</span></strong><p>${caption}</p><button data-seek="${time}" aria-label="定位此步：${title}，${time} 秒">定位此步</button></div>`).join('');
  on($('play'),'click',()=>playing?pause():play());
  on($('replay'),'click',()=>{initialOverview=false;t=0;play();});
  on($('timeline'),'pointerdown',pause);
  on($('timeline'),'keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(e.key))pause();});
  on($('timeline'),'input',e=>seek(e.target.value));
  on($('speed'),'change',()=>{speed=Number($('speed').value);last=null;render();});
  on($('explain'),'click',()=>{if(!$('explanation').hidden){closePanel();return;}pause();$('explanation').hidden=false;$('explain').setAttribute('aria-expanded','true');$('close-panel').focus();});
  on($('close-panel'),'click',()=>closePanel());
  on($('panel-play'),'click',()=>{play();$('play').focus();});
  on($('steps'),'click',e=>{const button=e.target.closest('[data-seek]');if(button)seek(button.dataset.seek);});
  on(document,'keydown',e=>{if(e.key==='Escape'&&!$('explanation').hidden){e.preventDefault();closePanel();}});
  on(document,'visibilitychange',()=>{stopFrame();schedule();});
  on(window,'pagehide',stopFrame);on(window,'pageshow',()=>{last=null;schedule();});
  on(narrow,'change',buildScene);
  on(motion,'change',()=>{initialOverview=false;pause();});
  window.SCPlayer={seek,pause,play,state:()=>({t,playing,speed,cycles,hidden:document.hidden,initialOverview,rafPending:!!raf,layout:narrow.matches?'mobile':'desktop',model:M.stateAt(t),nodeCount:scene.querySelectorAll('*').length,renderCount}),destroy:()=>{pause();destroyed=true;listeners.abort();stopFrame();}};
  buildScene();schedule();
})();
