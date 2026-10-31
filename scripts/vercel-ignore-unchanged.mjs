import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { pathToFileURL } from 'node:url';

// These projects serve committed dist/ files without installing or building.
// Vercel runs this in the project's Root Directory: exit 0 skips, 1 builds.
function runtimeConfig(text) {
  const config = JSON.parse(text);
  delete config.ignoreCommand;
  if (config.git) {
    delete config.git.deploymentEnabled;
    if (!Object.keys(config.git).length) delete config.git;
  }
  return config;
}

export function buildDecision({ cwd = process.cwd(), previous = process.env.VERCEL_GIT_PREVIOUS_SHA, head = 'HEAD' } = {}) {
  const git = (...args) => execFileSync('git', args, {
    cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
  });
  try {
    if (!/^[a-f0-9]{40}$/.test(previous ?? '')) throw Error('No previous successful deployment SHA');
    git('cat-file', '-e', previous + '^{commit}');
    const prefix = git('rev-parse', '--show-prefix').trim();
    if (!/^sites\/[a-z0-9-]+\/$/.test(prefix)) throw Error('Expected an individual sites/<slug>/ root');
    const configPath = prefix + 'vercel.json';
    const current = JSON.parse(git('show', head + ':' + configPath));
    if (current.outputDirectory !== 'dist' || current.buildCommand !== '' || current.installCommand !== '') {
      throw Error('Project is no longer a buildless static site');
    }
    const changed = git('diff', '--name-only', previous, head, '--', './dist/', './vercel.json')
      .trim().split('\n').filter(Boolean);
    const meaningful = changed.filter(path => path !== configPath || !isDeepStrictEqual(
      runtimeConfig(git('show', previous + ':' + path)), runtimeConfig(git('show', head + ':' + path))
    ));
    return meaningful.length
      ? { build: true, reason: 'Published files or runtime configuration changed.', files: meaningful }
      : { build: false, reason: 'Published files match the previous successful deployment.', files: [] };
  } catch (error) {
    // Never silently suppress a real update if comparison evidence is missing.
    return { build: true, reason: 'Cannot establish an unchanged deployment: ' + error.message };
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const decision = buildDecision();
  console.log((decision.build ? 'Build required: ' : 'Skipping: ') + decision.reason);
  process.exitCode = decision.build ? 1 : 0;
}
