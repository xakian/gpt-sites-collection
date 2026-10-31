export function layout(w,h){
 const narrow=w<650;
 const width=Math.min(w-32,1000),x=(w-width)/2;
 const top=Math.max(104,h*.31),bottom=Math.min(h-70,top+Math.max(108,h*.47));
 const left=x+width*(narrow?.25:.34),right=x+width*(narrow?.75:.66);
 const points=[[x,top],[left,top],[left,bottom],[right,bottom],[right,top],[x+width,top]];
 const normals=[[0,-1],[1,-1],[1,-1],[-1,-1],[-1,-1],[0,-1]];
 const vertices=[],sites=[];
 for(let seg=0;seg<5;seg++){
  const a=points[seg],b=points[seg+1],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
  const n=Math.max(3,Math.round(length/(narrow?25:42)));
  const normal=seg===0||seg===4?[0,-1]:seg===1?[1,0]:seg===2?[0,-1]:[-1,0];
  for(let j=0;j<n;j++){
   const f=j/n,px=a[0]+(b[0]-a[0])*f,py=a[1]+(b[1]-a[1])*f;
   vertices.push({x:px,y:py,nx:j===0?normals[seg][0]:normal[0],ny:j===0?normals[seg][1]:normal[1],depth:Math.max(0,(py-top)/(bottom-top)),index:vertices.length});
   const sf=(j+.5)/n,sx=a[0]+(b[0]-a[0])*sf,sy=a[1]+(b[1]-a[1])*sf;
   sites.push({x:sx,y:sy,nx:normal[0],ny:normal[1],depth:Math.max(0,(sy-top)/(bottom-top)),index:sites.length,seg,f:sf});
  }
 }
 vertices.push({x:x+width,y:top,nx:0,ny:-1,depth:0,index:vertices.length});
 return{w,h,narrow,x,width,top,bottom,left,right,points,normals,vertices,sites,layer:narrow?6:8,base:Math.min(h-26,bottom+40),inlet:[x+20,68],outlet:[x+width-14,68]};
}
export function surfacePoint(site,thickness,g){
 const a=g.points[site.seg],b=g.points[site.seg+1],na=g.normals[site.seg],nb=g.normals[site.seg+1],f=site.f;
 return[a[0]+(b[0]-a[0])*f+thickness*(na[0]*(1-f)+nb[0]*f),a[1]+(b[1]-a[1])*f+thickness*(na[1]*(1-f)+nb[1]*f)];
}
export const linePath=points=>'M'+points.map(p=>p.join(',')).join(' L');
