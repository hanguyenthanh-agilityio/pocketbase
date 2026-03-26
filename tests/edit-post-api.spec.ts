import { test, expect } from "../fixtures/fixture";

test.describe("Edit Post API", () => {
  test(
    "TC046 - API - Verify user can update post title successfully",
    { tag: ["@TC046", "@smoke", "@api", "@post", "@edit"] },
    async ({ postApi, createdPostIds }) => {
      const createTitle = `API Post ${Date.now()}`;
      const { body: created } = await postApi.create({ title: createTitle });

      createdPostIds.push(created.id);

      const updatedTitle = `Updated API ${Date.now()}`;

      const { res, body } = await postApi.update(created.id, {
        title: updatedTitle,
      });

      expect([200, 201]).toContain(res.status());
      expect(body.title).toBe(updatedTitle);
    }
  );

  test(
    "TC047 - API - Verify system returns error when updating post with empty title",
    { tag: ["@TC047", "@regression", "@api", "@validation"] },
    async ({ postApi, createdPostIds }) => {
      const { body: created } = await postApi.create({
        title: `API Post ${Date.now()}`,
      });

      createdPostIds.push(created.id);

      const { res, body } = await postApi.update(created.id, {
        title: "",
      });

      expect(res.status()).toBeGreaterThanOrEqual(400);
      expect(body).toHaveProperty("data");
    }
  );

  test(
    "TC048 - API - Verify user can update post description",
    { tag: ["@TC048", "@regression", "@api", "@post"] },
    async ({ postApi, createdPostIds }) => {
      const { body: created } = await postApi.create({
        title: `API Post ${Date.now()}`,
      });

      createdPostIds.push(created.id);

      const updatedDesc = "Updated description via API";

      const { res, body } = await postApi.update(created.id, {
        description: updatedDesc,
      });

      expect([200, 201]).toContain(res.status());
      expect(body.description).toContain("Updated");
    }
  );

  test(
    "TC049 - API - Verify user can set active status to true",
    { tag: ["@TC049", "@regression", "@api", "@post"] },
    async ({ postApi, createdPostIds }) => {
      const { body: created } = await postApi.create({
        title: `API Post ${Date.now()}`,
        active: false,
      });

      createdPostIds.push(created.id);

      const { res, body } = await postApi.update(created.id, {
        active: true,
      });

      expect([200, 201]).toContain(res.status());
      expect(body.active).toBe(true);
    }
  );

  test(
    "TC050 - API - Verify user can set active status to false",
    { tag: ["@TC050", "@regression", "@api", "@post"] },
    async ({ postApi, createdPostIds }) => {
      const { body: created } = await postApi.create({
        title: `API Post ${Date.now()}`,
        active: true,
      });

      createdPostIds.push(created.id);

      const { res, body } = await postApi.update(created.id, {
        active: false,
      });

      expect([200, 201]).toContain(res.status());
      expect(body.active).toBe(false);
    }
  );

  test(
    "TC051 - API - Verify system returns error when updating non-existing post",
    { tag: ["@TC051", "@regression", "@api", "@negative"] },
    async ({ postApi }) => {
      const fakeId = "non_existing_id";

      const { res } = await postApi.update(fakeId, {
        title: "Should fail",
      });

      expect(res.status()).toBeGreaterThanOrEqual(400);
    }
  );

  test(
    "TC052 - API - Verify unauthorized user cannot update post",
    { tag: ["@TC052", "@regression", "@api", "@negative"] },
    async ({ request }) => {
      const res = await request.patch("/api/collections/posts/records/some-id", {
        headers: {
          Authorization: "Bearer invalid_token",
          "Content-Type": "application/json",
        },
        data: {
          title: "Unauthorized edit",
        },
      });

      expect(res.status()).toBe(403);
    }
  );
});
