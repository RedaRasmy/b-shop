import type { BasicQuery, Prettify, Status } from "@/types/global-types"

export type AdminCategoriesQuery = Prettify<
    BasicQuery & {
        status?: Status
    }
>

export const categoryKeys = {
    base: ["categories"] as const,

    customer: () => [...categoryKeys.base, "customer"] as const,
    admin: (query?: AdminCategoriesQuery) =>
        [...categoryKeys.base, "admin", query] as const,
}
