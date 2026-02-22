import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Support Form', () => {
  test('renders form with all fields', async ({ page }) => {
    await page.goto('/support');
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Subject')).toBeVisible();
    await expect(page.getByLabel('Message')).toBeVisible();
    await expect(page.getByRole('button', { name: /Send Message/i })).toBeVisible();
  });

  test('shows validation errors for empty submission', async ({ page }) => {
    await page.goto('/support');
    await page.getByRole('button', { name: /Send Message/i }).click();
    await expect(page.getByText(/Please fix the errors/i)).toBeVisible();
  });

  test('marks required fields as invalid on empty submit', async ({ page }) => {
    await page.goto('/support');
    await page.getByRole('button', { name: /Send Message/i }).click();
    const nameInput = page.getByLabel('Name');
    await expect(nameInput).toHaveClass(/invalid/);
  });

  test('accessibility audit passes', async ({ page }) => {
    await page.goto('/support');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('visual regression — empty form', async ({ page }) => {
    await page.goto('/support');
    await expect(page).toHaveScreenshot('support-empty.png');
  });

  test('visual regression — validation errors', async ({ page }) => {
    await page.goto('/support');
    await page.getByRole('button', { name: /Send Message/i }).click();
    await expect(page).toHaveScreenshot('support-validation.png');
  });
});
