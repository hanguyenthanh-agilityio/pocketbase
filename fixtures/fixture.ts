import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { PostPage } from "../pages/post.page";
import { DashboardPage } from "../pages/dashboard.page";
import { getAuthToken } from "../utils/auth";
import { PostAPI } from "../api/post";

type AppFixtures = {
  loginPage: LoginPage;
  postPage: PostPage;
  dashboardPage: DashboardPage;
  authToken: string;

  postApi: PostAPI;
  createdPostIds: string[];
};

export const test = base.extend<AppFixtures>({
  // LoginPage fixture (auto goto)
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await use(loginPage);
  },

  // Dashboard fixture (auto login success)
  dashboardPage: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);

    await page.goto("/demo/");
    await dashboard.expectLoaded();

    await use(dashboard);
  },

  // PostPage fixture (auto login + navigate posts)
  postPage: async ({ page }, use) => {
    const postPage = new PostPage(page);

    await page.goto("/demo/");
    await postPage.goto();

    await use(postPage);
  },

  // API token fixture
  authToken: async ({}, use) => {
    const token = getAuthToken();
    await use(token);
  },

  // API CLIENT
  postApi: async ({ request, authToken }, use) => {
    const api = new PostAPI(request, authToken);
    await use(api);
  },

  // AUTO CLEANUP
  createdPostIds: async ({ postApi }, use) => {
    const ids: string[] = [];

    await use(ids);

    if (!ids.length) return;

    console.log(`🧹 Cleaning ${ids.length} post(s)...`);

    await Promise.all(
      ids.map(async (id) => {
        try {
          await postApi.safeDelete(id);
          console.log(`✅ Deleted: ${id}`);
        } catch {
          console.warn(`❌ Failed to delete post: ${id}`);
        }
      })
    );
  },
});

export { expect };
