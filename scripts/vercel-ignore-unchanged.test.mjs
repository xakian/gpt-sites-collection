import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename, sep } from 'node:path';
import { buildDecision } from './vercel-ignore-unchanged.mjs';

const repo = mkdtempSync(join(tmpdir(), 'atlas-deploy-guard-'));
const root = join(repo, 'sites', 'example');
const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true }).trim();
const config = { framework: null, installCommand: '', buildCommand: '', outputDirectory: 'dist' };
const writeConfig = value => writeFileSync(join(root, 'vercel.json'), JSON.stringify(value));
const commit = message => { git('add', '.'); git('-c', 'user.name=Guard Test', '-c', 'user.email=guard@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '-m', message); return git('rev-parse', 'HEAD'); };
try {
  mkdirSync(join(root, 'dist'), { recursive: true });
  git('init');
  writeConfig(config);
  writeFileSync(join(root, 'dist', 'index.html'), 'version one');
  const previous = commit('initial deployment');
  writeConfig({ ...config, ignoreCommand: 'node ../../scripts/vercel-ignore-unchanged.mjs', git: { deploymentEnabled: { 'codex/**': false } } });
  writeFileSync(join(root, 'README.md'), 'Documentation-only update');
  writeFileSync(join(repo, 'unrelated.txt'), 'Another project changed');
  commit('deployment controls and docs only');
  assert.equal(buildDecision({ cwd: root, previous }).build, false);
  writeFileSync(join(root, 'dist', 'index.html'), 'version two');
  const pending = commit('runtime update, not yet deployed');
  writeFileSync(join(root, 'README.md'), 'Second documentation update');
  commit('latest commit is docs only');
  assert.equal(buildDecision({ cwd: root, previous }).build, true, 'Compare to successful deployment, not HEAD^');
  assert.equal(buildDecision({ cwd: root, previous: pending }).build, false);
  writeFileSync(join(root, 'dist', 'new.js'), 'export const ready = true;');
  commit('new asset');
  assert.equal(buildDecision({ cwd: root, previous: pending }).build, true);
  const beforeDelete = git('rev-parse', 'HEAD');
  rmSync(join(root, 'dist', 'new.js'));
  commit('remove asset');
  assert.equal(buildDecision({ cwd: root, previous: beforeDelete }).build, true);
  const beforeConfig = git('rev-parse', 'HEAD');
  writeConfig({ ...config, headers: [{ source: '/(.*)', headers: [{ key: 'Cache-Control', value: 'public,max-age=60' }] }] });
  commit('runtime header change');
  assert.equal(buildDecision({ cwd: root, previous: beforeConfig }).build, true);
  assert.equal(buildDecision({ cwd: root, previous: '0'.repeat(40) }).build, true);
  assert.equal(buildDecision({ cwd: repo, previous }).build, true);
  console.log('PASS: unchanged sites, docs, controls, pending changes, asset additions/removals, runtime config and unavailable comparison.');
} finally {
  const target = realpathSync(repo), parent = realpathSync(tmpdir());
  assert(target.startsWith(parent + sep) && basename(target).startsWith('atlas-deploy-guard-'));
  rmSync(target, { recursive: true, force: true });
}
