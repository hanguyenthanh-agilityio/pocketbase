import { Page } from "@playwright/test";

export async function createPostViaUI(page: Page, action: () => Promise<void>) {
  const context = page.context();

  const [res] = await Promise.all([
    context.waitForEvent("response", {
      predicate: (res) =>
        res.url().includes("/api/collections/posts/records") && res.request().method() === "POST",
      timeout: 15000,
    }),
    action(),
  ]);

  const body = await res.json();

  return { res, body };
}
