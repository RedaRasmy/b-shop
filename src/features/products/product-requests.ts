import { axiosInstance } from "@/lib/axios"
import type { ProductsQuery } from "@/lib/query-keys"

export async function getProducts(params: ProductsQuery = {}) {
    return axiosInstance.get("/products", {
        params,
    })
}

export async function getProductsByIds(ids: string[]) {
    const res = await axiosInstance.post("/products/bulk", ids)
    return res.data
}

export async function getProduct(slug: string) {
    return axiosInstance.get("/products/" + slug)
}
