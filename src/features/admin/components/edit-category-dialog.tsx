import { CategoryForm } from "@/features/admin/components/forms/category-form"
import { useUpdateCategory } from "@/features/categories/api/mutations"
import { useAdminCategories } from "@/features/categories/api/queries"
import type { AdminCategory } from "@/features/categories/types"
import type { CategoryFormData } from "@/features/categories/validation"

export function EditCategoryDialog({
    category,
    open,
    onOpenChange,
}: {
    category: AdminCategory | null
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const { mutateAsync: updateCategory, isPending } = useUpdateCategory()
    const { data: categories = [] } = useAdminCategories()

    if (!category) return null

    const defaultValues: CategoryFormData = category // different but compatible

    const handleSubmit = async (values: CategoryFormData) => {
        await updateCategory({ id: category.id, data: values })
        onOpenChange(false)
    }

    return (
        <CategoryForm
            title="Edit Category"
            description="Add a new product category to organize your inventory."
            buttonText="Update Category"
            open={open}
            onOpenChange={onOpenChange}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            defaultValues={defaultValues}
            existingCategories={categories}
        />
    )
}
