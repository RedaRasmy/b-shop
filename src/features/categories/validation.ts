import z from "zod"

export const CategorySchema = z.object({
    id: z.uuid(),
    name: z.string().min(1),
    slug: z.string().min(1).max(255),
    description: z.string(),
    createdAt : z.iso.datetime(),
    updatedAt : z.iso.datetime()
})

export type Category = z.infer<typeof CategorySchema>