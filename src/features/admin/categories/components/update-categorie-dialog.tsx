import { Button } from "@/components/ui/button"
import {
    type AdminCategory,
    type CategoryFormData,
} from "@/features/admin/categories/categories.validation"
import { Edit } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { updateCategory } from "@/features/admin/admin-requests"
import { queryClient } from "@/main"
import { CategoryForm } from "@/features/admin/categories/components/category-form"
import { useState } from "react"

type UpdatePayload = {
    id: string
    data: CategoryFormData
}

export function UpdateCategoryDialog({
    category,
}: {
    category: AdminCategory
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
            triggerButton={
                <Button asChild variant={"outline"}>
                    <div>
                        <Edit />
                        Edit
                    </div>
                </Button>
            }
            title="Edit Category"
            description="Update category information."
            buttonText="Update Category"
            onSubmit={onSubmit}
            isSubmitting={isPending}
            initialData={category}
        />
    )
}
