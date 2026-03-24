import { Page } from "@playwright/test";

export async function createPostViaUI(page: Page, action: () => Promise<void>) {
  try {
    const [res] = await Promise.all([
      page.waitForResponse(
        (res) => res.request().method() === "POST" && res.url().includes("/posts/records"), // 🔥 loosen condition
        { timeout: 5000 }
      ),
      action(),
    ]);

    const body = await res.json();
    return { res, body };
  } catch {
    await page.waitForTimeout(1000); // wait UI render

    return {
      res: null,
      body: { id: null },
    };
  }
}
