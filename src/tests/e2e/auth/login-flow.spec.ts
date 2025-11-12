import { test, expect } from "@playwright/test"
import { mockedCustomerCredentials as customerCredentials } from "@/features/auth/tests/mocked-users"

const adminCredentials = {
    email: process.env.TEST_ADMIN_EMAIL!,
    password: process.env.TEST_ADMIN_PASSWORD!,
}

test.beforeEach(async ({ page }) => {
    await page.goto("/")
})

test.describe("Sign-in Flow", () => {
    test("customer should login successfully and can't go to admin page", async ({
        page,
    }) => {
        // Navigate to login page (if not already there)
        await page.getByText(/sign in/i).click()

        await expect(page).toHaveURL(/.*login.*/)

        const emailInput = page.getByPlaceholder("Enter your email")
        const passwordInput = page.getByPlaceholder("Enter your password")
        const signInButton = page.getByRole("button", { name: /sign in/i })

        // input credentials
        await emailInput.fill(customerCredentials.email)
        await passwordInput.fill(customerCredentials.password)

        // submit
        await signInButton.click()

        // Wait for successful registration
        // Should redirect to profile page for regular users
        await expect(page).toHaveURL(/.*profile.*/)

        // should not have access
        await page.goto("/admin")
        await expect(page).toHaveURL(/.*profile.*/)
    })
    test("admin should login successfully and can't go to profile page", async ({
        page,
    }) => {
        // Navigate to login page (if not already there)
        await page.getByText(/sign in/i).click()

        await expect(page).toHaveURL(/.*login.*/)

        const emailInput = page.getByPlaceholder("Enter your email")
        const passwordInput = page.getByPlaceholder("Enter your password")
        const signInButton = page.getByRole("button", { name: /sign in/i })

        // input credentials
        await emailInput.fill(adminCredentials.email)
        await passwordInput.fill(adminCredentials.password)

        // submit
        await signInButton.click()

        // Should redirect to profile page for regular users
        await expect(page).toHaveURL(/.*admin.*/)

        // should not have access
        await page.goto("/profile")
        await expect(page).toHaveURL(/.*admin.*/)
    })
    test("should persist customer authentication after page reload", async ({
        page,
    }) => {
        // Navigate to login page (if not already there)
        await page.getByText(/sign in/i).click()

        await expect(page).toHaveURL(/.*login.*/)

        const emailInput = page.getByPlaceholder("Enter your email")
        const passwordInput = page.getByPlaceholder("Enter your password")
        const signInButton = page.getByRole("button", { name: /sign in/i })

        // input credentials
        await emailInput.fill(customerCredentials.email)
        await passwordInput.fill(customerCredentials.password)

        // submit
        await signInButton.click()

        // Wait for redirect
        await expect(page).toHaveURL(/.*profile.*/)

        // Reload page
        await page.reload()

        // Should still be authenticated
        await expect(page).toHaveURL(/.*profile.*/)
        await expect(page.getByText(/settings/i)).toBeVisible()
    })
    test("should persist admin authentication after page reload", async ({
        page,
    }) => {
        // Navigate to login page (if not already there)
        await page.getByText(/sign in/i).click()

        await expect(page).toHaveURL(/.*login.*/)

        const emailInput = page.getByPlaceholder("Enter your email")
        const passwordInput = page.getByPlaceholder("Enter your password")
        const signInButton = page.getByRole("button", { name: /sign in/i })

        // input credentials
        await emailInput.fill(adminCredentials.email)
        await passwordInput.fill(adminCredentials.password)

        // submit
        await signInButton.click()

        // Wait for redirect
        await expect(page).toHaveURL(/.*admin.*/)

        // Reload page
        await page.reload()

        // Should still be authenticated
        await expect(page).toHaveURL(/.*admin.*/)
        await expect(page.getByText(/log out/i)).toBeVisible()
    })
    test("complete customer journey: login -> profile -> home -> profile -> logout", async ({
        page,
    }) => {
        // Sign in
        await page.getByText(/sign in/i).click()

        await expect(page).toHaveURL(/.*login.*/)

        const emailInput = page.getByPlaceholder("Enter your email")
        const passwordInput = page.getByPlaceholder("Enter your password")
        const signInButton = page.getByRole("button", { name: /sign in/i })

        await emailInput.fill(customerCredentials.email)
        await passwordInput.fill(customerCredentials.password)
        await signInButton.click()

        // Should be redirected to profile
        await expect(page).toHaveURL(/.*profile.*/)

        // go to home
        const homeButton = page.getByText("B-Shop")
        await homeButton.click()

        await expect(page).toHaveURL("/")

        // return to profile
        await page.goto("/profile")
        await expect(page).toHaveURL(/.*profile.*/)

        // Go to settings tab
        await page.getByText(/settings/i).click()

        // Logout
        await page.getByText(/logout/i).click()

        // Should redirect to login page
        await expect(page).toHaveURL(/.*login.*/)

        // Try to access protected route after logout - should redirect
        await page.goto("/profile")
        await expect(page).toHaveURL(/.*login.*/)
    })
    test("complete admin journey: login -> admin -> home -> admin -> logout", async ({
        page,
    }) => {
        // Sign in
        await page.getByText(/sign in/i).click()

        await expect(page).toHaveURL(/.*login.*/)

        const emailInput = page.getByPlaceholder("Enter your email")
        const passwordInput = page.getByPlaceholder("Enter your password")
        const signInButton = page.getByRole("button", { name: /sign in/i })

        await emailInput.fill(adminCredentials.email)
        await passwordInput.fill(adminCredentials.password)
        await signInButton.click()

        // Should be redirected to admin
        await expect(page).toHaveURL(/.*admin.*/)

        // go to home
        const homeButton = page.getByText("Shop")
        await homeButton.click()

        await expect(page).toHaveURL("/")

        // return to admin
        const adminButton = page.getByText('Admin')
        await adminButton.click()
        await expect(page).toHaveURL(/.*admin.*/)

        // Logout
        await page.getByText(/log out/i).click()

        // Should redirect to login page
        await expect(page).toHaveURL(/.*login.*/)

        // Try to access protected route after logout - should redirect
        await page.goto("/admin")
        await expect(page).toHaveURL(/.*login.*/)
    })
})
