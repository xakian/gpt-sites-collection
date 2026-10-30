import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sites=JSON.parse(fs.readFileSync(path.join(root,'migration/sources.json'),'utf8'));
let count=0;
for(const site of sites){
 for(const file of site.files){
  const bytes=fs.readFileSync(path.join(root,site.directory,file.path));
  const actual=createHash('sha256').update(bytes).digest('hex');
  if(actual!==file.sha256) throw Error(`Source differs: ${site.slug}/${file.path}`);
  count++;
 }
 console.log(`PASS ${site.slug}: ${site.files.length} files match source version ${site.version}`);
}
console.log(`PASS ${sites.length} sites, ${count} files byte-for-byte identical to the recorded source versions.`);
