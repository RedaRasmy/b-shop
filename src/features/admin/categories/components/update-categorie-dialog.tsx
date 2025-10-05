import {
    type AdminCategory,
    type CategoryFormData,
} from "@/features/admin/categories/categories.validation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getCategories, updateCategory } from "@/features/admin/admin-requests"
import { queryClient } from "@/main"
import { CategoryForm } from "@/features/admin/categories/components/category-form"
import { useState, type ReactNode } from "react"
import { queryKeys } from "@/lib/query-keys"

type UpdatePayload = {
    id: string
    data: CategoryFormData
}

export function UpdateCategoryDialog({
    category,
    children,
}: {
    category: AdminCategory
    children?: ReactNode
}) {
    const [isEditOpen, setIsEditOpen] = useState(false)

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, data }: UpdatePayload) => updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-categories"],
            })
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            })
            setIsEditOpen(false)
        },
    })

    const onSubmit = async (data: CategoryFormData) =>
        await mutateAsync({
            id: category.id,
            data,
        })
        
    const { data: categories } = useQuery({
        queryKey: queryKeys.categories.admin(),
        queryFn: () => getCategories(),
        select: (res) => res.data as AdminCategory[],
    })

    return (
        <CategoryForm
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            title="Edit Category"
            description="Update category information."
            buttonText="Update Category"
            onSubmit={onSubmit}
            isSubmitting={isPending}
            initialData={category}
            existingCategories={categories}
        >
            {children}
        </CategoryForm>
    )
}
