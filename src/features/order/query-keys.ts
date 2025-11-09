export type AdminOrdersQuery = {
    page?: number
    perPage?: number
    search?: string
    status?: string | null
    sort?: string
}

export const orderKeys = {
    base: ["orders"] as const,
    customer: () => [...orderKeys.base, "customer"] as const,
    admin: {
        base: ["orders", "admin"] as const,
        many: (query: AdminOrdersQuery = {}) =>
            [...orderKeys.base, "admin", query] as const,
        one: (id: number) => [...orderKeys.admin.base, id] as const,
    },
    success: (token: string) => [...orderKeys.base, "success", token] as const,
}
