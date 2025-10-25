import z from "zod"

export const CheckoutFormSchema = z.object({
    /// Contact Informations
    name: z
        .string("Name is required")
        .min(3, "Full name must be at least 3 characters")
        .max(100, "Full name must not exceed 100 characters"),
    phone: z
        .string("Phone number is required")
        .min(10, "Phone number must be at least 9 digits")
        .max(15, "Phone number must not exceed 16 digits")
        .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
    email: z
        .string("Email is required")
        .min(1, "Email is required")
        .email("Email is not valid"),

    /// Address
    city: z
        .string("City name is required")
        .min(1, "City name is required")
        .max(100),
    addressLine1: z
        .string("Street address is required")
        .min(1, "Street address is required")
        .max(255, "Max length is 255"),
    addressLine2: z.string().max(255, "Max length is 255").optional(),
    postalCode: z
        .string("Postal code is required")
        .min(1, "Postal code is required")
        .max(20, "Max length is 20"),
})

export type CheckoutFormData = z.infer<typeof CheckoutFormSchema>
