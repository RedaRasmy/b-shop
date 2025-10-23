import type { Status, Prettify } from "@/lib/types"

type Params = Record<string, string | number | boolean>

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

function serializeParams(params?: Params) {
    if (!params) return null
    const sorted = Object.keys(params)
        .sort()
        .reduce((acc, key) => {
            acc[key] = params[key]
            return acc
        }, {} as Params)
    return JSON.stringify(sorted)
}

export const queryKeys = {
    products: {
        base: ["products"],
        customer: (params?: ProductsQuery) => [
            "products",
            "customer",
            serializeParams(params),
        ],
        infinite: (params?: ProductsQuery) => [
            "products",
            "customer",
            "infinite",
            serializeParams(params),
        ],
        admin: (params?: ProductsQuery) => [
            "products",
            "admin",
            serializeParams(params),
        ],
        detail: (id: string | number) => ["products", "detail", id],
        related: (id?: string) => ["products", "related", id],
    },
    categories: {
        base: ["categories"],
        customer: (params?: CategoriesQuery) => [
            "categories",
            "customer",
            serializeParams(params),
        ],
        admin: (params?: CategoriesQuery) => [
            "categories",
            "admin",
            serializeParams(params),
        ],
        detail: (id: string | number) => ["categories", "detail", id],
        products: (categoryId: string) => [
            "categories",
            categoryId,
            "products",
        ],
    },
    cart: {
        base: ["cart"],
        auth: () => ["cart", "auth"],
        guest: (ids: string[]) => ["cart", "guest", ...ids.slice().sort()],
    },
    profile: ["me"],
    orders: {
        base: ["orders"],
        customer: () => ["orders", "customer"],
        admin: () => ["orders", "admin"],
    },
    addresses: ["addresses"],
}
