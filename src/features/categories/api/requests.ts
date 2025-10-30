import type { AdminCategoriesQuery } from "@/features/categories/query-keys"
import type { AdminCategory, Category } from "@/features/categories/types"
import type { CategoryFormData } from "@/features/categories/validation"
import { axiosInstance } from "@/lib/axios"

// Customer

export async function fetchCategories() {
    const res = await axiosInstance.get("/categories")
    return res.data as Category[]
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
