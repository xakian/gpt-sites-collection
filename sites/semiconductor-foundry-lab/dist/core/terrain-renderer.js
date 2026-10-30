// Adapted by extracting HexBase v0.4 terrain, wall, vector cache and camera methods.
import {CONFIG,PALETTE,terrainOffset} from './config.js';
import {DIRECTIONS,STEP,hexKey,hexArea,inBounds} from './hex.js';
const mix=(a,b,t)=>{const ca=a.match(/\w\w/g).map(x=>parseInt(x,16)),cb=b.match(/\w\w/g).map(x=>parseInt(x,16));return `rgb(${ca.map((v,i)=>Math.round(v+(cb[i]-v)*t)).join(',')})`;};

export class TerrainRenderer {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.width=0;this.height=0;this.camera={x:0,y:0};this.resize();this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);}
  resize(){
    const width=this.canvas.clientWidth,height=this.canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
    if(this.width===width&&this.height===height&&this.dpr===dpr)return;
    this.width=width;this.height=height;this.dpr=dpr;
    this.canvas.width=Math.round(this.width*this.dpr);this.canvas.height=Math.round(this.height*this.dpr);
    this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
    this.topFade=this.ctx.createLinearGradient(0,0,0,64);this.topFade.addColorStop(0,'#edf0e9cc');this.topFade.addColorStop(1,'#edf0e900');
    this.bottomFade=this.ctx.createLinearGradient(0,this.height-125,0,this.height);this.bottomFade.addColorStop(0,'#edf0e900');this.bottomFade.addColorStop(1,'#edf0e9e0');
  }
  resetPresentation(){this.presentation.reset();}
  position(actor,state){return this.presentation?.position(actor,state.grid)??actorPosition(actor,state.grid);}
  cameraUpdate(position){
    this.camera.x=position.x;this.camera.y=position.y;
  }
  screen(p){return{x:p.x-this.camera.x+this.width/2,y:p.y-this.camera.y+this.height/2};}
  hex(x,y,size=CONFIG.HEX_SIZE-1.2){
    // Draw near a floating origin so distant coordinates keep crisp geometry.
    x-=this.camera.x;y-=this.camera.y;
    const c=this.ctx;c.beginPath();for(let i=0;i<6;i++){const angle=(i*60-30)*Math.PI/180;const px=x+Math.cos(angle)*size,py=y+Math.sin(angle)*size;i?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();
  }
  revealGround(tiles){
    const c=this.ctx;c.save();c.beginPath();
    // Raised surfaces may project above the footprint; pits stay inside their
    // ground-level opening. The soft rim contains no hidden world information.
    for(const tile of tiles){
      const x=tile.x-this.camera.x,y=tile.y-this.camera.y,offset=-Math.max(0,terrainOffset(tile.visualLevel));
      for(let i=0;i<6;i++){
        const angle=(i*60-30)*Math.PI/180,sine=Math.sin(angle);
        const px=x+Math.cos(angle)*CONFIG.HEX_SIZE,py=y+sine*CONFIG.HEX_SIZE+(sine<0?Math.min(0,offset):Math.max(0,offset));
        i?c.lineTo(px,py):c.moveTo(px,py);
      }
      c.closePath();
    }
    c.fillStyle=PALETTE.background;c.shadowColor=PALETTE.background;c.shadowBlur=CONFIG.FOG_EDGE_SOFTNESS*this.dpr;c.fill();c.restore();
  }
  terrainSides(tile,grid,underground=false){
    const c=this.ctx,h=underground?Math.min(0,tile.visualLevel):tile.visualLevel,x=tile.x-this.camera.x,y=tile.y-this.camera.y,size=CONFIG.HEX_SIZE;
    // Each shared wall belongs to the higher cell behind it. This includes
    // flat-to-pit and shallow-to-deep edges: never draw a second inner wall.
    for(const edge of [1,2]){
      const d=DIRECTIONS[edge],neighbor=grid?.get(hexKey(tile.q+d.q,tile.r+d.r))?.visualLevel??0,bottom=underground?neighbor:Math.max(0,neighbor);
      if(bottom>=h)continue;
      const angle=(edge*60-30)*Math.PI/180,next=angle+Math.PI/3;
      const ax=x+Math.cos(angle)*size,ay=y+Math.sin(angle)*size;
      const bx=x+Math.cos(next)*size,by=y+Math.sin(next)*size;
      const wall=(upper,lower,color)=>{
        c.beginPath();c.moveTo(ax,ay-terrainOffset(upper));c.lineTo(bx,by-terrainOffset(upper));
        c.lineTo(bx,by-terrainOffset(lower));c.lineTo(ax,ay-terrainOffset(lower));c.closePath();c.fillStyle=color;c.fill();
      };
      if(bottom<0)wall(Math.min(0,h),bottom,mix(edge===1?PALETTE.lowWall:PALETTE.lowWallDark,PALETTE.lowWallEdge,Math.min(1,-bottom/Math.abs(CONFIG.TERRAIN_MIN_LEVEL))*.25));
      if(h>0)wall(h,Math.max(0,bottom),edge===1?PALETTE.highSide:PALETTE.highSideDark);
      c.save();c.globalAlpha*=.52;c.lineWidth=.65;
      for(let layer=Math.floor(bottom)+1;layer<h;layer++){
        c.strokeStyle=layer>0?PALETTE.highSideEdge:PALETTE.lowWallEdge;
        c.beginPath();c.moveTo(ax,ay-terrainOffset(layer));c.lineTo(bx,by-terrainOffset(layer));c.stroke();
      }
      c.restore();
    }
  }
  tile(tile,grid,decorate=null){
    const c=this.ctx,l=tile.visualLevel,top=tile.y-terrainOffset(l),strength=Math.min(1,Math.abs(l));
    const alpha=this.revealAlpha?.get(hexKey(tile.q,tile.r))??1;c.save();c.globalAlpha=alpha;
    this.terrainSides(tile,grid,l<0);
    const floor=l>=0?mix(PALETTE.flat,PALETTE.high,strength):l>=-1?mix(PALETTE.flat,PALETTE.low,strength):mix(PALETTE.low,PALETTE.lowDeep,Math.min(1,(-l-1)/Math.max(1,Math.abs(CONFIG.TERRAIN_MIN_LEVEL)-1)));
    // Recessed neighbors share a continuous floor with a thin grid seam.
    this.hex(tile.x,top,CONFIG.HEX_SIZE);c.fillStyle=floor;c.fill();
    c.strokeStyle=mix(PALETTE.flatEdge,l>=0?PALETTE.highEdge:PALETTE.lowEdge,strength);c.lineWidth=.65;c.globalAlpha=alpha*.32;c.stroke();c.globalAlpha=alpha;
    if(l<-.08){
      c.globalAlpha=alpha*strength*.65;c.strokeStyle=PALETTE.lowMark;c.lineWidth=1;
      c.beginPath();c.moveTo(tile.x-7-this.camera.x,top+20-this.camera.y);c.lineTo(tile.x+7-this.camera.x,top+20-this.camera.y);c.stroke();c.globalAlpha=alpha;
    }
    if(tile.animation){
      const t=Math.min(1,tile.animation.elapsed/CONFIG.TERRAIN_ANIMATION);
      this.hex(tile.x,top,CONFIG.HEX_SIZE-3);c.strokeStyle=tile.animation.to>tile.animation.from?PALETTE.raiseFlash:PALETTE.lowerFlash;c.globalAlpha=alpha*(1-t)*.9;c.lineWidth=1.5;c.stroke();c.globalAlpha=alpha;
    }
    // Use world coordinates so the sparse landmarks move with the board and
    // reappear at the same place when the player returns, including negatives.
    if(tile.q%CONFIG.REFERENCE_SPACING===0&&tile.r%CONFIG.REFERENCE_SPACING===0){
      const x=tile.x-this.camera.x,y=top-this.camera.y,half=CONFIG.REFERENCE_SIZE/2;
      c.save();c.strokeStyle=PALETTE.reference;c.globalAlpha=alpha*CONFIG.REFERENCE_OPACITY;c.lineWidth=1;c.lineCap='round';
      c.beginPath();c.moveTo(x-half,y);c.lineTo(x+half,y);c.moveTo(x,y-half);c.lineTo(x,y+half);c.stroke();c.restore();
    }
    c.restore();if(decorate)decorate(tile);
  }
  drawTerrain(tiles,grid,decorate=null){
    const c=this.ctx,known=new Map(tiles.map(tile=>[hexKey(tile.q,tile.r),tile]));
    const pits=tiles.filter(tile=>tile.visualLevel<0);
    if(pits.length){
      c.save();c.beginPath();
      // One aperture for the entire connected lowland. Its outline is fixed
      // at ground level; floors and effects never spill over the front rim.
      for(const tile of pits){
        for(let i=0;i<6;i++){
          const a=(i*60-30)*Math.PI/180,x=tile.x-this.camera.x+Math.cos(a)*CONFIG.HEX_SIZE,y=tile.y-this.camera.y+Math.sin(a)*CONFIG.HEX_SIZE;
          i?c.lineTo(x,y):c.moveTo(x,y);
        }
        c.closePath();
      }
      c.clip();c.fillStyle=PALETTE.lowWallDark;c.fill();
      const under=new Map(known);
      for(const tile of pits)for(const edge of [4,5]){
        const d=DIRECTIONS[edge],q=tile.q+d.q,r=tile.r+d.r,key=hexKey(q,r);
        // Unknown terrain is not disclosed by a wall at the fog boundary.
        if(!under.has(key))under.set(key,{q,r,x:tile.x+d.x*Math.sqrt(3)*CONFIG.HEX_SIZE,y:tile.y+d.y*Math.sqrt(3)*CONFIG.HEX_SIZE,visualLevel:0});
      }
      for(const tile of [...under.values()].sort((a,b)=>a.y-b.y||a.x-b.x)){
        if(tile.visualLevel<0)this.tile(tile,known,decorate);
        else this.terrainSides(tile,known,true);
      }
      // Only the boundary of the lowland gets a rim, never its shared edges.
      c.beginPath();
      for(const tile of pits)for(let edge=0;edge<6;edge++){
        const d=DIRECTIONS[edge];if((known.get(hexKey(tile.q+d.q,tile.r+d.r))?.visualLevel??0)<0)continue;
        const a=(edge*60-30)*Math.PI/180,b=a+Math.PI/3;
        c.moveTo(tile.x-this.camera.x+Math.cos(a)*CONFIG.HEX_SIZE,tile.y-this.camera.y+Math.sin(a)*CONFIG.HEX_SIZE);
        c.lineTo(tile.x-this.camera.x+Math.cos(b)*CONFIG.HEX_SIZE,tile.y-this.camera.y+Math.sin(b)*CONFIG.HEX_SIZE);
      }
      c.strokeStyle=PALETTE.lowWallEdge;c.lineWidth=1.6;c.stroke();c.restore();
    }
    // Solid foreground covers the recessed pass; raised walls stop at zero,
    // joining their underground segment instead of duplicating it.
    for(const tile of tiles)if(tile.visualLevel>=0)this.tile(tile,known,decorate);
  }
  circle(x,y,radius){
    const c=this.ctx;c.beginPath();c.arc(x-this.camera.x,y-this.camera.y,Math.max(0,radius),0,Math.PI*2);
  }
  traceBoard(path,border=false){
    for(const tile of this.boardTiles){
      if(border){
        for(let edge=0;edge<6;edge++){
          const d=DIRECTIONS[edge];if(inBounds({q:tile.q+d.q,r:tile.r+d.r},this.boardRadius))continue;
          const a=this.hexVertices[edge],b=this.hexVertices[(edge+1)%6];
          path.moveTo(tile.x+a.x,tile.y+a.y);path.lineTo(tile.x+b.x,tile.y+b.y);
        }
      }else{
        this.hexVertices.forEach((v,i)=>i?path.lineTo(tile.x+v.x,tile.y+v.y):path.moveTo(tile.x+v.x,tile.y+v.y));path.closePath();
      }
    }
  }
  boardBackdrop(grid){
    if(grid.radius===null)return;
    if(this.boardRadius!==grid.radius){
      this.boardRadius=grid.radius;this.boardTiles=hexArea(grid.radius);
      this.hexVertices=Array.from({length:6},(_,i)=>{const a=(i*60-30)*Math.PI/180;return{x:Math.cos(a)*CONFIG.HEX_SIZE,y:Math.sin(a)*CONFIG.HEX_SIZE};});
      // Cache public vector geometry, not a full-resolution bitmap. The paths
      // stay crisp at any pixel density and never contain hidden terrain.
      if(typeof globalThis.Path2D==='function'){
        this.boardPath=new Path2D();this.borderPath=new Path2D();this.traceBoard(this.boardPath);this.traceBoard(this.borderPath,true);
      }
    }
    const c=this.ctx;c.save();c.translate(-this.camera.x,-this.camera.y);
    c.fillStyle=PALETTE.fog;c.strokeStyle=PALETTE.boardGrid;c.lineWidth=.7;
    if(this.boardPath)c.fill(this.boardPath);else{c.beginPath();this.traceBoard(c);c.fill();}
    c.globalAlpha=.15;if(this.boardPath)c.stroke(this.boardPath);else c.stroke();c.globalAlpha=1;
    c.strokeStyle=PALETTE.boardEdge;c.lineWidth=2.2;
    if(this.borderPath)c.stroke(this.borderPath);else{c.beginPath();this.traceBoard(c,true);c.stroke();}
    c.restore();
  }

}
