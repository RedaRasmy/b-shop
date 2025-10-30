import {
    fetchAdminProducts,
    fetchProduct,
} from "@/features/products/api/requests"
import {
    productKeys,
    type AdminProductsQuery,
} from "@/features/products/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useProduct(slug: string) {
    return useQuery({
        queryKey: productKeys.detail(slug),
        queryFn: () => fetchProduct(slug),
    })
}

export function useAdminProducts(query?: AdminProductsQuery) {
    return useQuery({
        queryKey: productKeys.admin(query),
        queryFn: () => fetchAdminProducts(query),
    })
}
