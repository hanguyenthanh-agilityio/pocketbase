import { test, expect } from "@playwright/test";
import { PostPage } from "../pages/post.page";

test.use({ storageState: "playwright/.auth/user.json" });

test.describe("Create A New Post", () => {
  let postPage: PostPage;

  test.beforeEach(async ({ page }) => {
    postPage = new PostPage(page);
    await postPage.goto();
  });

  test("TC013 - Required fields only", async () => {
    const title = `Post ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);

    await postPage.clickCreate();

    await postPage.expectPostCreated(title);
  });

  test("TC015 - Special characters", async () => {
    const title = "!!!@@@" + Date.now();

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.clickCreate();

    await postPage.expectPostCreated(title);
  });

  test("TC016 - Title max length", async () => {
    const longTitle = "A".repeat(500);

    await postPage.clickNew();
    await postPage.fillTitle(longTitle);
    await postPage.clickCreate();

    await postPage.expectCreateResult(longTitle);
  });

  test("TC017 - Rich text", async () => {
    const title = `Rich ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.fillDescription("**bold**");

    await postPage.clickCreate();
    await postPage.expectPostCreated(title);
  });

  test("TC018 - Long description", async () => {
    const title = `Long ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.fillDescription("Lorem ".repeat(100));

    await postPage.clickCreate();
    await postPage.expectPostCreated(title);
  });

  test("TC019 - Active ON", async () => {
    const title = `ON ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.toggleActive(true);

    await postPage.clickCreate();
    await postPage.expectPostCreated(title);
  });

  test("TC020 - Active OFF", async () => {
    const title = `OFF ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.toggleActive(false);

    await postPage.clickCreate();
    await postPage.expectPostCreated(title);
  });

  test("TC027 - Cancel create", async () => {
    const title = `Cancel ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.clickCancel();

    await expect(postPage.getPostRow(title)).toHaveCount(0);
  });

  test("TC028 - Close modal", async () => {
    await postPage.clickNew();
    await postPage.clickCloseModal();

    await expect(postPage.titleInput).toHaveCount(0);
  });
});
