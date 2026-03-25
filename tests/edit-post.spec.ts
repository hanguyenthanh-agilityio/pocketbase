import { test, expect } from "../fixtures/fixture";

test.describe("Edit Post - UI Validation", () => {
  test(
    "TC031 - Verify user can open edit form",
    { tag: ["@TC031", "@smoke", "@ui", "@post", "@edit"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      // Create post inline
      await postPage.goto();
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.clickCreate();

      // Track created post
      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      // Open edit
      await postPage.openEdit(title);
      await expect(postPage.titleInput).toBeVisible();
    }
  );

  test(
    "TC032 - Verify user can update post title",
    { tag: ["@TC032", "@smoke", "@ui", "@post", "@edit"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;
      const updated = `Updated ${Date.now()}`;

      await postPage.goto();
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.clickCreate();

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);
      await postPage.updateTitle(updated);
      await postPage.clickSave();

      await postPage.expectPostUpdated(updated);
    }
  );

  test(
    "TC033 - Verify user can update post description",
    { tag: ["@TC033", "@regression", "@ui", "@post"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;
      const updatedDesc = `Updated Description ${Date.now()}`;

      await postPage.goto();
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.clickCreate();

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);
      await postPage.fillDescription(updatedDesc);
      await postPage.clickSave();
    }
  );

  test(
    "TC034 - Verify user can update all post fields",
    { tag: ["@TC034", "@regression", "@ui", "@post"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;
      const updatedTitle = `Updated ${Date.now()}`;
      const updatedDesc = `Updated Description ${Date.now()}`;

      await postPage.goto();
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.clickCreate();

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);
      await postPage.updateTitle(updatedTitle);
      await postPage.fillDescription(updatedDesc);
      await postPage.toggleActive(true);

      await postPage.clickSave();
      await postPage.expectPostUpdated(updatedTitle);
    }
  );

  test(
    "TC035 - Verify validation error when title is empty",
    { tag: ["@TC035", "@regression", "@ui", "@validation"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await postPage.goto();
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.clickCreate();

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);
      await postPage.clearTitle();
      await postPage.clickSave();

      expect(await postPage.isTitleInvalid()).toBe(true);
    }
  );

  test(
    "TC037 - Verify user can set Active status to ON",
    { tag: ["@TC037", "@regression", "@ui", "@post"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await postPage.goto();
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.clickCreate();

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);
      await postPage.toggleActive(true);
      await postPage.clickSave();

      await postPage.expectPostUpdated(title);
    }
  );

  test(
    "TC038 - Verify user can set Active status to OFF",
    { tag: ["@TC038", "@regression", "@ui", "@post"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await postPage.goto();
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.clickCreate();

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);
      await postPage.toggleActive(false);
      await postPage.clickSave();

      await postPage.expectPostUpdated(title);
    }
  );

  test(
    "TC041 - Verify changes are not saved when user cancels edit",
    { tag: ["@TC041", "@regression", "@ui", "@negative"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;
      const updated = "Should not save";

      await postPage.goto();
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.clickCreate();

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);
      await postPage.updateTitle(updated);
      await postPage.clickCancel();

      await expect(postPage.getPostRow(updated)).toHaveCount(0);
      await expect(postPage.getPostRow(title)).toBeVisible();
    }
  );

  test(
    "TC042 - Verify edit modal is closed when user clicks close button",
    { tag: ["@TC042", "@regression", "@ui"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await postPage.goto();
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.clickCreate();

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);
      await postPage.clickCloseModal();

      await expect(postPage.titleInput).toHaveCount(0);
    }
  );

  test(
    "TC043 - Verify warning is shown when closing with unsaved changes",
    { tag: ["@TC043", "@regression", "@ui"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await postPage.goto();
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.clickCreate();

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);
      await postPage.updateTitle("Unsaved");
      await postPage.clickCloseModal();

      await expect(postPage.getUnsavedWarning()).toBeVisible();
    }
  );

  test(
    "TC044 - Verify Save button is enabled when form is changed",
    { tag: ["@TC044", "@regression", "@ui"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await postPage.goto();
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.clickCreate();

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);
      await postPage.updateTitle("Changed");

      await postPage.expectSaveEnabled(true);
    }
  );

  test(
    "TC045 - Verify Save button is disabled when no changes are made",
    { tag: ["@TC045", "@regression", "@ui"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await postPage.goto();
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.clickCreate();

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);

      await postPage.expectSaveEnabled(false);
    }
  );
});
