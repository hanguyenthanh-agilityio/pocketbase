/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "../fixtures/fixture";
import {
  normalize,
  hasDifferentValues,
  isSortedAsc,
  isSortedDesc,
  isBooleanAsc,
  isBooleanDesc,
} from "../utils/sort";

test.describe("Post API - Sort (Optimized)", () => {
  test(
    "TC064 - API - Verify sorting posts by title ascending",
    { tag: ["@TC064", "@regression", "@api", "@post", "@sort"] },
    async ({ request, postApi }) => {
      let body: any;

      await test.step("Send request sort by title ASC", async () => {
        const res = await request.get("/api/collections/posts/records?sort=+title", {
          headers: { Authorization: `Bearer ${postApi["token"]}` },
        });

        expect(res.status()).toBe(200);
        body = await res.json();
      });

      let titles: string[] = [];

      await test.step("Extract titles", async () => {
        expect(body).toHaveProperty("items");
        titles = normalize(body.items.map((i: any) => i.title));
      });

      await test.step("Verify sorting result", async () => {
        expect(titles.length).toBeGreaterThan(0);

        if (hasDifferentValues(titles)) {
          expect(isSortedAsc(titles)).toBeTruthy();
        }
      });
    }
  );

  test(
    "TC065 - API - Verify sorting posts by title descending",
    { tag: ["@TC065", "@regression", "@api", "@post", "@sort"] },
    async ({ request, postApi }) => {
      let body: any;

      await test.step("Send request sort by title DESC", async () => {
        const res = await request.get("/api/collections/posts/records?sort=-title", {
          headers: { Authorization: `Bearer ${postApi["token"]}` },
        });

        expect(res.status()).toBe(200);
        body = await res.json();
      });

      let titles: string[] = [];

      await test.step("Extract titles", async () => {
        titles = normalize(body.items.map((i: any) => i.title));
      });

      await test.step("Verify sorting result", async () => {
        expect(titles.length).toBeGreaterThan(0);

        if (hasDifferentValues(titles)) {
          expect(isSortedDesc(titles)).toBeTruthy();
        }
      });
    }
  );

  test(
    "TC068 - API - Verify sorting posts by active ascending",
    { tag: ["@TC068", "@regression", "@api", "@post", "@sort"] },
    async ({ request, postApi }) => {
      let body: any;

      await test.step("Send request sort by active ASC", async () => {
        const res = await request.get("/api/collections/posts/records?sort=active", {
          headers: { Authorization: `Bearer ${postApi["token"]}` },
        });

        expect(res.status()).toBe(200);
        body = await res.json();
      });

      let values: string[] = [];

      await test.step("Extract active values", async () => {
        values = normalize(body.items.map((i: any) => (i.active ? "true" : "false")));
      });

      await test.step("Verify sorting result", async () => {
        expect(values.length).toBeGreaterThan(0);

        if (hasDifferentValues(values)) {
          expect(isBooleanAsc(values)).toBeTruthy();
        }
      });
    }
  );

  test(
    "TC069 - API - Verify sorting posts by active descending",
    { tag: ["@TC069", "@regression", "@api", "@post", "@sort"] },
    async ({ request, postApi }) => {
      let body: any;

      await test.step("Send request sort by active DESC", async () => {
        const res = await request.get("/api/collections/posts/records?sort=-active", {
          headers: { Authorization: `Bearer ${postApi["token"]}` },
        });

        expect(res.status()).toBe(200);
        body = await res.json();
      });

      let values: string[] = [];

      await test.step("Extract active values", async () => {
        values = normalize(body.items.map((i: any) => (i.active ? "true" : "false")));
      });

      await test.step("Verify sorting result", async () => {
        expect(values.length).toBeGreaterThan(0);

        if (hasDifferentValues(values)) {
          expect(isBooleanDesc(values)).toBeTruthy();
        }
      });
    }
  );

  test(
    "TC070 - API - Verify sorting by options field returns valid structure",
    { tag: ["@TC070", "@regression", "@api", "@post", "@sort"] },
    async ({ request, postApi }) => {
      let body: any;

      await test.step("Send request sort by options", async () => {
        const res = await request.get("/api/collections/posts/records?sort=options", {
          headers: { Authorization: `Bearer ${postApi["token"]}` },
        });

        expect(res.status()).toBe(200);
        body = await res.json();
      });

      await test.step("Verify response structure", async () => {
        expect(body).toHaveProperty("items");

        if (body.items.length > 0) {
          const item = body.items[0];

          expect(item).toHaveProperty("options");

          if (item.options !== null && item.options !== undefined) {
            expect(Array.isArray(item.options)).toBeTruthy();
          }
        }
      });
    }
  );
});
