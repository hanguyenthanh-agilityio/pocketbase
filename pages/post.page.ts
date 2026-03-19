import { Page, Locator, FrameLocator, expect } from "@playwright/test";

export class PostPage {
  readonly page: Page;
  readonly frame: FrameLocator;

  // navigation
  readonly postsMenu: Locator;

  // actions
  readonly newBtn: Locator;
  readonly createBtn: Locator;
  readonly cancelBtn: Locator;
  readonly closeModalBtn: Locator;

  // fields
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly activeToggle: Locator;

  constructor(page: Page) {
    this.page = page;

    // iframe
    this.frame = page.frameLocator('iframe[title="Demo dashboard"]');

    // sidebar
    this.postsMenu = this.frame.getByText("Posts");

    // buttons
    this.newBtn = this.frame.getByRole("button", { name: /New record/ });
    this.createBtn = this.frame.getByRole("button", { name: /Create/ });
    this.cancelBtn = this.frame.getByRole("button", { name: /Cancel/ });
    this.closeModalBtn = this.frame.getByRole("button", { name: /Close/ });

    // fields
    this.titleInput = this.frame.getByLabel(/title/i);
    this.descriptionInput = this.frame.getByLabel(/description/i);
    this.activeToggle = this.frame.getByLabel(/active/i);
  }

  async goto() {
    await this.page.goto("/demo/");
    await this.page.waitForSelector('iframe[title="Demo dashboard"]');

    await this.postsMenu.click();

    // ensure page ready
    await expect(this.newBtn).toBeVisible();
  }

  async clickNew() {
    await this.newBtn.click();

    // Wait modal render
    await expect(this.titleInput).toBeVisible({ timeout: 10000 });
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillDescription(desc: string) {
    await this.descriptionInput.fill(desc);
  }

  async toggleActive(active: boolean) {
    const checked = await this.activeToggle.isChecked();
    if (checked !== active) await this.activeToggle.click();
  }

  async clickCreate() {
    await this.createBtn.click();
  }

  async clickCancel() {
    await this.cancelBtn.click();
  }

  async clickCloseModal() {
    await this.closeModalBtn.click();
  }

  getPostRow(title: string) {
    return this.frame.locator(`tr:has-text("${title}")`);
  }

  async expectPostCreated(title: string) {
    await expect(this.getPostRow(title)).toBeVisible();
  }
}
