import { ProductSchema } from "@/features/products/products.validation"
import { StatusSchema } from "@/lib/zod-schemas"
import { z } from "zod"

/// GET

export const AdminProductSchema = ProductSchema.extend({
    status: StatusSchema,
    stock: z.int(),
})

export type AdminProduct = z.infer<typeof AdminProductSchema>

/// POST

const ImageFormSchema = z.object({
    alt: z.string().max(255, "Alt is too long").optional().default(""),
    isPrimary: z.boolean(),
    file: z
        .instanceof(File)
        .refine(
            (file) => file.size <= 10 * 1024 * 1024,
            "Image must be less than 10MB"
        )
        .refine(
            (file) =>
                ["image/jpeg", "image/png", "image/webp"].includes(file.type),
            "Only JPEG, PNG, and WebP images are allowed"
        ),
    url: z.string(),
})

export const ProductFormSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    slug: z
        .string()
        .min(1, "Product slug is required")
        .max(255, "Product slug is too long")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen."
        ),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    stock: z.int().min(0, "Stock must be positive"),
    // categoryId: z.string().min(1,"Category is Required").uuid(),
    categoryId: z.string().min(1,"Category is Required"),// for now until add categories  
    status: StatusSchema,
    images: z
        .array(ImageFormSchema)
        .min(1, "At least one image is required")
        .max(5, "Maximum 5 images allowed"),
})

export type ProductFormData = z.input<typeof ProductFormSchema>
