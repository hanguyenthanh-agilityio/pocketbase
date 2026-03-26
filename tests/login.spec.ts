import { test, expect } from "../fixtures/fixture";
import { DashboardPage } from "../pages/dashboard.page";
import { ENV } from "../utils/env";

test.describe("PocketBase Login", () => {
  const email = ENV.EMAIL;
  const password = ENV.PASSWORD;

  // POSITIVE CASE
  test(
    "TC001 - User can login successfully",
    { tag: ["@TC001", "@smoke", "@ui", "@login"] },
    async ({ page, loginPage }) => {
      const dashboard = new DashboardPage(page);

      await test.step("Login and capture API response", async () => {
        const responsePromise = page.waitForResponse(
          (res) => res.url().includes("/auth-with-password") && res.request().method() === "POST"
        );

        await loginPage.login(email, password);

        const res = await responsePromise;

        // Verify API
        expect(res.status()).toBe(200);

        // Verify response body contains token
        const body = await res.json();
        expect(body.token).toBeTruthy();
      });

      await test.step("Verify dashboard loaded", async () => {
        // Verify UI
        await dashboard.expectLoaded();
      });
    }
  );

  // NEGATIVE CASES
  const cases = [
    {
      id: "TC002",
      description: "should show required error when email is empty",
      email: "",
      password,
      type: "required",
      tag: ["@TC002", "@regression", "@ui", "@negative"],
    },
    {
      id: "TC003",
      description: "should show required error when password is empty",
      email,
      password: "",
      type: "required",
      tag: ["@TC003", "@regression", "@ui", "@negative"],
    },
    {
      id: "TC004",
      description: "should show required error when both email and password are empty",
      email: "",
      password: "",
      type: "required",
      tag: ["@TC004", "@regression", "@ui", "@negative"],
    },
    {
      id: "TC005",
      description: "should show validation error when email missing @",
      email: "123",
      password,
      type: "html5",
      tag: ["@TC005", "@regression", "@ui", "@negative"],
    },
    {
      id: "TC006",
      description: "should show validation error when email format is invalid",
      email: "test@",
      password,
      type: "html5",
      tag: ["@TC006", "@regression", "@ui", "@negative"],
    },
    {
      id: "TC007",
      description: "should show error when password is incorrect",
      email,
      password: "wrong",
      type: "api",
      tag: ["@TC007", "@regression", "@api", "@negative"],
    },
    {
      id: "TC008",
      description: "should show error when email does not exist",
      email: "wrong@example.com",
      password,
      type: "api",
      tag: ["@TC008", "@regression", "@api", "@negative"],
    },
    {
      id: "TC009",
      description: "should show error when both email and password are incorrect",
      email: "wrong@example.com",
      password: "wrong",
      type: "api",
      tag: ["@TC009", "@regression", "@api", "@negative"],
    },
  ];

  cases.forEach((c) => {
    test(`${c.id} - ${c.description}`, { tag: c.tag }, async ({ page, loginPage }) => {
      let responsePromise;

      await test.step("Perform login", async () => {
        if (c.type === "api") {
          responsePromise = page.waitForResponse(
            (res) => res.url().includes("/auth-with-password") && res.request().method() === "POST"
          );
        }

        // Perform login attempt
        await loginPage.login(c.email, c.password);
      });

      await test.step("Validate result", async () => {
        // HTML5 required validation
        if (c.type === "required") {
          if (!c.email) {
            const message = await loginPage.getEmailValidationMessage();
            expect(message).not.toBe("");
          }

          if (!c.password) {
            const message = await loginPage.getPasswordValidationMessage();
            expect(message).not.toBe("");
          }
        } else if (c.type === "html5") {
          const isValid = await loginPage.isEmailValid();
          expect(isValid).toBeFalsy();
        } else {
          const res = await responsePromise!;

          // Verify HTTP status from backend
          expect(res.status()).toBe(400);

          // Verify response body
          const body = await res.json();
          expect(body.message).toContain("Failed");

          // Verify UI shows error message
          await expect(loginPage.errorMessage).toBeVisible();
        }
      });

      await test.step("Verify still on login page", async () => {
        await expect(loginPage.loginTitle).toBeVisible();
      });
    });
  });
});
