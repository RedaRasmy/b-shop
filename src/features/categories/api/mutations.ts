import {
    createCategory,
    deleteCategory,
    updateCategory,
} from "@/features/categories/api/requests"
import { categoryKeys } from "@/features/categories/query-keys"
import type { CategoryFormData } from "@/features/categories/validation"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useCreateCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: categoryKeys.base,
            })
        },
    })
}

export function useUpdateCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) =>
            updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: categoryKeys.base,
            })
        },
    })
}

export function useDeleteCategory() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: categoryKeys.base,
            })
        },
    })
}
