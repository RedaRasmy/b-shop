import type { User } from "@/features/auth/types"
import type { Credentials } from "@/features/auth/validation"
import { api } from "@/lib/axios"

export async function registerRequest(data: Credentials) {
    const res = await api.post("/auth/register", data)
    return res.data as User
}

export async function loginRequest(data: Credentials) {
    const res = await api.post("/auth/login", data)
    return res.data as User
}

export async function logoutRequest() {
    return api.post("/auth/logout")
}
