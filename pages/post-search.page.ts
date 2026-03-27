import { Page, expect } from "@playwright/test";
import { PostPage } from "./post.page";

export class PostSearchPage extends PostPage {
  constructor(page: Page) {
    super(page);
  }

  async search(keyword: string) {
    const input = this.frame.locator("form.searchbar .cm-editor [role='textbox']");
    await input.waitFor({ state: "visible", timeout: 15000 });
    await input.fill(keyword);
    await input.press("Enter");
    await this.waitForTableLoaded();
  }

  async clearSearch() {
    const clearBtn = this.frame.locator('button:has-text("Clear")');
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
    } else {
      const input = this.frame.locator("form.searchbar .cm-editor [role='textbox']");
      await input.fill("");
      await input.press("Enter");
    }
    await this.waitForTableLoaded();
  }

  async expectRowVisible(title: string) {
    const row = this.getPostRow(title);
    await expect(row).toBeVisible();
  }

  async expectNoRecords() {
    const emptyRow = this.frame.locator('tbody tr:has-text("No records")');
    await expect(emptyRow).toBeVisible();
  }
}
