---
name: testing-workflow
description: Guide for writing and maintaining tests for Chattanooga Adventures. Use when creating test files, modifying tests, adding test coverage, or when the user asks about testing, test setup, or quality checks.
---

# Testing Workflow

## Unit Tests (Vitest)

**Location:** `tests/unit/*.test.js`
**Coverage target:** 80% line coverage (enforced in `vitest.config.js` via `@vitest/coverage-v8`)

### What to test directly

- URL query param parsing (`getAdventureParams`)
- Data validation and transformation functions
- Easter egg tap counter logic (threshold, timeout, reset)
- Any pure function that takes input and returns output

### What to mock

- Firestore SDK (`getDoc`, `getDocs`, `collection`, `doc`) -- mock the Firebase module, return controlled data
- DOM APIs when testing logic that reads/writes the DOM -- use `jsdom` environment in Vitest
- `window.location` for navigation tests

### Pattern

```javascript
import { describe, it, expect, vi } from 'vitest';

describe('functionName', () => {
  it('handles the happy path', () => {
    const result = functionUnderTest(validInput);
    expect(result).toEqual(expectedOutput);
  });

  it('handles missing input', () => {
    expect(() => functionUnderTest(null)).toThrow();
  });

  it('handles malformed input', () => {
    const result = functionUnderTest(garbageInput);
    expect(result).toBeNull();
  });
});
```

Always include: happy path, missing input, malformed input, and edge cases.

## UI Tests (Playwright)

**Location:** `tests/ui/*.spec.js`
**Browsers:** Chromium, Firefox, WebKit (configured in `playwright.config.js` `projects` array)

### Spec template

Every UI spec must include three things: functional assertions, an axe-core a11y audit, and visual regression snapshots.

```javascript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Page Name', () => {
  test('functional behavior', async ({ page }) => {
    await page.goto('/page-url');
    // Functional assertions using accessible locators
    await expect(page.getByRole('heading', { name: 'Expected Title' })).toBeVisible();
    await page.getByRole('button', { name: 'Action' }).click();
    await expect(page.getByText('Expected result')).toBeVisible();
  });

  test('accessibility audit', async ({ page }) => {
    await page.goto('/page-url');
    // Reach the primary interactive state first
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('visual regression', async ({ page }) => {
    await page.goto('/page-url');
    await expect(page).toHaveScreenshot('page-state.png');
  });
});
```

### Locator strategy

Always prefer accessible locators over CSS selectors:

| Prefer | Avoid |
|--------|-------|
| `page.getByRole('button', { name: 'Reveal' })` | `page.locator('.btn-reveal')` |
| `page.getByLabel('Email')` | `page.locator('#email-input')` |
| `page.getByText('Your adventure')` | `page.locator('.adventure-text')` |

### Visual regression snapshots

Capture these key states:

- **Adventure page:** teaser, revealed, error
- **Home page:** hero at mobile (375px) and desktop (1280px) widths
- **Support form:** empty, validation errors, success
- **Secret page:** tile grid at mobile and desktop widths

Update baselines intentionally: `npx playwright test --update-snapshots`

## API and Security Rules Tests

**Location:** `tests/api/*.test.js`

### Firestore read tests

Test both positive and negative paths:

- Valid box + adventure ID returns expected data shape (`title`, `description` fields)
- Nonexistent box ID returns null/undefined (not a crash)
- Nonexistent adventure ID within a valid box returns null/undefined
- Malformed document IDs are handled gracefully

### Firestore security rules tests

Use `@firebase/rules-unit-testing` with the Firebase emulator:

```javascript
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';

// Verify reads succeed for unauthenticated users
await assertSucceeds(unauthedDb.collection('boxes').doc('original').get());

// Verify writes are denied for all users
await assertFails(unauthedDb.collection('boxes').doc('test').set({ name: 'hack' }));
await assertFails(authedDb.collection('boxes').doc('test').set({ name: 'hack' }));
```

Test: unauthenticated reads allowed, all writes denied (even authenticated), subcollection access rules.

## Local Quality Check

Run before pushing to verify everything passes locally:

```powershell
npx eslint . --ext .js
npx prettier --check "**/*.{js,css,html,json}"
npx html-validate "*.html"
npx vitest run --coverage
npx playwright test
```

## Config File Reference

| File | Purpose |
|------|---------|
| `vitest.config.js` | Unit test runner, coverage thresholds, jsdom environment |
| `playwright.config.js` | Browser matrix (Chromium/Firefox/WebKit), base URL, screenshot settings |
| `lighthouserc.json` | Lighthouse CI score thresholds (Perf 90, A11y 95, BP 90, SEO 90) |
| `.eslintrc.json` | ESLint rules (`eslint:recommended` + compat plugin) |
| `.prettierrc` | Formatting rules |
