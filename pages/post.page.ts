// pages/post.page.ts
import { Page, Locator, FrameLocator, expect } from "@playwright/test";

export class PostPage {
  readonly page: Page;
  readonly frame: FrameLocator;

  // ================= NAVIGATION =================
  readonly postsMenu: Locator;

  // Buttons
  readonly newBtn: Locator;
  readonly createBtn: Locator;
  readonly saveBtn: Locator;
  readonly cancelBtn: Locator;
  readonly closeModalBtn: Locator;
  readonly resetBtn: Locator;

  // ================= FIELDS =================
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

  // ================= TABLE =================
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

    // Table
    this.selectedText = this.frame.getByText(/selected/i);

    this.resetBtn = this.frame.getByText(/reset/i);
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

  // ================= DELETE =================
  async selectPost(title: string) {
    const row = this.getPostRow(title);
    await expect(row).toBeVisible({ timeout: 5000 });
    const checkbox = row.locator("label");
    await checkbox.click();
  }

  async selectMultiple(titles: string[]) {
    for (const title of titles) await this.selectPost(title);
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
    const row = this.getPostRow(title);

    // Wait table reload
    await this.waitForTableLoaded();

    // Ensure row is gone
    await expect(row).toHaveCount(0, { timeout: 10000 });
  }

  async resetSelection() {
    await this.resetBtn.click();
  }

  async expectSelectedCount(count: number) {
    const counter = this.frame.locator("div.records-counter > span.txt").nth(1);
    await expect(counter).toHaveText(`${count}`);
  }

  // ================= SORT =================
  async sortBy(column: string, direction: "asc" | "desc" = "asc") {
    const header = this.frame
      .getByRole("columnheader")
      .filter({ hasText: new RegExp(column, "i") })
      .first();

    const getState = async () => {
      const className = await header.getAttribute("class");
      if (className?.includes("sort-asc")) return "asc";
      if (className?.includes("sort-desc")) return "desc";
      return "none";
    };

    let state = await getState();

    while (state !== direction) {
      await header.click();
      state = await getState();
    }
  }

  async getColumnTexts(index: number) {
    const rows = this.frame.locator("tbody tr");
    const count = await rows.count();

    const values: string[] = [];

    for (let i = 0; i < count; i++) {
      const cell = rows.nth(i).locator(`td:nth-child(${index})`);
      const text = await cell.innerText();
      values.push(text.trim());
    }

    return values;
  }

  async expectSortedAsc(values: string[]) {
    for (let i = 0; i < values.length - 1; i++)
      expect(values[i].localeCompare(values[i + 1]) <= 0).toBeTruthy();
  }

  async expectSortedDesc(values: string[]) {
    for (let i = 0; i < values.length - 1; i++)
      expect(values[i].localeCompare(values[i + 1]) >= 0).toBeTruthy();
  }

  async waitForTableLoaded() {
    const rows = this.frame.locator("tbody tr");

    await rows.first().waitFor({ state: "visible" });

    await this.page.waitForLoadState("networkidle");
  }

  async waitForPostsWithPrefix(prefix: string, colIndex = 3, count = 4, timeout = 15000) {
    await this.frame.locator("tbody tr").first().waitFor({ state: "visible" });

    const rows = this.frame.locator("tbody tr");
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      await rows.nth(i).locator(`td:nth-child(${colIndex})`).innerText();
    }

    const cells = this.frame.locator(`tbody tr td:nth-child(${colIndex})`, {
      hasText: prefix,
    });
    await expect(cells).toHaveCount(count, { timeout });
  }
}
