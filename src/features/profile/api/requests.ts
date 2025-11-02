import type { CustomersQuery } from "@/features/profile/query-keys"
import type { Address, Customer, Profile } from "@/features/profile/types"
import type { AddressFormData } from "@/features/profile/validation"
import { axiosInstance } from "@/lib/axios"
import type { PaginatedResult } from "@/types/global-types"

export async function fetchMe() {
    const res = await axiosInstance.get("/me")
    return res.data as Profile
}

export async function updateProfile(infos: {
    fullName: string
    phone: string
}) {
    return axiosInstance.patch("/me", infos)
}

export async function updatePassword(data: {
    oldPassword: string
    newPassword: string
}) {
    await axiosInstance.patch("/me/password", data)
}

/// Addresses

export async function fetchAddresses() {
    const res = await axiosInstance.get("/me/addresses")
    return res.data as Address[]
}

export async function createAddress(data: AddressFormData) {
    return axiosInstance.post("/me/addresses", data)
}

export async function updateAddress({
    id,
    data,
}: {
    id: string
    data: Partial<AddressFormData>
}) {
    return axiosInstance.patch("/me/addresses/" + id, data)
}

export async function deleteAddress(id: string) {
    return axiosInstance.delete("/me/addresses/" + id)
}

/// Admin : Customers

export async function fetchCustomers(query?: CustomersQuery) {
    const res = await axiosInstance.get("/admin/customers", {
        params: query,
    })

    return res.data as PaginatedResult<Customer[]>
}
