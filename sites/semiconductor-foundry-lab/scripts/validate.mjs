import {content} from '../dist/content/index.js';
import {validateContent} from '../dist/content/validate.js';
import {readFile,readdir,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
validateContent(content);
const files=[];async function walk(p){for(const n of await readdir(p)){const f=path.join(p,n);if((await stat(f)).isDirectory())await walk(f);else files.push(f);}}await walk('dist');
for(const f of files){if(f.endsWith('.js')){execFileSync(process.execPath,['--check',f]);const body=await readFile(f,'utf8');for(const m of body.matchAll(/from\s+['"]([^'"]+)['"]/g))if(m[1].startsWith('.'))await stat(path.resolve(path.dirname(f),m[1]));}}
const html=await readFile('dist/index.html','utf8');if(!html.includes('lang="zh-Hant"')||!html.includes('./main.js'))throw new Error('Missing entry');
console.log(`Content contracts, ${files.length} static assets, module imports and JavaScript syntax passed.`);
