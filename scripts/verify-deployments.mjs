import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== '--site')) {
  throw new Error('Usage: node scripts/verify-deployments.mjs [--site <slug>]');
}
const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 64 * 1024 * 1024 });
const commit = git('rev-parse', 'HEAD').toString().trim();
const deployments = JSON.parse(git('show', `${commit}:migration/deployments.json`).toString('utf8'));
const selected = args.length ? deployments.filter(item => item.slug === args[1]) : deployments;
if (!selected.length) throw new Error(`Unknown site: ${args[1]}`);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const results = [];
console.log(`Comparing public deployments with Git commit ${commit}`);
for (const deployment of selected) {
  const directory = `sites/${deployment.slug}`;
  const config = JSON.parse(git('show', `${commit}:${directory}/vercel.json`).toString('utf8'));
  if (config.outputDirectory !== 'dist' || config.buildCommand !== '') {
    throw new Error(`Review the verification strategy for changed build settings: ${deployment.slug}`);
  }
  const prefix = `${directory}/dist/`;
  const files = git('ls-tree', '-r', '--name-only', '-z', commit, '--', prefix)
    .toString('utf8').split('\0').filter(Boolean).map(path => ({
      path: path.slice(directory.length + 1),
      sha256: hash(git('show', `${commit}:${path}`))
    }));
  if (!files.some(file => file.path === 'dist/index.html')) {
    throw new Error(`No committed dist/index.html for ${deployment.slug}`);
  }
  const checks = [];
  for (let offset = 0; offset < files.length; offset += 6) {
    checks.push(...await Promise.all(files.slice(offset, offset + 6).map(async file => {
      const relative = file.path.slice(5);
      const url = new URL(relative === 'index.html' ? './' : relative.split('/').map(encodeURIComponent).join('/'), deployment.url);
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
        const bytes = Buffer.from(await response.arrayBuffer());
        const sha256 = hash(bytes);
        return { path: file.path, status: response.status, bytes: bytes.length, sha256,
          expectedSha256: file.sha256, matchesGit: response.status === 200 && sha256 === file.sha256 };
      } catch (error) {
        return { path: file.path, expectedSha256: file.sha256, matchesGit: false, error: error.message };
      }
    })));
  }
  const pass = checks.every(item => item.matchesGit);
  results.push({ slug: deployment.slug, url: deployment.url, pass, checks });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${deployment.slug}: ${checks.filter(item => item.matchesGit).length}/${checks.length}`);
}
await mkdir(resolve(root, '.verification'), { recursive: true });
await writeFile(resolve(root, '.verification/http-verification.json'), JSON.stringify({
  checkedAt: new Date().toISOString(), authenticated: false,
  expectedSource: { type: 'git-commit', commit }, results
}, null, 2) + '\n');
if (results.some(item => !item.pass)) process.exitCode = 1;
