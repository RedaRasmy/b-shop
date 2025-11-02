export type Profile = {
    id: string
    email: string
    role: "admin" | "customer"
    isEmailVerified: boolean
    fullName: string | null
    phone: string | null
}

export type Address = {
    id: string
    createdAt: Date
    updatedAt: Date
    customerId: string
    label: string
    city: string
    postalCode: string
    addressLine1: string
    // addressLine2: string | null
    isDefault: boolean
}

export type Customer = {
    id: string
    name: string | null
    email: string
    phone: string | null
    joinedAt: Date
    totalSpent: number
    orderCount: number
}
