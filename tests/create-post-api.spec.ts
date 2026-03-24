import { test, expect } from "../fixtures/fixture";

test.describe("Post API", () => {
  test("TC012 - API - Verify create post with required fields only", async ({
    postApi,
    createdPostIds,
  }) => {
    const title = `API Required ${Date.now()}`;

    const { res, body } = await postApi.create({ title });

    expect([200, 201]).toContain(res.status());
    expect(body.title).toBe(title);

    // Track for cleanup
    createdPostIds.push(body.id);
  });

  test("TC013 - API - Create post with all fields", async ({ postApi, createdPostIds }) => {
    const { res, body } = await postApi.create({
      title: "API Full Post",
      description: "Sample description",
      active: true,
    });

    expect([200, 201]).toContain(res.status());
    expect(body.title).toBe("API Full Post");
    expect(body.description).toContain("Sample description");
    expect(body.active).toBeTruthy();

    createdPostIds.push(body.id);
  });

  test("TC014 - API - Verify title is required", async ({ postApi }) => {
    const { res } = await postApi.create({ title: "" });

    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test("TC015 - API - Verify title accepts special characters", async ({
    postApi,
    createdPostIds,
  }) => {
    const title = "!!!Test@@@" + Date.now();

    const { res, body } = await postApi.create({ title });

    expect([200, 201]).toContain(res.status());
    expect(body.title).toBe(title);

    createdPostIds.push(body.id);
  });

  test("TC016 - API - Verify title max length validation", async ({ postApi, createdPostIds }) => {
    const longTitle = "A".repeat(500);

    const { res, body } = await postApi.create({ title: longTitle });

    expect([200, 201, 400]).toContain(res.status());

    // Only track if success
    if (res.status() < 400) {
      createdPostIds.push(body.id);
    } else {
      expect(body).toHaveProperty("data");
    }
  });

  test("TC017 - API - Verify description supports rich text", async ({
    postApi,
    createdPostIds,
  }) => {
    const { res, body } = await postApi.create({
      title: "Rich Text API",
      description: "<b>bold text</b>",
    });

    expect([200, 201]).toContain(res.status());
    expect(body.description).toContain("bold");

    createdPostIds.push(body.id);
  });

  test("TC018 - API - Verify description long paragraph", async ({ postApi, createdPostIds }) => {
    const desc = "Lorem ipsum ".repeat(200);

    const { res, body } = await postApi.create({
      title: "Long Desc API",
      description: desc,
    });

    expect([200, 201]).toContain(res.status());
    expect(body.description.length).toBeGreaterThan(100);

    createdPostIds.push(body.id);
  });

  test("TC019 - API - Verify active true", async ({ postApi, createdPostIds }) => {
    const { res, body } = await postApi.create({
      title: "Active True API",
      active: true,
    });

    expect([200, 201]).toContain(res.status());
    expect(body.active).toBe(true);

    createdPostIds.push(body.id);
  });

  test("TC020 - API - Verify active false", async ({ postApi, createdPostIds }) => {
    const { res, body } = await postApi.create({
      title: "Active False API",
      active: false,
    });

    expect([200, 201]).toContain(res.status());
    expect(body.active).toBe(false);

    createdPostIds.push(body.id);
  });

  test("TC021 - API - Verify unauthorized request", async ({ request }) => {
    const res = await request.post("/api/collections/posts/records", {
      headers: {
        Authorization: "Bearer invalid_token",
      },
      data: { title: "Should Fail" },
    });

    expect(res.status()).toBe(403);
  });
});
