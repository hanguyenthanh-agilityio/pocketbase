import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { ENV } from "../../utils/env";

setup("authenticate", async ({ page }) => {
  const login = new LoginPage(page);

  // Navigate to demo page
  await login.goto();

  // Login
  await login.login(ENV.EMAIL, ENV.PASSWORD);

  const frame = login.frame;

  // Wait for dashboard to load
  await expect(frame.locator("text=Collections")).toBeVisible();

  await expect(frame.locator('button:has-text("New record")')).toBeVisible();

  // Save session
  await page.context().storageState({
    path: "playwright/.auth/user.json",
  });
});
