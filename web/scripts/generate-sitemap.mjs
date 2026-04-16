// Auto-generate sitemap.xml by walking the Next.js static export output.
// Run AFTER `next build` (which produces web/out/). This captures every
// actually-generated route, not a hand-maintained list.
//
// Usage: node scripts/generate-sitemap.mjs

import { readdirSync, statSync, writeFileSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://yaal-nilam.web.app';
const OUT_DIR = join(__dirname, '..', 'out');
const PUBLIC_SITEMAP = join(__dirname, '..', 'public', 'sitemap.xml');
const OUT_SITEMAP = join(OUT_DIR, 'sitemap.xml');

// Priority rules (first match wins)
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

const EXCLUDED_PATHS = [
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

function isExcluded(path) {
  return EXCLUDED_PATHS.some((rx) => rx.test(path));
}

function walk(dir, baseDir) {
  const routes = new Set();
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry.startsWith('_') || entry.startsWith('.')) continue;
      for (const r of walk(full, baseDir)) routes.add(r);
    } else if (entry === 'index.html') {
      const rel = relative(baseDir, dir);
      const route = rel === '' ? '/' : `/${rel.split('\\').join('/')}/`;
      routes.add(route);
    }
  }
  return routes;
}

if (!existsSync(OUT_DIR)) {
  console.error(`✗ Build output not found at ${OUT_DIR}. Run 'next build' first.`);
  process.exit(1);
}

const today = new Date().toISOString().split('T')[0];
const routes = [...walk(OUT_DIR, OUT_DIR)]
  .filter((r) => !isExcluded(r))
  .sort();

const urls = routes.map((r) => {
  const { priority, changefreq } = getPriority(r);
  return `  <url>
    <loc>${BASE_URL}${r}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

writeFileSync(PUBLIC_SITEMAP, sitemap, 'utf-8');
writeFileSync(OUT_SITEMAP, sitemap, 'utf-8');

console.log(`✔ Sitemap generated with ${routes.length} URLs`);
console.log(`  → ${PUBLIC_SITEMAP}`);
console.log(`  → ${OUT_SITEMAP}`);
