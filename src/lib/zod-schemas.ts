import z from "zod"

export const emailPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email(),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long"),
})

export const StatusSchema = z.enum(["active", "inactive"])

export const SlugSchema = z
    .string()
    .min(1, "Product slug is required")
    .max(255, "Product slug is too long")
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen."
    )
