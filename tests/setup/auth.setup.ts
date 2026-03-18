import { test as setup, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import { ENV } from "../../utils/env";

setup("authenticate", async ({ page }) => {
  const login = new LoginPage(page);

  // Navigate to login page
  await login.goto();

  // Login
  await login.login(ENV.EMAIL, ENV.PASSWORD);

  // Wait until dashboard loads
  await page.waitForLoadState("networkidle");

  // Verify login success
  // 1️⃣ Check URL contains '/admin'
  await expect(page).toHaveURL(/\/admin/);

  // 2️⃣ Check an element unique in dashboard
  await expect(page.locator("text=Posts")).toBeVisible();

  // Save session
  await page.context().storageState({
    path: "playwright/.auth/user.json",
  });
});
