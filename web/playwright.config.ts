import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './generated-tests/e2e',
  outputDir: './test-results/artifacts',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  retries: 0,
  reporter: [
    ['json', { outputFile: 'test-results/results.json' }],
    ['html', { outputFolder: 'test-results/html', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    // Set PLAYWRIGHT_CHANNEL=chrome to use an installed Chrome browser.
    channel: process.env.PLAYWRIGHT_CHANNEL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
  timeout: 30 * 1000,
  globalTimeout: 10 * 60 * 1000,
});
