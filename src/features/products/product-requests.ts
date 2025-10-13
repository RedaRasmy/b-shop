import { axiosInstance } from "@/lib/axios"
import type { ProductsQuery } from "@/lib/query-keys"


export async function getProducts(params: ProductsQuery = {}) {
    return axiosInstance.get("/products", {
        params,
    })
}

export async function getProduct(slug: string) {
    return axiosInstance.get("/products/" + slug)
}
