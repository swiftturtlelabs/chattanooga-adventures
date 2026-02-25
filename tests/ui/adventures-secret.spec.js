import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Secret Adventures Page', () => {
  test('Easter egg — 7 rapid clicks on site title navigates to adventures', async ({ page }) => {
    await page.goto('/');
    const title = page.getByRole('link', { name: 'Chattanooga Adventures' }).first();

    for (let i = 0; i < 7; i++) {
      await title.click({ delay: 50 });
    }

    await page.waitForURL(/\/adventures/, { timeout: 3000 });
    await expect(page).toHaveURL(/\/adventures/);
  });

  test('renders page heading when accessed directly', async ({ page }) => {
    await page.goto('/adventures');
    await expect(page.getByRole('heading', { name: /All Adventures/i })).toBeVisible();
  });

  test('accessibility audit passes', async ({ page }) => {
    await page.goto('/adventures');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('visual regression — mobile', { tag: '@vrt' }, async ({ page }) => {
    test.skip(!!process.env.CI, 'No baseline snapshots for Linux CI');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/adventures');
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot('adventures-mobile.png');
  });

  test('visual regression — desktop', { tag: '@vrt' }, async ({ page }) => {
    test.skip(!!process.env.CI, 'No baseline snapshots for Linux CI');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/adventures');
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot('adventures-desktop.png');
  });
});
