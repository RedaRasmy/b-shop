import {
    fetchAdminCategories,
    fetchCategories,
} from "@/features/categories/api/requests"
import {
    categoryKeys,
    type AdminCategoriesQuery,
} from "@/features/categories/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.customer(),
        queryFn: () => fetchCategories(),
    })
}

export function useAdminCategories(query?: AdminCategoriesQuery) {
    return useQuery({
        queryKey: categoryKeys.admin(query),
        queryFn: () => fetchAdminCategories(query),
    })
}
