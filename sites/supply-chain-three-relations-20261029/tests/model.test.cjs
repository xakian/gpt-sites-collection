const assert=require('node:assert/strict'),M=require('../dist/model.js');
let checks=0;const check=(x,m)=>{assert.ok(x,m);checks++;};
for(let i=0;i<=32000;i++){
  const t=i/1000,s=M.stateAt(t),q=s.q;
  check(['F','M_FO','O','M_OC','C'].includes(s.lot.location),'實物位置必須唯一且有定義');
  check(s.report.O===(q>=19)&&s.report.D===(q>=21),'測試完成與報告抵達邊界');
  check(s.release.D===(q>=23)&&s.release.O===(q>=24.5),'本例核准因果');
  check(s.spec.D&&s.spec.O===(q>=4),'規格原件及副本保留');
  check(s.lot.form!=='covered'||s.lot.location==='O','加工在提供者廠內');
  check(s.work!=='封測工作完成'||q>=19,'工作不可提前完成');
}
for(const boundary of [4,10,12,15,16,19,21,23,24.5,25,27.5,31.35,31.5,31.65,32])for(const delta of [-.000001,0,.000001]){const t=Math.max(0,Math.min(32,boundary+delta));check(JSON.stringify(M.stateAt(t))===JSON.stringify(M.stateAt(t)),'直接定位可重現');}
check(M.stateAt(31.49).q===29&&M.stateAt(31.5).q===0,'遮蔽中於 31.5 重設');
check(M.stateAt(31.35).opacity===0&&M.stateAt(31.65).opacity===0,'重設遮蔽');
check(M.stateAt(32).lot.location==='F'&&M.stateAt(32).opacity===1,'32 秒完整初始幀');
check(M.stateAt(22).lot.location==='O'&&!M.stateAt(22).release.D,'報告回傳時實物留廠');
check(M.stateAt(29).lot.location==='C'&&M.stateAt(29).report.D&&M.stateAt(29).report.O,'成品與報告不同對象');
check(M.stateAt(17.5).fixture&&!M.stateAt(17.5).report.O,'測試尚無完成報告');
console.log(`${checks} assertions passed; all 32,001 time samples plus required boundaries.`);
