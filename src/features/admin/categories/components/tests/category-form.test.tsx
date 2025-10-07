import { describe, expect, it } from "vitest"
import { setup } from "@/tests/test-utils"
import { CategoryForm } from "@/features/admin/categories/components/category-form"

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
        expect(render.getByText("Add Categroy")).toBeInTheDocument()
        expect(render.getByText("Create new category")).toBeInTheDocument()
    })

    // it("should add new category and auto-close", () => {
    //     const { render, user } = setup(
    //         <CategoryForm
    //             buttonText="Add Category"
    //             description=""
    //             isSubmitting={false}
    //             onSubmit={async () => {}}
    //             title="Create new category"
    //             open={true}
    //         />
    //     )
    // })
})
