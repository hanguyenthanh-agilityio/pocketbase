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

  test("Cancel creating post", async () => {
    await postPage.clickNew();
    await postPage.fillTitle("Cancel Test");
    await postPage.clickCancel();
    await expect(postPage.getPostRow("Cancel Test")).toHaveCount(0);
  });
});
