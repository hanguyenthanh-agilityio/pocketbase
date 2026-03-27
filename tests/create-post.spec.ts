import { PostAPI } from "../api/post";
import { postsTest as test, expect } from "../fixtures/post";
import { PostData } from "../types/post";

// Helper track post for cleanup
async function trackPost(title: string, postApi: PostAPI, createdPostIds: string[]) {
  const res = await postApi.list(`title="${title}"`);
  const post = res.data.find((p: PostData) => p.title === title);

  if (post) {
    createdPostIds.push(post.id);
  }
}

test.describe("Create Post - UI Validation", () => {
  test(
    "TC013 - Verify user can create a post with required fields only (title)",
    { tag: ["@TC013", "@smoke", "@ui", "@post", "@create"] },
    async ({ createPostPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await test.step("Create post", async () => {
        await createPostPage.clickNew();
        await createPostPage.fillTitle(title);
        await createPostPage.clickCreate();
      });

      await test.step("Verify UI", async () => {
        await createPostPage.expectPostUpdated(title);
      });

      await test.step("Track cleanup", async () => {
        await trackPost(title, postApi, createdPostIds);
      });
    }
  );

  test(
    "TC015 - Verify user can create post with special characters",
    { tag: ["@TC015", "@regression", "@ui", "@post"] },
    async ({ createPostPage, postApi, createdPostIds }) => {
      const title = `!!!@@@ ${Date.now()}`;

      await createPostPage.clickNew();
      await createPostPage.fillTitle(title);
      await createPostPage.clickCreate();

      await createPostPage.expectPostUpdated(title);

      await trackPost(title, postApi, createdPostIds);
    }
  );

  test(
    "TC016 - Verify system handles long title",
    { tag: ["@TC016", "@regression", "@ui", "@validation"] },
    async ({ createPostPage, postApi, createdPostIds }) => {
      const title = "A".repeat(500);

      await createPostPage.clickNew();
      await createPostPage.fillTitle(title);
      await createPostPage.clickCreate();

      const row = createPostPage.getRowByData(title.slice(0, 20));
      const error = createPostPage.frame.locator(".error, .invalid, .text-danger");

      if (await row.count()) {
        await expect(row).toBeVisible();
        await trackPost(title, postApi, createdPostIds); // only track if created
      } else {
        await expect(error).toBeVisible();
      }
    }
  );

  test(
    "TC017 - Verify create post with rich text description",
    { tag: ["@TC017", "@regression", "@ui", "@post"] },
    async ({ createPostPage, postApi, createdPostIds }) => {
      const title = `Rich ${Date.now()}`;

      await createPostPage.clickNew();
      await createPostPage.fillTitle(title);
      await createPostPage.fillDescription("**bold**");
      await createPostPage.clickCreate();

      await createPostPage.expectPostUpdated(title);

      await trackPost(title, postApi, createdPostIds);
    }
  );

  test(
    "TC018 - Verify create post with long description",
    { tag: ["@TC018", "@regression", "@ui", "@post"] },
    async ({ createPostPage, postApi, createdPostIds }) => {
      const title = `Long ${Date.now()}`;
      const longDesc = "Lorem ".repeat(100);

      await createPostPage.clickNew();
      await createPostPage.fillTitle(title);
      await createPostPage.fillDescription(longDesc);
      await createPostPage.clickCreate();

      await createPostPage.expectPostUpdated(title);

      await trackPost(title, postApi, createdPostIds);
    }
  );

  test(
    "TC019 - Verify create post with Active ON",
    { tag: ["@TC019", "@regression", "@ui", "@post"] },
    async ({ createPostPage, postApi, createdPostIds }) => {
      const title = `ON ${Date.now()}`;

      await createPostPage.clickNew();
      await createPostPage.fillTitle(title);
      await createPostPage.toggleActive(true);
      await createPostPage.clickCreate();

      await createPostPage.expectPostUpdated(title);

      await trackPost(title, postApi, createdPostIds);
    }
  );

  test(
    "TC020 - Verify create post with Active OFF",
    { tag: ["@TC020", "@regression", "@ui", "@post"] },
    async ({ createPostPage, postApi, createdPostIds }) => {
      const title = `OFF ${Date.now()}`;

      await createPostPage.clickNew();
      await createPostPage.fillTitle(title);
      await createPostPage.toggleActive(false);
      await createPostPage.clickCreate();

      await createPostPage.expectPostUpdated(title);

      await trackPost(title, postApi, createdPostIds);
    }
  );

  test(
    "TC027 - Verify cancel creation",
    { tag: ["@TC027", "@regression", "@ui", "@negative"] },
    async ({ createPostPage }) => {
      const title = `Cancel ${Date.now()}`;

      await createPostPage.clickNew();
      await createPostPage.fillTitle(title);
      await createPostPage.clickCancel();

      await expect(createPostPage.getPostRow(title)).toHaveCount(0);
    }
  );

  test(
    "TC028 - Verify close modal",
    { tag: ["@TC028", "@regression", "@ui"] },
    async ({ createPostPage }) => {
      await createPostPage.clickNew();
      await createPostPage.clickCloseModal();

      await expect(createPostPage.titleInput).toHaveCount(0);
    }
  );
});
