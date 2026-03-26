import { test, expect } from "../fixtures/fixture";

test.describe("Delete Post - UI Validation (Optimized)", () => {
  test(
    "TC048 - Verify user can delete a single post",
    { tag: ["@TC048", "@regression", "@ui", "@post", "@delete"] },
    async ({ postPage, createdPostIds, postApi, page }) => {
      const title = `Post ${Date.now()}`;

      await test.step("Create a new post to delete", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Select the post for deletion", async () => {
        await postPage.selectPost(title);
      });

      await test.step("Click Delete and confirm", async () => {
        await postPage.clickDelete();

        const [res] = await Promise.all([
          page.waitForResponse(
            (r: { url(): string; request(): { method(): string } }) =>
              r.url().includes("/records") && r.request().method() === "DELETE"
          ),
          postPage.confirmDelete(),
        ]);

        expect([200, 204]).toContain(res.status());
      });

      await test.step("Verify post is removed from UI", async () => {
        await postPage.expectPostDeleted(title);
      });
    }
  );

  test(
    "TC049 - Verify user can delete multiple posts",
    { tag: ["@TC049", "@regression", "@ui", "@post", "@delete"] },
    async ({ postPage, createdPostIds, postApi, page }) => {
      const title1 = `Post ${Date.now()}`;
      const title2 = `Post ${Date.now() + 1}`;

      await test.step("Create two posts to delete", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title1);
        await postPage.clickCreate();

        await postPage.clickNew();
        await postPage.fillTitle(title2);
        await postPage.clickCreate();
      });

      await test.step("Track created posts for cleanup", async () => {
        for (const title of [title1, title2]) {
          const createdPost = await postApi.list(`title="${title}"`);
          if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
        }
      });

      await test.step("Select multiple posts", async () => {
        await postPage.selectMultiple([title1, title2]);
      });

      await test.step("Click Delete and confirm", async () => {
        await postPage.clickDelete();

        const [res] = await Promise.all([
          page.waitForResponse(
            (r) => r.url().includes("/records") && r.request().method() === "DELETE"
          ),
          postPage.confirmDelete(),
        ]);

        expect([200, 204]).toContain(res.status());
      });

      await test.step("Verify both posts are removed from UI", async () => {
        await postPage.expectPostDeleted(title1);
        await postPage.expectPostDeleted(title2);
      });
    }
  );

  test(
    "TC050 - Verify Delete button is visible when a post is selected",
    { tag: ["@TC050", "@regression", "@ui", "@post", "@delete"] },
    async ({ postPage, createdPostIds, postApi }) => {
      const title = `Post ${Date.now()}`;

      await test.step("Create a post to select", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Select the post", async () => {
        await postPage.selectPost(title);
      });

      await test.step("Verify Delete button is visible", async () => {
        await expect(postPage.deleteBtn).toBeVisible();
      });
    }
  );

  test(
    "TC051 - Verify Reset selection clears all selected posts",
    { tag: ["@TC051", "@regression", "@ui", "@post", "@delete"] },
    async ({ postPage, createdPostIds, postApi }) => {
      const title1 = `Post ${Date.now()}`;
      const title2 = `Post ${Date.now() + 1}`;

      await test.step("Create two posts to select", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title1);
        await postPage.clickCreate();

        await postPage.clickNew();
        await postPage.fillTitle(title2);
        await postPage.clickCreate();
      });

      await test.step("Track created posts for cleanup", async () => {
        for (const title of [title1, title2]) {
          const createdPost = await postApi.list(`title="${title}"`);
          if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
        }
      });

      await test.step("Select multiple posts", async () => {
        await postPage.selectMultiple([title1, title2]);
      });

      await test.step("Reset selection", async () => {
        await postPage.resetSelection();
      });

      await test.step("Verify no posts selected", async () => {
        await postPage.expectNoSelection();
      });
    }
  );

  test(
    "TC054 - Verify cancelling delete keeps the post",
    { tag: ["@TC054", "@regression", "@ui", "@post", "@negative"] },
    async ({ postPage, createdPostIds, postApi }) => {
      const title = `Post ${Date.now()}`;

      await test.step("Create a post to delete", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Select post and click Delete", async () => {
        await postPage.selectPost(title);
        await postPage.clickDelete();
      });

      await test.step("Cancel the delete", async () => {
        await postPage.cancelDelete();
      });

      await test.step("Verify post still exists", async () => {
        await expect(postPage.getPostRow(title)).toBeVisible();
      });
    }
  );
});
