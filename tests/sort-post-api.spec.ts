import { test, expect } from "../fixtures/fixture";
import { PostData } from "../types/post";

// Helper normalize title để sort compare
function normalizeTitleForSort(title: string | null | undefined): string {
  if (!title) return "";
  const match = title.match(/^create_0_(\d+)$/);
  if (match) {
    return match[1].padStart(20, "0"); // numeric part -> padded string
  }
  return title.toLowerCase();
}

test.describe("Edit Post API", () => {
  test(
    "TC046 - Verify user can update post title successfully",
    { tag: ["@TC046", "@smoke", "@api", "@post", "@edit"] },
    async ({ postApi, createdPostIds }) => {
      const createTitle = `API Post ${Date.now()}`;
      const createRes = await postApi.create({ title: createTitle });

      const created: PostData = createRes.data;
      createdPostIds.push(created.id);

      const updatedTitle = `Updated API ${Date.now()}`;
      const res = await postApi.update(created.id, { title: updatedTitle });

      expect([200, 201]).toContain(res.status);
      expect(normalizeTitleForSort(res.data.title)).toBe(normalizeTitleForSort(updatedTitle));
    }
  );

  test(
    "TC047 - Verify system returns error when updating post with empty title",
    { tag: ["@TC047", "@regression", "@api", "@validation"] },
    async ({ postApi, createdPostIds }) => {
      const createRes = await postApi.create({ title: `API Post ${Date.now()}` });
      const created = createRes.data;
      createdPostIds.push(created.id);

      const res = await postApi.update(created.id, { title: "" });

      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.data).toBeTruthy();
    }
  );

  test(
    "TC048 - Verify user can update post description",
    { tag: ["@TC048", "@regression", "@api", "@post"] },
    async ({ postApi, createdPostIds }) => {
      const createRes = await postApi.create({ title: `API Post ${Date.now()}` });
      const created = createRes.data;
      createdPostIds.push(created.id);

      const updatedDesc = "Updated description via API";
      const res = await postApi.update(created.id, { description: updatedDesc });

      expect([200, 201]).toContain(res.status);
      expect((res.data.description ?? "").toLowerCase()).toContain(updatedDesc.toLowerCase());
    }
  );

  test(
    "TC049 - Verify user can set active status to true",
    { tag: ["@TC049", "@regression", "@api", "@post"] },
    async ({ postApi, createdPostIds }) => {
      const createRes = await postApi.create({ title: `API Post ${Date.now()}`, active: false });
      const created = createRes.data;
      createdPostIds.push(created.id);

      const res = await postApi.update(created.id, { active: true });

      expect([200, 201]).toContain(res.status);
      expect(res.data.active).toBe(true);
    }
  );

  test(
    "TC050 - Verify user can set active status to false",
    { tag: ["@TC050", "@regression", "@api", "@post"] },
    async ({ postApi, createdPostIds }) => {
      const createRes = await postApi.create({ title: `API Post ${Date.now()}`, active: true });
      const created = createRes.data;
      createdPostIds.push(created.id);

      const res = await postApi.update(created.id, { active: false });

      expect([200, 201]).toContain(res.status);
      expect(res.data.active).toBe(false);
    }
  );

  test(
    "TC051 - Verify system returns error when updating non-existing post",
    { tag: ["@TC051", "@regression", "@api", "@negative"] },
    async ({ postApi }) => {
      const fakeId = "non_existing_id";

      const res = await postApi.update(fakeId, { title: "Should fail" });

      expect(res.status).toBeGreaterThanOrEqual(400);
    }
  );

  test(
    "TC052 - Verify unauthorized user cannot update post",
    { tag: ["@TC052", "@regression", "@api", "@negative"] },
    async ({ request }) => {
      const res = await request.patch("/api/collections/posts/records/some-id", {
        headers: {
          Authorization: "Bearer invalid_token",
          "Content-Type": "application/json",
        },
        data: { title: "Unauthorized edit" },
      });

      expect(res.status()).toBe(403);
    }
  );
});
