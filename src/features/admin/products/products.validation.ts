import { ProductSchema } from '@/features/products/products.validation'
import { StatusSchema } from '@/lib/zod-schemas'
import {z} from 'zod'

/// GET 


export const AdminProductSchema = ProductSchema.extend({
    status : StatusSchema,
    stock : z.int()
})

export type AdminProduct = z.infer<typeof AdminProductSchema>


/// POST

const ImageFormSchema = z.object({
    alt: z.string().max(255,"Alt is too long").optional().default(""),
    isPrimary: z.boolean(),
})

export const ProductFormSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    slug : z.string().min(1,"Product slug is required").max(255,'Product slug is too long'),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    stock: z.int().min(0, "Stock must be positive"),
    categoryId: z.uuid(),
    status: StatusSchema,
    images: z
        .array(ImageFormSchema)
        .min(1, "At least one image is required")
        .max(5, "Maximum 5 images allowed"),
})

export type ProductFormData = z.infer<typeof ProductFormSchema>