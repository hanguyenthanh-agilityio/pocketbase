import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

test.describe("PocketBase Login", () => {
  test("TC001 - login successfully", async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();

    await login.login("test@example.com", "123456");

    await expect(page).toHaveURL(/_\/collections/);
  });
});
