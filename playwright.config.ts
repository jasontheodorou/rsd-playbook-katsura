import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3019',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chromium' } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: 'npm run dev', reuseExistingServer: true, url: 'http://localhost:3019' },
})
