import { z } from "zod"

// The customer will only get products but can review !

export const ImageSchema = z.object({
    id: z.uuid(),
    url: z.url(),
    alt: z.string().default(""),
    isPrimary: z.boolean(),
})

const ReviewSchema = z.object({
    id: z.uuid(),
    rating: z.int().min(1).max(5),
    comment: z.string(),
    authorName: z.string(),
})

export const ProductSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    slug: z.string().min(1).max(255),
    price: z.number().positive(),
    inventoryStatus: z.enum(["In Stock", "Low Stock", "Out of Stock"]),
    description: z.string(),
    images: z.array(ImageSchema).min(1),
    reviews: z.array(ReviewSchema).default([]),
    categoryId: z.uuid(),
    categoryName: z.string().min(1),
    averageRating: z.number().min(0).max(5),
    reviewCount: z.int().min(0).default(0),
    isNew : z.boolean()
})

export type Product = z.infer<typeof ProductSchema>

export const ProductSummarySchema = ProductSchema.omit({
    images: true,
    reviews : true,
    description : true,
    inventoryStatus : true,
    categoryName : true,
}).extend({
    thumbnailUrl : z.string().min(1),
})


export type ProductSummary = z.infer<typeof ProductSummarySchema>

// Add review

export const ReviewFormSchema = z.object({
    rating: z.int().min(1).max(5),
    comment: z.string().max(500).optional(),
})

export type ReviewFormData = z.infer<typeof ReviewFormSchema>
