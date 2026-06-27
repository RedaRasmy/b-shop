import ProductForm from "@/features/admin/components/forms/product-form"
import { buildFormData } from "@/features/admin/utils/build-form-data"
import { useAdminCategories } from "@/features/categories/api/queries"
import { useUpdateProduct } from "@/features/products/api/mutations"
import type { AdminProduct } from "@/features/products/types"
import type { ProductFormData } from "@/features/products/validation"

export function EditProductDialog({
    product,
    open,
    onOpenChange,
}: {
    product: AdminProduct | null
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const { mutateAsync: updateProduct, isPending } = useUpdateProduct()
    const { data: categories = [] } = useAdminCategories()

    if (!product) return null

    const defaultValues: ProductFormData = {
        ...product,
        price: Number(product.price),
        categoryId: product.categoryId ?? "",
    }

    const handleSubmit = async (values: ProductFormData) => {
        const formData = buildFormData(values)
        await updateProduct({ id: product.id, data: formData })
        onOpenChange(false)
    }

    return (
        <ProductForm
            title="Edit Product"
            description="Update product information."
            buttonText="Update Product"
            open={open}
            onOpenChange={onOpenChange}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            categories={categories}
        />
    )
}
