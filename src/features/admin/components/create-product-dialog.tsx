import { Button } from "@/components/ui/button"
import ProductForm from "@/features/admin/components/forms/product-form"
import { buildFormData } from "@/features/admin/utils/build-form-data"
import { useAdminCategories } from "@/features/categories/api/queries"
import { useCreateProduct } from "@/features/products/api/mutations"
import type { ProductFormData } from "@/features/products/validation"
import { Plus } from "lucide-react"

export function CreateProductDialog({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const { mutateAsync: createProduct, isPending } = useCreateProduct()
    const { data: categories = [] } = useAdminCategories()

    const handleCreate = async (values: ProductFormData) => {
        const formData = buildFormData(values)
        await createProduct(formData)
        onOpenChange(false)
    }

    return (
        <ProductForm
            title="Add New Product"
            description="Create a brand new store item."
            buttonText="Create Product"
            onSubmit={handleCreate}
            isSubmitting={isPending}
            categories={categories}
            open={open}
            onOpenChange={onOpenChange}
        >
            <Button>
                <Plus />
                Add Product
            </Button>
        </ProductForm>
    )
}
