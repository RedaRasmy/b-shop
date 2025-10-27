import type { BasicQuery, Prettify, Status } from "@/types/global-types"

export type CategoriesQuery = BasicQuery

export type AdminCategoriesQuery = Prettify<
    BasicQuery & {
        status?: Status
    }
>

export const categoryKeys = {
    base: ["categories"] as const,

    customer: (query?: CategoriesQuery) =>
        [...categoryKeys.base, "customer", query] as const,
    admin: (query?: AdminCategoriesQuery) =>
        [...categoryKeys.base, "admin", query] as const,
}
