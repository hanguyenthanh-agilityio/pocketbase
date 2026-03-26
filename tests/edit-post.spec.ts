import { postsTest as test, expect } from "../fixtures/post";

test.describe("Edit Post - UI Validation", () => {
  test(
    "TC032 - Update post title",
    { tag: ["@TC032", "@smoke", "@ui", "@post", "@edit"] },
    async ({ createPostPage }) => {
      const post = createPostPage.postList[0];
      const updatedTitle = `Updated ${Date.now()}`;

      await test.step("Open edit form for the post", async () => {
        await createPostPage.openEdit(post.title);
      });

      await test.step("Update post title and save", async () => {
        await createPostPage.updateTitle(updatedTitle);
        await createPostPage.clickSave();
      });

      await test.step("Verify post title updated in UI", async () => {
        await createPostPage.expectPostUpdated(updatedTitle);
      });
    }
  );

  test(
    "TC033 - Update description",
    { tag: ["@TC033", "@regression", "@ui", "@post"] },
    async ({ createPostPage }) => {
      const post = createPostPage.postList[0];
      const updatedDesc = `Updated Description ${Date.now()}`;

      await test.step("Open edit form for the post", async () => {
        await createPostPage.openEdit(post.title);
      });

      await test.step("Update post description and save", async () => {
        await createPostPage.fillDescription(updatedDesc);
        await createPostPage.clickSave();
      });

      await test.step("Verify updated description in UI", async () => {
        const row = await createPostPage.getRowByData(post.title);
        await expect(row).toContainText("Updated");
      });
    }
  );

  test(
    "TC034 - Update all fields",
    { tag: ["@TC034", "@regression", "@ui", "@post"] },
    async ({ createPostPage }) => {
      const post = createPostPage.postList[0];
      const updatedTitle = `Updated ${Date.now()}`;
      const updatedDesc = `Updated Description ${Date.now()}`;

      await test.step("Open edit form", async () => {
        await createPostPage.openEdit(post.title);
      });

      await test.step("Update all fields and save", async () => {
        await createPostPage.updateTitle(updatedTitle);
        await createPostPage.fillDescription(updatedDesc);
        await createPostPage.toggleActive(true);
        await createPostPage.clickSave();
      });

      await test.step("Verify all updates in UI", async () => {
        await createPostPage.expectPostUpdated(updatedTitle);
      });
    }
  );

  test(
    "TC035 - Validation error when title is empty",
    { tag: ["@TC035", "@regression", "@ui", "@validation"] },
    async ({ createPostPage }) => {
      const post = createPostPage.postList[0];

      await test.step("Open edit form and clear title", async () => {
        await createPostPage.openEdit(post.title);
        await createPostPage.clearTitle();
        await createPostPage.clickSave();
      });

      await test.step("Verify validation error shown", async () => {
        expect(await createPostPage.isTitleInvalid()).toBe(true);
      });
    }
  );

  test(
    "TC037 - Set Active status ON",
    { tag: ["@TC037", "@regression", "@ui", "@post"] },
    async ({ createPostPage }) => {
      const post = createPostPage.postList[0];

      await test.step("Open edit form and toggle active ON", async () => {
        await createPostPage.openEdit(post.title);
        await createPostPage.toggleActive(true);
        await createPostPage.clickSave();
      });

      await test.step("Verify post updated in UI", async () => {
        await createPostPage.expectPostUpdated(post.title);
      });
    }
  );

  test(
    "TC038 - Set Active status OFF",
    { tag: ["@TC038", "@regression", "@ui", "@post"] },
    async ({ createPostPage }) => {
      const post = createPostPage.postList[0];

      await test.step("Open edit form and toggle active OFF", async () => {
        await createPostPage.openEdit(post.title);
        await createPostPage.toggleActive(false);
        await createPostPage.clickSave();
      });

      await test.step("Verify post updated in UI", async () => {
        await createPostPage.expectPostUpdated(post.title);
      });
    }
  );

  test(
    "TC041 - Changes not saved when cancel",
    { tag: ["@TC041", "@regression", "@ui", "@negative"] },
    async ({ createPostPage }) => {
      const post = createPostPage.postList[0];
      const updated = "Should not save";

      await test.step("Open edit form, update title and cancel", async () => {
        await createPostPage.openEdit(post.title);
        await createPostPage.updateTitle(updated);
        await createPostPage.clickCancel();
      });

      await test.step("Verify original title remains", async () => {
        await expect(createPostPage.getPostRow(updated)).toHaveCount(0);
        await expect(createPostPage.getPostRow(post.title)).toBeVisible();
      });
    }
  );

  test(
    "TC042 - Close edit modal",
    { tag: ["@TC042", "@regression", "@ui"] },
    async ({ createPostPage }) => {
      const post = createPostPage.postList[0];

      await test.step("Open edit form and close modal", async () => {
        await createPostPage.openEdit(post.title);
        await createPostPage.clickCloseModal();
      });

      await test.step("Verify modal closed", async () => {
        await expect(createPostPage.titleInput).toHaveCount(0);
      });
    }
  );

  test(
    "TC043 - Warning shown on unsaved changes",
    { tag: ["@TC043", "@regression", "@ui"] },
    async ({ createPostPage }) => {
      const post = createPostPage.postList[0];

      await test.step("Open edit form, make changes and close modal", async () => {
        await createPostPage.openEdit(post.title);
        await createPostPage.updateTitle("Unsaved");
        await createPostPage.clickCloseModal();
      });

      await test.step("Verify unsaved changes warning displayed", async () => {
        await expect(createPostPage.getUnsavedWarning()).toBeVisible();
      });
    }
  );

  test(
    "TC044 - Save button enabled when form changed",
    { tag: ["@TC044", "@regression", "@ui"] },
    async ({ createPostPage }) => {
      const post = createPostPage.postList[0];

      await test.step("Open edit form and modify title", async () => {
        await createPostPage.openEdit(post.title);
        await createPostPage.updateTitle("Changed");
      });

      await test.step("Verify Save button enabled", async () => {
        await createPostPage.expectSaveEnabled(true);
      });
    }
  );

  test(
    "TC045 - Save button disabled when no changes made",
    { tag: ["@TC045", "@regression", "@ui"] },
    async ({ createPostPage }) => {
      const post = createPostPage.postList[0];

      await test.step("Open edit form without changes", async () => {
        await createPostPage.openEdit(post.title);
      });

      await test.step("Verify Save button disabled", async () => {
        await createPostPage.expectSaveEnabled(false);
      });
    }
  );
});
