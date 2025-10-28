import z from "zod"

/// Contact

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

/// Address

export const AddressFormSchema = z.object({
    label: z.string().min(3).max(50),
    city: z
        .string("City name is required")
        .min(1, "City name is required")
        .max(100),
    addressLine1: z
        .string("Street address is required")
        .min(1, "Street address is required")
        .max(255, "Max length is 255"),
    isDefault: z.boolean(),
    postalCode: z
        .string("Postal code is required")
        .min(1, "Postal code is required")
        .max(20, "Max length is 20"),
})

export type AddressFormData = z.infer<typeof AddressFormSchema>
