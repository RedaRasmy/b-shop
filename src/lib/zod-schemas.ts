import z from "zod"

export const emailPasswordSchema = z.object({ // this should be in /auth feature folder
    // TODO : remove it in the next auth update
    email: z.string().min(1, "Email is required").email(),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long"),
})

export const StatusSchema = z.enum(["active", "inactive"])

export const SlugSchema = z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug is too long")
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen."
    )
