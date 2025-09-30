import z from "zod"

export const emailPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email(),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long"),
})


export const StatusSchema = z.enum(["active",'inactive'])