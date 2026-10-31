import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const base=path.join(import.meta.dirname,'dist'),port=Number(process.env.PORT||4186);
http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost'),name=decodeURIComponent(url.pathname);const file=path.resolve(base,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(base+path.sep)){res.writeHead(403).end();return;}try{const data=fs.readFileSync(file),ext=path.extname(file);res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'})[ext]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);}catch{res.writeHead(404).end('Not found');}}).listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port));
