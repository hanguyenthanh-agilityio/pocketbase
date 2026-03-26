import { test, expect } from "../fixtures/fixture";

test.describe("Edit Post - UI Validation", () => {
  test(
    "TC031 - Verify user can open edit form",
    { tag: ["@TC031", "@smoke", "@ui", "@post", "@edit"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await test.step("Create a new post", async () => {
        await postPage.goto();
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Open edit form for the post", async () => {
        await postPage.openEdit(title);
        await expect(postPage.titleInput).toBeVisible();
      });
    }
  );

  test(
    "TC032 - Verify user can update post title",
    { tag: ["@TC032", "@smoke", "@ui", "@post", "@edit"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;
      const updated = `Updated ${Date.now()}`;

      await test.step("Create a new post", async () => {
        await postPage.goto();
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Open edit form for the post", async () => {
        await postPage.openEdit(title);
      });

      await test.step("Update post title and save", async () => {
        await postPage.updateTitle(updated);
        await postPage.clickSave();
      });

      await test.step("Verify post title updated in UI", async () => {
        await postPage.expectPostUpdated(updated);
      });
    }
  );

  test(
    "TC033 - Verify user can update post description",
    { tag: ["@TC033", "@regression", "@ui", "@post"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;
      const updatedDesc = `Updated Description ${Date.now()}`;

      await test.step("Create a new post", async () => {
        await postPage.goto();
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Open edit form and update description", async () => {
        await postPage.openEdit(title);
        await postPage.fillDescription(updatedDesc);
        await postPage.clickSave();
      });

      await test.step("Verify updated description in UI", async () => {
        // Optionally check description displayed
        const row = await postPage.getRowByData(title);
        await expect(row).toContainText("Updated");
      });
    }
  );

  test(
    "TC034 - Verify user can update all post fields",
    { tag: ["@TC034", "@regression", "@ui", "@post"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;
      const updatedTitle = `Updated ${Date.now()}`;
      const updatedDesc = `Updated Description ${Date.now()}`;

      await test.step("Create a new post", async () => {
        await postPage.goto();
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Open edit form", async () => {
        await postPage.openEdit(title);
      });

      await test.step("Update all fields and toggle active ON", async () => {
        await postPage.updateTitle(updatedTitle);
        await postPage.fillDescription(updatedDesc);
        await postPage.toggleActive(true);
        await postPage.clickSave();
      });

      await test.step("Verify post updated in UI", async () => {
        await postPage.expectPostUpdated(updatedTitle);
      });
    }
  );

  test(
    "TC035 - Verify validation error when title is empty",
    { tag: ["@TC035", "@regression", "@ui", "@validation"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await test.step("Create a new post", async () => {
        await postPage.goto();
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Open edit form and clear title", async () => {
        await postPage.openEdit(title);
        await postPage.clearTitle();
        await postPage.clickSave();
      });

      await test.step("Verify validation error displayed", async () => {
        expect(await postPage.isTitleInvalid()).toBe(true);
      });
    }
  );

  test(
    "TC037 - Verify user can set Active status to ON",
    { tag: ["@TC037", "@regression", "@ui", "@post"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await test.step("Create a new post", async () => {
        await postPage.goto();
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Open edit form and toggle active ON", async () => {
        await postPage.openEdit(title);
        await postPage.toggleActive(true);
        await postPage.clickSave();
      });

      await test.step("Verify post updated in UI", async () => {
        await postPage.expectPostUpdated(title);
      });
    }
  );

  test(
    "TC038 - Verify user can set Active status to OFF",
    { tag: ["@TC038", "@regression", "@ui", "@post"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await test.step("Create a new post", async () => {
        await postPage.goto();
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Open edit form and toggle active OFF", async () => {
        await postPage.openEdit(title);
        await postPage.toggleActive(false);
        await postPage.clickSave();
      });

      await test.step("Verify post updated in UI", async () => {
        await postPage.expectPostUpdated(title);
      });
    }
  );

  test(
    "TC041 - Verify changes are not saved when user cancels edit",
    { tag: ["@TC041", "@regression", "@ui", "@negative"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;
      const updated = "Should not save";

      await test.step("Create a new post", async () => {
        await postPage.goto();
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Open edit form, change title and cancel", async () => {
        await postPage.openEdit(title);
        await postPage.updateTitle(updated);
        await postPage.clickCancel();
      });

      await test.step("Verify original title remains", async () => {
        await expect(postPage.getPostRow(updated)).toHaveCount(0);
        await expect(postPage.getPostRow(title)).toBeVisible();
      });
    }
  );

  test(
    "TC042 - Verify edit modal is closed when user clicks close button",
    { tag: ["@TC042", "@regression", "@ui"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await test.step("Create a new post", async () => {
        await postPage.goto();
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Open edit form and close modal", async () => {
        await postPage.openEdit(title);
        await postPage.clickCloseModal();
      });

      await test.step("Verify modal closed", async () => {
        await expect(postPage.titleInput).toHaveCount(0);
      });
    }
  );

  test(
    "TC043 - Verify warning is shown when closing with unsaved changes",
    { tag: ["@TC043", "@regression", "@ui"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await test.step("Create a new post", async () => {
        await postPage.goto();
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Open edit form, make changes and close modal", async () => {
        await postPage.openEdit(title);
        await postPage.updateTitle("Unsaved");
        await postPage.clickCloseModal();
      });

      await test.step("Verify unsaved changes warning displayed", async () => {
        await expect(postPage.getUnsavedWarning()).toBeVisible();
      });
    }
  );

  test(
    "TC044 - Verify Save button is enabled when form is changed",
    { tag: ["@TC044", "@regression", "@ui"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await test.step("Create a new post", async () => {
        await postPage.goto();
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Open edit form and modify title", async () => {
        await postPage.openEdit(title);
        await postPage.updateTitle("Changed");
      });

      await test.step("Verify Save button enabled", async () => {
        await postPage.expectSaveEnabled(true);
      });
    }
  );

  test(
    "TC045 - Verify Save button is disabled when no changes are made",
    { tag: ["@TC045", "@regression", "@ui"] },
    async ({ postPage, postApi, createdPostIds }) => {
      const title = `Post ${Date.now()}`;

      await test.step("Create a new post", async () => {
        await postPage.goto();
        await postPage.clickNew();
        await postPage.fillTitle(title);
        await postPage.clickCreate();
      });

      await test.step("Track created post for cleanup", async () => {
        const createdPost = await postApi.list(`title="${title}"`);
        if (createdPost.items?.[0]?.id) createdPostIds.push(createdPost.items[0].id);
      });

      await test.step("Open edit form without changes", async () => {
        await postPage.openEdit(title);
      });

      await test.step("Verify Save button disabled", async () => {
        await postPage.expectSaveEnabled(false);
      });
    }
  );
});
