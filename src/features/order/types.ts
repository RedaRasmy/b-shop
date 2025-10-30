// Customer

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

/// Admin

export type AdminOrder = {
    status: "pending" | "processing" | "shipped" | "completed" | "canceled"
    name: string
    id: number
    createdAt: Date
    updatedAt: Date
    email: string
    phone: string
    customerId: string | null
    city: string
    postalCode: string
    addressLine1: string
    addressLine2: string | null
    orderToken: string
    total: string
    items: {
        id: string
        productId: string
        quantity: number
        priceAtPurchase: string
    }[]
}
