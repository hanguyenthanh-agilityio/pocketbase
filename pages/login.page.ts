import { Page, Locator, FrameLocator, expect } from "@playwright/test";

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

    this.frame = page.frameLocator('iframe[title="Demo dashboard"]');

    this.emailInput = this.frame.getByRole("textbox", { name: "Email *" });
    this.passwordInput = this.frame.getByRole("textbox", { name: "Password *" });
    this.loginButton = this.frame.getByRole("button", { name: /Login/ });

    this.errorMessage = this.frame.getByText("Invalid login credentials.");

    this.loginTitle = this.frame.getByRole("heading", {
      name: "Superuser login",
    });
  }

  async goto() {
    await this.page.goto("/demo/");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    await expect(this.loginButton).toBeVisible();

    await this.loginButton.click({ force: true });
  }

  // Server error
  async expectInvalidCredentialsError() {
    await expect(this.errorMessage).toBeVisible();
  }

  // HTML5 validation
  async expectEmailRequired() {
    const message = await this.emailInput.evaluate((el: HTMLInputElement) => el.validationMessage);

    expect(message).not.toBe("");
  }

  async expectPasswordRequired() {
    const message = await this.passwordInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );

    expect(message).not.toBe("");
  }

  async expectStillOnLogin() {
    await expect(this.loginTitle).toBeVisible();
  }

  async expectEmailInvalidFormat() {
    const isValid = await this.emailInput.evaluate((el: HTMLInputElement) => el.checkValidity());

    expect(isValid).toBeFalsy();
  }
}
