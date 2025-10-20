import z from "zod"

export const ProfileInfosSchema = z.object({
    fullName: z
        .string()
        .min(3, "Full name must be at least 3 characters")
        .max(100, "Full name must not exceed 100 characters"),
    phone: z
        .string()
        .min(10, "Phone number must be at least 9 digits")
        .max(15, "Phone number must not exceed 16 digits")
        .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
})

export type Profile = {
    id: string
    email: string
    role: "admin" | "customer"
    isEmailVerified: boolean
    fullName: string | null
    phone: string | null
}
