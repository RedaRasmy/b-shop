import type { Status } from "@/lib/types"
import type { Prettify } from "node_modules/zod/v4/core/util.d.cts"

type Params = Record<string, string | number | boolean>

type BasicQuery = {
    search?: string
    sort?: string
}

type PaginationQuery = {
    page?: number
    perPage?: number
}

export type ProductsQuery = Prettify<
    BasicQuery &
        PaginationQuery & {
            category?: string
            status?: Status
        }
>

export type CategoriesQuery = Prettify<
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
        admin: (params?: ProductsQuery) => [
            "products",
            "admin",
            serializeParams(params),
        ],
        detail: (id: string | number) => ["products", "detail", id],
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
}
