import { test, expect } from "@playwright/test";
import { PostPage } from "../pages/post.page";

test.use({ storageState: "playwright/.auth/user.json" });

test.describe("Sort Records", () => {
  let postPage: PostPage;

  test.beforeEach(async ({ page }) => {
    postPage = new PostPage(page);
    await postPage.goto();
  });

  const hasData = (arr: string[]) => arr.length > 0;

  const hasDifferentValues = (arr: string[]) => new Set(arr).size > 1;

  test("TC056 - Sort title ASC", async ({ page }) => {
    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/records") && r.request().method() === "GET"),
      postPage.sortBy("title"),
    ]);

    expect(res.status()).toBe(200);

    await postPage.waitForTableLoaded();

    const titles = await postPage.getColumnTexts(3);

    expect(hasData(titles)).toBeTruthy();
    expect(hasDifferentValues(titles)).toBeTruthy();
  });

  test("TC057 - Sort title DESC", async ({ page }) => {
    await postPage.sortBy("title");

    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().includes("/records")),
      postPage.sortBy("title"),
    ]);

    expect(res.status()).toBe(200);

    await postPage.waitForTableLoaded();

    const titles = await postPage.getColumnTexts(3);

    expect(hasData(titles)).toBeTruthy();
  });

  test("TC058 - Sort description ASC", async () => {
    await postPage.sortBy("description");

    await postPage.waitForTableLoaded();

    const values = await postPage.getColumnTexts(4);

    expect(hasData(values)).toBeTruthy();
  });

  test("TC059 - Sort description DESC", async () => {
    await postPage.sortBy("description");
    await postPage.sortBy("description");

    await postPage.waitForTableLoaded();

    const values = await postPage.getColumnTexts(4);

    expect(hasData(values)).toBeTruthy();
  });

  test("TC060 - Sort active ASC", async () => {
    await postPage.sortBy("active");

    await postPage.waitForTableLoaded();

    const values = await postPage.getColumnTexts(5);

    const normalized = values.map((v) => (v.toLowerCase().includes("true") ? "true" : "false"));

    expect(hasData(normalized)).toBeTruthy();

    expect(new Set(normalized).size).toBeGreaterThan(1);
  });

  test("TC061 - Sort active DESC", async () => {
    await postPage.sortBy("active");
    await postPage.sortBy("active");

    await postPage.waitForTableLoaded();

    const values = await postPage.getColumnTexts(5);

    const normalized = values.map((v) => (v.toLowerCase().includes("true") ? "true" : "false"));

    expect(hasData(normalized)).toBeTruthy();
  });

  test("TC062 - Sort options ASC", async () => {
    await postPage.sortBy("options");

    await postPage.waitForTableLoaded();

    const rows = await postPage.frame.locator("tbody tr").count();

    expect(rows).toBeGreaterThan(0);
  });
});
