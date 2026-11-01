import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'migration/sites-sync-20261101-b05-b06.json'),'utf8'));
const git=(...a)=>execFileSync('git',a,{cwd:root,maxBuffer:16e6});
const fromIndex=process.argv.includes('--index');
const read=p=>fromIndex?git('show',':'+p):fs.readFileSync(path.join(root,p));
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=dir=>fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(d=>{assert(!d.isSymbolicLink(),'No symlinks');const p=dir+'/'+d.name;return d.isDirectory()?walk(p):[p];});
assert.equal(manifest.sites.length,15);
assert.equal(new Set(manifest.sites.map(s=>s.sourceProjectId)).size,15);
assert.equal(JSON.parse(read('vercel.json')).git.deploymentEnabled['codex/**'],false);
let files=0,runtimeFiles=0;
for(const s of manifest.sites){
 assert.equal(JSON.parse(read(s.directory+'/vercel.json')).git.deploymentEnabled,false);
 const expected=[...s.files.map(f=>s.directory+'/'+f.path),...s.addedFiles.map(p=>s.directory+'/'+p)].sort();
 const actual=fromIndex?git('ls-files','-z','--',s.directory).toString().split('\0').filter(Boolean).sort():walk(s.directory).sort();
 assert.deepEqual(actual,expected,'Exact copied files: '+s.slug);
 for(const f of s.files){const b=read(s.directory+'/'+f.path);assert.equal(b.length,f.bytes,s.slug+'/'+f.path);assert.equal(hash(b),f.sha256,s.slug+'/'+f.path);files++;if(f.path.startsWith('dist/'))runtimeFiles++;}
 assert(!s.files.some(f=>/(^|\/)(\.openai|\.env(?:\..*)?|\.git|\.vercel|node_modules)(\/|$)/.test(f.path)));
}
for(const slug of manifest.existingSiteDirectoriesPreserved){
 const dir='sites/'+slug;
 assert.equal(JSON.parse(read(dir+'/vercel.json')).git.deploymentEnabled['codex/**'],false);
 const base=git('ls-tree','-rz',manifest.baseCommit,dir).toString('utf8').split('\0').filter(Boolean);
 for(const entry of base){const p=entry.split('\t')[1];assert.deepEqual(read(p),git('show',manifest.baseCommit+':'+p),'Existing site changed: '+p);}
 const oldPaths=base.map(e=>e.split('\t')[1]).sort();
 const nowPaths=fromIndex?git('ls-files','-z','--',dir).toString().split('\0').filter(Boolean).sort():walk(dir).sort();
 assert.deepEqual(nowPaths,oldPaths,'Existing site file set changed: '+slug);
}
console.log(JSON.stringify({pass:true,sourceFiles:files,runtimeFiles,sites:15,existingSitesUnchanged:manifest.existingSiteDirectoriesPreserved.length,guardedConfigs:manifest.existingSiteDirectoriesPreserved.length+16,readFrom:fromIndex?'git-index':'working-tree'}));
