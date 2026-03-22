import { test, expect } from "@playwright/test";
import { getAuthToken } from "../utils/auth";

test.describe("Delete Post API", () => {
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
        title: "Delete API Post",
      },
    });

    expect([200, 201]).toContain(res.status());

    const body = await res.json();

    postId = body.id;

    expect(postId).toBeTruthy();
  });

  test("TC053 - Delete API success", async ({ request }) => {
    const res = await request.delete(`/api/collections/posts/records/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect([200, 204]).toContain(res.status());
  });

  test("TC055 - Delete non-existing", async ({ request }) => {
    const fakeId = "non-existing-id";

    const res = await request.delete(`/api/collections/posts/records/${fakeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status()).toBe(404);
  });
});
