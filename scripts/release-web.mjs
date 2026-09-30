#!/usr/bin/env node
// Build an identified website source state before an explicitly requested release.
import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WEB = join(ROOT, 'web');
const EXPECTED_REPO = 'nanthan77/yaal-nilam';
const PROJECT = 'yaal-nilam';
const DESIGN_BRANCH = 'codex/yaal-nilam-editorial-redesign-20260926';
const DESIGN_BASELINE = 'e002c95c5a8e7f0f0bc6297cfce8f7229c026b72';
// The data tests also load these two standalone modules through their VM helper.
const SOURCE_PATHS = ['web', 'shared/units.ts', 'shared/currency.ts', 'firebase.json', '.firebaserc', 'scripts/release-web.mjs'];
const REQUIRED_EXPORTS = ['index.html', 'properties/index.html', 'properties/view/index.html', 'sitemap.xml', 'sitemap-properties.xml', 'sitemap-hubs.xml', 'sitemap-core.xml', 'sitemap-images.xml', 'feed.xml', 'rss.xml', 'robots.txt'];

export function isGeneratedPath(path) {
  return path === 'web/tsconfig.tsbuildinfo'
    || /^web\/(?:node_modules|\.next(?:-emulator)?|out|test-results|playwright-report)(?:\/|$)/.test(path)
    || /^web\/public\/(?:sitemap(?:-[a-z]+)?\.xml|feed\.xml|rss\.xml|robots\.txt)$/.test(path);
}

export function repositoryName(remote) {
  const match = remote.trim().match(/^(?:git@github\.com:|https:\/\/github\.com\/)([^/]+\/[^/]+?)(?:\.git)?\/?$/);
  return match?.[1];
}

export function validateHostingConfig(config, targets) {
  if (targets.projects?.default !== PROJECT || targets.targets?.[PROJECT]?.hosting?.main?.join(',') !== PROJECT) {
    throw new Error('The default Firebase project and main Hosting target must both be yaal-nilam.');
  }
  const main = Array.isArray(config.hosting) && config.hosting.find((site) => site.target === 'main');
  if (!main || main.public !== 'web/out' || main.cleanUrls !== true || main.trailingSlash !== true) {
    throw new Error('Public Hosting must use target main, web/out, clean URLs and trailing slashes.');
  }
  if (!main.rewrites?.some((rule) => rule.source === '/properties/**' && rule.destination === '/properties/view/index.html')) {
    throw new Error('The existing dynamic property Hosting rewrite is missing.');
  }
  return main;
}

export function installationDirectory(webDirectory) {
  const dependencies = join(webDirectory, 'node_modules');
  // lstat also detects a broken link; do not silently replace its intended cache.
  if (!existsSync(dependencies) && !existsSync(webDirectory)) throw new Error('The website directory is missing.');
  let linked = false;
  try { linked = lstatSync(dependencies).isSymbolicLink(); } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (!linked) return webDirectory;
  let target;
  try { target = realpathSync(dependencies); } catch {
    throw new Error('The linked website dependency directory is unavailable. Restore its matching package and lockfile before release.');
  }
  if (!statSync(target).isDirectory() || basename(target) !== 'node_modules') throw new Error('The website dependency link must point to a node_modules directory.');
  const directory = dirname(target);
  for (const name of ['package.json', 'package-lock.json']) {
    const cached = join(directory, name);
    const source = join(webDirectory, name);
    if (!existsSync(cached) || !existsSync(source) || !readFileSync(cached).equals(readFileSync(source))) {
      throw new Error('The linked dependency cache package.json and package-lock.json must exactly match web/. No installation was started.');
    }
  }
  return directory;
}

export function validateSitemapContent(name, xml) {
  const root = name === 'sitemap.xml' ? 'sitemapindex' : 'urlset';
  if (!new RegExp(`<${root}\\b[^>]*>[\\s\\S]*<\\/${root}>`).test(xml)) {
    throw new Error(`${name} must contain a complete ${root} document.`);
  }
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  // Empty catalog/image children are honest output when no public properties exist.
  if ((['sitemap.xml', 'sitemap-core.xml'].includes(name) && !locations.length)
    || locations.some((url) => !url.startsWith('https://yaalnilam.com/'))) {
    throw new Error(`${name} must contain canonical yaalnilam.com URLs; the index and core sitemap cannot be empty.`);
  }
  return locations.length;
}

export function validatePreparedReceipt(receipt, { commit, branch, exported, now = Date.now() }) {
  if (!receipt || receipt.schemaVersion !== 1 || receipt.repository !== EXPECTED_REPO
    || receipt.firebaseProject !== PROJECT || receipt.hostingTarget !== 'main'
    || receipt.sourceCommit !== commit || receipt.branch !== branch) {
    throw new Error('The prepared receipt must identify this source commit, branch and public Hosting target. Run --prepare again.');
  }
  const builtAt = Date.parse(receipt.builtAt);
  if (!Number.isFinite(builtAt) || new Date(builtAt).toISOString() !== receipt.builtAt
    || builtAt > now + 5 * 60 * 1000 || now - builtAt > 24 * 60 * 60 * 1000) {
    throw new Error('The prepared export must have a valid build time within the last 24 hours. Run --prepare again.');
  }
  const expectedBuildId = `${commit.slice(0, 12)}-${receipt.builtAt.replace(/[-:.]/g, '')}`;
  if (receipt.buildId !== expectedBuildId || receipt.homepageSha256 !== exported.homepageSha256
    || !Number.isInteger(receipt.htmlFiles) || receipt.htmlFiles !== exported.htmlFiles) {
    throw new Error('The prepared build identifier, homepage hash or HTML file count differs from the export. Run --prepare again.');
  }
  return receipt;
}

function command(binary, args, { cwd = ROOT, capture = false, env = process.env } = {}) {
  const result = spawnSync(binary, args, { cwd, env, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit', maxBuffer: 8 * 1024 * 1024 });
  if (result.error || result.status !== 0) {
    // Do not echo captured output: provider responses can contain account details.
    throw new Error(`${binary} ${args[0] || ''} failed${result.status === null ? '' : ` (exit ${result.status})`}.`);
  }
  return result.stdout || '';
}

function git(...args) {
  return command('git', args, { capture: true }).trim();
}

function sourceChanges() {
  const changed = git('diff', '--name-only', '-z', 'HEAD', '--', ...SOURCE_PATHS).split('\0');
  const untracked = git('ls-files', '--others', '--exclude-standard', '-z', '--', ...SOURCE_PATHS).split('\0');
  return [...new Set([...changed, ...untracked])].filter((path) => path && !isGeneratedPath(path)).sort();
}

function requireCleanSource(commit, branch) {
  if (git('rev-parse', 'HEAD') !== commit || git('branch', '--show-current') !== branch) {
    throw new Error('The branch or commit changed during preparation. Start again from the reviewed source.');
  }
  const changes = sourceChanges();
  if (changes.length) {
    throw new Error(`Website release source has ${changes.length} uncommitted file(s). Commit the reviewed website/dependency/config changes first. Unrelated dirty work is allowed. Run --dry-run to list these paths.`);
  }
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function countHtml(directory) {
  return readdirSync(directory, { withFileTypes: true }).reduce((count, entry) => {
    if (entry.isDirectory()) return count + countHtml(join(directory, entry.name));
    return count + Number(entry.name.endsWith('.html'));
  }, 0);
}

function verifyExport() {
  const out = join(WEB, 'out');
  for (const path of REQUIRED_EXPORTS) {
    const file = join(out, path);
    if (!existsSync(file) || !statSync(file).isFile() || statSync(file).size === 0) throw new Error(`The export is missing ${path}.`);
  }
  const home = readFileSync(join(out, 'index.html'), 'utf8');
  if (!/<link\b(?=[^>]*\brel="canonical")(?=[^>]*\bhref="https:\/\/yaalnilam\.com\/")[^>]*>/.test(home)) {
    throw new Error('The homepage canonical must be https://yaalnilam.com/.');
  }
  for (const name of REQUIRED_EXPORTS.filter((path) => path.startsWith('sitemap'))) {
    validateSitemapContent(name, readFileSync(join(out, name), 'utf8'));
  }
  const htmlFiles = countHtml(out);
  if (htmlFiles < 10) throw new Error('The static export is unexpectedly small. Review the build before releasing.');
  return { htmlFiles, homepageSha256: sha256(Buffer.from(home)) };
}

export async function verifyLive(receipt) {
  for (const origin of ['https://yaalnilam.com', 'https://yaal-nilam.web.app']) {
    for (const path of ['/', '/properties/', '/properties/view/']) {
      const response = await fetch(`${origin}${path}`, { cache: 'no-store', signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`Post-release verification failed for ${origin}${path}.`);
      const html = Buffer.from(await response.arrayBuffer());
      const local = readFileSync(join(WEB, 'out', path === '/' ? 'index.html' : `${path.slice(1)}index.html`));
      if (sha256(html) !== sha256(local)) throw new Error(`Live HTML differs from the prepared export at ${origin}${path}.`);
      if (!response.headers.get('cache-control')?.includes('must-revalidate')) {
        throw new Error(`Live HTML cache headers require review at ${origin}${path}.`);
      }
    }
    const response = await fetch(`${origin}/release.json`, { cache: 'no-store', signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`The release receipt is unavailable at ${origin}.`);
    const live = await response.json();
    if (live.buildId !== receipt.buildId || live.sourceCommit !== receipt.sourceCommit || live.homepageSha256 !== receipt.homepageSha256) {
      throw new Error(`The live release receipt differs at ${origin}.`);
    }
  }
  console.log('Live homepage, properties page, property shell and release receipt match on both public hosts.');
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: node scripts/release-web.mjs [--dry-run | --check-prepared | --prepare | --deploy] [--branch main]\nDefault: --prepare on the editorial redesign branch. --check-prepared only validates an existing fresh receipt. --deploy is the only mode that publishes.');
    return;
  }
  let branch = DESIGN_BRANCH;
  const branchIndex = args.indexOf('--branch');
  if (branchIndex !== -1) {
    branch = args[branchIndex + 1];
    if (branch !== 'main' && branch !== DESIGN_BRANCH) throw new Error('Only main or the reviewed editorial redesign branch may release.');
    args.splice(branchIndex, 2);
  }
  const modes = args.filter((arg) => ['--dry-run', '--check-prepared', '--prepare', '--deploy'].includes(arg));
  if (args.some((arg) => !modes.includes(arg)) || modes.length > 1) throw new Error('Use one mode: --dry-run, --check-prepared, --prepare, or --deploy.');
  const mode = modes[0] || '--prepare';
  // Firebase's predeploy hook uses the same command before and after a reviewed merge.
  if (mode === '--check-prepared' && branchIndex === -1) {
    branch = git('branch', '--show-current');
    if (![DESIGN_BRANCH, 'main'].includes(branch)) throw new Error('Only main or the reviewed editorial redesign branch may release.');
  }

  if (resolve(git('rev-parse', '--show-toplevel')) !== ROOT) throw new Error('Run this script from the authoritative repository checkout.');
  if (repositoryName(git('remote', 'get-url', 'origin')) !== EXPECTED_REPO) throw new Error('The origin repository must be nanthan77/yaal-nilam.');
  if (git('branch', '--show-current') !== branch) throw new Error(`Expected branch ${branch}.`);
  command('git', ['merge-base', '--is-ancestor', DESIGN_BASELINE, 'HEAD'], { capture: true });
  const commit = git('rev-parse', 'HEAD');
  validateHostingConfig(JSON.parse(readFileSync(join(ROOT, 'firebase.json'), 'utf8')), JSON.parse(readFileSync(join(ROOT, '.firebaserc'), 'utf8')));
  const pkg = JSON.parse(readFileSync(join(WEB, 'package.json'), 'utf8'));
  if (!existsSync(join(WEB, 'package-lock.json')) || pkg.scripts?.build !== 'next build && node scripts/generate-sitemap.mjs') {
    throw new Error('The website requires its npm lockfile and the reviewed Next export + sitemap build command.');
  }
  console.log(`Source: ${EXPECTED_REPO} / ${branch} / ${commit}\nTarget: ${PROJECT} / hosting:main / web/out\nMode: ${mode}`);
  if (mode === '--dry-run') {
    const changes = sourceChanges();
    console.log('Planned checks: npm ci --include=dev; npm run test:data; npm run lint; npm run build; export validation; generated release.json.');
    console.log('Deployment requires --deploy and adds Hosting-only publication plus live verification.');
    if (changes.length) console.log(`Release blocked by uncommitted source:\n${changes.map((path) => `  ${path}`).join('\n')}`);
    requireCleanSource(commit, branch);
    console.log('Local release guards passed. Nothing was installed, built or deployed.');
    return;
  }
  requireCleanSource(commit, branch);
  if (mode === '--check-prepared') {
    const receiptPath = join(WEB, 'out', 'release.json');
    if (!existsSync(receiptPath)) throw new Error('The export has no prepared release receipt. Run --prepare before deploying.');
    const receipt = validatePreparedReceipt(JSON.parse(readFileSync(receiptPath, 'utf8')), { commit, branch, exported: verifyExport() });
    requireCleanSource(commit, branch);
    console.log(`Prepared export checks passed: ${receipt.buildId} / ${receipt.htmlFiles} HTML files. Nothing was installed, built or deployed.`);
    return;
  }
  if (mode === '--deploy') {
    const sites = JSON.parse(command('firebase', ['hosting:sites:list', '--project', PROJECT, '--json'], { capture: true }));
    if (!sites.result?.sites?.some((site) => site.name === `projects/${PROJECT}/sites/${PROJECT}`)) {
      throw new Error('Firebase authentication did not confirm the expected public Hosting site.');
    }
  }
  const installAt = installationDirectory(WEB);
  console.log(installAt === WEB
    ? 'Installing website dependencies from web/package-lock.json.'
    : 'Installing exact website dependencies in the matching linked cache; source builds remain in web/.');
  command('npm', ['ci', '--include=dev'], { cwd: installAt });
  if (installationDirectory(WEB) !== installAt) throw new Error('The website dependency link changed during installation. Prepare the reviewed source again.');
  process.env.NODE_ENV = 'production';
  const require = createRequire(join(WEB, 'package.json'));
  require('@next/env').loadEnvConfig(WEB, false, { info() {}, error() {} });
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== PROJECT) throw new Error('The website Firebase project must be yaal-nilam. Environment values were not printed.');
  if (['NEXT_PUBLIC_ENABLE_PROPERTY_FIXTURES', 'NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST', 'NEXT_PUBLIC_AUTH_EMULATOR_HOST', 'NEXT_PUBLIC_STORAGE_EMULATOR_HOST'].some((name) => process.env[name] && process.env[name] !== 'false')) {
    throw new Error('Disable development fixtures and emulator settings before preparing a public release.');
  }
  for (const script of ['test:data', 'lint', 'build']) command('npm', ['run', script], { cwd: WEB });
  requireCleanSource(commit, branch);
  const exported = verifyExport();
  const builtAt = new Date().toISOString();
  const receipt = { schemaVersion: 1, repository: EXPECTED_REPO, branch, sourceCommit: commit, buildId: `${commit.slice(0, 12)}-${builtAt.replace(/[-:.]/g, '')}`, builtAt, firebaseProject: PROJECT, hostingTarget: 'main', ...exported };
  writeFileSync(join(WEB, 'out', 'release.json'), `${JSON.stringify(receipt, null, 2)}\n`);
  console.log(`Prepared ${receipt.htmlFiles} HTML files. Receipt: web/out/release.json\nBuild: ${receipt.buildId}`);
  if (mode === '--prepare') {
    console.log('Preparation passed. No deployment was performed.');
    return;
  }
  requireCleanSource(commit, branch);
  command('firebase', ['deploy', '--only', 'hosting:main', '--project', PROJECT, '--message', `Public website; commit ${commit}; build ${receipt.buildId}`]);
  await verifyLive(receipt);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Website release stopped: ${error.message}`);
    process.exitCode = 1;
  });
}
