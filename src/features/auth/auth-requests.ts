import { axiosInstance } from "@/lib/axios";
import type { Credentials } from "@/lib/types";

export async function registerRequest(data:Credentials) {
    return axiosInstance.post("/auth/register",data)
}

export async function loginRequest(data:Credentials) {
    return axiosInstance.post("/auth/login",data)
}

export async function logoutRequest() {
    return axiosInstance.post("/auth/logout")
}

