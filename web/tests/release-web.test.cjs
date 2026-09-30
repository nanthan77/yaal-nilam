const assert = require('node:assert/strict');
const { mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, symlinkSync, unlinkSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const test = require('node:test');

const release = import(pathToFileURL(path.resolve(__dirname, '../../scripts/release-web.mjs')).href);
const emptyUrls = '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';

test('empty property/image sitemap children preserve an honest empty catalog', async () => {
  const { validateSitemapContent } = await release;
  assert.equal(validateSitemapContent('sitemap-properties.xml', emptyUrls), 0);
  assert.equal(validateSitemapContent('sitemap-images.xml', emptyUrls), 0);
  assert.throws(() => validateSitemapContent('sitemap-core.xml', emptyUrls), /cannot be empty/);
  assert.throws(() => validateSitemapContent('sitemap.xml', '<sitemapindex></sitemapindex>'), /cannot be empty/);
  assert.throws(() => validateSitemapContent('sitemap-images.xml', '<urlset>'), /complete urlset/);
  assert.throws(() => validateSitemapContent('sitemap-properties.xml', '<urlset><url><loc>https://example.com/property/</loc></url></urlset>'), /canonical/);
  assert.equal(validateSitemapContent('sitemap-core.xml', '<urlset><url><loc>https://yaalnilam.com/</loc></url></urlset>'), 1);
});

test('release installs through a dependency symlink only with exact website manifests', async (t) => {
  const { installationDirectory } = await release;
  const fixture = mkdtempSync(path.join(tmpdir(), 'yaal-release-dependencies-'));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  const web = path.join(fixture, 'web');
  const cache = path.join(fixture, 'cache');
  mkdirSync(web); mkdirSync(cache); mkdirSync(path.join(cache, 'node_modules'));
  for (const name of ['package.json', 'package-lock.json']) {
    writeFileSync(path.join(web, name), '{"name":"reviewed-web"}\n');
    writeFileSync(path.join(cache, name), readFileSync(path.join(web, name)));
  }
  assert.equal(installationDirectory(web), web);
  symlinkSync(path.join(cache, 'node_modules'), path.join(web, 'node_modules'), 'dir');
  assert.equal(installationDirectory(web), realpathSync(cache));
  writeFileSync(path.join(cache, 'package-lock.json'), '{"name":"other-project"}\n');
  assert.throws(() => installationDirectory(web), /exactly match/);
  writeFileSync(path.join(cache, 'package-lock.json'), readFileSync(path.join(web, 'package-lock.json')));
  rmSync(path.join(cache, 'package.json'));
  assert.throws(() => installationDirectory(web), /exactly match/);
  rmSync(path.join(cache, 'node_modules'), { recursive: true });
  assert.throws(() => installationDirectory(web), /unavailable/);
  unlinkSync(path.join(web, 'node_modules'));
  mkdirSync(path.join(cache, 'other-directory'));
  symlinkSync(path.join(cache, 'other-directory'), path.join(web, 'node_modules'), 'dir');
  assert.throws(() => installationDirectory(web), /node_modules directory/);
});

test('Hosting predeploy refuses stale, mismatched and altered prepared exports', async () => {
  const { validatePreparedReceipt } = await release;
  const commit = 'a'.repeat(40);
  const branch = 'codex/yaal-nilam-editorial-redesign-20260926';
  const builtAt = '2026-09-30T10:00:00.000Z';
  const exported = { htmlFiles: 555, homepageSha256: 'b'.repeat(64) };
  const receipt = {
    schemaVersion: 1, repository: 'nanthan77/yaal-nilam', branch,
    sourceCommit: commit, buildId: `${commit.slice(0, 12)}-${builtAt.replace(/[-:.]/g, '')}`,
    builtAt, firebaseProject: 'yaal-nilam', hostingTarget: 'main', ...exported,
  };
  const context = { commit, branch, exported, now: Date.parse(builtAt) + 60 * 60 * 1000 };
  assert.equal(validatePreparedReceipt(receipt, context), receipt);
  for (const change of [
    { schemaVersion: 2 }, { repository: 'another/repository' },
    { branch: 'main' }, { sourceCommit: 'c'.repeat(40) },
    { firebaseProject: 'another-project' }, { hostingTarget: 'admin' },
  ]) assert.throws(() => validatePreparedReceipt({ ...receipt, ...change }, context), /source commit, branch and public Hosting target/);
  assert.throws(() => validatePreparedReceipt(undefined, context), /prepared receipt/);
  assert.throws(() => validatePreparedReceipt(receipt, { ...context, now: Date.parse(builtAt) + 24 * 60 * 60 * 1000 + 1 }), /last 24 hours/);
  assert.throws(() => validatePreparedReceipt(receipt, { ...context, now: Date.parse(builtAt) - 5 * 60 * 1000 - 1 }), /valid build time/);
  assert.throws(() => validatePreparedReceipt({ ...receipt, builtAt: 'invalid' }, context), /valid build time/);
  for (const change of [{ buildId: 'old-build' }, { homepageSha256: 'c'.repeat(64) }, { htmlFiles: 554 }, { htmlFiles: '555' }]) {
    assert.throws(() => validatePreparedReceipt({ ...receipt, ...change }, context), /differs from the export/);
  }
  assert.throws(() => validatePreparedReceipt(receipt, { ...context, exported: { ...exported, htmlFiles: 554 } }), /differs from the export/);
});
