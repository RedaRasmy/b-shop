export type AdminOrdersQuery = {
    page?: number
    perPage?: number
    search?: string
    status?: string
    sort?: string
}

export const orderKeys = {
    base: ["orders"] as const,
    customer: () => [...orderKeys.base, "customer"] as const,
    admin: (query: AdminOrdersQuery = {}) =>
        [...orderKeys.base, "admin", query] as const,
    success: (token: string) => [...orderKeys.base, "success", token] as const,
}
