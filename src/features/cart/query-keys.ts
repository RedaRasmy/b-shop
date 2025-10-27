export const cartKeys = {
    base: ["cart"] as const,
    auth: () => [...cartKeys.base, "auth"] as const,
    guest: (ids: string[]) =>
        [...cartKeys.base, "guest", ...ids.slice().sort()] as const,
}
