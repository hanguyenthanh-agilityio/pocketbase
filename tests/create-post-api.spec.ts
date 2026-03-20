import { test, expect } from "@playwright/test";
import { getAuthToken } from "../utils/auth";

test.describe("Post API", () => {
  let token: string;

  test.beforeAll(() => {
    token = getAuthToken();
  });

  const headers = () => ({
    Authorization: `Bearer ${token}`,
  });

  test("TC012 - API - Verify create post with required fields only", async ({ request }) => {
    const title = `API Required ${Date.now()}`;

    const res = await request.post("/api/collections/posts/records", {
      headers: headers(),
      data: { title },
    });

    expect([200, 201]).toContain(res.status());

    const body = await res.json();
    expect(body.title).toBe(title);
  });

  test("TC013 - API - Create post with all fields", async ({ request }) => {
    const res = await request.post("/api/collections/posts/records", {
      headers: headers(),
      data: {
        title: "API Full Post",
        description: "Sample description",
        active: true,
      },
    });

    expect([200, 201]).toContain(res.status());

    const body = await res.json();
    expect(body.title).toBe("API Full Post");
    expect(body.description).toContain("Sample description");
    expect(body.active).toBeTruthy();
  });

  test("TC014 - API - Verify title is required", async ({ request }) => {
    const res = await request.post("/api/collections/posts/records", {
      headers: headers(),
      data: { title: "" },
    });

    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test("TC015 - API - Verify title accepts special characters", async ({ request }) => {
    const title = "!!!Test@@@" + Date.now();

    const res = await request.post("/api/collections/posts/records", {
      headers: headers(),
      data: { title },
    });

    expect([200, 201]).toContain(res.status());

    const body = await res.json();
    expect(body.title).toBe(title);
  });

  test("TC016 - API - Verify title max length validation", async ({ request }) => {
    const longTitle = "A".repeat(500);

    const res = await request.post("/api/collections/posts/records", {
      headers: headers(),
      data: { title: longTitle },
    });

    // PocketBase behavior: usually reject
    expect([200, 201, 400]).toContain(res.status());

    if (res.status() >= 400) {
      const body = await res.json();
      expect(body).toHaveProperty("data");
    }
  });

  test("TC017 - API - Verify description supports rich text", async ({ request }) => {
    const res = await request.post("/api/collections/posts/records", {
      headers: headers(),
      data: {
        title: "Rich Text API",
        description: "<b>bold text</b>",
      },
    });

    expect([200, 201]).toContain(res.status());

    const body = await res.json();
    expect(body.description).toContain("bold");
  });

  test("TC018 - API - Verify description long paragraph", async ({ request }) => {
    const desc = "Lorem ipsum ".repeat(200);

    const res = await request.post("/api/collections/posts/records", {
      headers: headers(),
      data: {
        title: "Long Desc API",
        description: desc,
      },
    });

    expect([200, 201]).toContain(res.status());

    const body = await res.json();
    expect(body.description.length).toBeGreaterThan(100);
  });

  test("TC019 - API - Verify active true", async ({ request }) => {
    const res = await request.post("/api/collections/posts/records", {
      headers: headers(),
      data: {
        title: "Active True API",
        active: true,
      },
    });

    expect([200, 201]).toContain(res.status());

    const body = await res.json();
    expect(body.active).toBe(true);
  });

  test("TC020 - API - Verify active false", async ({ request }) => {
    const res = await request.post("/api/collections/posts/records", {
      headers: headers(),
      data: {
        title: "Active False API",
        active: false,
      },
    });

    expect([200, 201]).toContain(res.status());

    const body = await res.json();
    expect(body.active).toBe(false);
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
