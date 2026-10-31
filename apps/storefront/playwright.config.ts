import { defineConfig, devices } from "@playwright/test"

const port = 3100
const isCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      // CI installs Chromium with `playwright install`. Locally, set PLAYWRIGHT_CHANNEL
      // (for example "msedge" or "chrome") to reuse a browser that is already installed.
      use: { ...devices["Desktop Chrome"], channel: process.env.PLAYWRIGHT_CHANNEL || undefined },
    },
  ],
  webServer: {
    command: "pnpm build && node .output/server/index.mjs",
    url: `http://localhost:${port}`,
    reuseExistingServer: !isCI,
    timeout: 180_000,
    env: {
      PORT: String(port),
      NODE_ENV: "production",
      NUXT_PUBLIC_API_URL: "https://api.test",
      NUXT_PUBLIC_PUBLISHABLE_KEY: "pk_e2e",
      NUXT_PUBLIC_APP_ENV: "preview",
      // The E2E build includes the sample catalog and reads from it.
      NUXT_INCLUDE_MOCKS: "1",
      NUXT_PUBLIC_DATA_SOURCE: "mock",
    },
  },
})
