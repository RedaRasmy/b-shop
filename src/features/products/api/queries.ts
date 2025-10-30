import {
    fetchAdminProducts,
    fetchProduct,
    fetchProducts,
} from "@/features/products/api/requests"
import {
    productKeys,
    type AdminProductsQuery,
    type ProductsQuery,
} from "@/features/products/query-keys"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

// Customer

export function useProduct(slug: string) {
    return useQuery({
        queryKey: productKeys.detail(slug),
        queryFn: () => fetchProduct(slug),
    })
}

export function useInfiniteProducts(query?: ProductsQuery) {
    return useInfiniteQuery({
        queryKey: productKeys.infinite(query),
        queryFn: ({ pageParam = 1 }) =>
            fetchProducts({ ...query, page: pageParam }),
        initialPageParam: 1,
        getPreviousPageParam: (data) => data.prevPage ?? undefined,
        getNextPageParam: (data) => data.nextPage ?? undefined,
    })
}

export function useProducts(query?: ProductsQuery) {
    return useQuery({
        queryKey: productKeys.customer(query),
        queryFn: () => fetchProducts(query),
        select: (res) => {
            return res.data
        },
    })
}

// Admin

export function useAdminProducts(query?: AdminProductsQuery) {
    return useQuery({
        queryKey: productKeys.admin(query),
        queryFn: () => fetchAdminProducts(query),
    })
}
