const assert = require('node:assert/strict');
const { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const test = require('node:test');

const SITE = 'https://yaalnilam.com';
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'yaal-sitemap-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const outDir = join(root, 'out');
  const publicDir = join(root, 'public');
  mkdirSync(outDir);
  const page = (route, { canonical = route, noindex = false, listing, body = '' } = {}) => {
    const directory = join(outDir, route);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, 'index.html'), `<html><head><link rel="canonical" href="${SITE}${canonical}"/>${noindex ? '<meta name="robots" content="noindex,follow"/>' : ''}${listing ? `<script type="application/ld+json">${JSON.stringify(listing)}</script>` : ''}</head><body>${body}</body></html>`);
  };
  return { outDir, publicDir, page, read: (name) => readFileSync(join(outDir, name), 'utf8') };
}
function listing(route, extra = {}) {
  return { '@context': 'https://schema.org', '@type': 'RealEstateListing', url: SITE + route, name: 'Test & listing', description: 'Owner supplied <description>', image: ['https://example.invalid/listing.jpg?a=1&b=2'], ...extra };
}

test('sitemap and feeds include only canonical available property exports', async (t) => {
  const { generateSitemaps } = await import('../scripts/generate-sitemap.mjs');
  const f = fixture(t);
  f.page('/');
  f.page('/properties/live-property/', { listing: listing('/properties/live-property/') });
  f.page('/properties/ID123/', { canonical: '/properties/live-property/', listing: listing('/properties/live-property/') });
  f.page('/properties/missing/', { noindex: true });
  f.page('/properties/unconfirmed/');
  f.page('/properties/view/');
  f.page('/map/', { noindex: true });
  f.page('/diaspora/');
  const result = generateSitemaps(f);
  assert.equal(result.properties, 1);
  assert.equal(result.core, 1);
  assert.equal(result.hubs, 1);
  assert.equal(result.images, 1);
  const properties = f.read('sitemap-properties.xml');
  assert.ok(properties.includes('/properties/live-property/'));
  assert.ok(!/ID123|missing|unconfirmed|view/.test(properties));
  assert.ok(!properties.includes('<lastmod>'));
  assert.ok(!f.read('sitemap-core.xml').includes('/map/'));
  assert.equal((f.read('sitemap.xml').match(/<sitemap>/g) || []).length, 4);
  for (const child of ['properties', 'hubs', 'core', 'images']) assert.ok(f.read('sitemap.xml').includes(`sitemap-${child}.xml`));
  const feed = f.read('feed.xml');
  assert.equal(feed, f.read('rss.xml'));
  assert.ok(feed.includes('Test &amp; listing'));
  assert.ok(feed.includes('&lt;description&gt;'));
  assert.ok(!feed.includes('<pubDate>'));
  assert.ok(!feed.includes('<lastBuildDate>'));
  assert.ok(f.read('sitemap-images.xml').includes('a=1&amp;b=2'));
  assert.equal(f.read('robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
});

test('exported source dates are retained and repeat runs never manufacture freshness', async (t) => {
  const { generateSitemaps } = await import('../scripts/generate-sitemap.mjs');
  const f = fixture(t);
  f.page('/properties/dated/', { listing: listing('/properties/dated/', { dateModified: '2026-09-20T10:00:00Z', datePublished: '2026-09-19', image: ['/design/illustration.webp', '/property-placeholder.svg', '/missing-photo.jpg'] }) });
  generateSitemaps(f);
  const before = f.read('sitemap-properties.xml');
  assert.ok(before.includes('<lastmod>2026-09-20T10:00:00Z</lastmod>'));
  assert.ok(f.read('feed.xml').includes('<pubDate>Sat, 19 Sep 2026 00:00:00 GMT</pubDate>'));
  assert.ok(!f.read('sitemap-images.xml').includes('<url>'));
  generateSitemaps(f);
  assert.equal(f.read('sitemap-properties.xml'), before);
});

test('populated area markers and real listing links filter thin hub exports', async (t) => {
  const { generateSitemaps } = await import('../scripts/generate-sitemap.mjs');
  const f = fixture(t);
  f.page('/properties/live-property/', { listing: listing('/properties/live-property/') });
  f.page('/real-estate/jaffna/', { body: '<a data-published-area="nallur" href="/areas/nallur/">Nallur</a>' });
  f.page('/areas/');
  f.page('/areas/nallur/');
  f.page('/areas/empty/');
  f.page('/buy/house/nallur/', { body: '<a href="/properties/live-property/">Listing</a>' });
  f.page('/buy/house/empty/');
  generateSitemaps(f);
  const hubs = f.read('sitemap-hubs.xml');
  assert.ok(hubs.includes('/areas/nallur/'));
  assert.ok(hubs.includes('/buy/house/nallur/'));
  assert.ok(!hubs.includes('/empty/'));
  assert.ok(f.read('sitemap-locations.xml').includes('/areas/nallur/'));
  assert.ok(f.read('sitemap-listings.xml').includes('/buy/house/nallur/'));
});
