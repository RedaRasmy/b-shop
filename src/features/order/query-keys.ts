export const orderKeys = {
    base: ["orders"] as const,
    customer: () => [...orderKeys.base, "customer"] as const,
    admin: () => [...orderKeys.base, "admin"] as const,
    success: (token: string) => [...orderKeys.base, "success", token] as const,
}
