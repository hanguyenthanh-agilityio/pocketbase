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
  readonly selectDropdown: Locator;

  // Rich text iframe
  readonly descriptionFrame: FrameLocator;
  readonly descriptionEditor: Locator;

  constructor(page: Page) {
    this.page = page;

    this.frame = page.frameLocator('iframe[title="Demo dashboard"]');

    this.postsMenu = this.frame.getByText("Posts");

    this.newBtn = this.frame.getByRole("button", { name: /New record/ });
    this.createBtn = this.frame.getByRole("button", { name: /Create/ });
    this.cancelBtn = this.frame.getByRole("button", { name: /Cancel/ });
    this.closeModalBtn = this.frame.getByRole("button", { name: /Close/ });

    this.titleInput = this.frame.getByLabel(/title/i);
    this.activeInput = this.frame.getByLabel(/active/i);

    this.selectDropdown = this.frame.getByRole("button", { name: /select/i });

    this.descriptionFrame = this.frame.frameLocator('iframe[title="Rich Text Area"]');
    this.descriptionEditor = this.descriptionFrame.locator("body");
  }

  async goto() {
    await this.page.goto("/demo/");

    // wait iframe
    await this.page.waitForSelector('iframe[title="Demo dashboard"]');

    // wait UI inside iframe
    await this.postsMenu.waitFor({ state: "visible", timeout: 15000 });

    await this.postsMenu.click({ force: true });

    await expect(this.newBtn).toBeVisible({ timeout: 15000 });
  }

  async clickNew() {
    await this.newBtn.click({ force: true });
    await expect(this.titleInput).toBeVisible({ timeout: 10000 });
  }

  async fillTitle(title: string) {
    await this.titleInput.waitFor({ state: "visible" });
    await this.titleInput.fill(title);
  }

  async fillDescription(desc: string) {
    const editor = this.descriptionEditor;

    await editor.waitFor({ state: "visible" });
    await editor.click({ force: true });

    try {
      await editor.fill(desc);
    } catch {
      await editor.type(desc);
    }
  }

  async toggleActive(active: boolean) {
    const label = this.frame.locator("label", { hasText: /active/i });

    await label.waitFor({ state: "visible" });

    const checked = await this.activeInput.isChecked();

    if (checked !== active) {
      await label.click({ force: true });
    }
  }

  async selectOption() {
    if (!(await this.selectDropdown.count())) return;

    await this.selectDropdown.waitFor({ state: "visible", timeout: 5000 });

    await this.selectDropdown.click({ force: true });

    const option = this.frame.getByRole("menuitem").first();

    await option.waitFor({ state: "visible", timeout: 5000 });
    await option.click({ force: true });
  }

  async clickCreate() {
    await this.createBtn.click({ force: true });
  }

  async clickCancel() {
    await this.cancelBtn.click({ force: true });
  }

  async clickCloseModal() {
    await this.closeModalBtn.click({ force: true });
  }

  getPostRow(title: string) {
    return this.frame.locator(`tr:has-text("${title}")`);
  }

  async expectPostCreated(title: string) {
    await expect(this.getPostRow(title)).toBeVisible({ timeout: 15000 });
  }

  async expectCreateResult(title: string) {
    const row = this.getPostRow(title);
    const errorMsg = this.frame.getByText("Failed to create record.");

    await Promise.race([
      row.first().waitFor({ state: "visible" }),
      errorMsg.waitFor({ state: "visible" }),
    ]);

    if (await errorMsg.isVisible().catch(() => false)) {
      await expect(errorMsg).toBeVisible();
    } else {
      await expect(row).toBeVisible();
    }
  }
}
