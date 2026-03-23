/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";
import { getAuthToken } from "../utils/auth";

test.describe("Search Post API", () => {
  let token: string;
  let createdTitle: string;
  let numericTitle: string;

  test.beforeAll(async ({ request }) => {
    token = getAuthToken();

    createdTitle = `SearchTest ${Date.now()}`;
    const res1 = await request.post("/api/collections/posts/records", {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: createdTitle },
    });
    expect(res1.status()).toBe(200);

    numericTitle = `${Date.now()}`;
    const res2 = await request.post("/api/collections/posts/records", {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: numericTitle },
    });
    expect(res2.status()).toBe(200);
  });

  test.afterAll(async ({ request }) => {
    // Cleanup
    const titlesToDelete = [createdTitle, numericTitle];
    for (const title of titlesToDelete) {
      const searchRes = await request.get(
        `/api/collections/posts/records?filter=(title='${encodeURIComponent(title)}')`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const body = await searchRes.json();
      if (body.items && body.items.length > 0) {
        for (const item of body.items) {
          await request.delete(`/api/collections/posts/records/${item.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }
    }
  });

  test("TC065 - Search any keyword", async ({ request }) => {
    const res = await request.get(`/api/collections/posts/records?filter=(title~'SearchTest')`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    const titles = body.items.map((i: any) => i.title);
    expect(titles).toContain(createdTitle);
  });

  test("TC066 - Search uppercase", async ({ request }) => {
    const res = await request.get(
      `/api/collections/posts/records?filter=(title~'${createdTitle.toUpperCase()}')`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(res.status()).toBe(200);
    const body = await res.json();
    const titles = body.items.map((i: any) => i.title);
    expect(titles).toContain(createdTitle);
  });

  test("TC067 - Search lowercase", async ({ request }) => {
    const res = await request.get(
      `/api/collections/posts/records?filter=(title~'${createdTitle.toLowerCase()}')`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(res.status()).toBe(200);
    const body = await res.json();
    const titles = body.items.map((i: any) => i.title);
    expect(titles).toContain(createdTitle);
  });

  test("TC068 - Search numeric", async ({ request }) => {
    const res = await request.get(
      `/api/collections/posts/records?filter=(title='${numericTitle}')`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(res.status()).toBe(200);
    const body = await res.json();
    const titles = body.items.map((i: any) => i.title);
    expect(titles).toContain(numericTitle);
  });

  test("TC069 - Search returns empty result", async ({ request }) => {
    const res = await request.get(`/api/collections/posts/records?filter=(title='randomtext123')`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.items.length).toBe(0);
  });

  test("TC070 - Clear search results (simulate by getting all records)", async ({ request }) => {
    const res = await request.get("/api/collections/posts/records", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.items.length).toBeGreaterThan(0);
  });

  test("TC071 - Search result updates record count", async ({ request }) => {
    const res = await request.get(`/api/collections/posts/records?filter=(title~'SearchTest')`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    const count = body.items.length;
    expect(count).toBeGreaterThan(0);
  });
});
