import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['js/**/*.js'],
      exclude: ['js/firebase-config.js'],
      /* Pure-logic functions are unit-tested here; DOM code is covered by
         Playwright UI tests. Thresholds reflect unit-testable code only. */
      thresholds: {
        lines: 25,
        functions: 30,
        branches: 50,
        statements: 25,
      },
    },
  },
});
