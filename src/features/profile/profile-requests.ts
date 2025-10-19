import { axiosInstance } from "@/lib/axios";

export async function fetchMe() {
    const res = await axiosInstance.get("/me")
    return res.data
}