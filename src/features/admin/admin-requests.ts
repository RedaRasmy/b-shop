import type { CategoryFormData } from "@/features/admin/categories/categories.validation"
import { axiosInstance } from "@/lib/axios"
import type { AdminCategoriesQuery, AdminProductsQuery } from "@/lib/query-keys"

// Products

export async function addProduct(formData: FormData) {
    return axiosInstance.post("/admin/products", formData)
}

export async function getProducts(params: AdminProductsQuery = {}) {
    return axiosInstance.get("/admin/products", {
        params: {
            ...params,
            perPage: 15,
        },
    })
}

export async function updateProduct(id: string, formData: FormData) {
    return axiosInstance.put("/admin/products/" + id, formData)
}

export async function deleteProduct(id: string) {
    return axiosInstance.delete("/admin/products/" + id)
}

// Categories

export async function addCategory(data: CategoryFormData) {
    return axiosInstance.post("/admin/categories", data)
}

export async function getCategories(params: AdminCategoriesQuery = {}) {
    return axiosInstance.get("/admin/categories", {
        params,
    })
}

export async function updateCategory(id: string, data: CategoryFormData) {
    return axiosInstance.put(`/admin/categories/${id}`, data)
}

export async function deleteCategory(id: string) {
    return axiosInstance.delete("/admin/categories/" + id)
}
