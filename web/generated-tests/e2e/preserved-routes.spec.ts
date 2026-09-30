import { test, expect } from '@playwright/test';

const restoredRoutes = [
  '/new-today/', '/diaspora/', '/diaspora/power-of-attorney-guide/',
  '/lands/clear-title-lands-jaffna/', '/real-estate/', '/real-estate/jaffna/', '/safety/',
];

for (const locale of ['ta', 'en'] as const) {
  test(`preserved public routes have canonical URLs and fit the viewport in ${locale}`, async ({ page }) => {
    test.setTimeout(60000);
    await page.addInitScript((preferredLocale) => {
      localStorage.setItem('yaal-nilam-public-store', JSON.stringify({ state: { locale: preferredLocale, compareIds: [] }, version: 0 }));
    }, locale);
    const viewport = page.viewportSize()!;
    for (const route of restoredRoutes) {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), route).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', `${locale}-LK`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://yaalnilam.com${route}`);
      await page.evaluate(() => document.fonts.ready);
      for (const width of [320, viewport.width]) {
        await page.setViewportSize({ ...viewport, width });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${route} overflows at ${width}px`).toBeTruthy();
      }
      await expect(page.locator('main')).not.toContainText('[DEVELOPMENT SAMPLE]');
    }
  });
}

test('management packages preserve selection, fees, validation and WhatsApp details', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('yaal-nilam-public-store', JSON.stringify({ state: { locale: 'en', compareIds: [] }, version: 0 }));
  });
  await page.goto('/diaspora/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-LK');
  await page.getByRole('button', { name: 'LKR', exact: true }).first().click();
  await expect(page.getByText('Rs. 18,500', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Select This Package', exact: true }).nth(1).click();
  await expect(page.locator('#management-package')).toHaveValue('full');
  await expect(page.locator('#management-name')).toBeFocused();
  const form = page.locator('#enquire-form form');
  expect(await form.evaluate((element) => (element as HTMLFormElement).checkValidity())).toBe(false);
  await page.getByLabel('Your Full Name *', { exact: true }).fill('Local browser QA');
  await page.getByLabel('WhatsApp Number *', { exact: true }).fill('+94000000000');
  await page.getByLabel('Jaffna Property Location *', { exact: true }).fill('Nallur local test');
  await page.getByLabel('Additional Notes / Specific Requirements', { exact: true }).fill('Local test only');
  expect(await form.evaluate((element) => (element as HTMLFormElement).checkValidity())).toBe(true);
  const href = await form.getByRole('link', { name: 'WhatsApp', exact: true }).getAttribute('href');
  const whatsapp = new URL(href!);
  expect(whatsapp.hostname).toBe('wa.me');
  expect(whatsapp.searchParams.get('text')).toContain('FULL Management Package');
  expect(whatsapp.searchParams.get('text')).toContain('Nallur local test');
  expect(whatsapp.searchParams.get('text')).toContain('Local test only');
  // Production browser checks stop before submitting a lead.
});
