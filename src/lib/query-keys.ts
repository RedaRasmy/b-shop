import type { Status, Prettify } from "@/types/global-types"

type BasicQuery = {
    search?: string
    sort?: string
}

type PaginationQuery = {
    page?: number
    perPage?: number
}

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

export type CategoriesQuery = BasicQuery

export type AdminCategoriesQuery = Prettify<
    BasicQuery & {
        status?: Status
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
    categories: {
        base: ["categories"],
        customer: (params?: CategoriesQuery) => [
            "categories",
            "customer",
            params,
        ],
        admin: (params?: CategoriesQuery) => ["categories", "admin", params],
        detail: (id: string | number) => ["categories", "detail", id],
        products: (categoryId: string) => [
            "categories",
            categoryId,
            "products",
        ],
    },
}
