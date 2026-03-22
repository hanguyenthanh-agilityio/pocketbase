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

  // Actions (edit)
  readonly saveBtn: Locator;
  readonly editBtn: Locator;

  // Delete
  readonly deleteBtn: Locator;
  readonly confirmDeleteBtn: Locator;
  readonly cancelDeleteBtn: Locator;
  readonly resetBtn: Locator;
  readonly selectedText: Locator;

  constructor(page: Page) {
    this.page = page;

    this.frame = page.frameLocator('iframe[title="Demo dashboard"]');

    this.postsMenu = this.frame.getByText(/posts/i);

    this.newBtn = this.frame.getByRole("button", { name: /New record/ });
    this.createBtn = this.frame.getByRole("button", { name: /Create/ });
    this.cancelBtn = this.frame.getByRole("button", { name: /Cancel/ });
    this.closeModalBtn = this.frame.getByRole("button", { name: /Close/ });

    this.titleInput = this.frame.getByLabel(/title/i);
    this.activeInput = this.frame.getByLabel(/active/i);

    this.selectDropdown = this.frame.getByRole("button", { name: /select/i });

    this.descriptionFrame = this.frame.frameLocator('iframe[title="Rich Text Area"]');
    this.descriptionEditor = this.descriptionFrame.locator("body");

    this.saveBtn = this.frame.getByRole("button", { name: /save/i });
    this.editBtn = this.frame.getByRole("button", { name: /edit/i });

    this.deleteBtn = this.frame.getByRole("button", { name: /delete selected/i });
    this.confirmDeleteBtn = this.frame.getByRole("button", { name: /^yes$/i });
    this.cancelDeleteBtn = this.frame.getByRole("button", { name: /^no$/i });

    this.resetBtn = this.frame.getByText(/reset/i);
    this.selectedText = this.frame.getByText(/selected/i);
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
  /** Add methods  */

  // Open edit modal
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
    if (enabled) {
      await expect(this.saveBtn).toBeEnabled();
    } else {
      await expect(this.saveBtn).toBeDisabled();
    }
  }

  async isTitleInvalid() {
    return await this.titleInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
  }

  async selectPost(title: string) {
    const row = this.getPostRow(title);

    await row.waitFor({ state: "visible" });

    const checkbox = row.locator("label");

    await checkbox.click();
  }

  async selectMultiple(titles: string[]) {
    for (const t of titles) {
      await this.selectPost(t);
    }
  }

  async clickDelete() {
    await this.deleteBtn.waitFor({ state: "visible" });
    await this.deleteBtn.click();
  }

  async confirmDelete() {
    await this.confirmDeleteBtn.waitFor({ state: "visible" });
    await this.confirmDeleteBtn.click();
  }

  async cancelDelete() {
    await this.cancelDeleteBtn.click();
  }

  async resetSelection() {
    await this.resetBtn.click();
  }

  async expectPostDeleted(title: string) {
    await expect(this.getPostRow(title)).toHaveCount(0);
  }

  async expectSelectedCount(count: number) {
    if (count === 0) {
      await expect(this.selectedText).toHaveCount(0);
    } else {
      await expect(this.selectedText).toContainText(`${count}`);
    }
  }

  getDeleteSuccessToast() {
    return this.frame.getByText(/successfully deleted/i);
  }

  async expectNoSelection() {
    await expect(this.selectedText).toHaveCount(0);
  }
}
