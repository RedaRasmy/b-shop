import type { Credentials, User } from "@/features/auth/validation"
import { axiosInstance } from "@/lib/axios"

export async function registerRequest(data: Credentials) {
    const res = await axiosInstance.post("/auth/register", data)
    return res.data as User
}

export async function loginRequest(data: Credentials) {
    const res = await axiosInstance.post("/auth/login", data)
    return res.data as User
}

export async function logoutRequest() {
    return axiosInstance.post("/auth/logout")
}
