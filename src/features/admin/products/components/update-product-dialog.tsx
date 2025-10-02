import { getCategories, updateProduct } from "@/features/admin/admin-requests"
import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import ProductForm from "@/features/admin/products/components/product-form"
import type { AdminProduct } from "@/features/admin/products/products.validation"
import { queryClient } from "@/main"
import { useMutation, useQuery } from "@tanstack/react-query"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: AdminProduct 
}

export default function UpdateProductDialog({
    onOpenChange,
    open,
    product,
}: Props) {


    const { data: categories = [] } = useQuery({
        queryFn: () => getCategories(),
        queryKey: ["admin-categories"],
        select: (res) => (res.data || []) as AdminCategory[],
    })

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: FormData) => updateProduct(product.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-products"],
            })
            queryClient.invalidateQueries({
                queryKey: ["products"],
            })
            onOpenChange(false)
        },
    })

    async function onSubmit(data: FormData) {
        await mutateAsync(data)
    }

    return (
        <ProductForm
            open={open}
            onOpenChange={onOpenChange}
            categories={categories}
            title="Edit Product"
            description="Update product information."
            buttonText="Update Product"
            onSubmit={onSubmit}
            isSubmitting={isPending}
            initialData={product}
        />
    )
}
