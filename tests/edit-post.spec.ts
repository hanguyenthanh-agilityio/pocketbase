import { test, expect } from "@playwright/test";
import { PostPage } from "../pages/post.page";

test.use({ storageState: "playwright/.auth/user.json" });

test.describe("Edit Post", () => {
  let postPage: PostPage;
  let originalTitle: string;

  test.beforeEach(async ({ page }) => {
    postPage = new PostPage(page);
    await postPage.goto();

    originalTitle = `Post ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(originalTitle);
    await postPage.clickCreate();

    await postPage.expectPostCreated(originalTitle);
  });
  test("TC031 - Open edit form", async () => {
    await postPage.openEdit(originalTitle);

    await expect(postPage.titleInput).toBeVisible();
  });

  test("TC032 - Update title", async () => {
    const updated = `Updated ${Date.now()}`;

    await postPage.openEdit(originalTitle);
    await postPage.updateTitle(updated);
    await postPage.clickSave();

    await postPage.expectPostUpdated(updated);
  });

  test("TC033 - Update description", async () => {
    const updated = `Updated Description ${Date.now()}`;

    await postPage.openEdit(originalTitle);
    await postPage.fillDescription(updated);
    await postPage.clickSave();
  });

  test("TC034 - Update all fields", async () => {
    const updatedTitle = `Updated ${Date.now()}`;
    const updatedDesc = `Updated Description ${Date.now()}`;

    await postPage.openEdit(originalTitle);
    await postPage.updateTitle(updatedTitle);
    await postPage.fillDescription(updatedDesc);
    await postPage.toggleActive(true);
    await postPage.selectOption();

    await postPage.clickSave();
    await postPage.expectPostUpdated(updatedTitle);
  });

  test("TC035 - Validation: Empty title", async () => {
    await postPage.openEdit(originalTitle);
    await postPage.clearTitle();
    await postPage.clickSave();

    expect(await postPage.isTitleInvalid()).toBe(true);
  });

  test("TC037 - Active ON", async () => {
    await postPage.openEdit(originalTitle);
    await postPage.toggleActive(true);
    await postPage.clickSave();

    await postPage.expectPostUpdated(originalTitle);
  });

  test("TC038 - Active OFF", async () => {
    await postPage.openEdit(originalTitle);
    await postPage.toggleActive(false);
    await postPage.clickSave();

    await postPage.expectPostUpdated(originalTitle);
  });

  test("TC041 - Cancel edit", async () => {
    const updated = "Should not save";

    await postPage.openEdit(originalTitle);
    await postPage.updateTitle(updated);
    await postPage.clickCancel();

    await expect(postPage.getPostRow(updated)).toHaveCount(0);
    await expect(postPage.getPostRow(originalTitle)).toBeVisible();
  });

  test("TC42 - Close modal", async () => {
    await postPage.openEdit(originalTitle);
    await postPage.clickCloseModal();

    await expect(postPage.titleInput).toHaveCount(0);
  });

  test("TC043 - Unsaved changes warning", async () => {
    const updated = "Unsaved";

    await postPage.openEdit(originalTitle);
    await postPage.updateTitle(updated);
    await postPage.clickCloseModal();

    await expect(postPage.getUnsavedWarning()).toBeVisible();
  });

  test("TC044 - Save enabled when changed", async () => {
    const updated = "Changed";

    await postPage.openEdit(originalTitle);
    await postPage.updateTitle(updated);

    // Initially disabled
    await postPage.expectSaveEnabled(true);
  });

  test("TC045 - Save disabled when no changes", async () => {
    await postPage.openEdit(originalTitle);

    // Initially disabled
    await postPage.expectSaveEnabled(false);
  });
});
