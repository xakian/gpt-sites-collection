import {clamp,smooth} from './svg.js';
export function stateAt(t){
  // Qualitative concave growth; not a calibrated oxidation recipe.
  const u=clamp((t-3)/16),thickness=100*(Math.sqrt(1+8*u)-1)/2;
  return {thickness,consumed:thickness/2.25,outward:thickness*(1-1/2.25),oxidizing:t>=3&&t<19,finished:t>=19,shift:t>=23?1100*smooth((t-23)/2):t>=25?0:0,newShift:t>=25?-1100*(1-smooth((t-25)/3)):null,gas:t<19?clamp((t-1)/2):1-clamp((t-19)/2),u};
}
