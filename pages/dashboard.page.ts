import { Page, FrameLocator, expect } from "@playwright/test";

export class DashboardPage {
  readonly frame: FrameLocator;

  constructor(page: Page) {
    this.frame = page.frameLocator('iframe[title="Demo dashboard"]');
  }

  async expectLoaded() {
    await expect(this.frame.getByText("Collections")).toBeVisible();
  }
}
