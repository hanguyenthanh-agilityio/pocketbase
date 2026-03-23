import { test, expect } from "@playwright/test";
import { PostPage } from "../pages/post.page";
import {
  normalize,
  hasDifferentValues,
  isSortedAsc,
  isSortedDesc,
  isBooleanAsc,
  isBooleanDesc,
  normalizeBoolean,
} from "../utils/sort";

test.use({ storageState: "playwright/.auth/user.json" });

test.describe("Sort Records", () => {
  let postPage: PostPage;

  test.beforeEach(async ({ page }) => {
    postPage = new PostPage(page);
    await postPage.goto();
  });

  const hasData = (arr: string[]) => arr.length > 0;

  test("TC056 - Sort title ASC", async ({ page }) => {
    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/records") && r.request().method() === "GET"),
      postPage.sortBy("title"),
    ]);

    expect(res.status()).toBe(200);

    await postPage.waitForTableLoaded();

    const titles = normalize(await postPage.getColumnTexts(3));

    expect(hasData(titles)).toBeTruthy();
    if (hasDifferentValues(titles)) {
      expect(isSortedAsc(titles)).toBeTruthy();
    }
  });

  test("TC057 - Sort title DESC", async ({ page }) => {
    await postPage.sortBy("title"); // reset
    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/records") && r.request().method() === "GET"),
      postPage.sortBy("title"),
    ]);

    expect(res.status()).toBe(200);
    await postPage.waitForTableLoaded();

    const titles = normalize(await postPage.getColumnTexts(3));
    expect(hasData(titles)).toBeTruthy();
    if (hasDifferentValues(titles)) {
      expect(isSortedDesc(titles)).toBeTruthy();
    }
  });

  test("TC060 - Sort active ASC", async ({ page }) => {
    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/records") && r.request().method() === "GET"),
      postPage.sortBy("active"),
    ]);

    expect(res.status()).toBe(200);
    await postPage.waitForTableLoaded();

    const values = normalizeBoolean(await postPage.getColumnTexts(5));

    expect(hasData(values)).toBeTruthy();
    if (hasDifferentValues(values)) {
      expect(isBooleanAsc(values)).toBeTruthy();
    }
  });

  test("TC061 - Sort active DESC", async ({ page }) => {
    await postPage.sortBy("active"); // reset
    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/records") && r.request().method() === "GET"),
      postPage.sortBy("active"),
    ]);

    expect(res.status()).toBe(200);
    await postPage.waitForTableLoaded();

    const values = normalize(
      (await postPage.getColumnTexts(5)).map((v) =>
        v.toLowerCase().includes("true") ? "true" : "false"
      )
    );

    expect(hasData(values)).toBeTruthy();
    if (hasDifferentValues(values)) {
      expect(isBooleanDesc(values)).toBeTruthy();
    }
  });
});
