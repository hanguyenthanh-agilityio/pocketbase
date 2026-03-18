import { test } from "@playwright/test";

export async function boxedStep(name: string, body: () => Promise<void>) {
  await test.step(name, async () => {
    await body();
  });
}
