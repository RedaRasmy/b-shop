export type CustomersQuery = {
    page?: number
    perPage?: number
    sort?: string
    search?: string
}

export const profileKeys = {
    base: ["profile"] as const,

    me: () => [...profileKeys.base, "me"] as const,

    addresses: () => [...profileKeys.base, "addresses"] as const,

    /// Admin

    customers: (query?: CustomersQuery) =>
        [...profileKeys.base, "admin", "customers", query] as const,
}
