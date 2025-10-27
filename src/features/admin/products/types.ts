export type AdminProduct = {
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
    createdAt: string
    updatedAt: string
    status: "active" | "inactive"
    stock: number
    categoryId?: string | undefined
}
