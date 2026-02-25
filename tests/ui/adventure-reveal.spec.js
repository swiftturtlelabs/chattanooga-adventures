import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Adventure Reveal Page', () => {
  test('shows teaser and reveal button for valid URL', async ({ page }) => {
    await page.goto('/adventure?box=original&adventure=1');
    await expect(page.getByRole('heading', { name: /Your Next Adventure Awaits/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Reveal My Adventure/i })).toBeVisible();
  });

  test('shows error for invalid URL with missing params', async ({ page }) => {
    await page.goto('/adventure');
    await expect(page.getByText(/Invalid adventure link/i)).toBeVisible();
  });

  test('reveal button shows loading state on click', async ({ page }) => {
    await page.route('**/firestore.googleapis.com/**', (route) => route.abort());
    await page.goto('/adventure?box=original&adventure=1');
    const btn = page.getByRole('button', { name: /Reveal My Adventure/i });
    await expect(btn).toBeVisible();
    await btn.click({ force: true });
    await expect(page.getByRole('button', { name: /Loading/i })).toBeDisabled();
  });

  test('accessibility audit — teaser state', async ({ page }) => {
    await page.goto('/adventure?box=original&adventure=1');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('accessibility audit — error state', async ({ page }) => {
    await page.goto('/adventure');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('visual regression — teaser', { tag: '@vrt' }, async ({ page }) => {
    test.skip(!!process.env.CI, 'No baseline snapshots for Linux CI');
    await page.goto('/adventure?box=original&adventure=1');
    await expect(page).toHaveScreenshot('adventure-teaser.png');
  });

  test('visual regression — error', { tag: '@vrt' }, async ({ page }) => {
    test.skip(!!process.env.CI, 'No baseline snapshots for Linux CI');
    await page.goto('/adventure');
    await expect(page).toHaveScreenshot('adventure-error.png');
  });
});
