export type Product = {
    id: string
    name: string
    slug: string
    price: number
    inventoryStatus: "In Stock" | "Low Stock" | "Out of Stock"
    description: string
    images: {
        id: string
        url: string
        alt: string
        isPrimary: boolean
        width: number
        height: number
        size: number
    }[]
    reviews: {
        id: string
        rating: number
        comment: string
        date: string
        edited: boolean
    }[]
    categoryId: string
    categoryName: string
    averageRating: number
    reviewCount: number
    isNew: boolean
}

export type ProductSummary = {
    id: string
    name: string
    slug: string
    price: number
    inventoryStatus: "In Stock" | "Low Stock" | "Out of Stock"
    categoryId: string
    averageRating: number
    reviewCount: number
    isNew: boolean
    thumbnailUrl: string
}
