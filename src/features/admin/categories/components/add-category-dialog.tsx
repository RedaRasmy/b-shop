import { Button } from "@/components/ui/button"
import { type CategoryFormData } from "@/features/admin/categories/categories.validation"
import { Plus } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { addCategory } from "@/features/admin/admin-requests"
import { queryClient } from "@/main"
import { CategoryForm } from "@/features/admin/categories/components/category-form"

export function AddCategoryDialog() {
    const { mutateAsync, isPending } = useMutation({
        mutationFn: addCategory,
        onSuccess: (data) => {
            console.log("success : ", data)
            queryClient.invalidateQueries({
                queryKey: ["admin-categories", "categories"],
            })
        },
    })

    const onSubmit = async (data: CategoryFormData) => await mutateAsync(data)

    return (
        <CategoryForm
            triggerButton={
                <Button asChild>
                    <div>
                        <Plus />
                        Add Category
                    </div>
                </Button>
            }
            title="Add Category"
            description="Add a new product category to organize your inventory."
            buttonText="Add Category"
            onSubmit={onSubmit}
            isSubmitting={isPending}
        />
    )
}
