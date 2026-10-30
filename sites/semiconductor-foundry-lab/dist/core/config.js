// Geometric / timing values retained from HexBase v0.4. No content or combat rules.
export const CONFIG=Object.freeze({HEX_SIZE:32,BOARD_RADIUS:8,REFERENCE_SPACING:5,REFERENCE_SIZE:5,REFERENCE_OPACITY:.5,FOG_EDGE_SOFTNESS:8,MOVE_STEP_INTERVAL:.30,MOVE_PRESENTATION:.14,MOVE_ARRIVAL_FLASH:.14,INPUT_BUFFER:.32,TERRAIN_HEIGHT:7,PIT_LAYER_HEIGHT:4,TERRAIN_MIN_LEVEL:-1,TERRAIN_MAX_LEVEL:5,FIXED_STEP:1/120,MAX_FRAME_DELTA:.1});
export const KEY_BINDINGS=Object.freeze({move:['KeyJ','KeyN','KeyC','KeyD','KeyE','KeyI'],interact:'Space'});
export const PALETTE = Object.freeze({
  background: '#edf0e9',
  fog: '#c1c9be',
  boardEdge: '#8d825f', boardGrid: '#a8b3a1',
  reference: '#6c776d',
  flat: '#dfe7d5', flatEdge: '#b6c5ae',
  low: '#c9beb1', lowDeep: '#b0a397', lowEdge: '#938476',
  high: '#efe2b8', highEdge: '#b79a55',
  player: '#087d91', worker: '#ae643c',
  terrainShadow: '#a7b4a1', highSide: '#cbb882', highSideDark: '#bfa76e', highSideEdge: '#a18c57',
  lowWall: '#9b8b7c', lowWallDark: '#87776a', lowWallEdge: '#66594f',
  highMark: '#9b7d35', lowMark: '#706154',
  raiseFlash: '#a38235', lowerFlash: '#76604d',
  actorShadow: '#4d60452e', actorEdge: '#fffdf3', actorCore: '#e7faf7',
  buildRing: '#9c783a', muted: '#cabfae', foot: '#087d9160',
});

export const terrainOffset=level=>level*(level<0?CONFIG.PIT_LAYER_HEIGHT:CONFIG.TERRAIN_HEIGHT);
