/**
 * Smoke tests - Quick validation that app is working.
 */

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');

    // Check for navigation elements
    const nav = await page.locator('nav').isVisible().catch(() => false);
    const header = await page.locator('header').isVisible().catch(() => false);

    expect(nav || header).toBeTruthy();
  });

  test('no critical console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toEqual([]);
  });
});
