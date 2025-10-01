import { CategorySchema } from "@/features/categories/categories.validation"
import { SlugSchema, StatusSchema } from "@/lib/zod-schemas"
import z from "zod"

/// Get

export const AdminCategorySchema = CategorySchema.extend({
    status : StatusSchema,
    productsCount : z.int().min(0)
})

export type AdminCategory = z.infer<typeof AdminCategorySchema>

/// Post

export const CategoryFormSchema = z.object({
    name: z.string().min(1, "Category name is required").max(30),
    description: z.string().min(1, "Description is required"),
    slug: SlugSchema,
    status: StatusSchema,
})

export type CategoryFormData = z.infer<typeof CategoryFormSchema>
