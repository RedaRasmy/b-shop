import { describe, it, expect, beforeEach } from "vitest"
import { setup, screen, waitFor } from "@/tests/test-utils"
import {
    insertCategory,
    resetMockedCategories,
} from "@/features/admin/categories/tests/handlers"
import AdminCategoriesPage from "@/pages/admin/categories"

describe("Admin Categories Page", () => {
    beforeEach(() => {
        resetMockedCategories()
    })

    it("should create a new category", async () => {
        const { user } = setup(<AdminCategoriesPage />)

        // ✅ Wait for categories to load (edit buttons appear)
        await waitFor(() => {
            expect(
                screen.getAllByRole("button", { name: /edit/i }).length
            ).toBeGreaterThan(0)
        })

        // NOW count them
        const initialCount = screen.getAllByRole("button", {
            name: /edit/i,
        }).length
        expect(initialCount).toEqual(5)

        // Open dialog (this button is always visible, not fetched)
        await user.click(screen.getByText("Add Category"))

        // Wait for dialog to open
        await waitFor(() => {
            expect(
                screen.getByPlaceholderText("Enter category name")
            ).toBeInTheDocument()
        })

        // Fill form
        const { name, description, slug } = insertCategory
        await user.type(screen.getByLabelText("Category Name"), name)
        await user.type(screen.getByLabelText("Description"), description)
        expect(screen.getByDisplayValue(slug)).toBeInTheDocument()

        // Submit
        await user.click(screen.getByRole("button", { name: /add category/i }))

        // Wait for dialog to close
        await waitFor(() => {
            expect(
                screen.queryByPlaceholderText("Enter category name")
            ).not.toBeInTheDocument()
        })

        // ✅ Wait for NEW edit button to appear (new category loaded)
        await waitFor(() => {
            const newButtons = screen.getAllByRole("button", { name: /edit/i })
            expect(newButtons.length).toEqual(initialCount + 1)
        })

        // ✅ Also verify the category name appears
        expect(screen.getByText(name)).toBeInTheDocument()
    })
})
