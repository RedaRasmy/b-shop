import type {
    Address,
    IAddress,
    Profile,
} from "@/features/profile/profile.validation"
import { axiosInstance } from "@/lib/axios"

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

export async function getAddresses() {
    const res = await axiosInstance.get("/me/addresses")
    return res.data as Address[]
}

export async function addAddress(data: IAddress) {
    return axiosInstance.post("/me/addresses", data)
}

export async function updateAddress({
    id,
    data,
}: {
    id: string
    data: Partial<IAddress>
}) {
    return axiosInstance.patch("/me/addresses/" + id, data)
}

export async function deleteAddress(id: string) {
    return axiosInstance.delete("/me/addresses/" + id)
}


