import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.join(import.meta.dirname,'dist'),port=Number(process.env.PORT||4203);
http.createServer((req,res)=>{try{const url=new URL(req.url,'http://localhost');const f=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!f.startsWith(root+path.sep))throw Error();const data=fs.readFileSync(f);res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'})[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);}catch{res.writeHead(404).end('Not found');}}).listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port));
