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

    // Wait Posts menu
    await expect(this.postsMenu).toBeVisible({ timeout: 15000 });

    await this.postsMenu.click();

    // Ensure page loaded
    await expect(this.newBtn).toBeVisible({ timeout: 15000 });
  }

  // ======================
  // ACTIONS
  // ======================
  async clickNew() {
    await expect(this.newBtn).toBeVisible();
    await this.newBtn.click();

    await expect(this.titleInput).toBeVisible({ timeout: 10000 });
  }

  async clickCreate() {
    await expect(this.createBtn).toBeVisible();

    // 🔥 ensure button enabled
    await expect(this.createBtn).toBeEnabled();

    await this.createBtn.click();
  }
  async clickCancel() {
    await expect(this.cancelBtn).toBeVisible();
    await this.cancelBtn.click();
  }

  async clickCloseModal() {
    await expect(this.closeModalBtn).toBeVisible();
    await this.closeModalBtn.click();
  }

  // ======================
  // FORM
  // ======================
  async fillTitle(title: string) {
    await expect(this.titleInput).toBeVisible();
    await this.titleInput.fill(title);

    await this.titleInput.press("Tab");
  }

  async fillDescription(desc: string) {
    await expect(this.descriptionEditor).toBeVisible();

    await this.descriptionEditor.click();

    try {
      await this.descriptionEditor.fill(desc);
    } catch {
      await this.descriptionEditor.type(desc);
    }
  }

  async toggleActive(active: boolean) {
    const label = this.frame.locator("label", { hasText: /active/i });

    await expect(label).toBeVisible();

    const checked = await this.activeInput.isChecked();

    if (checked !== active) {
      await label.click();
    }
  }

  async selectOption() {
    if (!(await this.selectDropdown.count())) return;

    await expect(this.selectDropdown).toBeVisible();

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
