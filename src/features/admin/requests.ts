import type {
    AdminCategory,
    CategoryFormData,
} from "@/features/admin/categories/validation"
import type { AdminProduct } from "@/features/admin/products/types"
import type { AdminCategoriesQuery } from "@/features/categories/query-keys"
import type { AdminProductsQuery } from "@/features/products/query-keys"
import { axiosInstance } from "@/lib/axios"
import type { PaginationResponse } from "@/types/global-types"

// Products

export async function addProduct(formData: FormData) {
    return axiosInstance.post("/admin/products", formData)
}

export async function getProducts(params: AdminProductsQuery = {}) {
    const res = await axiosInstance.get("/admin/products", {
        params: {
            ...params,
            perPage: 15,
        },
    })
    return res.data as PaginationResponse<AdminProduct[]>
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
