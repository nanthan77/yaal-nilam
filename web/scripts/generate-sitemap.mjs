// Generate sitemap.xml after next build
// Run: node scripts/generate-sitemap.mjs

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://yaal-nilam.web.app';

const PROPERTY_TYPES = ['house', 'apartment', 'villa', 'land', 'commercial'];
const INTENTS = ['buy', 'rent'];
const LOCATIONS = [
  'jaffna', 'nallur', 'valikamam-north', 'valikamam-south', 'valikamam-east',
  'valikamam-west', 'vadamarachchi-north', 'vadamarachchi-south', 'vadamarachchi-east',
  'thenmarachchi', 'sandilipay', 'karainagar', 'velanai', 'island-north', 'island-south',
  'jaffna-fort', 'grand-bazaar', 'vannarpannai', 'kokkuvil', 'thirunelvely',
  'kondavil', 'chundikuli', 'passaiyoor', 'kopay', 'urumpirai', 'ilavalai',
  'chunnakam', 'erlalai', 'manipay', 'tellippalai', 'maviddapuram',
  'chavakachcheri', 'kodikamam', 'point-pedro', 'valvettithurai', 'kayts',
];

const today = new Date().toISOString().split('T')[0];

function url(loc, priority, changefreq = 'weekly') {
  return `  <url>
    <loc>${BASE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const urls = [];

// Homepage
urls.push(url('/', '1.0', 'daily'));

// Static pages
const staticPages = [
  '/properties/', '/areas/', '/map/', '/agents/', '/about/', '/contact/',
  '/add-listing/', '/list-property/', '/request-property/',
  '/guides/buying-land-jaffna/', '/terms/', '/privacy/', '/listing-policy/',
  '/short-term-rental/',
];
for (const page of staticPages) {
  urls.push(url(page, '0.5'));
}

// Tier 1: Intent hubs
for (const intent of INTENTS) {
  urls.push(url(`/${intent}/`, '0.9'));
}

// Tier 2: Intent + Type
for (const intent of INTENTS) {
  for (const type of PROPERTY_TYPES) {
    urls.push(url(`/${intent}/${type}/`, '0.8'));
  }
}

// Tier 3: Intent + Type + Location (THE CORE)
for (const intent of INTENTS) {
  for (const type of PROPERTY_TYPES) {
    for (const location of LOCATIONS) {
      urls.push(url(`/${intent}/${type}/${location}/`, '0.7'));
    }
  }
}

// Tier 4: Area hubs
for (const location of LOCATIONS) {
  urls.push(url(`/areas/${location}/`, '0.8'));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

const outPath = join(__dirname, '..', 'public', 'sitemap.xml');
writeFileSync(outPath, sitemap, 'utf-8');

console.log(`Sitemap generated with ${urls.length} URLs -> ${outPath}`);
