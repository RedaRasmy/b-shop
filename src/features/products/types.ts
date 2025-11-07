// Customer

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

// Admin

export type AdminProduct = {
    inventoryStatus: "Out of Stock" | "Low Stock" | "In Stock"
    categoryName: string | null
    slug: string
    status: "active" | "inactive"
    name: string
    description: string
    price: string
    stock: number
    categoryId: string | null
    id: string
    createdAt: Date
    updatedAt: Date
    images: {
        format: string | null
        id: string
        alt: string
        isPrimary: boolean
        url: string
        createdAt: Date
        updatedAt: Date
        productId: string
        publicId: string
        width: number | null
        height: number | null
        size: number | null
    }[]
}
