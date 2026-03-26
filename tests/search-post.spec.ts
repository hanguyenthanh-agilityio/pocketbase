import { test, expect } from "../fixtures/fixture";

test.describe("Search Posts - UI Validation (Optimized)", () => {
  test(
    "TC065 - Search any keyword",
    { tag: ["@TC065", "@regression", "@ui", "@post", "@search"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `SearchTest ${Date.now()}`;

      await test.step("Create post", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track for cleanup", async () => {
        const res = await postApi.list(`title="${title}"`);
        if (res.items?.[0]?.id) createdPostIds.push(res.items[0].id);
      });

      await test.step("Search keyword", async () => {
        await postPage.searchPost("SearchTest");
      });

      await test.step("Verify result", async () => {
        await expect(postPage.getPostRow(title)).toBeVisible();
      });
    }
  );

  test(
    "TC066 - Search uppercase",
    { tag: ["@TC066", "@regression", "@ui", "@post", "@search"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `SearchTest ${Date.now()}`;

      await test.step("Create post", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track for cleanup", async () => {
        const res = await postApi.list(`title="${title}"`);
        if (res.items?.[0]?.id) createdPostIds.push(res.items[0].id);
      });

      await test.step("Search uppercase", async () => {
        await postPage.searchPost(title.toUpperCase());
      });

      await test.step("Verify result", async () => {
        await expect(postPage.getPostRow(title)).toBeVisible();
      });
    }
  );

  test(
    "TC067 - Search lowercase",
    { tag: ["@TC067", "@regression", "@ui", "@post", "@search"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `SearchTest ${Date.now()}`;

      await test.step("Create post", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track for cleanup", async () => {
        const res = await postApi.list(`title="${title}"`);
        if (res.items?.[0]?.id) createdPostIds.push(res.items[0].id);
      });

      await test.step("Search lowercase", async () => {
        await postPage.searchPost(title.toLowerCase());
      });

      await test.step("Verify result", async () => {
        await expect(postPage.getPostRow(title)).toBeVisible();
      });
    }
  );

  test(
    "TC069 - Search returns empty result",
    { tag: ["@TC069", "@regression", "@ui", "@negative"] },
    async ({ postPage }) => {
      await test.step("Search random keyword", async () => {
        await postPage.searchPost("randomtext123");
      });

      await test.step("Verify empty result", async () => {
        const emptyRow = postPage.frame.locator('tbody tr:has-text("No records")');
        await expect(emptyRow).toBeVisible();
      });
    }
  );

  test(
    "TC070 - Clear search",
    { tag: ["@TC070", "@regression", "@ui"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `SearchTest ${Date.now()}`;

      await test.step("Create post", async () => {
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track for cleanup", async () => {
        const res = await postApi.list(`title="${title}"`);
        if (res.items?.[0]?.id) createdPostIds.push(res.items[0].id);
      });

      await test.step("Search and clear", async () => {
        await postPage.searchPost(title);
        await postPage.clearSearch();
      });

      await test.step("Verify data restored", async () => {
        await expect(postPage.getPostRow(title)).toBeVisible();
      });
    }
  );
});
