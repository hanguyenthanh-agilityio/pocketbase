import { test, expect } from "@playwright/test";
import { PostPage } from "../pages/post.page";

test.use({ storageState: "playwright/.auth/user.json" });

test.describe("Delete Post", () => {
  let postPage: PostPage;
  let post1: string;
  let post2: string;

  test.beforeEach(async ({ page }) => {
    postPage = new PostPage(page);
    await postPage.goto();

    post1 = `Post ${Date.now()}`;
    post2 = `Post ${Date.now() + 1}`;

    // Create post 1
    await postPage.clickNew();
    await postPage.fillTitle(post1);
    await postPage.clickCreate();
    await postPage.expectPostCreated(post1);

    // Create post 2
    await postPage.clickNew();
    await postPage.fillTitle(post2);
    await postPage.clickCreate();
    await postPage.expectPostCreated(post2);
  });

  test("TC048 - Delete single post", async ({ page }) => {
    await postPage.selectPost(post1);

    await postPage.clickDelete();

    const [res] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/records") && r.request().method() === "DELETE"
      ),
      postPage.confirmDelete(),
    ]);

    expect([200, 204]).toContain(res.status());

    await postPage.expectPostDeleted(post1);
  });

  test("TC049 - Delete multiple posts", async ({ page }) => {
    await postPage.selectMultiple([post1, post2]);

    await postPage.clickDelete();

    const [res] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/records") && r.request().method() === "DELETE"
      ),
      postPage.confirmDelete(),
    ]);

    expect([200, 204]).toContain(res.status());

    await postPage.expectPostDeleted(post1);
    await postPage.expectPostDeleted(post2);
  });

  test("TC050 - Delete button visible when selected", async () => {
    await postPage.selectPost(post1);

    await expect(postPage.deleteBtn).toBeVisible();
  });

  test("TC051 - Reset selection", async () => {
    await postPage.selectMultiple([post1, post2]);

    await postPage.resetSelection();

    await expect(postPage.selectedText).toHaveCount(0);
  });

  test("TC052 - Total count decreases", async ({ page }) => {
    const rows = postPage.frame.locator("tbody tr");

    const countBefore = await rows.count();

    await postPage.selectPost(post1);
    await postPage.clickDelete();

    const [res] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/records") && r.request().method() === "DELETE"
      ),
      postPage.confirmDelete(),
    ]);

    expect([200, 204]).toContain(res.status());

    // Wait table re-render
    await expect(rows).toHaveCount(countBefore - 1);
  });

  test("TC054 - Cancel delete", async () => {
    await postPage.selectPost(post1);

    await postPage.clickDelete();
    await postPage.cancelDelete();

    await expect(postPage.getPostRow(post1)).toBeVisible();
  });
});
