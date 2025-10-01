
import {
    type AdminCategory,
    type CategoryFormData,
} from "@/features/admin/categories/categories.validation"
import { useMutation } from "@tanstack/react-query"
import { updateCategory } from "@/features/admin/admin-requests"
import { queryClient } from "@/main"
import { CategoryForm } from "@/features/admin/categories/components/category-form"
import { useState, type ReactNode } from "react"

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
        onSuccess: (data) => {
            console.log("success : ", data)
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
        >
            {children}
        </CategoryForm>
    )
}
