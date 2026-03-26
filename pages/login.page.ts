import { Page, Locator, FrameLocator, expect } from "@playwright/test";

// UI elements
export class LoginPage {
  readonly page: Page;
  readonly frame: FrameLocator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    // iframe
    this.frame = page.frameLocator('iframe[title="Demo dashboard"]');

    // Input fields
    this.emailInput = this.frame.getByRole("textbox", { name: /email/i });
    this.passwordInput = this.frame.getByRole("textbox", { name: /password/i });

    // Login button
    this.loginButton = this.frame.getByRole("button", { name: /^login/i });

    // Error message shown when server rejects login
    this.errorMessage = this.frame.getByText(/invalid login credentials/i);

    // Login page title (used to verify we are still on login screen)
    this.loginTitle = this.frame.getByRole("heading", {
      name: /superuser login/i,
    });
  }

  // ======================
  // NAVIGATION
  // ======================
  async goto() {
    await this.page.goto("/demo/");

    // Wait until iframe is rendered
    const iframe = this.page.locator('iframe[title="Demo dashboard"]');

    await expect(iframe).toBeVisible({ timeout: 15000 });

    // Wait DOM + network
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("networkidle");

    // Ensure login form ready
    await expect(this.emailInput).toBeVisible();
  }

  // ======================
  // ACTION
  // ======================
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    await this.loginButton.click();
  }

  // ======================
  // VALIDATION (HTML5)
  // ======================
  async getEmailValidationMessage() {
    return this.emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);
  }

  async getPasswordValidationMessage() {
    return this.passwordInput.evaluate((el: HTMLInputElement) => el.validationMessage);
  }

  async isEmailValid() {
    return this.emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());
  }
}
