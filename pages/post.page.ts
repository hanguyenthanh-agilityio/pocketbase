import { Page, Locator, FrameLocator, expect } from "@playwright/test";

export class PostPage {
  readonly page: Page;
  readonly frame: FrameLocator;

  // Navigation
  readonly postsMenu: Locator;

  // Buttons
  readonly newBtn: Locator;
  readonly createBtn: Locator;
  readonly cancelBtn: Locator;
  readonly closeModalBtn: Locator;

  // Fields
  readonly titleInput: Locator;
  readonly activeInput: Locator;

  // Rich text editor iframe
  readonly descriptionFrame: FrameLocator;
  readonly descriptionEditor: Locator;

  // Edit buttons
  readonly saveBtn: Locator;
  readonly editBtn: Locator;

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

    // Edit
    this.saveBtn = this.frame.getByRole("button", { name: /save/i });
    this.editBtn = this.frame.getByRole("button", { name: /edit/i });
  }

  // ======================
  // NAVIGATION
  // ======================
  async goto() {
    await this.page.goto("/demo/");
    const iframe = this.page.locator('iframe[title="Demo dashboard"]');
    await expect(iframe).toBeVisible();
    await this.postsMenu.waitFor({ state: "visible" });
    await this.page.waitForLoadState("networkidle");
    await this.postsMenu.first().click();
    await expect(this.newBtn).toBeVisible({ timeout: 15000 });
  }

  // ======================
  // ACTIONS - CREATE
  // ======================
  async clickNew() {
    await this.newBtn.first().click();
    await expect(this.titleInput).toBeVisible();
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillDescription(desc: string) {
    if ((await this.descriptionEditor.count()) === 0) return;
    await this.descriptionEditor.click();
    await this.descriptionEditor.fill(desc);
  }

  async toggleActive(active: boolean) {
    const label = this.frame.locator("label", { hasText: /active/i });
    await expect(label).toBeVisible();
    const checked = await this.activeInput.isChecked();
    if (checked !== active) {
      await label.click();
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

  // ======================
  // ROW HELPERS
  // ======================
  getRowByData(title: string, description?: string) {
    let row = this.frame.locator("tr", { hasText: title });
    if (description) row = row.filter({ hasText: description });
    return row;
  }

  getPostRow(title: string) {
    return this.getRowByData(title).first();
  }

  // ======================
  // ACTIONS - EDIT
  // ======================
  async openEdit(title: string) {
    const row = this.getPostRow(title);

    await row.waitFor({ state: "visible" });

    await row.click();

    await this.titleInput.waitFor({ state: "visible" });

    await expect(this.saveBtn).toBeVisible();
  }

  // Click Save
  async clickSave() {
    await this.saveBtn.click({ force: true });
  }

  // Update title
  async updateTitle(title: string) {
    await this.titleInput.fill("");
    await this.titleInput.fill(title);
  }

  // Clear title (for validation test)
  async clearTitle() {
    await this.titleInput.fill("");
  }

  // Expect updated
  async expectPostUpdated(title: string) {
    await expect(this.getPostRow(title)).toBeVisible({ timeout: 15000 });
  }

  // Unsaved changes warning
  getUnsavedWarning() {
    return this.frame.getByText(/unsaved/i);
  }

  // Save button state
  async expectSaveEnabled(enabled: boolean) {
    if (enabled) await expect(this.saveBtn).toBeEnabled({ timeout: 5000 });
    else await expect(this.saveBtn).toBeDisabled({ timeout: 5000 });
  }

  async isTitleInvalid() {
    return await this.titleInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
  }
}
