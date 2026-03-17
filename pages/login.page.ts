import { Page, Locator, FrameLocator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly frame: FrameLocator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.frame = page.frameLocator('iframe[title="Demo dashboard"]');

    this.emailInput = this.frame.getByRole("textbox", { name: "Email *" });
    this.passwordInput = this.frame.getByRole("textbox", { name: "Password *" });
    this.loginButton = this.frame.getByRole("button", { name: /Login/ });
  }

  async goto() {
    await this.page.goto("/demo/");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
