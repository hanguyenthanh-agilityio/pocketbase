import { test, expect } from "@playwright/test";
import { PostPage } from "../pages/post.page";

// Reuse login session
test.use({ storageState: "playwright/.auth/user.json" });

test.describe("Create A New Post", () => {
  let postPage: PostPage;

  test.beforeEach(async ({ page }) => {
    postPage = new PostPage(page);
    await postPage.goto();
  });

  // Cancel
  test("Cancel creating post", async () => {
    const title = `Cancel ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.clickCancel();

    await expect(postPage.getPostRow(title)).toHaveCount(0);
  });

  // Close modal
  test("Close modal using X button", async () => {
    await postPage.clickNew();
    await postPage.clickCloseModal();

    await expect(postPage.titleInput).toHaveCount(0);
  });
});
