import { defineConfig, devices } from "@playwright/test";
import { ENV } from "./utils/env";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,

  forbidOnly: isCI,

  retries: isCI ? 2 : 0,

  workers: isCI ? 1 : undefined,

  timeout: 60 * 1000,

  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]],

  use: {
    baseURL: ENV.BASE_URL,

    headless: isCI,

    trace: "on-first-retry",

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    launchOptions: {
      slowMo: isCI ? 0 : 200,
    },
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },

    // AUTH TESTS (LOGIN)
    {
      name: "auth-chromium",
      testMatch: /.*login\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: undefined,
      },
    },
    {
      name: "auth-firefox",
      testMatch: /.*login\.spec\.ts/,
      use: {
        ...devices["Desktop Firefox"],
        storageState: undefined,
      },
    },
    {
      name: "auth-webkit",
      testMatch: /.*login\.spec\.ts/,
      use: {
        ...devices["Desktop Safari"],
        storageState: undefined,
      },
    },

    // E2E TESTS (POST, FEATURES,...)
    {
      name: "chromium",
      testIgnore: /.*login\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "firefox",
      testIgnore: /.*login\.spec\.ts/,
      use: {
        ...devices["Desktop Firefox"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "webkit",
      testIgnore: /.*login\.spec\.ts/,
      use: {
        ...devices["Desktop Safari"],
        storageState: "playwright/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
});
