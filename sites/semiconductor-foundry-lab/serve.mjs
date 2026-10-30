import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist'),port=Number(process.env.PORT??4317);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let filename=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(filename!==root&&!filename.startsWith(root+path.sep)){res.writeHead(403).end();return;}if((await stat(filename)).isDirectory())filename=path.join(filename,'index.html');const data=await readFile(filename);res.writeHead(200,{'content-type':types[path.extname(filename)]??'application/octet-stream','cache-control':'no-store'}).end(data);}catch{res.writeHead(404).end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
