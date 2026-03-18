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

    // The PocketBase demo app is rendered inside an iframe
    this.frame = page.frameLocator('iframe[title="Demo dashboard"]');

    // Input fields
    this.emailInput = this.frame.getByRole("textbox", { name: "Email *" });
    this.passwordInput = this.frame.getByRole("textbox", { name: "Password *" });

    // Login button
    this.loginButton = this.frame.getByRole("button", { name: /Login/ });

    // Error message shown when server rejects login
    this.errorMessage = this.frame.getByText("Invalid login credentials.");

    // Login page title (used to verify we are still on login screen)
    this.loginTitle = this.frame.getByRole("heading", {
      name: "Superuser login",
    });
  }

  // Navigate to demo page and ensure iframe + inputs are ready
  async goto() {
    await this.page.goto("/demo/");

    // Wait until iframe is rendered
    await this.page.waitForSelector('iframe[title="Demo dashboard"]');

    // Wait until email input is ready
    await this.emailInput.waitFor();
  }

  // Perform login action via UI
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    // Ensure button is visible before clicking
    await expect(this.loginButton).toBeVisible();

    await this.loginButton.click();
  }

  // Verify server-side error message is displayed
  async expectInvalidCredentialsError() {
    await expect(this.errorMessage).toBeVisible();
  }

  // HTML5 validation: email is required
  async expectEmailRequired() {
    const message = await this.emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);

    expect(message).not.toBe("");
  }

  // HTML5 validation: password is required
  async expectPasswordRequired() {
    const message = await this.passwordInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );

    expect(message).not.toBe("");
  }

  // Verify that user is still on login page
  async expectStillOnLogin() {
    await expect(this.loginTitle).toBeVisible();
  }

  // HTML5 validation: invalid email format
  async expectEmailInvalidFormat() {
    const isValid = await this.emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());

    expect(isValid).toBeFalsy();
  }
}
