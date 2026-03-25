import { Page, Locator, FrameLocator, expect } from "@playwright/test";

export class PostPage {
  readonly page: Page;
  readonly frame: FrameLocator;

  // Navigation
  readonly postsMenu: Locator;

  // Actions
  readonly newBtn: Locator;
  readonly createBtn: Locator;
  readonly cancelBtn: Locator;
  readonly closeModalBtn: Locator;

  // Fields
  readonly titleInput: Locator;
  readonly activeInput: Locator;

  // Rich text iframe
  readonly descriptionFrame: FrameLocator;
  readonly descriptionEditor: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main iframe
    this.frame = page.frameLocator('iframe[title="Demo dashboard"]');

    // Navigation
    this.postsMenu = this.frame.getByRole("link", { name: /posts/i });

    // Buttons
    this.newBtn = this.frame.locator("header").getByRole("button", { name: /New record/i });

    this.createBtn = this.frame.getByRole("button", { name: /^Create$/i });
    this.cancelBtn = this.frame.getByRole("button", { name: /Cancel/i });
    this.closeModalBtn = this.frame.getByRole("button", { name: /Close/i });

    // Fields
    this.titleInput = this.frame.getByLabel(/title/i);
    this.activeInput = this.frame.getByLabel(/active/i);

    // Rich text editor iframe
    this.descriptionFrame = this.frame.frameLocator('iframe[title="Rich Text Area"]');
    this.descriptionEditor = this.descriptionFrame.locator("body");
  }

  // ======================
  // NAVIGATION
  // ======================
  async goto() {
    await this.page.goto("/demo/");

    const iframe = this.page.locator('iframe[title="Demo dashboard"]');

    // Wait iframe ready
    await expect(iframe).toBeVisible();

    // Wait element inside iframe
    await this.postsMenu.waitFor({ state: "visible" });

    await this.page.waitForLoadState("networkidle");

    await this.postsMenu.first().click();

    await expect(this.newBtn).toBeVisible({ timeout: 15000 });
  }

  // ======================
  // ACTIONS
  // ======================
  async clickNew() {
    await this.newBtn.first().click();
    await expect(this.titleInput).toBeVisible();
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillDescription(desc: string) {
    if (!(await this.descriptionEditor.count())) return;

    await this.descriptionEditor.click();
    await this.descriptionEditor.fill(desc);
  }

  async toggleActive(active: boolean) {
    const checkbox = this.activeInput;

    // label clickable (UI visible)
    const label = this.frame.locator("label", { hasText: /active/i });

    await expect(label).toBeVisible();

    const checked = await checkbox.isChecked();

    if (checked !== active) {
      await label.click(); // Click label instead of input
    }
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

  getRowByData(title: string, description?: string) {
    const row = this.frame.locator("tr", { hasText: title });

    if (description) {
      return row.filter({ hasText: description });
    }

    return row;
  }
}
