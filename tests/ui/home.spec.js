import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Home Page', () => {
  test('renders hero section with title and subtitle', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Explore the Scenic City/i })).toBeVisible();
    await expect(page.locator('.hero').getByText(/box of adventure cards/i)).toBeVisible();
  });

  test('renders about section', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /What is Chattanooga Adventures/i }),
    ).toBeVisible();
  });

  test('renders where to buy section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Where to Buy/i })).toBeVisible();
  });

  test('navigation link to support works', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: /Support/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/support/);
  });

  test('accessibility audit passes', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('visual regression — mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot('home-mobile.png');
  });

  test('visual regression — desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot('home-desktop.png');
  });
});
