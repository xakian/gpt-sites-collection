import test from 'node:test';
import assert from 'node:assert/strict';
import {allowedGalleryParent,validGalleryControl} from '../dist/gallery-protocol.mjs';
test('only the original learning domains can control the production iframe',()=>{
 const child='https://xakian-wafer-electrical-test.vercel.app';
 for(const parent of ['https://xakian.com','https://www.xakian.com'])assert.equal(allowedGalleryParent(parent,child),true);
 for(const parent of ['https://xakian.com.evil.test','https://evil.test','http://127.0.0.1:5848','https://xakian.com/learn/','null',null])assert.equal(allowedGalleryParent(parent,child),false);
 assert.equal(allowedGalleryParent('http://127.0.0.1:5848','http://127.0.0.1:5849'),true);
});
test('commands require exact source, origin, topic and validated arguments',()=>{
 const parent={},origin='https://xakian.com';
 const event={source:parent,origin,data:{type:'gallery-control',id:'wafer-test',method:'setActive',args:[false,false]}};
 assert.equal(validGalleryControl(event,parent,origin),true);
 for(const bad of [{...event,source:{}},{...event,origin:'https://evil.test'},{...event,data:{...event.data,id:'other'}},{...event,data:{...event.data,method:'eval'}},{...event,data:{...event.data,args:['true',false]}}])assert.equal(validGalleryControl(bad,parent,origin),false);
 assert.equal(validGalleryControl({...event,data:{...event.data,method:'restore',args:[{mode:'flow',rate:1,total:2000}]}},parent,origin),true);
 assert.equal(validGalleryControl({...event,data:{...event.data,method:'restore',args:[{mode:'flow',rate:1,total:Infinity}]}},parent,origin),false);
});
