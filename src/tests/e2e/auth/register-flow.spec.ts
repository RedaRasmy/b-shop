import { test, expect } from "@playwright/test"

function getCredentials(timestamp: number) {
    return {
        email : `testuser${timestamp}@example.com`,
        password : 'password123'
    }
}

test.beforeEach(async ({ page }) => {
    await page.goto("/")
})

test.describe("register", () => {
    test("customer should register successfully", async ({ page }) => {
        // Navigate to register page (if not already there)
        await page.getByText(/register/i).click()

        const credentials = getCredentials(Date.now())
        const emailInput = page.getByPlaceholder("Enter your email")
        const passwordInput = page.getByPlaceholder("Enter your password")
        const registerButton = page.getByRole("button", { name: /register/i })

        // input credentials
        await emailInput.fill(credentials.email)
        await passwordInput.fill(credentials.password)

        // submit
        await registerButton.click()

        // Wait for successful registration
        // Should redirect to profile page for regular users
        await expect(page).toHaveURL(/.*profile.*/)

    })
    test("should persist authentication after page reload", async ({
        page,
    }) => {
        // Register successfully
        await page.getByText(/register/i).click()

        const credentials = getCredentials(Date.now())
        const emailInput = page.getByPlaceholder("Enter your email")
        const passwordInput = page.getByPlaceholder("Enter your password")
        const registerButton = page.getByRole("button", { name: /register/i })

        await emailInput.fill(credentials.email)
        await passwordInput.fill(credentials.password)
        await registerButton.click()

        // Wait for redirect
        await expect(page).toHaveURL(/.*profile.*/)

        // Reload page
        await page.reload()

        // Should still be authenticated
        await expect(page).toHaveURL(/.*profile.*/)
        await expect(page.getByText(/log out/i)).toBeVisible()
    })
    test("complete user journey: register -> profile -> home -> profile -> logout", async ({
        page,
    }) => {
        // Register
        await page.getByText(/register/i).click()

        const credentials = getCredentials(Date.now())

        const emailInput = page.getByPlaceholder("Enter your email")
        const passwordInput = page.getByPlaceholder("Enter your password")
        const registerButton = page.getByRole("button", { name: /register/i })

        await emailInput.fill(credentials.email)
        await passwordInput.fill(credentials.password)
        await registerButton.click()

        // Should be redirected to profile
        await expect(page).toHaveURL(/.*profile.*/)

        // go to home
        const homeButton = page.getByText("B-Shop")
        await homeButton.click()

        await expect(page).toHaveURL('/')

        // return to profile
        await page.goto("/profile")
        await expect(page).toHaveURL(/.*profile.*/)

        // Logout
        await page.getByText(/log out/i).click()

        // Should redirect to login page
        await expect(page).toHaveURL(/.*login.*/)

        // Try to access protected route after logout - should redirect
        await page.goto("/profile")
        await expect(page).toHaveURL(/.*login.*/)
    })
})
