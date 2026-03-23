/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";
import { getAuthToken } from "../utils/auth";

test.describe("Sort Post API", () => {
  let token: string;

  test.beforeAll(() => {
    token = getAuthToken();
  });

  // ===== HELPERS =====
  const normalize = (arr: any[]) =>
    arr.map((v) => (v ?? "").toString().trim().toLowerCase()).filter((v) => v !== "");

  const hasDifferentValues = (arr: string[]) => new Set(arr).size > 1;

  const isSortedAsc = (arr: string[]) => {
    const sorted = [...arr].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    return arr.join("|") === sorted.join("|");
  };

  const isSortedDesc = (arr: string[]) => {
    const sorted = [...arr]
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
      .reverse();

    return arr.join("|") === sorted.join("|");
  };

  const isBooleanAsc = (arr: string[]) => arr.join(",") === [...arr].sort().join(",");

  const isBooleanDesc = (arr: string[]) => arr.join(",") === [...arr].sort().reverse().join(",");

  // ===== TITLE =====
  test("TC064 - Sort API title ASC", async ({ request }) => {
    const res = await request.get("/api/collections/posts/records?sort=title", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    const titles = normalize(body.items.map((i: any) => i.title));

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

    if (hasDifferentValues(titles)) {
      expect(isSortedDesc(titles)).toBeTruthy();
    }
  });

  // ===== ACTIVE =====
  test("TC068 - Sort API active ASC", async ({ request }) => {
    const res = await request.get("/api/collections/posts/records?sort=active", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();

    const values = normalize(body.items.map((i: any) => (i.active ? "true" : "false")));

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

    if (hasDifferentValues(values)) {
      expect(isBooleanDesc(values)).toBeTruthy();
    }
  });

  // ===== OPTIONS =====
  test("TC070 - Sort API options ASC", async ({ request }) => {
    const res = await request.get("/api/collections/posts/records?sort=options", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();

    const values = normalize(
      body.items.map((i: any) =>
        (i.options || [])
          .map((o: string) => o.trim().toLowerCase())
          .sort()
          .join(",")
      )
    );

    if (hasDifferentValues(values)) {
      expect(isSortedAsc(values)).toBeTruthy();
    }
  });

  test("TC071 - Sort API options DESC", async ({ request }) => {
    const res = await request.get("/api/collections/posts/records?sort=-options", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();

    const values = normalize(
      body.items.map((i: any) =>
        (i.options || [])
          .map((o: string) => o.trim().toLowerCase())
          .sort()
          .join(",")
      )
    );

    if (hasDifferentValues(values)) {
      expect(isSortedDesc(values)).toBeTruthy();
    }
  });
});
