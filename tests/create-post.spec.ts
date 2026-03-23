import { test, expect } from "../fixtures/fixture";

test.describe("Create A New Post", () => {
  test("TC013 - Required fields only", async ({ postPage }) => {
    const title = `Post ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.clickCreate();

    await postPage.expectPostCreated(title);
  });

  test("TC015 - Special characters", async ({ postPage }) => {
    const title = "!!!@@@" + Date.now();

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.clickCreate();

    await postPage.expectPostCreated(title);
  });

  test("TC016 - Title max length", async ({ postPage }) => {
    const longTitle = "A".repeat(500);

    await postPage.clickNew();
    await postPage.fillTitle(longTitle);
    await postPage.clickCreate();

    await postPage.expectCreateResult(longTitle);
  });

  test("TC017 - Rich text", async ({ postPage }) => {
    const title = `Rich ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.fillDescription("**bold**");

    await postPage.clickCreate();
    await postPage.expectPostCreated(title);
  });

  test("TC018 - Long description", async ({ postPage }) => {
    const title = `Long ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.fillDescription("Lorem ".repeat(100));

    await postPage.clickCreate();
    await postPage.expectPostCreated(title);
  });

  test("TC019 - Active ON", async ({ postPage }) => {
    const title = `ON ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.toggleActive(true);

    await postPage.clickCreate();
    await postPage.expectPostCreated(title);
  });

  test("TC020 - Active OFF", async ({ postPage }) => {
    const title = `OFF ${Date.now()}`;

    await postPage.clickNew();
    await postPage.fillTitle(title);
    await postPage.toggleActive(false);

    await postPage.clickCreate();
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
