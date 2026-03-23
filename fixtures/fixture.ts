import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { PostPage } from "../pages/post.page";
import { DashboardPage } from "../pages/dashboard.page";
import { ENV } from "../utils/env";
import { getAuthToken } from "../utils/auth";

type AppFixtures = {
  loginPage: LoginPage;
  postPage: PostPage;
  dashboardPage: DashboardPage;
  authToken: string;
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
    const loginPage = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(ENV.EMAIL, ENV.PASSWORD);
    await dashboard.expectLoaded();

    await use(dashboard);
  },

  // PostPage fixture (auto login + navigate posts)
  postPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const postPage = new PostPage(page);

    await loginPage.goto();
    await loginPage.login(ENV.EMAIL, ENV.PASSWORD);

    await postPage.goto();

    await use(postPage);
  },

  // API token fixture
  authToken: async ({}, use) => {
    const token = getAuthToken();
    await use(token);
  },
});

export { expect };
