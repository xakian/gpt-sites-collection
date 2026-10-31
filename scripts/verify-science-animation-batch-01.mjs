import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'migration/science-animation-batch-01.json'),'utf8'));
let count=0;
assert.equal(manifest.sites.length,8);
for(const site of manifest.sites){
 for(const file of site.files){
  const data=fs.readFileSync(path.join(root,site.directory,file.path));
  assert.equal(createHash('sha256').update(data).digest('hex'),file.sha256,`${site.slug}/${file.path} differs from the saved source snapshot`);
  count++;
 }
 assert.equal(fs.existsSync(path.join(root,site.directory,'.openai/hosting.json')),false,'Do not copy GPT Sites publishing identity');
 const cfg=JSON.parse(fs.readFileSync(path.join(root,site.directory,'vercel.json'),'utf8'));
 assert.equal(cfg.git.deploymentEnabled,false,`${site.slug}: Git deployment lock changed`);
 assert.equal(cfg.framework,null);
 assert.equal(cfg.installCommand,'');
 assert.equal(cfg.buildCommand,'');
 assert.equal(cfg.outputDirectory,'dist');
 console.log(`PASS ${site.slug}: ${site.files.length} source files; Git deployment disabled`);
}
const rootConfig=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
assert.equal(rootConfig.git.deploymentEnabled['codex/**'],false);
// Check every existing site configuration; no original site is enabled for this branch.
for(const folder of fs.readdirSync(path.join(root,'sites'))){
 const configFile=path.join(root,'sites',folder,'vercel.json');
 if(!fs.existsSync(configFile))throw new Error(`Missing deployment configuration: ${folder}`);
 const enabled=JSON.parse(fs.readFileSync(configFile,'utf8')).git?.deploymentEnabled;
 assert(enabled===false||(enabled?.['codex/**']===false&&!Object.entries(enabled).some(([k,v])=>v===true)),`Unprotected Git branch: ${folder}`);
}
console.log(`PASS: ${count} source files, 8 sites, and all repository Git deployment guards`);
