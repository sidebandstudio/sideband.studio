import { defineConfig, devices } from '@playwright/test'

// PLAYWRIGHT_PORT lets parallel checkouts run the suite without sharing a server.
const PORT = process.env.PLAYWRIGHT_PORT ?? '3005'

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
  },
  // CI has already run `next build`, so test the production server there. The
  // dev server compiles routes on demand and can do a Fast Refresh full reload
  // mid-test, which made the homepage navigation smoke test flaky.
  webServer: {
    command: process.env.CI
      ? `npm run start -- --port ${PORT}`
      : `npm run dev -- --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
