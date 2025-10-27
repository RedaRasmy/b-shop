import z from "zod"

export const PasswordSchema = z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password is too long")

export const emailPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email(),
    password: PasswordSchema,
})

export type Credentials = z.infer<typeof emailPasswordSchema>

export type User = {
    id: string
    email: string
    role: "admin" | "customer"
    isEmailVerified: boolean
}
