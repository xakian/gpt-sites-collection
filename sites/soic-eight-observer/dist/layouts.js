export const layouts={
 wide:{id:'wide',width:1200,height:720,anchors:[[200,210],[600,210],[1000,210],[1000,510],[600,510],[200,510]]},
 tall:{id:'tall',width:600,height:1000,anchors:[[150,170],[450,170],[450,500],[150,500],[150,830],[450,830]]}
};
export const add=(p,q)=>[p[0]+q[0],p[1]+q[1]];
export const lerp=(a,b,p)=>[a[0]+(b[0]-a[0])*p,a[1]+(b[1]-a[1])*p];
export const smooth=p=>p*p*(3-2*p);
// All transfers join actual workpiece docks, retaining its top-view orientation.
export function transfer(a,b,p){return lerp(a,b,smooth(p));}
const cache=new Map();
// Round the two corridor corners, then sample by distance rather than by segment.
export function route(layout,index){
 const key=layout.id+index;if(cache.has(key))return cache.get(key);
 let a=layout.anchors[index],b=layout.anchors[index+1];
 if(index===0){a=add(a,[0,-70]);b=add(b,[-78,-70]);}
 let vertices=[a,b];
 if(a[0]===b[0]){const offset=layout.id==='wide'?125:(a[0]>300?-150:150);vertices=[a,add(a,[offset,0]),add(b,[offset,0]),b];}
 const points=[a];
 for(let i=1;i<vertices.length-1;i++){
  const prev=vertices[i-1],c=vertices[i],next=vertices[i+1],r=24;
  const d1=Math.hypot(c[0]-prev[0],c[1]-prev[1]),d2=Math.hypot(next[0]-c[0],next[1]-c[1]);
  const enter=lerp(c,prev,r/d1),exit=lerp(c,next,r/d2);points.push(enter);
  for(let j=1;j<=12;j++){const p=j/12,q=1-p;points.push([q*q*enter[0]+2*q*p*c[0]+p*p*exit[0],q*q*enter[1]+2*q*p*c[1]+p*p*exit[1]]);}
 }
 points.push(b);const distances=[0];for(let i=1;i<points.length;i++)distances.push(distances[i-1]+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
 const length=distances.at(-1);
 function at(distance){const d=Math.max(0,Math.min(length,distance));let i=1;while(i<distances.length-1&&distances[i]<d)i++;return lerp(points[i-1],points[i],(d-distances[i-1])/(distances[i]-distances[i-1]));}
 const start=index===0?100:85,end=index===0?30:85,visible=[at(start),...points.filter((_,i)=>distances[i]>start&&distances[i]<length-end),at(length-end)];
 const result={length,at,d:'M'+visible.map(p=>p.join(',')).join('L')};cache.set(key,result);return result;
}
export function travel(layout,index,p){const r=route(layout,index);return r.at(r.length*smooth(p));}
