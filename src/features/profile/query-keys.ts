export const profileKeys = {
    base: ["profile"] as const,

    me: () => [...profileKeys.base, "me"] as const,

    addresses: () => [...profileKeys.base, "addresses"] as const,
}
