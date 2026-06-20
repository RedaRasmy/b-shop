import z from "zod"

export const PasswordSchema = z
    .string("Password is required")
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password is too long")

export const EmailSchema = z
    .string()
    .min(1, "Email is required")
    .pipe(z.email())

export const CredentialsSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema,
})

export type Credentials = z.infer<typeof CredentialsSchema>
