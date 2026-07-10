import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://127.0.0.1:41730",
    trace: "on-first-retry",
  },
  webServer: {
    command: process.env.PLAYWRIGHT_SKIP_BUILD
      ? "npm run preview -- --port 41730 --strictPort"
      : "npm run build && npm run preview -- --port 41730 --strictPort",
    url: "http://127.0.0.1:41730",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
