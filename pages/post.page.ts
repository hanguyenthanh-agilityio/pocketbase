import { Page, Locator } from "@playwright/test";

export class PostPage {
  readonly page: Page;
  readonly newBtn: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly activeToggle: Locator;
  readonly optionsDropdown: Locator;
  readonly createBtn: Locator;
  readonly cancelBtn: Locator;
  readonly closeModalBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newBtn = page.locator('button:has-text("New record")');
    this.titleInput = page.locator('input[name="title"]');
    this.descriptionInput = page.locator('textarea[name="description"]');
    this.activeToggle = page.locator('input[name="active"]');
    this.optionsDropdown = page.locator('select[name="options"]');
    this.createBtn = page.locator('button:has-text("Create")');
    this.cancelBtn = page.locator('button:has-text("Cancel")');
    this.closeModalBtn = page.locator("button.close-modal");
  }

  async goto() {
    await this.page.goto("/admin/collections/posts");
  }

  async clickNew() {
    await this.newBtn.click();
  }

  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillDescription(desc: string) {
    await this.descriptionInput.fill(desc);
  }

  async toggleActive(active: boolean) {
    const checked = await this.activeToggle.isChecked();
    if (checked !== active) await this.activeToggle.click();
  }

  async selectOptions(options: string[]) {
    for (const option of options) {
      await this.optionsDropdown.selectOption(option);
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

  getPostRow(title: string) {
    return this.page.locator(`tr:has(td:text-is("${title}"))`);
  }
}
