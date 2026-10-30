// One-time, auditable extraction from the exact retained HexBase source checkout.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const source=process.argv[2];
if(!source)throw new Error('Provide the retained HexBase checkout path.');
const read=n=>readFile(path.join(source,'dist/js',n),'utf8');
await mkdir('dist/core',{recursive:true});await mkdir('docs',{recursive:true});
const manifest={sourceSite:'appgprj_6ac0c679ad648191a98de80f4b19164e',sourceVersion:38,commit:'edd19a5426da16b766de618faf48bd4b65208b32',files:{}};
for(const name of ['hex.js','config.js','movement.js','input.js','intent-input.js','presentation.js','rendering.js','main.js','game-state.js','fullscreen.js']){
 const body=await read(name);manifest.files[name]={sha256:createHash('sha256').update(body).digest('hex')};
}
await writeFile('dist/core/hex.js',(await read('hex.js')).replace(' // Clockwise',' // Clockwise').replace('// Clockwise from right: J N C D E I. Chords select raise, tunnel or flat mode.','// Clockwise from right: J N C D E I.').replace('this match\'s board','this world\'s board').replace('including relative attack offsets','including pointer coordinates'));
await writeFile('dist/core/fullscreen.js',await read('fullscreen.js'));
const original=await read('rendering.js');
const mix=original.slice(original.indexOf('const mix='),original.indexOf('export class Renderer'));
const methods=original.slice(original.indexOf('  resize(){'),original.indexOf('  attackRadius(')).replace('  resetPresentation(){this.presentation.reset();}\n','').replace(/  position\(actor,state\).*\n/,'');
const board=original.slice(original.indexOf('  traceBoard('),original.indexOf('  draw(state,'));
await writeFile('dist/core/terrain-renderer.js',`// Adapted by extracting HexBase v0.4 terrain, wall, vector cache and camera methods.\nimport {CONFIG,PALETTE,terrainOffset} from './config.js';\nimport {DIRECTIONS,STEP,hexKey,hexArea,inBounds} from './hex.js';\n${mix}\nexport class TerrainRenderer {\n constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.width=0;this.height=0;this.camera={x:0,y:0};this.resize();this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);}\n${methods}${board}\n}\n`);
const config=await read('config.js');
const palette=config.slice(config.indexOf('export const PALETTE'),config.indexOf('export const terrainSpeed'));
await writeFile('dist/core/config.js',`// Geometric / timing values retained from HexBase v0.4. No content or combat rules.\nexport const CONFIG=Object.freeze({HEX_SIZE:32,BOARD_RADIUS:8,REFERENCE_SPACING:5,REFERENCE_SIZE:5,REFERENCE_OPACITY:.5,FOG_EDGE_SOFTNESS:8,MOVE_STEP_INTERVAL:.30,MOVE_PRESENTATION:.14,MOVE_ARRIVAL_FLASH:.14,INPUT_BUFFER:.32,TERRAIN_HEIGHT:7,PIT_LAYER_HEIGHT:4,TERRAIN_MIN_LEVEL:-1,TERRAIN_MAX_LEVEL:5,FIXED_STEP:1/120,MAX_FRAME_DELTA:.1});\nexport const KEY_BINDINGS=Object.freeze({move:['KeyJ','KeyN','KeyC','KeyD','KeyE','KeyI'],interact:'Space'});\n${palette.replace("dummy: '#ae643c'","worker: '#ae643c'").replace("depletedHP: '#cabfae'","muted: '#cabfae'")}\nexport const terrainOffset=level=>level*(level<0?CONFIG.PIT_LAYER_HEIGHT:CONFIG.TERRAIN_HEIGHT);\n`);
await writeFile('docs/BASELINE.json',JSON.stringify(manifest,null,2)+'\n');
console.log('Adopted exact HexBase coordinate/fullscreen modules and extracted terrain renderer; source hashes recorded.');
