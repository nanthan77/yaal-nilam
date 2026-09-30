import { test, expect, type Page, type Locator, type APIRequestContext } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const enabled = process.env.LOCAL_EMULATOR_UI === '1';
const shots = process.env.LOCAL_UI_SCREENSHOTS || path.resolve(process.cwd(), 'test-results', 'local-listing-screenshots');
const emulatorOrigin = 'http://127.0.0.1:8180';
const emulatorDocuments = '/v1/projects/demo-yaal-nilam/databases/(default)/documents';
const fixturePath = '/properties/prop-001/';
const viewports = [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
];

test.describe('Local listing experience — explicit development samples and demo emulator only', () => {
  test.skip(!enabled, 'Opt in with LOCAL_EMULATOR_UI=1 against the isolated local demo emulator.');
  test.setTimeout(90000);

  test.beforeEach(async ({ page, baseURL }) => {
    const origin = new URL(baseURL || '');
    expect(['localhost', '127.0.0.1']).toContain(origin.hostname);
    expect(origin.port).toBe('4175');
    // An accidental click cannot navigate to the real WhatsApp assistant.
    await page.route('https://wa.me/**', (route) => route.abort());
    await page.route('**/firestore.googleapis.com/**', (route) => route.abort());
    await mkdir(shots, { recursive: true });
  });

  for (const viewport of viewports) {
    for (const language of ['ta', 'en'] as const) {
      test(`${language} homepage, results and detail fit ${viewport.width}×${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await openHome(page, language);
        await expect(page.locator('.yn-home')).toContainText('DEVELOPMENT PREVIEW');
        const card = page.locator('#featured .yn-listing-card').filter({ has: page.locator(`h3 a[href="${fixturePath}"]`) });
        await expect(card).toBeVisible();
        await expect(card).toContainText('Development sample');
        await assertNoOverflow(page);
        await assertTarget(card.getByRole('button', { name: language === 'en' ? 'Save property' : 'சொத்தைச் சேமிக்கவும்', exact: true }));
        await assertTarget(card.getByRole('button', { name: language === 'en' ? 'Share this property' : 'இந்தச் சொத்தைப் பகிருங்கள்', exact: true }));
        await assertTarget(card.getByRole('button', { name: language === 'en' ? 'Compare' : 'ஒப்பிடு', exact: true }));
        expect(await card.locator('a[href*="wa.me"]').count()).toBe(0);
        if (viewport.width === 1440 && language === 'en') await page.screenshot({ path: path.join(shots, 'home-desktop-en.png') });
        if (viewport.width === 390 && language === 'ta') await page.screenshot({ path: path.join(shots, 'home-mobile-ta.png') });

        await page.goto('/properties/?intent=sell&type=villa&area=jaffna-fort&q=Modern', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#property-search')).toHaveValue('Modern');
        await expect(page.locator('#filter-intent')).toHaveValue('sell');
        await expect(page.locator('#filter-selectedType')).toHaveValue('villa');
        await expect(page.locator('#filter-selectedArea')).toHaveValue('jaffna-fort');
        await expect(page.locator('.yn-listing-card')).toHaveCount(1);
        await assertNoOverflow(page);
        await expect(page.getByRole('link', { name: language === 'en' ? 'Map view' : 'வரைபடக் காட்சி', exact: true })).toHaveAttribute('href', /area=jaffna-fort/);

        await page.locator(`.yn-listing-card h3 a[href="${fixturePath}"]`).click();
        await expect(page.locator('.yn-detail h1')).toContainText(language === 'en' ? 'Modern Villa in Jaffna Fort' : 'யாழ் கோட்டையில் நவீன வில்லா', { timeout: 15000 });
        await expect(page.locator('.yn-detail')).toContainText('Development sample');
        await expect(page.locator('.yn-detail a[href*="wa.me"]')).toHaveCount(0);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://yaalnilam.com/properties/prop-001/');
        await assertNoOverflow(page);
        await assertTarget(page.getByRole('button', { name: language === 'en' ? 'View fullscreen' : 'முழுத் திரையில் பார்க்கவும்', exact: true }));
        const inquiry = page.locator('.yn-mobile-inquiry');
        if (viewport.width < 1024) {
          await expect(inquiry).toBeVisible();
          const bar = await inquiry.boundingBox();
          expect(bar).not.toBeNull();
          expect(bar!.y + bar!.height).toBeCloseTo(viewport.height, 0);
          expect(bar!.height).toBeLessThan(150);
          await assertTarget(inquiry.locator('a[href="#viewing-request"]'));
          await inquiry.locator('a[href="#viewing-request"]').click();
          await expect(page.locator('#viewing-name')).toBeVisible();
          const headerBottom = await page.locator('.yn-site-header').evaluate((element) => element.getBoundingClientRect().bottom);
          const formTop = await page.locator('#viewing-request').evaluate((element) => element.getBoundingClientRect().top);
          expect(formTop).toBeGreaterThanOrEqual(headerBottom - 2);
          await page.evaluate(() => window.scrollTo(0, 0));
        } else {
          await expect(inquiry).toBeHidden();
        }
        if (viewport.width === 1440 && language === 'en') await page.screenshot({ path: path.join(shots, 'detail-desktop-en.png') });
        if (viewport.width === 390 && language === 'ta') await page.screenshot({ path: path.join(shots, 'detail-mobile-ta.png') });
        await page.getByRole('button', { name: language === 'en' ? 'View fullscreen' : 'முழுத் திரையில் பார்க்கவும்', exact: true }).click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await assertNoOverflow(page);
        if (viewport.width === 1440 && language === 'en') await page.screenshot({ path: path.join(shots, 'gallery-desktop-en.png') });
        if (viewport.width === 390 && language === 'ta') await page.screenshot({ path: path.join(shots, 'gallery-mobile-ta.png') });
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toBeHidden();
      });
    }
  }

  test('save, compare, share and gallery keyboard controls preserve the listing journey', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    // Exercise the browser fallback when a native share sheet is unavailable.
    await page.addInitScript(() => Object.defineProperty(navigator, 'share', { value: undefined, configurable: true }));
    await openHome(page, 'en');
    const card = page.locator('#featured .yn-listing-card').filter({ has: page.locator(`h3 a[href="${fixturePath}"]`) });
    const save = card.getByRole('button', { name: 'Save property', exact: true });
    await save.click();
    await expect(card.getByRole('button', { name: 'Remove saved property', exact: true })).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('yaal-nilam-saved-properties') || '[]'))).toContain('prop-001');
    await card.getByRole('button', { name: 'Compare', exact: true }).click();
    await expect(card.getByRole('button', { name: /Compare/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.yn-compare-bar')).toContainText('1');
    const share = card.getByRole('button', { name: 'Share this property', exact: true });
    await share.click();
    const shareGroup = card.getByRole('group', { name: 'Share options' });
    await expect(shareGroup).toBeVisible();
    const facebook = await shareGroup.getByRole('link', { name: 'Facebook', exact: true }).getAttribute('href');
    expect(new URL(facebook!).searchParams.get('u')).toBe('https://yaalnilam.com/properties/prop-001/');
    for (const link of await page.locator('a[target="_blank"]').all()) await expect(link).toHaveAttribute('rel', /noopener/);
    await page.keyboard.press('Escape');
    await expect(share).toBeFocused();

    await card.locator('h3 a').click();
    await expect(page.locator('.yn-detail h1')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
    const opener = page.getByRole('button', { name: 'View fullscreen', exact: true });
    await opener.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('Photo 1 / 2');
    await expect(dialog.getByRole('button', { name: 'Close photos', exact: true })).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(dialog).toContainText('Photo 2 / 2');
    await page.keyboard.press('ArrowLeft');
    await expect(dialog).toContainText('Photo 1 / 2');
    await page.keyboard.press('Shift+Tab');
    await expect(dialog.getByRole('button', { name: 'Next photo', exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dialog.getByRole('button', { name: 'Close photos', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(page.locator('.yn-detail')).not.toContainText('30-Year Deed History Verified');
    await expect(page.locator('.yn-detail')).not.toContainText('Survey Plan on Record');
    await expect(page.locator('.yn-detail')).toContainText('Details not supplied');
    const related = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Similar Properties', exact: true }) });
    const relatedLink = related.locator('h3 a[href="/properties/prop-demo-related-jaffna-fort/"]');
    await expect(relatedLink).toBeVisible();
    await expect(related).toContainText('Development sample');
    await relatedLink.click();
    await expect(page.locator('.yn-detail h1')).toContainText('Related villa layout sample');
    await expect(page.locator('.yn-detail a[href*="wa.me"]')).toHaveCount(0);
  });

  test('native share receives the canonical property URL without opening an external app', async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (data: ShareData) => { (window as Window & { __nativeShare?: ShareData }).__nativeShare = data; },
    }));
    await openHome(page, 'en');
    const card = page.locator('#featured .yn-listing-card').filter({ has: page.locator(`h3 a[href="${fixturePath}"]`) });
    await card.getByRole('button', { name: 'Share this property', exact: true }).click();
    await expect.poll(() => page.evaluate(() => (window as Window & { __nativeShare?: ShareData }).__nativeShare?.url)).toBe('https://yaalnilam.com/properties/prop-001/');
  });

  test('the supplied land size and price survive card navigation and currency changes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openHome(page, 'en');
    await page.goto('/properties/?type=land&area=point-pedro', { waitUntil: 'domcontentloaded' });
    const card = page.locator('.yn-listing-card');
    await expect(card).toHaveCount(1);
    await expect(card).toContainText('25 perch');
    await expect(card).toContainText('lacham');
    await card.locator('h3 a').click();
    const summary = page.getByRole('complementary', { name: 'Price and inquiry', exact: true });
    await expect(summary).toContainText('LKR 55,000,000', { timeout: 15000 });
    await expect(summary).toContainText('25 perches');
    await expect(page.getByRole('region', { name: 'Property facts', exact: true })).toContainText('25 perches');
    const currencies = summary.getByRole('group', { name: 'Currency', exact: true });
    await currencies.getByRole('button', { name: 'CAD', exact: true }).click();
    await expect(currencies.getByRole('button', { name: 'CAD', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(summary.locator('p').nth(1)).toHaveText('$244,444');
    await expect(summary).toContainText('Approximate converted values for overseas buyers');
    await currencies.getByRole('button', { name: 'LKR', exact: true }).click();
    await expect(summary.locator('p').nth(1)).toHaveText('LKR 55,000,000');
    await assertNoOverflow(page);
  });

  test('mobile filters apply, clear and Enter return visitors to the current results', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openHome(page, 'en');
    await page.goto('/properties/', { waitUntil: 'domcontentloaded' });
    const filters = page.getByRole('button', { name: 'Filters', exact: true });
    await filters.click();
    await expect(filters).toHaveAttribute('aria-expanded', 'true');
    await page.locator('#filter-selectedType').selectOption('land');
    await page.locator('#filter-selectedArea').selectOption('point-pedro');
    await expect(page.locator('.yn-listing-card')).toHaveCount(1);
    await assertNoOverflow(page);
    await page.getByRole('button', { name: 'Show results', exact: true }).click();
    await expect(page.locator('#property-results-heading')).toBeFocused();
    await expect(page.locator('#property-filter-panel')).toBeHidden();
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await expect(page.locator('.yn-listing-card')).toHaveCount(8);
    await page.locator('#property-search').fill('Nallur');
    await page.locator('#property-search').press('Enter');
    await expect(page.locator('.yn-listing-card')).toHaveCount(1);
    await expect(page.locator('#property-results-heading')).toBeFocused();
  });

  test('gallery photo failure offers a working retry without a substitute listing photo', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openHome(page, 'en');
    await page.route('**/properties/villa_modern.webp', (route) => route.abort());
    await page.goto(fixturePath, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('This photo could not be loaded.', { exact: true })).toBeVisible();
    await page.unroute('**/properties/villa_modern.webp');
    await page.getByRole('button', { name: 'Try again', exact: true }).click();
    await expect(page.getByText('This photo could not be loaded.', { exact: true })).toHaveCount(0);
    const image = page.locator('.yn-detail img').first();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  });

  test('mobile gallery swipe advances the photo without opening fullscreen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openHome(page, 'en');
    await page.goto(fixturePath, { waitUntil: 'domcontentloaded' });
    const gallery = page.getByRole('region', { name: 'Property photos', exact: true });
    const photo = gallery.getByRole('button', { name: 'View fullscreen', exact: true });
    await photo.scrollIntoViewIfNeeded();
    const bounds = (await photo.boundingBox())!;
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
    const y = bounds.y + bounds.height / 2;
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: bounds.x + bounds.width * 0.8, y }] });
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: bounds.x + bounds.width * 0.2, y }] });
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(gallery.getByRole('status')).toHaveText('2 / 2');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await client.detach();
  });

  test('one valid viewing request creates both expected lead records in the demo emulator', async ({ page, request }) => {
    const beforeViews = await readCollection(request, 'viewing_requests');
    const beforeInquiries = await readCollection(request, 'inquiries');
    await page.setViewportSize({ width: 390, height: 844 });
    await openHome(page, 'en');
    await page.goto(fixturePath, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#viewing-name')).toBeEnabled();
    await page.locator('#viewing-name').fill('Local UI Test');
    await page.locator('#viewing-phone').fill('0700000000');
    await page.locator('#viewing-email').fill('ui-test@example.invalid');
    await page.locator('#viewing-notes').fill('Local UI redesign verification 2026-09-30');
    await page.getByRole('button', { name: 'Send Viewing Request', exact: true }).click();
    await expect(page.getByText('Viewing request submitted. Our team will follow up shortly.', { exact: true })).toBeVisible();
    const views = await readCollection(request, 'viewing_requests');
    const inquiries = await readCollection(request, 'inquiries');
    expect(views.length).toBe(beforeViews.length + 1);
    expect(inquiries.length).toBe(beforeInquiries.length + 1);
    const view = views.find((item) => !beforeViews.some((before) => before.name === item.name));
    const inquiry = inquiries.find((item) => !beforeInquiries.some((before) => before.name === item.name));
    expect(view?.fields.customer_name.stringValue).toBe('Local UI Test');
    expect(view?.fields.listing_id.stringValue).toBe('prop-001');
    expect(view?.fields.notify_email.stringValue).toBe('info@yaalnilam.com');
    expect(inquiry?.fields.source.stringValue).toBe('viewing_request');
    expect(inquiry?.fields.listing_id.stringValue).toBe('prop-001');
    expect(inquiry?.fields.email.stringValue).toBe('ui-test@example.invalid');
    await test.info().attach('local-viewing-proof', { body: JSON.stringify({ emulatorOrigin, project: 'demo-yaal-nilam', viewingRequestsBefore: beforeViews.length, viewingRequestsAfter: views.length, inquiriesBefore: beforeInquiries.length, inquiriesAfter: inquiries.length, viewingPath: view?.name, inquiryPath: inquiry?.name }, null, 2), contentType: 'application/json' });
  });
});

async function openHome(page: Page, language: 'ta' | 'en') {
  await page.addInitScript((preferredLanguage) => {
    if (!localStorage.getItem('yaal-nilam-public-store')) {
      localStorage.setItem('yaal-nilam-public-store', JSON.stringify({ state: { locale: preferredLanguage, compareIds: [] }, version: 2 }));
    }
  }, language);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('lang', `${language}-LK`);
  await expect(page.locator('#featured .yn-listing-card').first()).toBeVisible();
}

async function assertNoOverflow(page: Page) {
  const size = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth }));
  expect(size.document).toBeLessThanOrEqual(size.viewport + 1);
}

async function assertTarget(control: Locator) {
  const bounds = await control.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.width).toBeGreaterThanOrEqual(44);
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
}

async function readCollection(request: APIRequestContext, collection: 'viewing_requests' | 'inquiries'): Promise<any[]> {
  // The emulator's local owner token is accepted only at this fixed loopback URL.
  const response = await request.get(`${emulatorOrigin}${emulatorDocuments}/${collection}?pageSize=100`, { headers: { Authorization: 'Bearer owner' } });
  expect(response.status()).toBe(200);
  return (await response.json()).documents || [];
}
