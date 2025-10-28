export type Category = {
    id: string
    name: string
    slug: string
    description: string
    createdAt: string
    updatedAt: string
}

export type AdminCategory = {
    id: string
    name: string
    slug: string
    description: string
    createdAt: string
    updatedAt: string
    status: "active" | "inactive"
    productsCount: number
}
