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
  readonly saveBtn: Locator;

  // Fields
  readonly titleInput: Locator;
  readonly activeInput: Locator;

  // Rich text editor iframe
  readonly descriptionFrame: FrameLocator;
  readonly descriptionEditor: Locator;

  // Edit buttons
  readonly editBtn: Locator;

  // Delete
  readonly deleteBtn: Locator;
  readonly confirmDeleteBtn: Locator;
  readonly cancelDeleteBtn: Locator;
  readonly resetBtn: Locator;

  // Table
  readonly selectedText: Locator;

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

    // Rich text
    this.descriptionEditor = this.frame
      .frameLocator('iframe[title="Rich Text Area"]')
      .locator("body");

    // Rich text editor iframe
    this.descriptionFrame = this.frame.frameLocator('iframe[title="Rich Text Area"]');
    this.descriptionEditor = this.descriptionFrame.locator("body");

    // Edit
    this.saveBtn = this.frame.getByRole("button", { name: /save/i });
    this.editBtn = this.frame.getByRole("button", { name: /edit/i });

    // Delete
    this.deleteBtn = this.frame.getByRole("button", { name: /delete selected/i });
    this.confirmDeleteBtn = this.frame.getByRole("button", { name: /^yes$/i });
    this.cancelDeleteBtn = this.frame.getByRole("button", { name: /^no$/i });
    this.resetBtn = this.frame.getByText(/reset/i);

    // Table
    this.selectedText = this.frame.getByText(/selected/i);
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

  async expectPostUpdated(title: string) {
    await expect(this.getPostRow(title)).toBeVisible();
  }

  async isTitleInvalid() {
    return await this.titleInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
  }

  async expectSaveEnabled(enabled: boolean) {
    if (enabled) await expect(this.saveBtn).toBeEnabled({ timeout: 5000 });
    else await expect(this.saveBtn).toBeDisabled({ timeout: 5000 });
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
  async sortBy(column: string, direction: "asc" | "desc" = "asc") {
    const header = this.frame
      .getByRole("columnheader")
      .filter({ hasText: new RegExp(column, "i") })
      .first();

    await header.click(); // ASC
    await header.click(); // DESC
    await header.click(); // NONE

    if (direction === "asc") {
      await header.click(); // ASC
    } else {
      await header.click(); // ASC
      await header.click(); // DESC
    }
  }

  async getColumnTexts(index: number) {
    const rows = this.frame.locator("tbody tr");

    const count = await rows.count();
    const result: string[] = [];

    for (let i = 0; i < count; i++) {
      const cell = rows.nth(i).locator(`td:nth-child(${index})`);

      if (await cell.count()) {
        const text = (await cell.textContent())?.trim();
        if (text) result.push(text);
      }
    }

    return result;
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
