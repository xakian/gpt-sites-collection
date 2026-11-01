export function layout(width,height){const compact=width<600,w=Math.min(width*.73,900),x=(width-w)/2;return {width,height,compact,x,w,y:height<300?110:Math.max(compact?210:135,height*.47)};}
