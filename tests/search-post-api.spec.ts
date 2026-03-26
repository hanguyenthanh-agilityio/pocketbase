import { test, expect } from "../fixtures/fixture";

type Post = {
  id: string;
  title: string;
};

test.describe("Post API - Search (Optimized)", () => {
  test(
    "TC065 - API - Search any keyword",
    { tag: ["@TC065", "@api", "@post", "@search"] },
    async ({ postApi, createdPostIds }) => {
      const title = `SearchTest ${Date.now()}`;

      const { body } = await postApi.create({ title });
      createdPostIds.push(body.id);

      const res = await postApi.list(`title~"SearchTest"`);

      const items = res.items as Post[];

      const titles = items.map((i) => i.title);

      expect(titles).toContain(title);
    }
  );

  test(
    "TC066 - API - Search uppercase",
    { tag: ["@TC066", "@api", "@post"] },
    async ({ postApi, createdPostIds }) => {
      const title = `SearchTest ${Date.now()}`;

      const { body } = await postApi.create({ title });
      createdPostIds.push(body.id);

      const res = await postApi.list(`title~"${title.toUpperCase()}"`);

      const items = res.items as Post[];

      expect(items.map((i) => i.title)).toContain(title);
    }
  );

  test(
    "TC067 - API - Search lowercase",
    { tag: ["@TC067", "@api", "@post"] },
    async ({ postApi, createdPostIds }) => {
      const title = `SearchTest ${Date.now()}`;

      const { body } = await postApi.create({ title });
      createdPostIds.push(body.id);

      const res = await postApi.list(`title~"${title.toLowerCase()}"`);

      const items = res.items as Post[];

      expect(items.map((i) => i.title)).toContain(title);
    }
  );

  test(
    "TC068 - API - Search numeric",
    { tag: ["@TC068", "@api", "@post"] },
    async ({ postApi, createdPostIds }) => {
      const title = `${Date.now()}`;

      const { body } = await postApi.create({ title });
      createdPostIds.push(body.id);

      const res = await postApi.list(`title="${title}"`);

      const items = res.items as Post[];

      expect(items.map((i) => i.title)).toContain(title);
    }
  );

  test(
    "TC069 - API - Search empty result",
    { tag: ["@TC069", "@api", "@negative"] },
    async ({ postApi }) => {
      const res = await postApi.list(`title="randomtext123"`);

      expect(res.items.length).toBe(0);
    }
  );

  test(
    "TC071 - API - Verify search returns correct count",
    { tag: ["@TC071", "@api"] },
    async ({ postApi, createdPostIds }) => {
      const title = `SearchTest ${Date.now()}`;

      const { body } = await postApi.create({ title });
      createdPostIds.push(body.id);

      const res = await postApi.list(`title~"SearchTest"`);

      expect(res.items.length).toBeGreaterThan(0);
    }
  );
});
