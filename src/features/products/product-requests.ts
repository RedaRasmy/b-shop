import { axiosInstance } from "@/lib/axios"

type ProductsQuery = {
    search?: string
    sort?: string
    categoryId?: string
    page?: number
    perPage?: number
}

export async function getProducts(params: ProductsQuery = {}) {
    return axiosInstance.get("/products", {
        params,
    })
}

export async function getProduct(slug: string) {
    return axiosInstance.get("/products/" + slug)
}
