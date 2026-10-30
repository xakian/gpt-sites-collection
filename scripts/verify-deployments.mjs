import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sites = JSON.parse(await readFile(resolve(root, 'migration/sources.json'), 'utf8'));
const deployments = JSON.parse(await readFile(resolve(root, 'migration/deployments.json'), 'utf8'));
const results = [];
for (const site of sites) {
  const deployment = deployments.find(item => item.slug === site.slug);
  if (!deployment) throw new Error(`Missing deployment: ${site.slug}`);
  const checks = [];
  const files = site.files.filter(file => file.path.startsWith('dist/'));
  for (let offset = 0; offset < files.length; offset += 6) {
    checks.push(...await Promise.all(files.slice(offset, offset + 6).map(async file => {
      const relative = file.path.slice(5);
      const url = new URL(relative === 'index.html' ? './' : relative, deployment.url);
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      const bytes = Buffer.from(await response.arrayBuffer());
      const sha256 = createHash('sha256').update(bytes).digest('hex');
      return { path: file.path, status: response.status, bytes: bytes.length, sha256,
        matchesSource: response.status === 200 && sha256 === file.sha256 };
    })));
  }
  const pass = checks.every(item => item.matchesSource);
  results.push({ slug: site.slug, url: deployment.url, pass, checks });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${site.slug}: ${checks.filter(item => item.matchesSource).length}/${checks.length}`);
}
await writeFile(resolve(root, 'migration/http-verification.json'), JSON.stringify({ checkedAt: new Date().toISOString(), authenticated: false, results }, null, 2) + '\n');
if (results.some(item => !item.pass)) process.exitCode = 1;
