import {rect,text,line,circle,path,legend} from './svg.js';
export function draw(s,l){const {width:W,height:H,x,w,y,k}=l,dx=x+w*.3,dw=w*.4,dy=y-40*k,lx=x+w*.07,lw=w*.86,inner=y-(120-70*s.place)*k,shift=-(1-s.entry)*(W+w)+s.exit*(W+w),timW=dw*(.5+.5*s.squash),timH=(20-10*s.squash)*k*s.tim;
let out=`<defs><clipPath id="work"><rect y="65" width="${W}" height="${H-75}"/></clipPath></defs>`+legend([['die','晶粒'],['tim','TIM1'],['glue','蓋膠'],['lid','金屬蓋'],['substrate','基板']],W);
let a=rect(x,y,w,20*k,'substrate')+rect(x-5,y+20*k,w+10,9*k,'support')+rect(dx,dy,dw,34*k,'die')+rect(dx,y-6*k,dw,6*k,'existing');a+=path(`M${dx+5} ${dy+5}h8l-8 8Z`,'mark');
if(s.tim>0){const tx=dx+(dw-timW)/2;a+=path(`M${tx} ${dy}L${tx} ${dy-timH*(.7+.3*s.squash)}Q${tx+timW/2} ${dy-timH*(1.3-.3*s.squash)} ${tx+timW} ${dy-timH*(.7+.3*s.squash)}L${tx+timW} ${dy}Z`,'tim outline');}
for(const xx of [lx,lx+lw-w*.09]){const gh=(14-6*s.rim)*k*s.glue;a+=rect(xx,y-gh,w*.09,gh,'glue',`style="fill:rgb(${183-20*s.cure},${173-18*s.cure},${199-15*s.cure})"`);if(s.cure>0)a+=line(xx+3,y-gh/2,xx+w*.09-3,y-gh/2,'cured',`opacity="${s.cure}"`);}
a+=rect(lx,inner-12*k,lw,12*k,'lid')+rect(lx,inner,w*.09,42*k,'lid')+rect(lx+lw-w*.09,inner,w*.09,42*k,'lid');
if(s.t>=4&&s.t<9.5){const nx=s.t<6.5?dx+dw/2:s.t<7.8?lx+w*.045:lx+lw-w*.045,ny=s.t<6.5?dy-42*k:y-36*k;a+=rect(nx-5,ny,10,15*k,'support')+line(nx,ny+15*k,nx,ny+24*k,'nozzle');}
if(s.index===2){for(const xx of [lx+w*.045,lx+lw-w*.045])a+=line(xx,inner+42*k,xx,y,'guide');}
if(s.index===3){for(const xx of [x-12,x+w+12])a+=path(`M${xx} ${y+5*k}q-9 -12 0 -24t0 -24`,'processheat');}
if(s.index===0){const ax=dx,ay=y+43*k,aw=dw;a+=rect(ax,ay,aw,25,'inset')+path(`M${ax+5} ${ay+5}l${aw*.15} 3l${aw*.15} -3l${aw*.15} 3l${aw*.15} -3l${aw*.15} 3l${aw*.15} -3`,'rough1')+path(`M${ax+5} ${ay+18}l${aw*.15} -3l${aw*.15} 3l${aw*.15} -3l${aw*.15} 3l${aw*.15} -3l${aw*.15} 3`,'rough2');}
if(s.heat){const by=inner-45*k;a+=line(lx,by,lx+lw,by,'boundary')+text(W/2,by-14,'外部散熱邊界');for(const q of [.38,.5,.62]){const xx=x+w*q;a+=line(xx,dy+18*k,xx,by-3,'heatflow')+path(`M${xx-5} ${by+4}l5 -7l5 7`,'heatflow');const yy=dy+18*k-((s.t*35+q*100)%(dy+18*k-by));a+=circle(xx,yy,3,'heatdot');}}
out+=`<g clip-path="url(#work)"><g transform="translate(${shift} 0)">${a}</g></g>`;const caps=['A 表面微隙（放大）','中央傳熱；周邊固定','填隙接觸，側邊保持淨空','蓋膠固化；TIM不固化','橙色箭頭＝熱流，跨越邊界','完成組裝件移交'];out+=text(W/2,H-16,caps[s.index]);return out;}
