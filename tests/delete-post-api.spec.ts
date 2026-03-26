import { test, expect } from "../fixtures/fixture";

test.describe("Post API - Create", () => {
  test(
    "TC012 - API - Verify create post with required fields only",
    { tag: ["@TC012", "@smoke", "@api", "@post", "@create"] },
    async ({ postApi, createdPostIds }) => {
      const title = `API Required ${Date.now()}`;
      const { res, body } = await postApi.create({ title });

      expect([200, 201]).toContain(res.status());
      expect(body.title).toBe(title);

      createdPostIds.push(body.id);
    }
  );

  test(
    "TC013 - API - Create post with all fields",
    { tag: ["@TC013", "@regression", "@api", "@post"] },
    async ({ postApi, createdPostIds }) => {
      const { res, body } = await postApi.create({
        title: "API Full Post",
        description: "Sample description",
        active: true,
      });

      expect([200, 201]).toContain(res.status());
      expect(body.title).toBe("API Full Post");
      expect(body.description).toContain("Sample description");
      expect(body.active).toBe(true);

      createdPostIds.push(body.id);
    }
  );

  test(
    "TC014 - API - Verify title is required",
    { tag: ["@TC014", "@regression", "@api", "@validation"] },
    async ({ postApi }) => {
      const { res } = await postApi.create({ title: "" });
      expect(res.status()).toBeGreaterThanOrEqual(400);
    }
  );

  test(
    "TC015 - API - Verify title accepts special characters",
    { tag: ["@TC015", "@regression", "@api", "@post"] },
    async ({ postApi, createdPostIds }) => {
      const title = "!!!Test@@@" + Date.now();
      const { res, body } = await postApi.create({ title });

      expect([200, 201]).toContain(res.status());
      expect(body.title).toBe(title);

      createdPostIds.push(body.id);
    }
  );
});
