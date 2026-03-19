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

  test("TC013 - Verify create post with required fields only", async () => {
    const title = `Demo Post ${Date.now()}`;
    const description = "Sample description";

    await postPage.clickNew();
    await postPage.scrollForm();

    await postPage.fillTitle(title);
    await postPage.fillDescription(description);
    await postPage.toggleActive(true);
    await postPage.selectOption();

    await postPage.clickCreate();

    // Wait UI instead of API
    await postPage.expectPostCreated(title);
  });

  test("TC027 - Verify cancel creating post", async () => {
    const title = `Cancel ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.clickCancel();

    await expect(postPage.getPostRow(title)).toHaveCount(0);
  });

  test("TC028 - Verify close modal using X button", async () => {
    await postPage.clickNew();
    await postPage.clickCloseModal();

    await expect(postPage.titleInput).toHaveCount(0);
  });
});
