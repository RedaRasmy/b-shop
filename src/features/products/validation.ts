import z from "zod"

export const ReviewFormSchema = z.object({
    rating: z.int().min(1).max(5),
    comment: z.string().max(500).optional(),
})

export type ReviewFormData = z.infer<typeof ReviewFormSchema>
