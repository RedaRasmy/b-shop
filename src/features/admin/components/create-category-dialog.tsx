import { Button } from "@/components/ui/button"
import { CategoryForm } from "@/features/admin/components/forms/category-form"
import { useCreateCategory } from "@/features/categories/api/mutations"
import { useAdminCategories } from "@/features/categories/api/queries"
import type { CategoryFormData } from "@/features/categories/validation"
import { Plus } from "lucide-react"

export function CreateCategoryDialog({
    open,
    onOpenChange,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const { mutateAsync: createCategory, isPending } = useCreateCategory()
    const { data: categories = [] } = useAdminCategories()

    const handleCreate = async (values: CategoryFormData) => {
        await createCategory(values)
        onOpenChange(false)
    }

    return (
        <CategoryForm
            open={open}
            onOpenChange={onOpenChange}
            title={"Add Category"}
            description={
                "Add a new product category to organize your inventory."
            }
            buttonText={"Add Category"}
            onSubmit={handleCreate}
            isSubmitting={isPending}
            existingCategories={categories}
        >
            <Button asChild>
                <div>
                    <Plus />
                    Add Category
                </div>
            </Button>
        </CategoryForm>
    )
}
