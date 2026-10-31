// Geometry follows the available scene, while text remains in screen pixels.
export function sceneLayout(width,height) {
  const w=Math.max(280,width),h=Math.max(180,height),portrait=w<680;
  let contact,wafer,map,mode;
  if(portrait){
    const contactH=Math.max(212,h*(h<500?.53:.60)),pairH=h-contactH;
    contact={x:8,y:0,w:w-16,h:contactH};
    wafer={x:6,y:contactH,w:w/2-12,h:pairH};
    map={x:w/2+6,y:contactH,w:w/2-12,h:pairH};mode='portrait';
  }else if(h/w>.46){
    contact={x:14,y:10,w:w*.60-24,h:h-20};
    wafer={x:w*.62,y:0,w:w*.36,h:h*.5-4};
    map={x:w*.62,y:h*.5+4,w:w*.36,h:h*.5-4};mode='tall';
  }else{
    wafer={x:12,y:0,w:w*.25-16,h};
    contact={x:w*.25+2,y:0,w:w*.47-10,h};
    map={x:w*.73,y:0,w:w*.27-12,h};mode='wide';
  }
  const circle=b=>{const short=b.h<240;const r=Math.max(30,Math.min((b.w-14)/2,(b.h-(short?60:104))/2));return{...b,cx:b.x+b.w/2,cy:b.y+b.h/2+(short?-2:4),r,short};};
  return{w,h,mode,portrait,compact:h<330,contact,wafer:circle(wafer),map:circle(map)};
}
