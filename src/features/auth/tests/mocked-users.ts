import type { User } from "@/lib/types"

export const mockedAdmin: User = {
    id: "test-id-admin",
    email: "admin@example.com",
    role: "admin",
    isEmailVerified: false,
}

export const mockedCustomer: User = {
    id: "test-id",
    email: "customer@example.com",
    role: "customer",
    isEmailVerified: false,
}

export const usedEmail = "used@example.com"
export const password = "password123"

export const mockedAdminCredentials = {
    email: mockedAdmin.email,
    password,
}

export const mockedCustomerCredentials = {
    email: mockedCustomer.email,
    password,
}
