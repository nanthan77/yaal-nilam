import { test, expect } from '@playwright/test';

const unavailableId = 'qa-unavailable-20260930';
const productionHost = process.env.BASE_URL || '';

test.describe('Production Hosting routes and honest empty catalog', () => {
  test.skip(process.env.LOCAL_EMULATOR_UI === '1', 'Development fixtures cannot verify production inventory behavior.');
  test.skip(!/^http:\/\/(?:127\.0\.0\.1|localhost):4183\/?$/.test(productionHost), 'Run only against the local production Firebase Hosting export on port 4183.');

  for (const locale of ['ta', 'en'] as const) {
    test.describe(locale, () => {
      test.beforeEach(async ({ page }) => {
        await page.addInitScript((preferredLocale) => {
          localStorage.setItem('yaal-nilam-public-store', JSON.stringify({ state: { locale: preferredLocale, compareIds: [] }, version: 0 }));
        }, locale);
      });

      for (const route of [
        `/properties/${unavailableId}/`,
        `/properties/view/?id=${unavailableId}`,
        `/property/view/?id=${unavailableId}`,
      ]) {
        test(`${route} shows unavailable details without an inquiry form`, async ({ page }) => {
          const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
          expect(response?.status()).toBe(200);
          await expect(page.getByRole('heading', {
            name: locale === 'ta' ? 'சொத்து தற்போது கிடைக்கவில்லை' : 'Property currently unavailable', exact: true,
          })).toBeVisible({ timeout: 20000 });
          await expect(page.locator('html')).toHaveAttribute('lang', `${locale}-LK`);
          await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://yaalnilam.com/properties/${unavailableId}/`);
          await expect(page.locator('.yn-detail')).toHaveCount(0);
          await expect(page.locator('#viewing-request')).toHaveCount(0);
          await expect(page.locator('main form')).toHaveCount(0);
          await expect(page.locator('main')).not.toContainText('[DEVELOPMENT SAMPLE]');
        });
      }

      test('bare property shell returns to listing search', async ({ page }) => {
        await page.goto('/properties/view/', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/\/properties\/$/);
        await expect(page.locator('#property-search')).toBeVisible();
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://yaalnilam.com/properties/');
      });

      test('historical seed redirect cannot restore sample availability', async ({ page }) => {
        await page.goto('/properties/8fSf4y9RBP62PHm8LGcJ/', { waitUntil: 'domcontentloaded' });
        await expect(page).toHaveURL(/\/properties\/nallur-house-4-bed-38-perch-yn-m8lgcj\/$/);
        await expect(page.getByRole('heading', {
          name: locale === 'ta' ? 'சொத்து தற்போது கிடைக்கவில்லை' : 'Property currently unavailable', exact: true,
        })).toBeVisible({ timeout: 20000 });
        await expect(page.locator('.yn-detail')).toHaveCount(0);
        await expect(page.locator('#viewing-request')).toHaveCount(0);
      });

      test('asking-price guide does not synthesize averages from static area ranges', async ({ page }) => {
        await page.goto('/price-index/', { waitUntil: 'domcontentloaded' });
        await expect(page.getByRole('heading', {
          name: locale === 'ta' ? 'யாழ்ப்பாண சொத்து கேட்கும் விலைகள்' : 'Jaffna property asking prices', exact: true,
        })).toBeVisible();
        await expect(page.locator('main [role="status"]')).toHaveText(locale === 'ta'
          ? 'தற்போதைய பட்டியல்கள் இல்லாததால் விலைத் தகவல் கிடைக்கவில்லை.'
          : 'There are no current listings to calculate asking prices from.', { timeout: 20000 });
        await expect(page.locator('main a[href^="/areas/"]')).toHaveCount(0);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://yaalnilam.com/price-index/');
        await expect(page.locator('main')).not.toContainText(/average market prices|price estimates|மதிப்பீட்டு விலைகள்/i);
      });
    });
  }

  test('account and submission exports have their own canonicals and noindex metadata', async ({ request }) => {
    for (const route of ['/login/', '/register/', '/dashboard/', '/add-listing/', '/list-property/', '/request-property/']) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      const html = await response.text();
      const canonical = html.match(/<link\b(?=[^>]*\brel="canonical")(?=[^>]*\bhref="([^"]+)")[^>]*>/)?.[1];
      const robots = html.match(/<meta\b(?=[^>]*\bname="robots")(?=[^>]*\bcontent="([^"]+)")[^>]*>/)?.[1];
      expect(canonical, route).toBe(`https://yaalnilam.com${route}`);
      expect(robots, route).toMatch(/\bnoindex\b/);
      expect(response.headers()['x-robots-tag'], route).toMatch(/\bnoindex\b/);
    }
  });
});
