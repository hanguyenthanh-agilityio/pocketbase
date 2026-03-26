import { test, expect } from "../fixtures/fixture";
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
    async ({ postPage }) => {
      let titles: string[] = [];

      await test.step("Sort by title ASC", async () => {
        await postPage.sortBy("title", "asc");
        await postPage.waitForTableLoaded();
      });

      await test.step("Get titles from table", async () => {
        titles = normalize(await postPage.getColumnTexts(3));
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
    async ({ postPage }) => {
      let titles: string[] = [];

      await test.step("Sort by title DESC", async () => {
        await postPage.sortBy("title", "desc");
        await postPage.waitForTableLoaded();
      });

      await test.step("Get titles from table", async () => {
        titles = normalize(await postPage.getColumnTexts(3));
      });

      await test.step("Verify sorting result", async () => {
        expect(hasData(titles)).toBeTruthy();

        console.log("DESC Titles:", titles);

        if (hasDifferentValues(titles)) {
          expect(isSortedDesc(titles)).toBeTruthy();
        }
      });
    }
  );

  test(
    "TC060 - Verify user can sort posts by active status ascending",
    { tag: ["@TC060", "@regression", "@ui", "@post", "@sort"] },
    async ({ postPage }) => {
      let values: string[] = [];

      await test.step("Sort by active ASC", async () => {
        await postPage.sortBy("active", "asc");
        await postPage.waitForTableLoaded();
      });

      await test.step("Get active values from table", async () => {
        values = normalizeBoolean(await postPage.getColumnTexts(5));
      });

      await test.step("Verify sorting result", async () => {
        expect(hasData(values)).toBeTruthy();

        console.log("ASC Active:", values);

        if (hasDifferentValues(values)) {
          expect(isBooleanAsc(values)).toBeTruthy();
        }
      });
    }
  );

  test(
    "TC061 - Verify user can sort posts by active status descending",
    { tag: ["@TC061", "@regression", "@ui", "@post", "@sort"] },
    async ({ postPage }) => {
      let values: string[] = [];

      await test.step("Sort by active DESC", async () => {
        await postPage.sortBy("active", "desc");
        await postPage.waitForTableLoaded();
      });

      await test.step("Get active values from table", async () => {
        values = normalizeBoolean(await postPage.getColumnTexts(5));
      });

      await test.step("Verify sorting result", async () => {
        expect(hasData(values)).toBeTruthy();

        console.log("DESC Active:", values);

        if (hasDifferentValues(values)) {
          expect(isBooleanDesc(values)).toBeTruthy();
        }
      });
    }
  );
});
