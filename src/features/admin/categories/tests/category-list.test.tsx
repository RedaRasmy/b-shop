import { it, describe, vi, expect } from "vitest"
import { setup } from "@/tests/test-utils"
import CategoryList from "@/features/admin/categories/components/category-list"
import { mockedCategories } from "@/features/admin/categories/tests/handlers"

describe("Category List", () => {
    it("should handle edit and delete events", async () => {
        const mockedDelete = vi.fn()
        const mockedUpdate = vi.fn()

        const { render, user } = setup(
            <CategoryList
                categories={mockedCategories}
                onUpdate={mockedUpdate}
                onDelete={mockedDelete}
            />
        )

        expect(render.getByText("Electronics")).toBeInTheDocument()

        /// test update handler
        await user.click(render.getAllByText("Edit")[0])
        expect(mockedUpdate).toBeCalledTimes(1)

        /// test delete handler
        await user.click(
            render.getAllByRole("button", { name: /more actions/i })[0]
        )
        await user.click(render.getByText("Delete"))
        expect(mockedDelete).toBeCalledTimes(1)
    })
})
