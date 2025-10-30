import { fetchProduct } from "@/features/products/api/requests"
import { productKeys } from "@/features/products/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useProduct(slug: string) {
    return useQuery({
        queryKey: productKeys.detail(slug),
        queryFn: () => fetchProduct(slug),
    })
}
