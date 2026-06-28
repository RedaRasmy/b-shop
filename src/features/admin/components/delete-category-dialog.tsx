import { DeleteConfirmDialog } from "@/features/admin/components/delete-confirm-dialog"
import { useDeleteCategory } from "@/features/categories/api/mutations"
import type { AdminCategory } from "@/features/categories/types"

export function DeleteCategoryDialog({
    open,
    onOpenChange,
    category,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    category: AdminCategory | null
}) {
    const { mutateAsync: deleteCategory, isPending } = useDeleteCategory()

    if (!category) return null

    async function handleDelete() {
        await deleteCategory(category!.id)
        onOpenChange(false)
    }

    return (
        <DeleteConfirmDialog
            title={"Delete Category"}
            description={`Are you sure you want to delete "${category?.name}"? This action cannot be undone.`}
            onConfirm={handleDelete}
            isLoading={isPending}
            open={open}
            onOpenChange={onOpenChange}
        />
    )
}
