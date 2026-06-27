import { DeleteConfirmDialog } from "@/features/admin/components/delete-confirm-dialog"
import { useDeleteProduct } from "@/features/products/api/mutations"
import type { AdminProduct } from "@/features/products/types"

export function DeleteProductDialog({
    open,
    onOpenChange,
    product,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: AdminProduct | null
}) {
    const { mutateAsync: deleteMutation, isPending: isDeleting } =
        useDeleteProduct()

    if (!product) return null

    async function handleDelete() {
        await deleteMutation(product!.id)
        onOpenChange(false)
    }

    return (
        <DeleteConfirmDialog
            title={"Delete Product"}
            description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
            onConfirm={handleDelete}
            isLoading={isDeleting}
            open={open}
            onOpenChange={onOpenChange}
        />
    )
}
