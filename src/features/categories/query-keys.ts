import type { BasicQuery, Prettify } from "@/types/global-types"

export type AdminCategoriesQuery = Prettify<
    BasicQuery & {
        status?: string
    }
>

export const categoryKeys = {
    base: ["categories"] as const,

    customer: () => [...categoryKeys.base, "customer"] as const,
    admin: (query?: AdminCategoriesQuery) =>
        [...categoryKeys.base, "admin", query] as const,
}
