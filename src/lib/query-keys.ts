import type {
    Status,
    Prettify,
    BasicQuery,
    PaginationQuery,
} from "@/types/global-types"

export type AdminProductsQuery = Prettify<
    BasicQuery &
        PaginationQuery & {
            categoryId?: string
            status?: Status
        }
>

export type ProductsQuery = Prettify<
    BasicQuery &
        PaginationQuery & {
            categoryId?: string
        }
>

export const queryKeys = {
    products: {
        base: ["products"],
        customer: (params?: ProductsQuery) => ["products", "customer", params],
        infinite: (params?: ProductsQuery) => [
            "products",
            "customer",
            "infinite",
            params,
        ],
        admin: (params?: ProductsQuery) => ["products", "admin", params],
        detail: (id: string | number) => ["products", "detail", id],
        related: (id?: string) => ["products", "related", id],
    },
}
