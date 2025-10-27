import type { Product, ProductSummary } from "@/features/products/validation"
import { axiosInstance } from "@/lib/axios"
import type { ProductsQuery } from "@/lib/query-keys"
import type { PaginationResponse } from "@/types/global-types"

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
