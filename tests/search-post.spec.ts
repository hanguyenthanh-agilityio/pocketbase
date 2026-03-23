import { test, expect } from "@playwright/test";
import { PostPage } from "../pages/post.page";

test.use({ storageState: "playwright/.auth/user.json" });

test.describe("Search Posts", () => {
  let postPage: PostPage;
  let createdTitle: string;

  test.beforeEach(async ({ page }) => {
    postPage = new PostPage(page);
    await postPage.goto();

    createdTitle = `SearchTest ${Date.now()}`;
    await postPage.clickNew();
    await postPage.fillTitle(createdTitle);
    await postPage.clickCreate();
    await postPage.expectPostCreated(createdTitle);
  });

  test.afterEach(async () => {
    const row = postPage.getPostRow(createdTitle);
    if ((await row.count()) > 0) {
      await postPage.selectPost(createdTitle);
      await postPage.clickDelete();
      await postPage.confirmDelete();
      await postPage.expectPostDeleted(createdTitle);
    }
  });

  test("TC065 - Search any keyword", async () => {
    await postPage.searchPost("SearchTest");
    const row = postPage.getPostRow(createdTitle);
    await row.waitFor({ state: "visible", timeout: 10000 });
    await expect(row).toBeVisible();
  });

  test("TC066 - Search uppercase", async () => {
    await postPage.searchPost(createdTitle.toUpperCase());
    const row = postPage.getPostRow(createdTitle);
    await row.waitFor({ state: "visible", timeout: 10000 });
    await expect(row).toBeVisible();
  });

  test("TC067 - Search lowercase", async () => {
    await postPage.searchPost(createdTitle.toLowerCase());
    const row = postPage.getPostRow(createdTitle);
    await row.waitFor({ state: "visible", timeout: 10000 });
    await expect(row).toBeVisible();
  });

  test("TC068 - Search numeric", async () => {
    const numericTitle = `${Date.now()}`;
    await postPage.clickNew();
    await postPage.fillTitle(numericTitle);
    await postPage.clickCreate();
    await postPage.expectPostCreated(numericTitle);

    await postPage.searchPost(numericTitle);
    const row = postPage.getPostRow(numericTitle);
    await row.waitFor({ state: "visible", timeout: 10000 });
    await expect(row).toBeVisible();

    await postPage.selectPost(numericTitle);
    await postPage.clickDelete();
    await postPage.confirmDelete();
    await postPage.expectPostDeleted(numericTitle);
  });

  test("TC069 - Search returns empty result", async () => {
    await postPage.searchPost("randomtext123");

    const noRecordRow = postPage.frame.locator('tbody tr:has-text("No records found.")');
    await noRecordRow.waitFor({ state: "visible", timeout: 10000 });

    await expect(noRecordRow).toBeVisible();

    const clearBtn = noRecordRow.locator('button:has-text("Clear filters")');
    await expect(clearBtn).toBeVisible();
  });

  test("TC070 - Clear search results", async () => {
    await postPage.searchPost(createdTitle);
    await postPage.clearSearch();
    const row = postPage.getPostRow(createdTitle);
    await row.waitFor({ state: "visible", timeout: 10000 });
    await expect(row).toBeVisible();
  });

  test("TC071 - Search result updates record count", async () => {
    await postPage.searchPost(createdTitle);

    await postPage.expectSelectedCount(1);
  });
});
