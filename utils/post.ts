import { Page } from "@playwright/test";

/**
 * Create post via UI.
 * UI only, does not return ID reliably.
 */
export async function createPostViaUI(page: Page, action: () => Promise<void>) {
  try {
    await action();

    await page.waitForTimeout(1000);

    return {};
  } catch (err) {
    console.error("Error in createPostViaUI:", err);
    return {};
  }
}
