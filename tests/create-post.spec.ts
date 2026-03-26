import { test, expect } from "../fixtures/fixture";

test.describe("Create Post - UI Validation (Optimized)", () => {
  test(
    "TC013 - Verify user can create a post with required fields only (title)",
    { tag: ["@TC013", "@smoke", "@ui", "@post", "@create"] },
    async ({ postPage, createdPostIds, postApi }) => {
      const title = `Post ${Date.now()}`;

      await test.step("Open new post modal and fill title", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Verify post appears in UI", async () => {
        await expect(postPage.getRowByData(title)).toBeVisible();
      });

      await test.step("Track for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });
    }
  );

  test(
    "TC015 - Verify user can create a post with special characters in title",
    { tag: ["@TC015", "@regression", "@ui", "@post"] },
    async ({ postPage, createdPostIds, postApi }) => {
      const title = `!!!@@@ ${Date.now()}`;

      await test.step("Open new post modal and fill title", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Verify post appears in UI", async () => {
        await expect(postPage.getRowByData(title)).toBeVisible();
      });

      await test.step("Track for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });
    }
  );

  test(
    "TC016 - Verify system handles title exceeding maximum length",
    { tag: ["@TC016", "@regression", "@ui", "@validation"] },
    async ({ postPage, createdPostIds, postApi }) => {
      const title = "A".repeat(500);

      await test.step("Open new post modal and fill long title", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Verify post appears in UI (if created)", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]) {
          createdPostIds.push(createdPost.items[0].id);
          await expect(postPage.getRowByData(title.slice(0, 20))).toBeVisible();
        } else {
          const error = postPage.frame.locator(".error, .invalid, .text-danger");
          await expect(error).toBeVisible();
        }
      });
    }
  );

  test(
    "TC017 - Verify user can create a post with rich text description",
    { tag: ["@TC017", "@regression", "@ui", "@post"] },
    async ({ postPage, createdPostIds, postApi }) => {
      const title = `Rich ${Date.now()}`;

      await test.step("Open new post modal and fill data", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.fillDescription("**bold**");
        await postPage.clickCreate();
      });

      await test.step("Verify post appears in UI", async () => {
        await expect(postPage.getRowByData(title)).toBeVisible();
      });

      await test.step("Track for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });
    }
  );

  test(
    "TC018 - Verify user can create a post with long description content",
    { tag: ["@TC018", "@regression", "@ui", "@post"] },
    async ({ postPage, createdPostIds, postApi }) => {
      const title = `Long ${Date.now()}`;
      const longDesc = "Lorem ".repeat(100);

      await test.step("Open new post modal and fill data", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.fillDescription(longDesc);
        await postPage.clickCreate();
      });

      await test.step("Verify post appears in UI", async () => {
        await expect(postPage.getRowByData(title)).toBeVisible();
      });

      await test.step("Track for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });
    }
  );

  test(
    "TC019 - Verify user can create a post with Active status ON",
    { tag: ["@TC019", "@regression", "@ui", "@post"] },
    async ({ postPage, createdPostIds, postApi }) => {
      const title = `ON ${Date.now()}`;

      await test.step("Open new post modal, fill title and toggle active", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.toggleActive(true);
        await postPage.clickCreate();
      });

      await test.step("Verify post appears in UI", async () => {
        await expect(postPage.getRowByData(title)).toBeVisible();
      });

      await test.step("Track for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });
    }
  );

  test(
    "TC020 - Verify user can create a post with Active status OFF",
    { tag: ["@TC020", "@regression", "@ui", "@post"] },
    async ({ postPage, createdPostIds, postApi }) => {
      const title = `OFF ${Date.now()}`;

      await test.step("Open new post modal, fill title and toggle inactive", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.toggleActive(false);
        await postPage.clickCreate();
      });

      await test.step("Verify post appears in UI", async () => {
        await expect(postPage.getRowByData(title)).toBeVisible();
      });

      await test.step("Track for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });
    }
  );

  test(
    "TC027 - Verify user can cancel post creation",
    { tag: ["@TC027", "@regression", "@ui", "@negative"] },
    async ({ postPage }) => {
      const title = `Cancel ${Date.now()}`;

      await test.step("Open and cancel modal", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCancel();
      });

      await test.step("Verify no data created", async () => {
        await expect(postPage.getRowByData(title)).toHaveCount(0);
      });
    }
  );

  test(
    "TC028 - Verify user can close modal",
    { tag: ["@TC028", "@regression", "@ui"] },
    async ({ postPage }) => {
      await test.step("Open and close modal", async () => {
        await postPage.clickNew();
        await postPage.clickCloseModal();
      });

      await test.step("Verify modal closed", async () => {
        await expect(postPage.titleInput).toHaveCount(0);
      });
    }
  );
});
