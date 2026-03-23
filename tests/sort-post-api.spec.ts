/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";
import { getAuthToken } from "../utils/auth";
import {
  normalize,
  hasDifferentValues,
  isSortedAsc,
  isSortedDesc,
  isBooleanAsc,
  isBooleanDesc,
} from "../utils/sort";

test.describe("Sort Post API", () => {
  let token: string;

  test.beforeAll(() => {
    token = getAuthToken();
  });

  // ===== TESTS =====

  test("TC064 - Sort API title ASC", async ({ request }) => {
    const res = await request.get("/api/collections/posts/records?sort=+title", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("items");

    const titles = normalize(body.items.map((i: any) => i.title));
    expect(titles.length).toBeGreaterThan(0);

    if (hasDifferentValues(titles)) {
      expect(isSortedAsc(titles)).toBeTruthy();
    }
  });

  test("TC065 - Sort API title DESC", async ({ request }) => {
    const res = await request.get("/api/collections/posts/records?sort=-title", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    const titles = normalize(body.items.map((i: any) => i.title));
    expect(titles.length).toBeGreaterThan(0);

    if (hasDifferentValues(titles)) {
      expect(isSortedDesc(titles)).toBeTruthy();
    }
  });

  test("TC068 - Sort API active ASC", async ({ request }) => {
    const res = await request.get("/api/collections/posts/records?sort=active", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    const values = normalize(body.items.map((i: any) => (i.active ? "true" : "false")));
    expect(values.length).toBeGreaterThan(0);

    if (hasDifferentValues(values)) {
      expect(isBooleanAsc(values)).toBeTruthy();
    }
  });

  test("TC069 - Sort API active DESC", async ({ request }) => {
    const res = await request.get("/api/collections/posts/records?sort=-active", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    const values = normalize(body.items.map((i: any) => (i.active ? "true" : "false")));
    expect(values.length).toBeGreaterThan(0);

    if (hasDifferentValues(values)) {
      expect(isBooleanDesc(values)).toBeTruthy();
    }
  });

  test("TC070 - Sort API options ASC", async ({ request }) => {
    const res = await request.get("/api/collections/posts/records?sort=options", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty("items");

    if (body.items.length > 0) {
      const item = body.items[0];
      expect(item).toHaveProperty("options");

      if (item.options !== null && item.options !== undefined) {
        expect(Array.isArray(item.options)).toBeTruthy();
      }
    }
  });
});
