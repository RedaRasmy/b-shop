import { SlugSchema, StatusSchema } from "@/lib/zod-schemas"
import z from "zod"

const RESERVED_CATEGORY_NAMES = ["__NULL__", "__ALL__"]

export const CategoryFormSchema = z.object({
    name: z
        .string()
        .min(1, "Category name is required")
        .max(30, "Name is too long (maximum 30 characters)")
        .refine((val) => !RESERVED_CATEGORY_NAMES.includes(val.toUpperCase()), {
            message: "This category name is not allowed.",
        }),
    description: z.string().min(1, "Description is required"),
    slug: SlugSchema,
    status: StatusSchema,
})

export type CategoryFormData = z.infer<typeof CategoryFormSchema>
