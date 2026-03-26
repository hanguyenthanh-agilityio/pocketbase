import { postsTest as test, expect } from "../fixtures/post";
import {
  normalize,
  hasDifferentValues,
  isSortedAsc,
  isSortedDesc,
  isBooleanAsc,
  isBooleanDesc,
  normalizeBoolean,
} from "../utils/sort";

test.describe("Sort Records - UI Validation (Optimized)", () => {
  const hasData = (arr: string[]) => arr.length > 0;

  test(
    "TC056 - Verify user can sort posts by title ascending",
    { tag: ["@TC056", "@regression", "@ui", "@post", "@sort"] },
    async ({ createPostPage }) => {
      let titles: string[] = [];

      await test.step("Sort by title ASC", async () => {
        await createPostPage.sortBy("title", "asc");
        await createPostPage.waitForTableLoaded();
      });

      await test.step("Get titles from table", async () => {
        titles = normalize(await createPostPage.getColumnTexts(3));
      });

      await test.step("Verify sorting result", async () => {
        expect(hasData(titles)).toBeTruthy();
        if (hasDifferentValues(titles)) {
          expect(isSortedAsc(titles)).toBeTruthy();
        }
      });
    }
  );

  test(
    "TC057 - Verify user can sort posts by title descending",
    { tag: ["@TC057", "@regression", "@ui", "@post", "@sort"] },
    async ({ createPostPage }) => {
      let titles: string[] = [];

      await test.step("Sort by title DESC", async () => {
        await createPostPage.sortBy("title", "desc");
        await createPostPage.waitForTableLoaded();
      });

      await test.step("Get titles from table", async () => {
        titles = normalize(await createPostPage.getColumnTexts(3));
      });

      await test.step("Verify sorting result", async () => {
        expect(hasData(titles)).toBeTruthy();
        if (hasDifferentValues(titles)) {
          expect(isSortedDesc(titles)).toBeTruthy();
        }
      });
    }
  );

  test(
    "TC060 - Verify user can sort posts by active status ascending",
    { tag: ["@TC060", "@regression", "@ui", "@post", "@sort"] },
    async ({ createPostPage }) => {
      let values: string[] = [];

      await test.step("Sort by active ASC", async () => {
        await createPostPage.sortBy("active", "asc");
        await createPostPage.waitForTableLoaded();
      });

      await test.step("Get active values from table", async () => {
        values = normalizeBoolean(await createPostPage.getColumnTexts(5));
      });

      await test.step("Verify sorting result", async () => {
        expect(hasData(values)).toBeTruthy();
        if (hasDifferentValues(values)) {
          expect(isBooleanAsc(values)).toBeTruthy();
        }
      });
    }
  );

  test(
    "TC061 - Verify user can sort posts by active status descending",
    { tag: ["@TC061", "@regression", "@ui", "@post", "@sort"] },
    async ({ createPostPage }) => {
      let values: string[] = [];

      await test.step("Sort by active DESC", async () => {
        await createPostPage.sortBy("active", "desc");
        await createPostPage.waitForTableLoaded();
      });

      await test.step("Get active values from table", async () => {
        values = normalizeBoolean(await createPostPage.getColumnTexts(5));
      });

      await test.step("Verify sorting result", async () => {
        expect(hasData(values)).toBeTruthy();
        if (hasDifferentValues(values)) {
          expect(isBooleanDesc(values)).toBeTruthy();
        }
      });
    }
  );
});
