import { test, expect } from "@playwright/test";
import { getAuthToken } from "../utils/auth";

test.describe("Post API", () => {
  let token: string;

  test.beforeAll(() => {
    token = getAuthToken();
  });

  test("TC012 - API - Verify create post with required fields only", async ({ request }) => {
    const res = await request.post("/api/collections/posts/records", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        title: "API Required Post",
      },
    });

    expect([200, 201]).toContain(res.status());

    const body = await res.json();
    expect(body.title).toBe("API Required Post");
  });

  test("TC013 - API - Verify create post with all fields", async ({ request }) => {
    const res = await request.post("/api/collections/posts/records", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        title: "",
      },
    });

    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
