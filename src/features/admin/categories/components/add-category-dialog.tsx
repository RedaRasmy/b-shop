import { Button } from "@/components/ui/button"
import {
    type AdminCategory,
    type CategoryFormData,
} from "@/features/admin/categories/categories.validation"
import { Plus } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { addCategory, getCategories } from "@/features/admin/admin-requests"
import { queryClient } from "@/main"
import { CategoryForm } from "@/features/admin/categories/components/category-form"
import { useState } from "react"

export function AddCategoryDialog() {
    const [open, onOpenChange] = useState(false)
    const { mutateAsync, isPending } = useMutation({
        mutationFn: addCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-categories"],
            })
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            })
            onOpenChange(false)
        },
    })

    const { data: categories } = useQuery({
        queryKey: ["admin-categories"],
        queryFn: () => getCategories(),
        select: (res) => res.data as AdminCategory[],
    })


    const onSubmit = async (data: CategoryFormData) => await mutateAsync(data)

    return (
        <CategoryForm
            open={open}
            onOpenChange={onOpenChange}
            title="Add Category"
            description="Add a new product category to organize your inventory."
            buttonText="Add Category"
            onSubmit={onSubmit}
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
