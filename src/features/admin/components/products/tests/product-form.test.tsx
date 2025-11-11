import { describe, expect, it } from "vitest"
import { setup } from "@/tests/test-utils"
import ProductForm from "@/features/admin/components/products/product-form"

describe("Product Form", () => {
    it("Should render", () => {
        const { render } = setup(
            <ProductForm
                buttonText="Add Product"
                categories={[]}
                description=""
                isSubmitting={false}
                onSubmit={async () => {}}
                title="Create new product"
                open={true}
            />
        )
        expect(render.getByText("Add Product")).toBeInTheDocument()
        expect(render.getByText("Create new product")).toBeInTheDocument()
    })
    it("Should render with dialog trigger child", () => {
        const { render } = setup(
            <ProductForm
                buttonText="Save Product"
                categories={[]}
                description="Add a new product"
                isSubmitting={false}
                onSubmit={async () => {}}
                title="Create Product"
                open={false}
                onOpenChange={() => {}}
            >
                <button>Open Form</button>
            </ProductForm>
        )

        // The trigger is always visible
        expect(render.getByText("Open Form")).toBeInTheDocument()
    })
})
