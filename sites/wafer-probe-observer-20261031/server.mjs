// Portable local preview: Node.js 20+, no third-party dependencies.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url)),root=path.join(base,'dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
const port=Number(process.env.PORT)||4175;
http.createServer(async(req,res)=>{try{let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file;if(name==='/qa.html')file=path.join(base,'tests/browser-qa.html');else{if(name==='/')name='/index.html';file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep))throw Error('path');}const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);}catch{res.writeHead(404);res.end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Wafer probe observer: http://127.0.0.1:${port}/`));
