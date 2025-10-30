import type { AdminCategoriesQuery } from "@/features/categories/query-keys"
import type { AdminCategory } from "@/features/categories/types"
import type { CategoryFormData } from "@/features/categories/validation"
import { axiosInstance } from "@/lib/axios"

// Customer

export const fetchCategories = () => {
    return axiosInstance.get("/categories")
}

// Admin

export async function createCategory(data: CategoryFormData) {
    return axiosInstance.post("/admin/categories", data)
}

export async function fetchAdminCategories(params: AdminCategoriesQuery = {}) {
    const res = await axiosInstance.get("/admin/categories", {
        params,
    })
    return res.data as AdminCategory[]
}

export async function updateCategory(id: string, data: CategoryFormData) {
    return axiosInstance.put(`/admin/categories/${id}`, data)
}

export async function deleteCategory(id: string) {
    return axiosInstance.delete("/admin/categories/" + id)
}
