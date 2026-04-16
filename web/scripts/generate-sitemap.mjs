// Auto-generate sitemap.xml (and a sitemap index) by walking the
// Next.js static export output. Run AFTER `next build`.
//
// Outputs to both web/public/ (source) and web/out/ (build):
//   sitemap.xml          — sitemap index pointing to the 3 below
//   sitemap-core.xml     — homepage, static pages, intent hubs, areas hub
//   sitemap-listings.xml — buy/rent + short-term-rental pages
//   sitemap-locations.xml— areas/[slug] + properties/[id]

import { readdirSync, statSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://yaal-nilam.web.app';
const OUT_DIR = join(__dirname, '..', 'out');
const PUBLIC_DIR = join(__dirname, '..', 'public');

const PRIORITY_RULES = [
  { match: /^\/$/, priority: '1.0', changefreq: 'daily' },
  { match: /^\/(buy|rent)\/$/, priority: '0.9', changefreq: 'daily' },
  { match: /^\/(buy|rent)\/[^/]+\/$/, priority: '0.8', changefreq: 'weekly' },
  { match: /^\/(buy|rent)\/[^/]+\/[^/]+\/$/, priority: '0.7', changefreq: 'weekly' },
  { match: /^\/areas\/[^/]+\/$/, priority: '0.8', changefreq: 'weekly' },
  { match: /^\/areas\/$/, priority: '0.7', changefreq: 'weekly' },
  { match: /^\/short-term-rental\/[^/]+\/$/, priority: '0.75', changefreq: 'weekly' },
  { match: /^\/short-term-rental\/$/, priority: '0.7', changefreq: 'weekly' },
  { match: /^\/properties\/[^/]+\/$/, priority: '0.7', changefreq: 'weekly' },
  { match: /^\/properties\/$/, priority: '0.7', changefreq: 'daily' },
  { match: /^\/guides\/[^/]+\/$/, priority: '0.6', changefreq: 'monthly' },
];

const EXCLUDED = [
  /^\/404\/?$/,
  /^\/_next\//,
  /^\/dashboard\//,
  /^\/login\/?$/,
  /^\/register\/?$/,
  /^\/add-listing\/?$/,
];

function getPriority(path) {
  for (const rule of PRIORITY_RULES) {
    if (rule.match.test(path)) return rule;
  }
  return { priority: '0.5', changefreq: 'weekly' };
}

function walk(dir, baseDir) {
  const routes = new Set();
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('_') || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      for (const r of walk(full, baseDir)) routes.add(r);
    } else if (entry === 'index.html') {
      const rel = relative(baseDir, dir);
      const route = rel === '' ? '/' : `/${rel.split('\\').join('/')}/`;
      routes.add(route);
    }
  }
  return routes;
}

function bucket(path) {
  if (/^\/(buy|rent|short-term-rental)\//.test(path)) return 'listings';
  if (/^\/(areas|properties)\//.test(path)) return 'locations';
  return 'core';
}

function urlBlock(r, lastmod) {
  const { priority, changefreq } = getPriority(r);
  return `  <url>
    <loc>${BASE_URL}${r}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function urlsetDoc(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

function indexDoc(entries, lastmod) {
  const items = entries
    .map(
      (name) => `  <sitemap>
    <loc>${BASE_URL}/${name}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>
`;
}

function writePair(filename, content) {
  if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(PUBLIC_DIR, filename), content, 'utf-8');
  writeFileSync(join(OUT_DIR, filename), content, 'utf-8');
}

if (!existsSync(OUT_DIR)) {
  console.error(`✗ Build output not found at ${OUT_DIR}. Run 'next build' first.`);
  process.exit(1);
}

const today = new Date().toISOString().split('T')[0];
const routes = [...walk(OUT_DIR, OUT_DIR)]
  .filter((r) => !EXCLUDED.some((rx) => rx.test(r)))
  .sort();

const groups = { core: [], listings: [], locations: [] };
for (const r of routes) groups[bucket(r)].push(r);

writePair('sitemap-core.xml', urlsetDoc(groups.core.map((r) => urlBlock(r, today))));
writePair('sitemap-listings.xml', urlsetDoc(groups.listings.map((r) => urlBlock(r, today))));
writePair('sitemap-locations.xml', urlsetDoc(groups.locations.map((r) => urlBlock(r, today))));

writePair(
  'sitemap.xml',
  indexDoc(['sitemap-core.xml', 'sitemap-listings.xml', 'sitemap-locations.xml'], today),
);

console.log(`✔ Sitemap index + 3 children generated (${routes.length} total URLs)`);
console.log(`  core:      ${groups.core.length} URLs`);
console.log(`  listings:  ${groups.listings.length} URLs`);
console.log(`  locations: ${groups.locations.length} URLs`);
