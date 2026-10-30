import { CONFIG, KEY_BINDINGS } from './config.js';
export const STEP = Math.sqrt(3) * CONFIG.HEX_SIZE;
// Clockwise from right: J N C D E I.
export const DIRECTIONS = Object.freeze([
  {q:1,r:0}, {q:0,r:1}, {q:-1,r:1},
  {q:-1,r:0}, {q:0,r:-1}, {q:1,r:-1},
].map((d,i) => Object.freeze({...d, key:KEY_BINDINGS.move[i], x:Math.cos(i*Math.PI/3), y:Math.sin(i*Math.PI/3)})));
export const hexKey = (q,r) => `${q},${r}`;
export const hexToWorld = (q,r) => ({x: STEP*(q+r/2), y: 1.5*CONFIG.HEX_SIZE*r});
export const hexDistance = (a,b) => Math.max(Math.abs(a.q-b.q),Math.abs(a.r-b.r),Math.abs(a.q+a.r-b.q-b.r));
export const inBounds=({q,r},radius=CONFIG.BOARD_RADIUS)=>Number.isInteger(q)&&Number.isInteger(r)&&(radius===null||Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r))<=radius);
// Round a world position to the nearest hex, including pointer coordinates.
export function worldToHex(x,y) {
  const r=y/(1.5*CONFIG.HEX_SIZE),q=x/STEP-r/2,s=-q-r;
  let rq=Math.round(q),rr=Math.round(r),rs=Math.round(s);
  const dq=Math.abs(rq-q),dr=Math.abs(rr-r),ds=Math.abs(rs-s);
  if(dq>dr&&dq>ds)rq=-rr-rs;else if(dr>ds)rr=-rq-rs;
  return {q:rq,r:rr};
}
export function hexArea(radius) {
  const result=[];
  for(let q=-radius;q<=radius;q++)for(let r=Math.max(-radius,-q-radius);r<=Math.min(radius,-q+radius);r++)
    result.push({q,r,...hexToWorld(q,r),ring:hexDistance({q,r},{q:0,r:0})});
  return result;
}
export function createGrid(radius=CONFIG.BOARD_RADIUS) {
  const grid = new Map();
  grid.radius=radius;
  grid.animations=new Set();
  return grid;
}
const createCell=(q,r)=>({q,r,...hexToWorld(q,r),terrainLevel:0,visualLevel:0,animation:null});
// Only cells inside this world's board exist. Cache edits lazily.
export function cellAt(grid,{q,r}) {
  if(!inBounds({q,r},grid.radius))return null;
  const key=hexKey(q,r);
  if(!grid.has(key))grid.set(key,createCell(q,r));
  return grid.get(key);
}
export function releaseFlatCell(grid,tile){
  if(tile.terrainLevel===0&&tile.visualLevel===0&&!tile.animation)grid.delete(hexKey(tile.q,tile.r));
}
export function visibleTiles(grid,{left,top,right,bottom}){
  const tiles=[],rowHeight=1.5*CONFIG.HEX_SIZE;
  for(let r=Math.floor(top/rowHeight);r<=Math.ceil(bottom/rowHeight);r++){
    const first=Math.floor(left/STEP-r/2),last=Math.ceil(right/STEP-r/2);
    for(let q=first;q<=last;q++)if(inBounds({q,r},grid.radius))tiles.push(grid.get(hexKey(q,r))??createCell(q,r));
  }
  return tiles; // row order is already the terrain's y/x drawing order
}
