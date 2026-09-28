// Run after Next.js static export. Only confirmed, canonical export pages are
// published; rebuilding never invents listing dates or available properties.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = 'https://yaalnilam.com';
const EXCLUDED = /^\/(?:404|_next|dashboard|login|register|add-listing)(?:\/|$)|^\/(?:properties|agents)\/(?:view|__fallback)(?:\/|$)/;
const HUB = /^\/(?:areas|buy|rent|short-term-rental|real-estate|lands)(?:\/|$)|^\/diaspora\/$/;
const PRIMARY_HUBS = new Set(['/areas/', '/buy/', '/rent/', '/short-term-rental/', '/diaspora/', '/real-estate/', '/real-estate/jaffna/', '/lands/clear-title-lands-jaffna/']);
const CHILDREN = ['sitemap-properties.xml', 'sitemap-hubs.xml', 'sitemap-core.xml', 'sitemap-images.xml'];

function xml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character]));
}

function unescapeHtml(value) {
  return value.replace(/&(?:amp|quot|apos|lt|gt);/g, (entity) => ({ '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' }[entity]));
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match ? unescapeHtml(match[2]) : undefined;
}

function canonicalPath(value) {
  try {
    const url = new URL(value, SITE);
    return url.origin === SITE && !url.search && !url.hash ? url.pathname : undefined;
  } catch { return undefined; }
}

function dateValue(value) {
  // Dates must be supplied by the document. File mtimes and build times are not listing dates.
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) && Number.isFinite(Date.parse(value)) ? value : undefined;
}

function structuredNodes(value) {
  if (Array.isArray(value)) return value.flatMap(structuredNodes);
  if (!value || typeof value !== 'object') return [];
  return [value, ...(Array.isArray(value['@graph']) ? value['@graph'].flatMap(structuredNodes) : [])];
}

function readPage(file, route) {
  const html = readFileSync(file, 'utf8');
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  const canonical = links.find((tag) => attribute(tag, 'rel') === 'canonical');
  if (!canonical || canonicalPath(attribute(canonical, 'href')) !== route) return null;
  const noindex = [...html.matchAll(/<meta\b[^>]*>/gi)].some(([tag]) =>
    /^(robots|googlebot)$/i.test(attribute(tag, 'name') || '') && /\bnoindex\b/i.test(attribute(tag, 'content') || '')
  );
  if (noindex) return null;

  const structured = [];
  for (const [tag, body] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    if (attribute(tag, 'type') !== 'application/ld+json') continue;
    try { structured.push(...structuredNodes(JSON.parse(body))); } catch { /* Invalid schema cannot establish a listing. */ }
  }
  const listing = structured.find((item) =>
    (Array.isArray(item['@type']) ? item['@type'] : [item['@type']]).includes('RealEstateListing') && canonicalPath(item.url) === route
  );
  const lastmod = dateValue(listing?.dateModified) || dateValue(listing?.datePublished);
  return { route, html, listing, lastmod };
}

function walk(directory, root = directory) {
  const pages = [];
  for (const entry of readdirSync(directory)) {
    if (entry.startsWith('_') || entry.startsWith('.')) continue;
    const file = join(directory, entry);
    if (statSync(file).isDirectory()) pages.push(...walk(file, root));
    else if (entry === 'index.html') {
      const local = relative(root, directory).split('\\').join('/');
      const route = local ? `/${local}/` : '/';
      if (!EXCLUDED.test(route)) {
        const page = readPage(file, route);
        if (page) pages.push(page);
      }
    }
  }
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}

function priority(route) {
  if (route === '/') return '1.0';
  if (route === '/properties/' || route === '/new-today/') return '0.9';
  return HUB.test(route) ? '0.8' : '0.7';
}

function urlBlock(page, images = []) {
  return `  <url>\n    <loc>${xml(SITE + page.route)}</loc>${page.lastmod ? `\n    <lastmod>${xml(page.lastmod)}</lastmod>` : ''}\n    <priority>${priority(page.route)}</priority>${images.map((image) => `\n    <image:image><image:loc>${xml(image)}</image:loc></image:image>`).join('')}\n  </url>`;
}

function urlset(blocks, images = false) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${images ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : ''}>\n${blocks.join('\n')}\n</urlset>\n`;
}

function listingImages(page, outDir) {
  const values = Array.isArray(page.listing.image) ? page.listing.image : [page.listing.image];
  const images = values.flatMap((value) => {
    try {
      const raw = typeof value === 'string' ? value : value?.url || value?.contentUrl;
      if (!raw) return [];
      const url = new URL(raw, SITE);
      if (!['https:', 'http:'].includes(url.protocol) || /\/design\/|property-placeholder/i.test(url.pathname)) return [];
      // Local assets must actually be present in this export. Remote listing
      // media comes only from that listing's exported JSON-LD.
      if (url.origin === SITE && !existsSync(join(outDir, decodeURIComponent(url.pathname)))) return [];
      return [url.href];
    } catch { return []; }
  });
  return [...new Set(images)];
}

function feed(properties) {
  const sorted = [...properties].sort((a, b) => (Date.parse(b.lastmod || '') || 0) - (Date.parse(a.lastmod || '') || 0) || a.route.localeCompare(b.route));
  const items = sorted.map((page) => {
    const published = dateValue(page.listing.datePublished) || page.lastmod;
    return `    <item>\n      <title>${xml(page.listing.name)}</title>\n      <link>${xml(SITE + page.route)}</link>\n      <guid isPermaLink="true">${xml(SITE + page.route)}</guid>\n      <description>${xml(page.listing.description || '')}</description>${published ? `\n      <pubDate>${new Date(published).toUTCString()}</pubDate>` : ''}\n    </item>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>Yaal Nilam property listings</title>\n    <link>${SITE}/new-today/</link>\n    <description>Current published property listings on Yaal Nilam. Confirm availability with the advertiser.</description>\n    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>\n${items.join('\n')}\n  </channel>\n</rss>\n`;
}

export function generateSitemaps({ outDir = join(HERE, '..', 'out'), publicDir = join(HERE, '..', 'public') } = {}) {
  if (!existsSync(outDir)) throw new Error(`Build output missing at ${outDir}. Run next build first.`);
  const pages = walk(outDir);
  const properties = pages.filter((page) => /^\/properties\/[^/]+\/$/.test(page.route) && page.listing);
  const propertyPaths = new Set(properties.map((page) => page.route));
  const populatedAreas = new Set();
  for (const page of pages) {
    for (const [tag] of page.html.matchAll(/<a\b[^>]*\bdata-published-area=[^>]*>/gi)) {
      const area = attribute(tag, 'data-published-area');
      if (area && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(area)) populatedAreas.add(`/areas/${area}/`);
    }
  }
  const hasListingLinks = (page) => [...page.html.matchAll(/<a\b[^>]*>/gi)].some(([tag]) => propertyPaths.has(canonicalPath(attribute(tag, 'href'))));
  const hubs = pages.filter((page) => HUB.test(page.route) && (
    PRIMARY_HUBS.has(page.route) || (/^\/areas\/[^/]+\/$/.test(page.route) ? populatedAreas.has(page.route) : hasListingLinks(page))
  ));
  const core = pages.filter((page) => !HUB.test(page.route) && !/^\/properties\/[^/]+\/$/.test(page.route));
  const images = properties.map((page) => ({ page, urls: listingImages(page, outDir) })).filter((item) => item.urls.length);
  const write = (name, content) => {
    for (const directory of new Set([publicDir, outDir])) {
      mkdirSync(directory, { recursive: true });
      writeFileSync(join(directory, name), content);
    }
  };
  write('sitemap-properties.xml', urlset(properties.map((page) => urlBlock(page))));
  write('sitemap-hubs.xml', urlset(hubs.map((page) => urlBlock(page))));
  write('sitemap-core.xml', urlset(core.map((page) => urlBlock(page))));
  write('sitemap-images.xml', urlset(images.map(({ page, urls }) => urlBlock(page, urls)), true));
  // Retain earlier sitemap URLs as aliases, without putting duplicate URL sets in the index.
  write('sitemap-listings.xml', urlset(hubs.filter((page) => /^\/(buy|rent|short-term-rental)\//.test(page.route)).map((page) => urlBlock(page))));
  write('sitemap-locations.xml', urlset([...hubs.filter((page) => /^\/areas\//.test(page.route)), ...properties].map((page) => urlBlock(page))));
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${CHILDREN.map((name) => `  <sitemap><loc>${SITE}/${name}</loc></sitemap>`).join('\n')}\n</sitemapindex>\n`);
  write('feed.xml', feed(properties));
  write('rss.xml', feed(properties));
  write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
  return { properties: properties.length, hubs: hubs.length, core: core.length, images: images.length, total: properties.length + hubs.length + core.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const counts = generateSitemaps();
  console.log(`Sitemap index + 4 children and RSS feeds generated (${counts.total} canonical URLs; ${counts.properties} properties, ${counts.hubs} hubs, ${counts.core} core, ${counts.images} image entries).`);
}
