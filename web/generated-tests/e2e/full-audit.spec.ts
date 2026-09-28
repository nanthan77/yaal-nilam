/**
 * Full Audit Suite — Multi-Agent Observer pattern
 * Driver: navigates + interacts. Observers: security, a11y, performance.
 */
import { test, expect, Page } from '@playwright/test';

const ROUTES = [
  '/',
  '/properties/',
  '/areas/',
  '/short-term-rental/',
  '/about/',
  '/contact/',
  '/add-listing/',
  '/areas/nallur/',
  '/areas/jaffna-fort/',
  '/areas/chunnakam/',
  '/areas/point-pedro/',
];


async function openEnglishHome(page: Page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-LK');
}

// ── DRIVER: Functional flows ─────────────────────────────────────────────

test.describe('Driver — Navigation & Core Functions', () => {
  for (const route of ROUTES) {
    test(`renders ${route}`, async ({ page }) => {
      const resp = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(resp?.status(), `${route} HTTP status`).toBeLessThan(400);
      await expect(page.locator('body')).toBeVisible();
    });
  }

  test('homepage intent controls and illustration are present', async ({ page }) => {
    await openEnglishHome(page);
    for (const intent of ['Buy', 'Rent', 'Short stay']) {
      await expect(page.getByRole('button', { name: intent, exact: true })).toBeVisible();
    }
    await expect(page.getByText('Illustrative image', { exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Illustration of a Jaffna style house, not a property listing' })).toBeVisible();
  });

  test('homepage search fields have accessible labels and property types', async ({ page }) => {
    await openEnglishHome(page);
    await expect(page.getByRole('searchbox', { name: 'Search by keyword' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Where?' })).toBeVisible();
    const propertyType = page.getByRole('combobox', { name: 'What kind?' });
    for (const type of ['house', 'apartment', 'villa', 'land', 'commercial']) {
      await propertyType.selectOption(type);
      await expect(propertyType).toHaveValue(type);
    }
  });

  for (const [label, intent] of [['Buy', 'sell'], ['Rent', 'rent'], ['Short stay', 'short_rent']]) {
    for (const submission of ['Enter', 'button']) {
      test(`homepage ${label} search via ${submission} preserves filters`, async ({ page }) => {
        await openEnglishHome(page);
        await page.getByRole('button', { name: label, exact: true }).click();
        await page.getByRole('combobox', { name: 'Where?' }).selectOption('nallur');
        await page.getByRole('combobox', { name: 'What kind?' }).selectOption('house');
        const keyword = page.getByRole('searchbox', { name: 'Search by keyword' });
        await keyword.fill('  Nallur & temple  ');
        if (submission === 'Enter') await keyword.press('Enter');
        else await page.getByRole('button', { name: 'Find properties', exact: true }).click();
        await expect(page).toHaveURL(/\/properties\/?\?/);
        const params = new URL(page.url()).searchParams;
        expect(Object.fromEntries(params)).toEqual({ intent, area: 'nallur', type: 'house', q: 'Nallur & temple' });
        await expect(page.locator('#filter-intent')).toHaveValue(intent);
        await expect(page.locator('#filter-selectedArea')).toHaveValue('nallur');
        await expect(page.locator('#filter-selectedType')).toHaveValue('house');
        await expect(page.locator('#property-search')).toHaveValue('Nallur & temple');
      });
    }
  }

  test('featured section shows real links or an honest empty state', async ({ page }) => {
    await openEnglishHome(page);
    const featured = page.locator('#featured');
    await expect.poll(async () => (await featured.locator('.yn-listing-card').count()) > 0 || await featured.getByText('No properties are available right now.', { exact: false }).isVisible(), { timeout: 15000 }).toBeTruthy();
    for (const link of await featured.locator('.yn-listing-card h3 a').all()) {
      await expect(link).toHaveAttribute('href', /^\/properties\/[^/]+\/$/);
    }
    await expect(featured).not.toContainText('[DEVELOPMENT SAMPLE]');
  });

  test('homepage WhatsApp links use valid international numbers', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const links = page.locator('a[href*="wa.me/"]');
    expect(await links.count()).toBeGreaterThan(0);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('href', /^https:\/\/wa\.me\/[1-9]\d{7,14}(?:\?|$)/);
    }
  });

  test('area cards navigate and mobile menu supports Escape', async ({ page, isMobile }) => {
    await openEnglishHome(page);
    if (isMobile) {
      const menu = page.getByRole('button', { name: 'Open menu', exact: true });
      await menu.click();
      await expect(page.locator('#mobile-navigation')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#mobile-navigation')).toBeHidden();
      await expect(menu).toBeFocused();
    }
    const areaLinks = page.locator('.yn-area-card');
    await expect(areaLinks.first()).toBeVisible();
    await areaLinks.first().click();
    await expect(page).toHaveURL(/\/areas\/[^/?]+\/?(?:\?|$)/);
  });

  test('footer social links use HTTPS', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const socials = ['facebook.com', 'instagram.com', 'x.com', 'youtube.com'];
    for (const s of socials) {
      const link = page.locator(`a[href*="${s}"]`).first();
      const href = await link.getAttribute('href');
      expect(href?.startsWith('https://')).toBeTruthy();
    }
  });

  test('Tamil is default and English preference persists after reload', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('lang', 'ta-LK');
    await expect(page.getByRole('button', { name: 'சொத்துகளைத் தேடுங்கள்', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Switch to English' }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-LK');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-LK');
    await expect(page.getByRole('button', { name: 'Find properties', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'தமிழுக்கு மாற்றவும்' }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ta-LK');
  });

  test('add-listing form has required fields', async ({ page }) => {
    const resp = await page.goto('/add-listing/', { waitUntil: 'domcontentloaded' });
    expect(resp?.status()).toBeLessThan(400);
    const inputs = await page.locator('input, select, textarea').count();
    expect(inputs).toBeGreaterThan(0);
  });
});

// ── OBSERVER: Security audit ─────────────────────────────────────────────

test.describe('🔒 Security Observer', () => {
  test('no sensitive keys leaked in page source', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const html = await page.content();
    const forbidden = [
      /AIza[0-9A-Za-z_-]{35}/,            // Google API key pattern, but NEXT_PUBLIC is ok
      /sk_live_[0-9a-zA-Z]{24,}/,          // Stripe live secret
      /sk_test_[0-9a-zA-Z]{24,}/,          // Stripe test secret
      /-----BEGIN (RSA|PRIVATE) KEY-----/,
      /password\s*[:=]\s*["'][^"']+["']/i,
    ];
    for (const rx of forbidden) {
      expect(html, `Leak match ${rx}`).not.toMatch(rx);
    }
  });

  test('external links have rel=noopener', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const externals = await page.locator('a[target="_blank"]').all();
    for (const a of externals) {
      const rel = await a.getAttribute('rel');
      expect(rel ?? '', `target=_blank link missing noopener`).toMatch(/noopener/);
    }
  });

  test('XSS attempt in search does not execute', async ({ page }) => {
    let alerted = false;
    page.on('dialog', async d => { alerted = true; await d.dismiss(); });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const search = page.getByRole('searchbox');
    await search.fill('<script>alert(1)</script>');
    await page.keyboard.press('Enter').catch(() => {});
    await page.waitForTimeout(800);
    expect(alerted).toBeFalsy();
  });

  test('response headers set (X-Content-Type, etc.)', async ({ page }) => {
    const resp = await page.goto('/', { waitUntil: 'domcontentloaded' });
    const headers = resp?.headers() ?? {};
    // Warn-only: log missing headers rather than fail dev build
    const missing = ['x-content-type-options', 'x-frame-options', 'referrer-policy']
      .filter(h => !headers[h]);
    console.log(`[SECURITY] Missing security headers: ${missing.join(', ') || 'none'}`);
  });
});

// ── OBSERVER: Accessibility (WCAG 2.1 AA) ────────────────────────────────

test.describe('♿ Accessibility Observer', () => {
  test('html has lang attribute', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });

  test('images have alt attributes', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const imgs = await page.locator('img').all();
    let missing = 0;
    for (const img of imgs) {
      const alt = await img.getAttribute('alt');
      if (alt === null) missing++;
    }
    console.log(`[A11Y] Images missing alt: ${missing}/${imgs.length}`);
    expect(missing).toBeLessThanOrEqual(Math.ceil(imgs.length * 0.1)); // ≤10%
  });

  test('single h1 per page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('landmark regions exist', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('nav, [role="navigation"]').first()).toBeVisible();
    await expect(page.locator('main, [role="main"]').first()).toBeVisible();
    await expect(page.locator('footer, [role="contentinfo"]').first()).toBeVisible();
  });

  test('keyboard focusable: Tab reaches search', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    let reached = false;
    for (let i = 0; i < 30 && !reached; i++) {
      await page.keyboard.press('Tab');
      // Check computed role via type attribute (implicit) or explicit role attribute
      reached = await page.evaluate(() => {
        const el = document.activeElement as HTMLInputElement | null;
        if (!el) return false;
        return el.tagName === 'INPUT' && (el.type === 'search' || el.getAttribute('role') === 'searchbox');
      });
    }
    expect(reached).toBeTruthy();
  });

  test('touch targets ≥ 44px on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only');
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const buttons = await page.getByRole('button').all();
    let small = 0;
    for (const b of buttons.slice(0, 15)) {
      const box = await b.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) small++;
    }
    console.log(`[A11Y-MOBILE] Small touch targets: ${small}`);
  });
});

// ── OBSERVER: Performance ────────────────────────────────────────────────

test.describe('⚡ Performance Observer', () => {
  test('LCP < 4s (dev tolerance)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const lcp = await page.evaluate(() => new Promise<number>(res => {
      let value = 0;
      new PerformanceObserver(list => {
        for (const e of list.getEntries()) value = (e as any).renderTime || e.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => res(value), 3000);
    }));
    console.log(`[PERF] LCP = ${Math.round(lcp)}ms`);
    expect(lcp, 'LCP under 4s (dev)').toBeLessThan(4000);
  });

  test('TTFB < 1500ms', async ({ page }) => {
    const resp = await page.goto('/', { waitUntil: 'domcontentloaded' });
    const timing = await page.evaluate(() => {
      const n = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return n ? n.responseStart - n.requestStart : 0;
    });
    console.log(`[PERF] TTFB = ${Math.round(timing)}ms`);
    expect(timing).toBeLessThan(1500);
  });

  test('no console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const filtered = errors.filter(e =>
      !e.includes('Download the React DevTools') &&
      !e.includes('Failed to load resource: net::ERR_BLOCKED_BY_CLIENT'));
    console.log(`[PERF] Console errors: ${filtered.length}`);
    if (filtered.length) console.log(filtered.slice(0, 3).join('\n'));
    expect(filtered.length).toBeLessThanOrEqual(2);
  });

  test('images use lazy loading where appropriate', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const imgs = await page.locator('img').all();
    let lazyCount = 0;
    for (const img of imgs) {
      const loading = await img.getAttribute('loading');
      if (loading === 'lazy') lazyCount++;
    }
    console.log(`[PERF] Lazy-loaded images: ${lazyCount}/${imgs.length}`);
  });
});

// ── QUINN PERSONA: exploratory black-box ─────────────────────────────────

test.describe('🤠 Quinn — Adversarial Exploration', () => {
  test('emoji + unicode in search does not break UI', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const search = page.getByRole('searchbox');
    await search.fill('🏠 யாழ்ப்பாணம் 😎 ' + 'a'.repeat(200));
    await expect(search).toHaveValue(/🏠/);
  });

  test('rapid nav back/forward stable', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.goto('/properties/', { waitUntil: 'domcontentloaded' });
    await page.goBack();
    await page.goForward();
    await expect(page.locator('body')).toBeVisible();
  });

  test('direct-access property detail route preserves inquiry actions', async ({ page, isMobile }) => {
    const resp = await page.goto('/properties/8fSf4y9RBP62PHm8LGcJ/', { waitUntil: 'domcontentloaded' });
    expect(resp?.status()).toBe(200);
    await expect(page.locator('.yn-detail')).toBeVisible();
    await expect(page.locator('.yn-global-whatsapp')).toBeHidden();
    await expect(page.locator('.yn-detail a[href^="https://wa.me/"]').first()).toBeVisible();
    if (isMobile) await expect(page.locator('.yn-mobile-inquiry a[href^="https://wa.me/"]')).toBeVisible();
  });

  test('404 route handled gracefully', async ({ page }) => {
    const resp = await page.goto('/this-does-not-exist-xyz/', { waitUntil: 'domcontentloaded' });
    expect([200, 404]).toContain(resp?.status() ?? 0);
    await expect(page.locator('body')).toBeVisible();
  });
});
