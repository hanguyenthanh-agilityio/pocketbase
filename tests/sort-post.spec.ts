import { sortPostsTest as test } from "../fixtures/sort";
import { expect } from "@playwright/test";
import { normalize, normalizeBoolean } from "../utils/sort";

test.describe("Sort Records - UI Validation", () => {
  test(
    "TC056 - Verify user can sort posts by title ascending",
    { tag: ["@TC056", "@regression", "@ui", "@post", "@sort"] },
    async ({ sortPostPage }) => {
      const titlesToSort = sortPostPage.postList.map((p) => p.title);
      await sortPostPage.sortBy("title", "asc");

      const allTitles = normalize(await sortPostPage.getColumnTexts(3));

      const filtered = allTitles.filter((t) => titlesToSort.includes(t));

      expect(filtered).toEqual([...titlesToSort].sort((a, b) => a.localeCompare(b)));
    }
  );

  test(
    "TC057 - Verify user can sort posts by title descending",
    { tag: ["@TC057", "@regression", "@ui", "@post", "@sort"] },
    async ({ sortPostPage }) => {
      const titlesToSort = sortPostPage.postList.map((p) => p.title);

      await sortPostPage.sortBy("title", "desc");

      const allTitles = normalize(await sortPostPage.getColumnTexts(3));

      const filtered = allTitles.filter((t) => titlesToSort.includes(t));

      expect(filtered).toEqual([...titlesToSort].sort((a, b) => b.localeCompare(a)));
    }
  );

  test(
    "TC058 - Verify user can sort posts by description ascending",
    { tag: ["@TC058", "@regression", "@ui", "@post", "@sort"] },
    async ({ sortPostPage }) => {
      const descToSort = normalize(sortPostPage.postList.map((p) => p.description ?? ""));

      await sortPostPage.sortBy("description", "asc");

      const allDesc = normalize(await sortPostPage.getColumnTexts(4));

      // Remove duplicates
      const filtered = Array.from(new Set(allDesc)).filter((d) => descToSort.includes(d));

      expect(filtered).toEqual([...descToSort].sort((a, b) => a.localeCompare(b)));
    }
  );

  test(
    "TC059 - Verify user can sort posts by description descending",
    { tag: ["@TC059", "@regression", "@ui", "@post", "@sort"] },
    async ({ sortPostPage }) => {
      const descToSort = sortPostPage.postList
        .map((p) => p.description ?? "")
        .filter(Boolean)
        .map((d) => d.toLowerCase().trim());

      await sortPostPage.sortBy("description", "desc");

      const allDesc = normalize(await sortPostPage.getColumnTexts(4));

      const filtered = Array.from(new Set(allDesc)).filter((d) => descToSort.includes(d));

      expect(filtered).toEqual([...descToSort].sort((a, b) => b.localeCompare(a)));
    }
  );

  test(
    "TC060 - Verify user can sort posts by active ascending",
    { tag: ["@TC060", "@regression", "@ui", "@post", "@sort"] },
    async ({ sortPostPage }) => {
      const activesToSort = sortPostPage.postList.map((p) => p.active);

      await sortPostPage.sortBy("active", "asc");

      const allActives = normalizeBoolean(await sortPostPage.getColumnTexts(5));

      const filtered = allActives.slice(0, activesToSort.length);

      // ASC
      expect(filtered).toEqual([...activesToSort].sort().map((v) => (v ? "1" : "0")));
    }
  );

  test(
    "TC061 - Verify user can sort posts by active descending",
    { tag: ["@TC061", "@regression", "@ui", "@post", "@sort"] },
    async ({ sortPostPage }) => {
      const activesToSort = sortPostPage.postList.map((p) => p.active);

      await sortPostPage.sortBy("active", "desc");

      const allActives = normalizeBoolean(await sortPostPage.getColumnTexts(5));

      const filtered = allActives.slice(0, activesToSort.length);

      // DESC
      expect(filtered).toEqual(
        [...activesToSort]
          .sort()
          .reverse()
          .map((v) => (v ? "1" : "0"))
      );
    }
  );
});
