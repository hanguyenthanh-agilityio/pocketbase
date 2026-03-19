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

    // Input hidden
    this.activeInput = this.frame.getByLabel(/active/i);

    this.selectDropdown = this.frame.getByRole("button", { name: /select/i });

    // Rich text editor
    this.descriptionFrame = this.frame.frameLocator('iframe[title="Rich Text Area"]');
    this.descriptionEditor = this.descriptionFrame.locator("body");
  }

  async goto() {
    await this.page.goto("/demo/");
    await this.page.waitForSelector('iframe[title="Demo dashboard"]');

    await this.postsMenu.click();
    await expect(this.newBtn).toBeVisible();
  }

  async clickNew() {
    await this.newBtn.click();
    await expect(this.titleInput).toBeVisible({ timeout: 10000 });
  }

  // Scroll
  async scrollForm() {
    const form = this.frame.locator("form.tab-item.active");

    await form.waitFor({ state: "visible" });
    await form.scrollIntoViewIfNeeded();
  }

  async fillTitle(title: string) {
    await this.titleInput.scrollIntoViewIfNeeded();
    await this.titleInput.fill(title);
  }

  async fillDescription(desc: string) {
    const editor = this.descriptionEditor;

    await editor.scrollIntoViewIfNeeded();
    await editor.waitFor({ state: "visible" });

    await editor.click();

    try {
      await editor.fill(desc);
    } catch {
      await editor.type(desc);
    }
  }

  async toggleActive(active: boolean) {
    const label = this.frame.locator("label", { hasText: /active/i });

    await label.scrollIntoViewIfNeeded();
    await label.waitFor({ state: "visible" });

    const checked = await this.activeInput.isChecked();

    if (checked !== active) {
      await label.click();
    }
  }

  async selectOption() {
    await this.selectDropdown.scrollIntoViewIfNeeded();
    await this.selectDropdown.click();

    const option = this.frame.getByRole("menuitem").first();

    await option.waitFor({ state: "visible" });
    await option.click();
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
