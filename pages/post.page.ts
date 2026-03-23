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
  readonly saveBtn: Locator;

  // Fields
  readonly titleInput: Locator;
  readonly activeInput: Locator;
  readonly selectDropdown: Locator;

  // Rich text
  readonly descriptionEditor: Locator;

  // Delete
  readonly deleteBtn: Locator;
  readonly confirmDeleteBtn: Locator;
  readonly cancelDeleteBtn: Locator;
  readonly resetBtn: Locator;

  // Table
  readonly selectedText: Locator;

  constructor(page: Page) {
    this.page = page;

    this.frame = page.frameLocator('iframe[title="Demo dashboard"]');

    // Navigation
    this.postsMenu = this.frame.getByText(/posts/i);

    // Actions
    this.newBtn = this.frame.getByRole("button", { name: /new record/i });
    this.createBtn = this.frame.getByRole("button", { name: /create/i });
    this.cancelBtn = this.frame.getByRole("button", { name: /cancel/i });
    this.closeModalBtn = this.frame.getByRole("button", { name: /close/i });
    this.saveBtn = this.frame.getByRole("button", { name: /save/i });

    // Fields
    this.titleInput = this.frame.getByLabel(/title/i);
    this.activeInput = this.frame.getByLabel(/active/i);
    this.selectDropdown = this.frame.getByRole("button", { name: /select/i });

    // Rich text
    this.descriptionEditor = this.frame
      .frameLocator('iframe[title="Rich Text Area"]')
      .locator("body");

    // Delete
    this.deleteBtn = this.frame.getByRole("button", { name: /delete selected/i });
    this.confirmDeleteBtn = this.frame.getByRole("button", { name: /^yes$/i });
    this.cancelDeleteBtn = this.frame.getByRole("button", { name: /^no$/i });
    this.resetBtn = this.frame.getByText(/reset/i);

    // Table
    this.selectedText = this.frame.getByText(/selected/i);
  }

  // ================= NAVIGATION =================
  async goto() {
    await this.page.goto("/demo/");
    await expect(this.postsMenu).toBeVisible();
    await this.postsMenu.click();
    await expect(this.newBtn).toBeVisible();
  }

  // ================= CREATE =================
  async clickNew() {
    await this.newBtn.click();
    await expect(this.titleInput).toBeVisible();
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillDescription(desc: string) {
    await this.descriptionEditor.click();
    await this.descriptionEditor.fill(desc);
  }

  async toggleActive(active: boolean) {
    const checked = await this.activeInput.isChecked();
    if (checked !== active) {
      await this.activeInput.click();
    }
  }

  async selectOption() {
    if (await this.selectDropdown.isVisible()) {
      await this.selectDropdown.click();
      await this.frame.getByRole("menuitem").first().click();
    }
  }

  async clickCreate() {
    await this.createBtn.click();
  }

  async expectPostCreated(title: string) {
    await expect(this.getPostRow(title)).toBeVisible();
  }

  async expectCreateResult(title: string) {
    const row = this.getPostRow(title);
    const errorMsg = this.frame.getByText(/failed to create/i);

    await Promise.race([expect(row).toBeVisible(), expect(errorMsg).toBeVisible()]);
  }

  // ================= EDIT =================
  getPostRow(title: string) {
    return this.frame.locator("tbody tr").filter({ hasText: title });
  }

  async openEdit(title: string) {
    const row = this.getPostRow(title);
    await expect(row).toBeVisible();

    await row.click();
    await expect(this.titleInput).toBeVisible();
    await expect(this.saveBtn).toBeVisible();
  }

  async updateTitle(title: string) {
    await this.titleInput.fill("");
    await this.titleInput.fill(title);
  }

  async clearTitle() {
    await this.titleInput.fill("");
  }

  async clickSave() {
    await this.saveBtn.click();
  }

  async clickCancel() {
    await this.cancelBtn.click();
  }

  async clickCloseModal() {
    await this.closeModalBtn.click();
  }

  async expectPostUpdated(title: string) {
    await expect(this.getPostRow(title)).toBeVisible();
  }

  async isTitleInvalid() {
    return await this.titleInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
  }

  async expectSaveEnabled(enabled: boolean) {
    if (enabled) {
      await expect(this.saveBtn).toBeEnabled();
    } else {
      await expect(this.saveBtn).toBeDisabled();
    }
  }

  getUnsavedWarning() {
    return this.frame.getByText(/unsaved/i);
  }

  // ================= DELETE =================
  async selectPost(title: string) {
    const row = this.getPostRow(title);
    await expect(row).toBeVisible();

    const checkbox = row.locator("label");
    await checkbox.click();
  }

  async selectMultiple(titles: string[]) {
    for (const t of titles) {
      await this.selectPost(t);
    }
  }

  async clickDelete() {
    await this.deleteBtn.click();
  }

  async confirmDelete() {
    await this.confirmDeleteBtn.click();
  }

  async cancelDelete() {
    await this.cancelDeleteBtn.click();
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

  async expectNoSelection() {
    await expect(this.selectedText).toHaveCount(0);
  }

  getDeleteSuccessToast() {
    return this.frame.getByText(/successfully deleted/i);
  }

  async resetSelection() {
    await this.resetBtn.click();
  }

  // ================= SORT =================
  async sortBy(column: string) {
    await this.frame
      .getByRole("columnheader")
      .filter({ hasText: new RegExp(column, "i") })
      .first()
      .click();
  }

  async getColumnTexts(index: number) {
    const texts = await this.frame.locator(`tbody tr td:nth-child(${index})`).allTextContents();

    return texts.map((t) => t.trim());
  }

  async waitForTableLoaded() {
    await expect(this.frame.locator("tbody tr").first()).toBeVisible();
  }

  async expectSortedAsc(values: string[]) {
    for (let i = 0; i < values.length - 1; i++) {
      expect(values[i].localeCompare(values[i + 1]) <= 0).toBeTruthy();
    }
  }

  async expectSortedDesc(values: string[]) {
    for (let i = 0; i < values.length - 1; i++) {
      expect(values[i].localeCompare(values[i + 1]) >= 0).toBeTruthy();
    }
  }
}
