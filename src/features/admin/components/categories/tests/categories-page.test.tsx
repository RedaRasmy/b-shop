import { describe, it, expect, beforeEach } from "vitest"
import { setup, screen, waitFor } from "@/tests/test-utils"
import {
    insertCategory,
    mockedCategories,
    resetMockedCategories,
} from "@/features/admin/components/categories/tests/handlers"
import AdminCategoriesPage from "@/pages/admin/categories"

describe("Admin Categories Page", () => {
    beforeEach(() => {
        resetMockedCategories()
    })

    it("should create a new category", async () => {
        const { user } = setup(<AdminCategoriesPage />)

        // Wait for categories to load (edit buttons appear)
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

        // Wait for NEW edit button to appear (new category loaded)
        await waitFor(() => {
            const newButtons = screen.getAllByRole("button", { name: /edit/i })
            expect(newButtons.length).toEqual(initialCount + 1)
        })

        // Also verify the category name appears
        expect(screen.getByText(name)).toBeInTheDocument()
    })

    it("should update a category", async () => {
        const { user } = setup(<AdminCategoriesPage />)

        // Wait for categories to load (edit buttons appear)
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

        // open first-category update dialog
        await user.click(screen.getAllByRole("button", { name: "edit" })[0])

        const { name, slug, description } = mockedCategories[0]

        /// check initial data
        expect(screen.getByDisplayValue(name)).toBeInTheDocument()
        expect(screen.getByDisplayValue(slug)).toBeInTheDocument()
        expect(screen.getByDisplayValue(description)).toBeInTheDocument()

        // Update Category Name
        await user.clear(screen.getByLabelText("Category Name"))
        await user.type(
            screen.getByLabelText("Category Name"),
            "New Category Name!"
        )

        /// Submit
        await user.click(
            screen.getByRole("button", { name: "Update Category" })
        )

        await waitFor(() => {
            // wait for submit -> auto-close
            expect(
                screen.queryByText("Update Category")
            ).not.toBeInTheDocument()
        })
        // Wait for updated category name
        expect(screen.getByText("New Category Name!")).toBeInTheDocument()

        // Check if inital-data is updated in update form
        await user.click(screen.getAllByText("Edit")[0])
        expect(
            screen.getByDisplayValue("New Category Name!")
        ).toBeInTheDocument()
    })

    it("should delete a category", async () => {
        const { user } = setup(<AdminCategoriesPage />)

        // Wait for categories to load (edit buttons appear)
        await waitFor(() => {
            expect(
                screen.getAllByRole("button", { name: /edit/i }).length
            ).toBeGreaterThan(0)
        })
        const { name } = mockedCategories[0]

        // NOW count them
        const initialCount = screen.getAllByRole("button", {
            name: /edit/i,
        }).length
        expect(initialCount).toEqual(5)

        // open first-category delete dialog
        await user.click(
            screen.getAllByRole("button", { name: "more actions" })[0]
        )
        await user.click(screen.getByText("Delete"))
        // delete
        await user.click(screen.getByRole("button", { name: "delete" }))

        await waitFor(() => {
            /// wait for auto-close
            expect(
                screen.queryByRole("button", { name: "Delete" })
            ).not.toBeInTheDocument()
        })

        // Deleted category should disappear
        expect(screen.queryByText(name)).not.toBeInTheDocument()
        // check new count
        const newCount = screen.getAllByRole("button", {
            name: /edit/i,
        }).length
        expect(newCount).toEqual(4)
    })

    it("should search", async () => {
        const { user } = setup(<AdminCategoriesPage />)

        // Wait for categories to load (edit buttons appear)
        await waitFor(() => {
            expect(
                screen.getAllByRole("button", { name: /edit/i }).length
            ).toBeGreaterThan(0)
        })

        // Test Searching
        const searchInput = screen.getByPlaceholderText("Search...")
        await user.type(searchInput, "Electronics")

        await waitFor(() => {
            const initialCount = screen.getAllByRole("button", {
                name: /edit/i,
            }).length
            expect(initialCount).toEqual(1)
        })
    })
})
