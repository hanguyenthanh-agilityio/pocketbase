import { test, expect } from "@playwright/test";
import { getAuthToken } from "../utils/auth";

test.describe("Edit Post API", () => {
  let token: string;
  let postId: string;

  test.beforeAll(async ({ request }) => {
    token = getAuthToken();

    const res = await request.post("/api/collections/posts/records", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        title: "API Post",
      },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();

    postId = body.id;

    expect(postId).toBeTruthy();
  });

  test("TC046 - Edit API success", async ({ request }) => {
    const updatedTitle = `Updated API ${Date.now()}`;

    const res = await request.patch(`/api/collections/posts/records/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        title: updatedTitle,
      },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();

    expect(body.title).toBe(updatedTitle);
  });

  test("TC047 - Edit API invalid data", async ({ request }) => {
    const res = await request.patch(`/api/collections/posts/records/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        title: "", // invalid
      },
    });

    expect(res.status()).toBe(400);

    const body = await res.json();

    expect(body).toHaveProperty("message");
  });
});
