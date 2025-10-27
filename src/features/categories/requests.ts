import { axiosInstance } from "@/lib/axios"

export const getCategories = () => {
    return axiosInstance.get("/categories")
}
