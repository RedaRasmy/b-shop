export type User = {
    id: string
    email: string
    role: "admin" | "customer"
    isEmailVerified: boolean
}