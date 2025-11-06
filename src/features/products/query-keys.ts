import type {
    Prettify,
    BasicQuery,
    PaginationQuery,
} from "@/types/global-types"

export type AdminProductsQuery = Prettify<
    BasicQuery &
        PaginationQuery & {
            categoryId?: string
            status?: string
        }
>

export type ProductsQuery = Prettify<
    BasicQuery &
        PaginationQuery & {
            categoryId?: string
        }
>

export const productKeys = {
    base: ["products"] as const,
    customer: (query: ProductsQuery = {}) =>
        [...productKeys.base, "customer", query] as const,
    infinite: (query: ProductsQuery = {}) =>
        [...productKeys.base, "customer", "infinite", query] as const,
    admin: (query: AdminProductsQuery = {}) =>
        [...productKeys.base, "admin", query] as const,
    detail: (id?: string) => [...productKeys.base, "detail", id] as const,
}
