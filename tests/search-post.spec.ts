import { postsSearchTest as test } from "../fixtures/search";

test.describe("Search Posts - UI Validation (Optimized)", () => {
  test(
    "TC065 - Search any keyword",
    { tag: ["@TC065", "@regression", "@ui", "@post", "@search"] },
    async ({ searchPostPage }) => {
      const post = searchPostPage.postList[0];

      await test.step("Search keyword 'search_'", async () => {
        await searchPostPage.search("search_");
      });

      await test.step("Verify post row is visible", async () => {
        await searchPostPage.expectRowVisible(post.title);
      });
    }
  );

  test(
    "TC066 - Search uppercase keyword",
    { tag: ["@TC066", "@regression", "@ui", "@post", "@search"] },
    async ({ searchPostPage }) => {
      const post = searchPostPage.postList[0];

      await test.step("Search using uppercase title", async () => {
        await searchPostPage.search(post.title.toUpperCase());
      });

      await test.step("Verify post row is visible", async () => {
        await searchPostPage.expectRowVisible(post.title);
      });
    }
  );

  test(
    "TC067 - Search lowercase keyword",
    { tag: ["@TC067", "@regression", "@ui", "@post", "@search"] },
    async ({ searchPostPage }) => {
      const post = searchPostPage.postList[0];

      await test.step("Search using lowercase title", async () => {
        await searchPostPage.search(post.title.toLowerCase());
      });

      await test.step("Verify post row is visible", async () => {
        await searchPostPage.expectRowVisible(post.title);
      });
    }
  );

  test(
    "TC069 - Search returns empty result",
    { tag: ["@TC069", "@regression", "@ui", "@negative"] },
    async ({ searchPostPage }) => {
      await test.step("Search random text 'randomtext123'", async () => {
        await searchPostPage.search("randomtext123");
      });

      await test.step("Verify 'No records' is displayed", async () => {
        await searchPostPage.expectNoRecords();
      });
    }
  );

  test(
    "TC070 - Clear search restores data",
    { tag: ["@TC070", "@regression", "@ui", "@post", "@search"] },
    async ({ searchPostPage }) => {
      const post = searchPostPage.postList[0];

      await test.step("Search using a post title", async () => {
        await searchPostPage.search(post.title);
      });

      await test.step("Clear search input", async () => {
        await searchPostPage.clearSearch();
      });

      await test.step("Verify original data is restored", async () => {
        await searchPostPage.expectRowVisible(post.title);
      });
    }
  );
});
