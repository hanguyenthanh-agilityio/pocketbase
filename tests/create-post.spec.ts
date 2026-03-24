import { test, expect } from "../fixtures/fixture";
import { createPostViaUI } from "../utils/post";

test.describe("Create A New Post", () => {
  test("TC013 - Required fields only", async ({ postPage, page, createdPostIds }) => {
    const title = `Post ${Date.now()}`;

    const { body } = await createPostViaUI(page, async () => {
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await expect(postPage.createBtn).toBeEnabled();
      await postPage.clickCreate();
    });

    // ✅ SAFE PUSH
    if (body?.id) {
      createdPostIds.push(body.id);
    }

    await postPage.expectPostCreated(title);
  });

  test("TC015 - Special characters", async ({ postPage, page, createdPostIds }) => {
    const title = "!!!@@@" + Date.now();

    const { body } = await createPostViaUI(page, async () => {
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await expect(postPage.createBtn).toBeEnabled();
      await postPage.clickCreate();
    });

    if (body?.id) {
      createdPostIds.push(body.id);
    }

    await postPage.expectPostCreated(title);
  });

  test("TC016 - Title max length", async ({ postPage, page, createdPostIds }) => {
    const longTitle = "A".repeat(500);

    const { res, body } = await createPostViaUI(page, async () => {
      await postPage.clickNew();
      await postPage.fillTitle(longTitle);
      await expect(postPage.createBtn).toBeEnabled();
      await postPage.clickCreate();
    });

    // ✅ SAFE CHECK
    if (res && res.status() < 400 && body?.id) {
      createdPostIds.push(body.id);
    }

    await postPage.expectCreateResult(longTitle);
  });

  test("TC017 - Rich text", async ({ postPage, page, createdPostIds }) => {
    const title = `Rich ${Date.now()}`;

    const { body } = await createPostViaUI(page, async () => {
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.fillDescription("**bold**");
      await expect(postPage.createBtn).toBeEnabled();
      await postPage.clickCreate();
    });

    if (body?.id) {
      createdPostIds.push(body.id);
    }

    await postPage.expectPostCreated(title);
  });

  test("TC018 - Long description", async ({ postPage, page, createdPostIds }) => {
    const title = `Long ${Date.now()}`;

    const { body } = await createPostViaUI(page, async () => {
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.fillDescription("Lorem ".repeat(100));
      await expect(postPage.createBtn).toBeEnabled();
      await postPage.clickCreate();
    });

    if (body?.id) {
      createdPostIds.push(body.id);
    }

    await postPage.expectPostCreated(title);
  });

  test("TC019 - Active ON", async ({ postPage, page, createdPostIds }) => {
    const title = `ON ${Date.now()}`;

    const { body } = await createPostViaUI(page, async () => {
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.toggleActive(true);
      await expect(postPage.createBtn).toBeEnabled();
      await postPage.clickCreate();
    });

    if (body?.id) {
      createdPostIds.push(body.id);
    }

    await postPage.expectPostCreated(title);
  });

  test("TC020 - Active OFF", async ({ postPage, page, createdPostIds }) => {
    const title = `OFF ${Date.now()}`;

    const { body } = await createPostViaUI(page, async () => {
      await postPage.clickNew();
      await postPage.fillTitle(title);
      await postPage.toggleActive(false);
      await expect(postPage.createBtn).toBeEnabled();
      await postPage.clickCreate();
    });

    if (body?.id) {
      createdPostIds.push(body.id);
    }

    await postPage.expectPostCreated(title);
  });

  test("TC027 - Cancel create", async ({ postPage }) => {
    const title = `Cancel ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.clickCancel();

    await expect(postPage.getPostRow(title)).toHaveCount(0);
  });

  test("TC028 - Close modal", async ({ postPage }) => {
    await postPage.clickNew();
    await postPage.clickCloseModal();

    await expect(postPage.titleInput).toHaveCount(0);
  });
});
