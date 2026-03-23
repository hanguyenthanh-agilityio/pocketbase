// pages/post.page.ts
import { Page, Locator, FrameLocator, expect } from "@playwright/test";

export class PostPage {
  readonly page: Page;
  readonly frame: FrameLocator;

  // ================= NAVIGATION =================
  readonly postsMenu: Locator;

  // ================= ACTION BUTTONS =================
  readonly newBtn: Locator;
  readonly createBtn: Locator;
  readonly saveBtn: Locator;
  readonly cancelBtn: Locator;
  readonly closeModalBtn: Locator;
  readonly resetBtn: Locator;

  // ================= FIELDS =================
  readonly titleInput: Locator;
  readonly activeInput: Locator;
  readonly selectDropdown: Locator;
  readonly descriptionEditor: Locator;

  // ================= DELETE =================
  readonly deleteBtn: Locator;
  readonly confirmDeleteBtn: Locator;
  readonly cancelDeleteBtn: Locator;

  // ================= TABLE =================
  readonly selectedText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.frame = page.frameLocator('iframe[title="Demo dashboard"]');

    // Navigation
    this.postsMenu = this.frame.getByText(/posts/i);

    // Buttons
    this.newBtn = this.frame.getByRole("button", { name: /new record/i });
    this.createBtn = this.frame.getByRole("button", { name: /create/i });
    this.saveBtn = this.frame.getByRole("button", { name: /save/i });
    this.cancelBtn = this.frame.getByRole("button", { name: /cancel/i });
    this.closeModalBtn = this.frame.getByRole("button", { name: /close/i });
    this.resetBtn = this.frame.getByText(/reset/i);

    // Fields
    this.titleInput = this.frame.getByLabel(/title/i);
    this.activeInput = this.frame.getByLabel(/active/i);
    this.selectDropdown = this.frame.getByRole("button", { name: /select/i });
    this.descriptionEditor = this.frame
      .frameLocator('iframe[title="Rich Text Area"]')
      .locator("body");

    // Delete
    this.deleteBtn = this.frame.getByRole("button", { name: /delete selected/i });
    this.confirmDeleteBtn = this.frame.getByRole("button", { name: /^yes$/i });
    this.cancelDeleteBtn = this.frame.getByRole("button", { name: /^no$/i });

    // Table
    this.selectedText = this.frame.getByText(/selected/i);
  }

  // ================= NAVIGATION =================
  async goto() {
    await this.page.goto("/demo/");
    await expect(this.postsMenu).toBeVisible({ timeout: 15000 });
    await this.postsMenu.click();
    await expect(this.newBtn).toBeVisible({ timeout: 10000 });
  }

  // ================= CREATE =================
  async clickNew() {
    await this.newBtn.click();
    await expect(this.titleInput).toBeVisible({ timeout: 5000 });
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
    if (checked !== active) await this.activeInput.click();
  }

  async selectOption(index = 0) {
    if (await this.selectDropdown.isVisible()) {
      await this.selectDropdown.click();
      const menuItems = this.frame.getByRole("menuitem");
      await menuItems.nth(index).click();
    }
  }

  async clickCreate() {
    await this.createBtn.click();
  }

  async expectPostCreated(title: string) {
    await expect(this.getPostRow(title)).toBeVisible({ timeout: 5000 });
  }

  // ================= EDIT =================
  getPostRow(title: string) {
    return this.frame.locator("tbody tr").filter({ hasText: title });
  }

  async openEdit(title: string) {
    const row = this.getPostRow(title);
    await expect(row).toBeVisible({ timeout: 5000 });
    await row.click();
    await expect(this.titleInput).toBeVisible({ timeout: 5000 });
    await expect(this.saveBtn).toBeVisible();
  }

  async updateTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async clickSave() {
    await this.saveBtn.click();
  }

  async isTitleInvalid() {
    return await this.titleInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
  }

  async expectSaveEnabled(enabled: boolean) {
    if (enabled) await expect(this.saveBtn).toBeEnabled();
    else await expect(this.saveBtn).toBeDisabled();
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
    await expect(this.getPostRow(title)).toHaveCount(0, { timeout: 5000 });
  }

  async resetSelection() {
    await this.resetBtn.click();
  }

  async expectSelectedCount(count: number) {
    const counter = this.frame.locator("div.records-counter > span.txt").nth(1);
    await expect(counter).toHaveText(`${count}`);
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

  async expectSortedAsc(values: string[]) {
    for (let i = 0; i < values.length - 1; i++)
      expect(values[i].localeCompare(values[i + 1]) <= 0).toBeTruthy();
  }

  async expectSortedDesc(values: string[]) {
    for (let i = 0; i < values.length - 1; i++)
      expect(values[i].localeCompare(values[i + 1]) >= 0).toBeTruthy();
  }

  // ================= SEARCH =================
  async waitForTableLoaded() {
    await this.frame.locator("tbody tr").first().waitFor({ state: "visible", timeout: 10000 });
  }

  async searchPost(keyword: string) {
    const searchInput = this.frame.locator("form.searchbar .cm-editor [role='textbox']");
    await searchInput.waitFor({ state: "visible", timeout: 15000 });
    await searchInput.fill(keyword);
    await searchInput.press("Enter");
    await this.waitForTableLoaded();
  }

  async clearSearch() {
    const clearBtn = this.frame.locator('button:has-text("Clear")');
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    } else {
      const searchInput = this.frame.locator("form.searchbar .cm-editor [role='textbox']");
      await searchInput.fill("");
      await searchInput.press("Enter");
    }
    await this.waitForTableLoaded();
  }
}
