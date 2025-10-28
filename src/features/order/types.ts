export type Order = {
    items: {
        productName: string
        productId: string
        quantity: number
        priceAtPurchase: string
    }[]
    id: number
    status: "pending" | "processing" | "shipped" | "completed" | "canceled"
    createdAt: Date
    total: string
}

export type SuccessfulOrder = { total: string; id: number }
