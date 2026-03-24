import { Page } from "@playwright/test";

/**
 * Create post via UI.
 * UI only, does not return ID reliably.
 */
export async function createPostViaUI(page: Page, action: () => Promise<void>) {
  try {
    await action();

    // wait small time để modal đóng / animation hoàn tất
    await page.waitForTimeout(1000);

    return {}; // UI không trả ID
  } catch (err) {
    console.error("Error in createPostViaUI:", err);
    return {};
  }
}
