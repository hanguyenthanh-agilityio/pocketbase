import { test } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { DashboardPage } from "../pages/dashboard.page";
import { boxedStep } from "../utils/boxed-step";

// disable storage reuse
test.use({ storageState: undefined });

test.describe("PocketBase Login", () => {
  const validEmail = "test@example.com";
  const validPassword = "123456";

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);

    await boxedStep("Navigate to login page", async () => {
      await login.goto();
    });
  });

  // TC001 - Success
  test("TC001 - User can login successfully", async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await boxedStep("Login with valid credentials", async () => {
      await login.login(validEmail, validPassword);
    });

    await boxedStep("Verify dashboard loaded", async () => {
      await dashboard.expectLoaded();
    });
  });

  // Negative cases (data-driven)
  const negativeCases = [
    {
      title: "empty email",
      email: "",
      password: validPassword,
    },
    {
      title: "empty password",
      email: validEmail,
      password: "",
    },
    {
      title: "empty email and password",
      email: "",
      password: "",
    },
    {
      title: "invalid password",
      email: validEmail,
      password: "wrong123",
    },
    {
      title: "invalid email",
      email: "wrong@example.com",
      password: validPassword,
    },
  ];

  negativeCases.forEach((data, index) => {
    const testId = `TC${String(index + 2).padStart(3, "0")}`;

    test(`${testId} - User cannot login with ${data.title}`, async ({ page }) => {
      const login = new LoginPage(page);

      await boxedStep(`Attempt login with ${data.title}`, async () => {
        await login.login(data.email, data.password);
      });

      await boxedStep("Verify validation", async () => {
        const isEmptyEmail = !data.email;
        const isEmptyPassword = !data.password;

        if (isEmptyEmail || isEmptyPassword) {
          if (isEmptyEmail) {
            await login.expectEmailRequired();
          }
          if (isEmptyPassword) {
            await login.expectPasswordRequired();
          }
        } else {
          await login.expectInvalidCredentialsError();
        }
      });

      await boxedStep("Verify still on login screen", async () => {
        await login.expectStillOnLogin();
      });
    });
  });
});
