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

    // Main iframe
    this.frame = page.frameLocator('iframe[title="Demo dashboard"]');

    // Navigation
    this.postsMenu = this.frame.getByText("Posts");

    // Buttons
    this.newBtn = this.frame.getByRole("button", { name: /New record/i });
    this.createBtn = this.frame.getByRole("button", { name: /Create/i });
    this.cancelBtn = this.frame.getByRole("button", { name: /Cancel/i });
    this.closeModalBtn = this.frame.getByRole("button", { name: /Close/i });

    // Fields
    this.titleInput = this.frame.getByLabel(/title/i);
    this.activeInput = this.frame.getByLabel(/active/i);

    this.selectDropdown = this.frame.getByRole("button", { name: /select/i });

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
    await expect(iframe).toBeVisible({ timeout: 15000 });

    // Ensure DOM ready
    await this.page.waitForLoadState("domcontentloaded");
    await this.postsMenu.click();

    // Ensure page loaded
    await expect(this.newBtn).toBeVisible({ timeout: 15000 });
  }

  // ======================
  // ACTIONS
  // ======================
  async clickNew() {
    await this.newBtn.click();

    await expect(this.titleInput).toBeVisible();
  }

  async clickCreate() {
    await expect(this.createBtn).toBeEnabled();
    await this.createBtn.click();
  }

  async clickCancel() {
    await this.cancelBtn.click();
  }

  async clickCloseModal() {
    await this.closeModalBtn.click();
  }

  // ======================
  // FORM
  // ======================
  async fillTitle(title: string) {
    await this.titleInput.fill(title);
    await this.titleInput.press("Tab");
  }

  async fillDescription(desc: string) {
    if (!(await this.descriptionEditor.count())) return;

    await expect(this.descriptionEditor).toBeVisible();

    await this.descriptionEditor.click();
    await this.descriptionEditor.pressSequentially(desc);
  }

  async toggleActive(active: boolean) {
    const label = this.frame.locator("label", { hasText: /active/i });

    const checked = await this.activeInput.isChecked();

    if (checked !== active) {
      await label.click();
    }
  }

  async selectOption() {
    if (!(await this.selectDropdown.count())) return;

    await this.selectDropdown.click();

    const option = this.frame.getByRole("menuitem").first();

    await expect(option).toBeVisible();
    await option.click();
  }

  // ======================
  // ASSERTIONS
  // ======================
  getPostRow(title: string) {
    return this.frame.locator(`tr:has-text("${title}")`);
  }

  async expectPostCreated(title: string) {
    await expect(this.getPostRow(title)).toBeVisible({ timeout: 15000 });
  }

  async expectCreateSuccess(title: string) {
    const shortTitle = title.slice(0, 20);
    const row = this.frame.locator(`tr:has-text("${shortTitle}")`);

    await expect(row.first()).toBeVisible({ timeout: 5000 });
  }

  async expectCreateError() {
    const errorMsg = this.frame.getByText(/error|required|max/i);

    await expect(errorMsg).toBeVisible({ timeout: 5000 });
  }

  async expectCreateResult(title: string) {
    const shortTitle = title.slice(0, 20);

    const row = this.frame.locator(`tr:has-text("${shortTitle}")`);
    const errorMsg = this.frame.getByText(/error|required|max/i);

    await Promise.race([
      row.first().waitFor({ state: "visible", timeout: 5000 }),
      errorMsg.waitFor({ state: "visible", timeout: 5000 }),
    ]);
  }
}
