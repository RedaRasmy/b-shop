import type { CategoryFormData } from "@/features/admin/categories/categories.validation"
import { axiosInstance } from "@/lib/axios"

// Products

export async function addProduct(formData: FormData) {
    return axiosInstance.post("/admin/products", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
}

type ProductsQuery = {
    search?: string
    status?: "active" | "inactive"
    sort?: string
    categoryId?: string

}
export async function getProducts(params:ProductsQuery={}) {
    return axiosInstance.get('admin/products',{
        params
    })
}

// Categories

export async function addCategory(data: CategoryFormData) {
    return axiosInstance.post("/admin/categories", data)
}

type CategoriesQuery = {
    search?: string
    status?: "active" | "inactive"
    sort?: string
}

export async function getCategories(params: CategoriesQuery = {}) {
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
