import type { Profile } from "@/features/profile/profile.validation"
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
