import {
    createProduct,
    deleteProduct,
    updateProduct,
} from "@/features/products/api/requests"
import { productKeys } from "@/features/products/query-keys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// CREATE

export function useCreateProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: FormData) => createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: productKeys.base,
            })
        },
    })
}

// UPDATE

export function useUpdateProduct(id: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: FormData) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: productKeys.base,
            })
        },
    })
}

/// DELETE

export function useDeleteProduct(id: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: productKeys.base,
            })
        },
    })
}
