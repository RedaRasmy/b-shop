import { realAdminCredentials } from "@/tests/test-utils"
import { test, expect } from "@playwright/test"

const { email, password } = realAdminCredentials

test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.getByText(/sign in/i).click()

    await expect(page).toHaveURL(/.*login.*/)

    const emailInput = page.getByPlaceholder("Enter your email")
    const passwordInput = page.getByPlaceholder("Enter your password")
    const signInButton = page.getByRole("button", { name: /sign in/i })

    await emailInput.fill(email)
    await passwordInput.fill(password)

    // submit
    await signInButton.click()

    await expect(page).toHaveURL(/.*admin.*/)
})

test.describe("Categories & Products", () => {
    test("CRUD categories", async ({ page }) => {
        await page.getByText("categories").click()

        // Add

        await page.getByText("Add Category").click()

        await page.getByPlaceholder(/enter category name/i).fill("test")

        await page.getByLabel("Description").fill("test description")

        await page.getByLabel("Status").click()
        await page.getByRole("option", { name: "Active", exact: true }).click()

        await page.getByRole("button", { name: "Add Category" }).click()

        await expect(page.getByText("Cancel")).not.toBeInViewport()

        await expect(page.getByText("test", { exact: true })).toBeVisible()

        // Update

        await page.getByText("Edit").first().click()

        await page.getByLabel("Category Name").fill("test2")

        await page.getByRole("button", { name: "Update Category" }).click()

        await expect(page.getByText("test2")).toBeVisible()

        // Delete

        await page.getByLabel("more actions").first().click()

        await page.getByText("Delete").click()

        await page.getByRole("button", { name: "Delete" }).click()

        await expect(page.getByText("test2")).not.toBeVisible()
    })
})
