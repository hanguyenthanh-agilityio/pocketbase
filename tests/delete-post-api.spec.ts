import { test, expect } from "../fixtures/fixture";
import { PostData } from "../types/post";

test.describe("Post API - Delete", () => {
  test(
    "TC060 - Verify user can delete a post successfully",
    { tag: ["@TC060", "@smoke", "@api", "@post", "@delete"] },
    async ({ postApi }) => {
      const createRes = await postApi.create({
        title: `Delete ${Date.now()}`,
      });

      const created: PostData = createRes.data;

      const res = await postApi.delete(created.id);

      expect(res.status).toBeLessThan(300);

      // verify deleted
      const getRes = await postApi.getById(created.id);
      expect(getRes.status).toBeGreaterThanOrEqual(400);
    }
  );

  test(
    "TC061 - Verify deleting non-existing post returns error",
    { tag: ["@TC061", "@regression", "@api", "@negative"] },
    async ({ postApi }) => {
      const fakeId = "non_existing_id";

      const res = await postApi.delete(fakeId);

      expect(res.status).toBeGreaterThanOrEqual(400);
    }
  );

  test(
    "TC062 - Verify unauthorized user cannot delete post",
    { tag: ["@TC062", "@regression", "@api", "@negative"] },
    async ({ request }) => {
      const res = await request.delete("/api/collections/posts/records/some-id", {
        headers: {
          Authorization: "Bearer invalid_token",
        },
      });

      expect(res.status()).toBe(403);
    }
  );

  test(
    "TC063 - Verify deleting the same post twice",
    { tag: ["@TC063", "@regression", "@api", "@edge"] },
    async ({ postApi }) => {
      const createRes = await postApi.create({
        title: `Double Delete ${Date.now()}`,
      });

      const created = createRes.data;

      // First delete
      const res1 = await postApi.delete(created.id);
      expect(res1.status).toBeLessThan(300);

      // Second delete → should fail
      const res2 = await postApi.delete(created.id);
      expect(res2.status).toBeGreaterThanOrEqual(400);
    }
  );
});
