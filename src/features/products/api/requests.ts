import type {
    AdminProductsQuery,
    ProductsQuery,
} from "@/features/products/query-keys"
import type {
    AdminProduct,
    Product,
    ProductSummary,
} from "@/features/products/types"
import { axiosInstance } from "@/lib/axios"
import type { PaginatedResult } from "@/types/global-types"

// Customer

export async function fetchProducts(params: ProductsQuery = {}) {
    const res = await axiosInstance.get("/products", {
        params,
    })
    return res.data as PaginatedResult<ProductSummary[]>
}

export async function fetchProductsByIds(ids: string[]) {
    if (ids.length === 0) return []
    const res = await axiosInstance.post("/products/bulk", ids)
    return res.data as ProductSummary[]
}

export async function fetchProduct(slug: string) {
    const res = await axiosInstance.get("/products/" + slug)

    return res.data as Product
}

// Admin

export async function createProduct(formData: FormData) {
    return axiosInstance.post("/admin/products", formData)
}

export async function fetchAdminProducts(params: AdminProductsQuery = {}) {
    const res = await axiosInstance.get("/admin/products", {
        params,
    })
    return res.data as PaginatedResult<AdminProduct[]>
}

export async function updateProduct(id: string, formData: FormData) {
    return axiosInstance.patch("/admin/products/" + id, formData)
}

export async function deleteProduct(id: string) {
    return axiosInstance.delete("/admin/products/" + id)
}
