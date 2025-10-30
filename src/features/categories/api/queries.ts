import { fetchCategories } from "@/features/categories/api/requests"
import { categoryKeys } from "@/features/categories/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.customer(),
        queryFn: () => fetchCategories(),
    })
}
