import { test, expect } from "../fixtures/fixture";
import { createPostViaUI } from "../utils/post";

test.describe("Create Post - UI Validation", () => {
  test(
    "TC013 - Verify user can create a post with required fields only (title)",
    { tag: ["@smoke", "@ui", "@post", "@create"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      // Get ID via API
      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.expectPostCreated(title);
    }
  );

  test(
    "TC015 - Verify user can create a post with special characters in title",
    { tag: ["@regression", "@ui", "@post"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `!!!@@@ ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.expectPostCreated(title);
    }
  );

  test(
    "TC016 - Verify system handles title exceeding maximum length",
    { tag: ["@regression", "@ui", "@validation"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const longTitle = "A".repeat(500);

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(longTitle);
        await postPage.clickCreate();
      });

      const posts = await postApi.list(`title="${longTitle}"`);
      const id = posts.items?.[0]?.id;

      if (id) {
        createdPostIds.push(id);
        await postPage.expectCreateSuccess(longTitle);
      } else {
        await postPage.expectCreateError();
      }
    }
  );

  test(
    "TC017 - Verify user can create a post with rich text description",
    { tag: ["@regression", "@ui", "@post"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Rich ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.fillDescription("**bold**");
        await postPage.clickCreate();
      });

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.expectPostCreated(title);
    }
  );

  test(
    "TC018 - Verify user can create a post with long description content",
    { tag: ["@regression", "@ui", "@post"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `Long ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.fillDescription("Lorem ".repeat(100));
        await postPage.clickCreate();
      });

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.expectPostCreated(title);
    }
  );

  test(
    "TC019 - Verify user can create a post with Active status set to ON",
    { tag: ["@regression", "@ui", "@post"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `ON ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.toggleActive(true);
        await postPage.clickCreate();
      });

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.expectPostCreated(title);
    }
  );

  test(
    "TC020 - Verify user can create a post with Active status set to OFF",
    { tag: ["@regression", "@ui", "@post"] },
    async ({ postPage, page, postApi, createdPostIds }) => {
      const title = `OFF ${Date.now()}`;

      await createPostViaUI(page, async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.toggleActive(false);
        await postPage.clickCreate();
      });

      const posts = await postApi.list(`title="${title}"`);
      const id = posts.items?.[0]?.id;
      if (id) createdPostIds.push(id);

      await postPage.expectPostCreated(title);
    }
  );

  test(
    "TC027 - Verify user can cancel post creation and no data is saved",
    { tag: ["@regression", "@ui", "@negative"] },
    async ({ postPage }) => {
      const title = `Cancel ${Date.now()}`;

      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.clickCancel();

      await expect(postPage.getPostRow(title)).toHaveCount(0);
    }
  );

  test(
    "TC028 - Verify modal is closed when user clicks close button",
    { tag: ["@regression", "@ui"] },
    async ({ postPage }) => {
      await postPage.clickNew();
      await postPage.clickCloseModal();

      await expect(postPage.titleInput).toHaveCount(0);
    }
  );
});
