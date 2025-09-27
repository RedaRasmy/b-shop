import type { User } from "@/lib/types"

export const mockedAdmin:User = {
    id: "test-id-admin",
    email: "test@example.com",
    role: "admin" ,
    isEmailVerified: false,
}

export const mockedCustomer:User = {
    id: "test-id",
    email: "test@example.com",
    role: "customer" ,
    isEmailVerified: false,
}
