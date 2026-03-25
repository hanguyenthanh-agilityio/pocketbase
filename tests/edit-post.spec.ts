import { test, expect } from "../fixtures/fixture";
import { createPostViaUI } from "../utils/post";

test.describe("Edit Post", () => {
  test(
    "TC031 - Verify user can open edit form",
    { tag: ["@smoke", "@ui", "@post", "@edit"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      // Create post first
      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      // Cleanup tracking
      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);
      await expect(postPage.titleInput).toBeVisible();
    }
  );

  test(
    "TC032 - Verify user can update post title",
    { tag: ["@smoke", "@ui", "@post", "@edit"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;
      const updated = `Updated ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

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
    { tag: ["@regression", "@ui", "@post"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;
      const updated = `Updated Description ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);
      await postPage.fillDescription(updated);
      await postPage.clickSave();
    }
  );

  test(
    "TC034 - Verify user can update all post fields",
    { tag: ["@regression", "@ui", "@post"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;
      const updatedTitle = `Updated ${Date.now()}`;
      const updatedDesc = `Updated Description ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);
      await postPage.updateTitle(updatedTitle);
      await postPage.fillDescription(updatedDesc);
      await postPage.toggleActive(true);
      await postPage.selectOption();

      await postPage.clickSave();
      await postPage.expectPostUpdated(updatedTitle);
    }
  );

  test(
    "TC035 - Verify validation error when title is empty",
    { tag: ["@regression", "@ui", "@validation"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

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
    { tag: ["@regression", "@ui", "@post"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

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
    { tag: ["@regression", "@ui", "@post"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

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
    { tag: ["@regression", "@ui", "@negative"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;
      const updated = "Should not save";

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

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
    { tag: ["@regression", "@ui"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

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
    { tag: ["@regression", "@ui"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

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
    { tag: ["@regression", "@ui"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

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
    { tag: ["@regression", "@ui"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.openEdit(title);

      await postPage.expectSaveEnabled(false);
    }
  );
});
