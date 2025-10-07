import { describe, expect, it, vi } from "vitest"
import { setup } from "@/tests/test-utils"
import { CategoryForm } from "@/features/admin/categories/components/category-form"
import { insertCategory } from "@/features/admin/categories/components/tests/mocked-categories"

describe("Category Form", () => {
    it("Should render", () => {
        const { render } = setup(
            <CategoryForm
                buttonText="Add Category"
                description=""
                isSubmitting={false}
                onSubmit={async () => {}}
                title="Create new category"
                open={true}
            />
        )
        expect(render.getByText("Add Category")).toBeInTheDocument()
        expect(render.getByText("Create new category")).toBeInTheDocument()
    })

    it("should open dialog when trigger is clicked", async () => {
        const mockOnOpenChange = vi.fn()

        const { user, render } = setup(
            <CategoryForm
                buttonText="Save"
                description="Category form"
                isSubmitting={false}
                onSubmit={async () => {}}
                title="Create Category"
                open={false}
                onOpenChange={mockOnOpenChange}
            >
                <button>Add Category</button>
            </CategoryForm>
        )

        // Click trigger
        await user.click(render.getByText("Add Category"))

        // onOpenChange should be called
        expect(mockOnOpenChange).toHaveBeenCalledWith(true)
    })

    it("should call onSubmit with form data when submitted", async () => {
        const mockOnSubmit = vi.fn().mockResolvedValue(undefined)

        const { user, render } = setup(
            <CategoryForm
                buttonText="Save"
                description=""
                isSubmitting={false}
                onSubmit={mockOnSubmit}
                title="Form title"
                open={true}
                onOpenChange={() => {}}
            />
        )

        const { name, description } = insertCategory

        // Fill out the form
        await user.type(render.getByLabelText(/category name/i), name)
        await user.type(render.getByLabelText(/description/i), description)
        // await user.type(render.getByLabelText(/slug/i), slug) // auto generated

        // Submit
        await user.click(render.getByRole("button", { name: /save/i }))

        // Check onSubmit was called
        expect(mockOnSubmit).toHaveBeenCalledTimes(1)
        expect(mockOnSubmit).toHaveBeenCalledWith(insertCategory)
    })

    it("should validate inputs", async () => {
        const mockOnSubmit = vi.fn().mockResolvedValue(undefined)

        const { user, render } = setup(
            <CategoryForm
                buttonText="Save"
                description=""
                isSubmitting={false}
                onSubmit={mockOnSubmit}
                title="Form title"
                open={true}
                onOpenChange={() => {}}
            />
        )

        // Submit
        await user.click(render.getByRole("button", { name: /save/i }))

        // on submit should not run
        expect(mockOnSubmit).toHaveBeenCalledTimes(0)
        expect(
            render.getByText(/category name is required/i)
        ).toBeInTheDocument()

        const nameInput = render.getByLabelText("Category Name")
        await user.type(nameInput, "__null__")
        expect(
            render.getByText("This category name is not allowed.")
        ).toBeInTheDocument()

        await user.clear(nameInput)

        await user.type(nameInput, "__NULL__")

        expect(
            render.getByText("This category name is not allowed.")
        ).toBeInTheDocument()
    })
})
