import { postsTest as test, expect } from "../fixtures/post";
import { normalize, normalizeBoolean } from "../utils/sort";

test.describe("Sort Records - UI Validation (Optimized)", () => {
  test("TC056 - Sort title ASC", async ({ createPostPage }) => {
    const before = normalize(await createPostPage.getColumnTexts(3));

    await createPostPage.sortBy("title", "asc");

    const after = normalize(await createPostPage.getColumnTexts(3));

    expect(after).not.toEqual(before);

    // stable check
    await createPostPage.sortBy("title", "asc");
    const after2 = normalize(await createPostPage.getColumnTexts(3));

    expect(after2).toEqual(after);
  });

  test(
    "TC057 - Verify user can sort posts by title descending",
    { tag: ["@TC057", "@regression", "@ui", "@post", "@sort"] },
    async ({ createPostPage }) => {
      let before: string[] = [];
      let after: string[] = [];

      await test.step("Get initial titles", async () => {
        before = normalize(await createPostPage.getColumnTexts(3));
      });

      await test.step("Sort DESC", async () => {
        await createPostPage.sortBy("title", "desc");
      });

      await test.step("Get titles after sort", async () => {
        after = normalize(await createPostPage.getColumnTexts(3));
        console.log("DESC titles:", after);
      });

      await test.step("Verify sorting behavior", async () => {
        expect(after.length).toBeGreaterThan(0);

        expect(after).not.toEqual(before);

        await createPostPage.sortBy("title", "desc");
        const after2 = normalize(await createPostPage.getColumnTexts(3));

        expect(after2).toEqual(after);
      });
    }
  );

  test(
    "TC060 - Verify user can sort posts by active status ascending",
    { tag: ["@TC060", "@regression", "@ui", "@post", "@sort"] },
    async ({ createPostPage }) => {
      let before: string[] = [];
      let after: string[] = [];

      await test.step("Get initial active values", async () => {
        before = normalizeBoolean(await createPostPage.getColumnTexts(5));
      });

      await test.step("Sort ASC", async () => {
        await createPostPage.sortBy("active", "asc");
      });

      await test.step("Get values after sort", async () => {
        after = normalizeBoolean(await createPostPage.getColumnTexts(5));
        console.log("ASC active:", after);
      });

      await test.step("Verify sorting behavior", async () => {
        expect(after.length).toBeGreaterThan(0);

        expect(after).not.toEqual(before);

        await createPostPage.sortBy("active", "asc");
        const after2 = normalizeBoolean(await createPostPage.getColumnTexts(5));

        expect(after2).toEqual(after);
      });
    }
  );

  test(
    "TC061 - Verify user can sort posts by active status descending",
    { tag: ["@TC061", "@regression", "@ui", "@post", "@sort"] },
    async ({ createPostPage }) => {
      let before: string[] = [];
      let after: string[] = [];

      await test.step("Get initial active values", async () => {
        before = normalizeBoolean(await createPostPage.getColumnTexts(5));
      });

      await test.step("Sort DESC", async () => {
        await createPostPage.sortBy("active", "desc");
      });

      await test.step("Get values after sort", async () => {
        after = normalizeBoolean(await createPostPage.getColumnTexts(5));
        console.log("DESC active:", after);
      });

      await test.step("Verify sorting behavior", async () => {
        expect(after.length).toBeGreaterThan(0);

        expect(after).not.toEqual(before);

        await createPostPage.sortBy("active", "desc");
        const after2 = normalizeBoolean(await createPostPage.getColumnTexts(5));

        expect(after2).toEqual(after);
      });
    }
  );
});
