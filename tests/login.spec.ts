import { test, expect } from "../fixtures/fixture";
import { DashboardPage } from "../pages/dashboard.page";
import { ENV } from "../utils/env";

test.describe("PocketBase Login", () => {
  const email = ENV.EMAIL;
  const password = ENV.PASSWORD;

  test("TC001 - User can login successfully", async ({ page, loginPage }) => {
    const dashboard = new DashboardPage(page);

    // intercept API (browser context)
    const responsePromise = page.waitForResponse((res) =>
      res.url().includes("/auth-with-password")
    );

    await loginPage.login(email, password);

    const res = await responsePromise;

    // Verify API
    expect(res.status()).toBe(200);

    // Verify response body contains token
    const body = await res.json();
    expect(body.token).toBeTruthy();

    // Verify UI
    await dashboard.expectLoaded();
  });

  // NEGATIVE CASES
  const cases = [
    {
      id: "TC002",
      description: "should show required error when email is empty",
      email: "",
      password,
      type: "required",
    },
    {
      id: "TC003",
      description: "should show required error when password is empty",
      email,
      password: "",
      type: "required",
    },
    {
      id: "TC004",
      description: "should show required error when email and password are empty",
      email: "",
      password: "",
      type: "required",
    },
    {
      id: "TC005",
      description: "should show validation error when email missing @",
      email: "123",
      password,
      type: "html5",
    },
    {
      id: "TC006",
      description: "should show validation error when email format is invalid",
      email: "test@",
      password,
      type: "html5",
    },
    {
      id: "TC007",
      description: "should show error when password is incorrect",
      email,
      password: "wrong",
      type: "api",
    },
    {
      id: "TC008",
      description: "should show error when email does not exist",
      email: "wrong@example.com",
      password,
      type: "api",
    },
    {
      id: "TC009",
      description: "should show error when both email and password are incorrect",
      email: "wrong@example.com",
      password: "wrong",
      type: "api",
    },
  ];

  cases.forEach((c) => {
    test(`${c.id}`, async ({ page, loginPage }) => {
      let responsePromise;

      // Only listen for API when backend is expected to be called
      if (c.type === "api") {
        responsePromise = page.waitForResponse(
          (res) => res.url().includes("/auth-with-password") && res.request().method() === "POST"
        );
      }

      // Perform login attempt
      await loginPage.login(c.email, c.password);

      // HTML5 required validation
      if (c.type === "required") {
        if (!c.email) await loginPage.expectEmailRequired();
        if (!c.password) await loginPage.expectPasswordRequired();
      }
      // HTML5 format validation
      else if (c.type === "html5") {
        await loginPage.expectEmailInvalidFormat();
      }
      // API validation
      else {
        const res = await responsePromise!;

        // Verify HTTP status from backend
        expect(res.status()).toBe(400);

        // Verify response body
        const body = await res.json();
        expect(body.message).toContain("Failed");

        // Verify UI shows error message
        await loginPage.expectInvalidCredentialsError();
      }

      await loginPage.expectStillOnLogin();
    });
  });
});
