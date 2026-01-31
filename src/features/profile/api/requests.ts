import type { CustomersQuery } from "@/features/profile/query-keys"
import type { Address, Customer, Profile } from "@/features/profile/types"
import type { AddressFormData } from "@/features/profile/validation"
import { api } from "@/lib/axios"
import type { PaginatedResult } from "@/types/global-types"

export async function fetchMe() {
    const res = await api.get("/me")
    return res.data as Profile
}

export async function updateProfile(infos: {
    fullName: string
    phone: string
}) {
    return api.patch("/me", infos)
}

export async function updatePassword(data: {
    oldPassword: string
    newPassword: string
}) {
    await api.patch("/me/password", data)
}

/// Addresses

export async function fetchAddresses() {
    const res = await api.get("/me/addresses")
    return res.data as Address[]
}

export async function createAddress(data: AddressFormData) {
    return api.post("/me/addresses", data)
}

export async function updateAddress({
    id,
    data,
}: {
    id: string
    data: Partial<AddressFormData>
}) {
    return api.patch("/me/addresses/" + id, data)
}

export async function deleteAddress(id: string) {
    return api.delete("/me/addresses/" + id)
}

/// Admin : Customers

export async function fetchCustomers(query?: CustomersQuery) {
    const res = await api.get("/admin/customers", {
        params: query,
    })

    return res.data as PaginatedResult<Customer[]>
}
