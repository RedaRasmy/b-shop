import type { AdminCategoriesQuery } from "@/features/categories/query-keys"
import type { AdminCategory, Category } from "@/features/categories/types"
import type { CategoryFormData } from "@/features/categories/validation"
import { api } from "@/lib/axios"

// Customer

export async function fetchCategories() {
    const res = await api.get("/categories")
    return res.data as Category[]
}

// Admin

export async function createCategory(data: CategoryFormData) {
    return api.post("/admin/categories", data)
}

export async function fetchAdminCategories(query: AdminCategoriesQuery = {}) {
    const res = await api.get("/admin/categories", {
        params: query,
    })
    return res.data as AdminCategory[]
}

export async function updateCategory(id: string, data: CategoryFormData) {
    return api.patch(`/admin/categories/${id}`, data)
}

export async function deleteCategory(id: string) {
    return api.delete("/admin/categories/" + id)
}
