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
import type { PaginationResponse } from "@/types/global-types"

// Customer

export async function getProducts(params: ProductsQuery = {}) {
    const res = await axiosInstance.get("/products", {
        params,
    })
    return res.data as PaginationResponse<ProductSummary[]>
}

export async function getProductsByIds(ids: string[]) {
    const res = await axiosInstance.post("/products/bulk", ids)
    return res.data as ProductSummary[]
}

export async function getProduct(slug: string) {
    const res = await axiosInstance.get("/products/" + slug)

    return res.data as Product
}

// Admin

export async function addProduct(formData: FormData) {
    return axiosInstance.post("/admin/products", formData)
}

export async function getAdminProducts(params: AdminProductsQuery = {}) {
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
