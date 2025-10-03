import { Button } from "@/components/ui/button"
import { addProduct, getCategories } from "@/features/admin/admin-requests"
import type { AdminCategory } from "@/features/admin/categories/categories.validation"
import ProductForm from "@/features/admin/products/components/product-form"
import { queryClient } from "@/main"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useState } from "react"

export default function AddProductDialog() {
    const [open, onOpenChange] = useState(false)

    const { data: categories = [] } = useQuery({
        queryFn: () => getCategories(),
        queryKey: ["admin-categories"],
        select: (res) => (res.data || []) as AdminCategory[],
    })

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data: FormData) => addProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-products"],
            })
            queryClient.invalidateQueries({
                queryKey: ["products"],
            })
            onOpenChange(false)
        }
    })

    async function onSubmit(data: FormData) {
        await mutateAsync(data)
    }

    return (
        <ProductForm
            open={open}
            onOpenChange={onOpenChange}
            categories={categories}
            title="Add Product"
            description="Add a new product to your inventory."
            buttonText="Add Product"
            onSubmit={onSubmit}
            isSubmitting={isPending}
        >
            <Button>
                <Plus />
                Add Product
            </Button>
        </ProductForm>
    )
}
