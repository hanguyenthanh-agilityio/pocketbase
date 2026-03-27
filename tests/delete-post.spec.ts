import { postsTest as test, expect } from "../fixtures/post";

test.describe("Delete Post - UI Validation (Optimized)", () => {
  test(
    "TC048 - Verify user can delete a single post",
    { tag: ["@TC048", "@regression", "@ui", "@post", "@delete"] },
    async ({ createPostPage }) => {
      const post = createPostPage.postList[0];

      await test.step("Select the post for deletion", async () => {
        await createPostPage.selectPost(post.title);
      });

      await test.step("Click Delete and confirm", async () => {
        await createPostPage.clickDelete();
        await createPostPage.confirmDelete();
      });

      await test.step("Verify post is removed from UI", async () => {
        await createPostPage.expectPostDeleted(post.title);
      });
    }
  );

  test.describe("Multiple delete scenarios", () => {
    test.use({ postCount: 2 });

    test(
      "TC049 - Verify user can delete multiple posts",
      { tag: ["@TC049", "@regression", "@ui", "@post", "@delete"] },
      async ({ createPostPage }) => {
        const [post1, post2] = createPostPage.postList;

        await test.step("Select multiple posts", async () => {
          await createPostPage.selectMultiple([post1.title, post2.title]);
        });

        await test.step("Click Delete and confirm", async () => {
          await createPostPage.clickDelete();
          await createPostPage.confirmDelete();
        });

        await test.step("Verify both posts are removed from UI", async () => {
          await createPostPage.expectPostDeleted(post1.title);
          await createPostPage.expectPostDeleted(post2.title);
        });
      }
    );

    test(
      "TC050 - Verify Delete button is visible when a post is selected",
      { tag: ["@TC050", "@regression", "@ui", "@post", "@delete"] },
      async ({ createPostPage }) => {
        const post = createPostPage.postList[0];

        await test.step("Select the post", async () => {
          await createPostPage.selectPost(post.title);
        });

        await test.step("Verify Delete button is visible", async () => {
          await expect(createPostPage.deleteBtn).toBeVisible();
        });
      }
    );

    test(
      "TC051 - Verify Reset selection clears all selected posts",
      { tag: ["@TC051", "@regression", "@ui", "@post", "@delete"] },
      async ({ createPostPage }) => {
        const [post1, post2] = createPostPage.postList;

        await test.step("Select multiple posts", async () => {
          await createPostPage.selectMultiple([post1.title, post2.title]);
        });

        await test.step("Reset selection", async () => {
          await createPostPage.resetSelection();
        });

        await test.step("Verify no posts selected", async () => {
          await expect(createPostPage.deleteBtn).not.toBeVisible();
        });
      }
    );
  });

  test(
    "TC054 - Verify cancelling delete keeps the post",
    { tag: ["@TC054", "@regression", "@ui", "@post", "@negative"] },
    async ({ createPostPage }) => {
      const post = createPostPage.postList[0];

      await test.step("Select post and click Delete", async () => {
        await createPostPage.selectPost(post.title);
        await createPostPage.clickDelete();
      });

      await test.step("Cancel the delete", async () => {
        await createPostPage.cancelDelete();
      });

      await test.step("Verify post still exists", async () => {
        await expect(createPostPage.getPostRow(post.title)).toBeVisible();
      });
    }
  );
});
