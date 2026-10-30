// Fullscreen includes the canvas and HUD; it never resets the simulation.
export function initFullscreen({arena,canvas,button,status,onTransition}) {
  let pending=false,messageTimer;
  const supported=()=>Boolean(arena.requestFullscreen&&document.exitFullscreen&&document.fullscreenEnabled);
  const sync=()=>{
    const active=document.fullscreenElement===arena;
    button.textContent=active?'退出全螢幕':'全螢幕';
    button.setAttribute('aria-label',active?'退出全螢幕':'進入全螢幕');
    button.setAttribute('aria-pressed',String(active));
    button.title=active?'退出全螢幕（Esc）':supported()?'全螢幕遊玩，Esc 退出':'目前瀏覽器未開放全螢幕';
    button.disabled=pending;
  };
  const clearMessage=()=>{
    clearTimeout(messageTimer);status.hidden=true;status.textContent='';
  };
  const showMessage=message=>{
    clearMessage();status.textContent=message;status.hidden=false;
    messageTimer=setTimeout(clearMessage,5000);
  };
  document.addEventListener('fullscreenchange',()=>{
    clearMessage();sync();onTransition();
    if(!document.hidden)canvas.focus({preventScroll:true});
  });
  const toggle=async()=>{
    if(pending)return;
    clearMessage();onTransition();
    if(!supported()){
      showMessage('此瀏覽器未開放全螢幕，請用桌面瀏覽器開啟遊戲後再試。');
      canvas.focus({preventScroll:true});return;
    }
    pending=true;sync();
    try{
      // Call directly inside the click handler to keep user activation.
      if(document.fullscreenElement===arena)await document.exitFullscreen();
      else await arena.requestFullscreen();
    }catch{
      showMessage('無法切換全螢幕，請再試一次，或用桌面瀏覽器開啟遊戲。');
    }finally{
      pending=false;sync();
      if(!document.hidden)canvas.focus({preventScroll:true});
    }
  };
  button.addEventListener('click',toggle);
  // Some embedded browsers forward Escape without performing their own exit.
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!event.repeat&&document.fullscreenElement===arena){
      event.preventDefault();toggle();
    }
  });
  sync();
}
