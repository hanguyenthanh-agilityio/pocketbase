import { test, expect } from "../fixtures/fixture";
import { PostData } from "../types/post";

test.use({ browserName: "chromium" });

test.describe("Post API - Create", () => {
  test("TC012 - Create with required fields only", async ({ postApi, createdPostIds }) => {
    const title = `API Required ${Date.now()}`;

    const res = await postApi.create({ title });

    expect([200, 201]).toContain(res.status);

    const post: PostData = res.data;

    expect(post.title).toBe(title);

    createdPostIds.push(post.id);
  });

  test("TC013 - Create with all fields", async ({ postApi, createdPostIds }) => {
    const data = {
      title: `API Full ${Date.now()}`,
      description: "Sample description",
      active: true,
    };

    const res = await postApi.create(data);

    expect([200, 201]).toContain(res.status);

    const post = res.data;

    expect(post.title).toBe(data.title);
    expect(post.description).toContain("Sample");
    expect(post.active).toBe(true);

    createdPostIds.push(post.id);
  });

  test("TC014 - Title is required", async ({ postApi }) => {
    const res = await postApi.create({ title: "" });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("TC015 - Title supports special characters", async ({ postApi, createdPostIds }) => {
    const title = `!!!Test@@@ ${Date.now()}`;

    const res = await postApi.create({ title });

    expect([200, 201]).toContain(res.status);
    expect(res.data.title).toBe(title);

    createdPostIds.push(res.data.id);
  });

  test("TC016 - Title max length validation", async ({ postApi, createdPostIds }) => {
    const longTitle = "A".repeat(500);

    const res = await postApi.create({ title: longTitle });

    expect([200, 201, 400]).toContain(res.status);

    if (res.status < 400) {
      createdPostIds.push(res.data.id);
    }
  });

  test("TC017 - Description supports rich text", async ({ postApi, createdPostIds }) => {
    const res = await postApi.create({
      title: `Rich ${Date.now()}`,
      description: "<b>bold text</b>",
    });

    expect([200, 201]).toContain(res.status);
    expect(res.data.description).toContain("bold");

    createdPostIds.push(res.data.id);
  });

  test("TC018 - Description long paragraph", async ({ postApi, createdPostIds }) => {
    const desc = "Lorem ".repeat(200);

    const res = await postApi.create({
      title: `Long Desc ${Date.now()}`,
      description: desc,
    });

    expect([200, 201]).toContain(res.status);
    expect(res.data.description!.length).toBeGreaterThan(100);

    createdPostIds.push(res.data.id);
  });

  test("TC019 - Active = true", async ({ postApi, createdPostIds }) => {
    const res = await postApi.create({
      title: `Active True ${Date.now()}`,
      active: true,
    });

    expect(res.status).toBeLessThan(300);
    expect(res.data.active).toBe(true);

    createdPostIds.push(res.data.id);
  });

  test("TC020 - Active = false", async ({ postApi, createdPostIds }) => {
    const res = await postApi.create({
      title: `Active False ${Date.now()}`,
      active: false,
    });

    expect(res.status).toBeLessThan(300);
    expect(res.data.active).toBe(false);

    createdPostIds.push(res.data.id);
  });

  test("TC021 - Unauthorized request", async ({ request }) => {
    const res = await request.post("/api/collections/posts/records", {
      headers: { Authorization: "Bearer invalid_token" },
      data: { title: "Fail" },
    });

    expect(res.status()).toBe(403);
  });
});
