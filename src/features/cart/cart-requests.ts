import { axiosInstance } from "@/lib/axios"
import type { CartItem } from "@/redux/slices/cart"

export const getCart = async function () {
    return axiosInstance.get("/me/cart")
}

export const addCartItem = async function (cartItem: {
    productId: string
    quantity: number
}) {
    return axiosInstance.post("/me/cart", cartItem)
}

export const updateCartItem = async function ({
    id,
    quantity,
}: {
    id: string
    quantity: number
}) {
    return axiosInstance.put("/me/cart/" + id, {
        quantity,
    })
}

export const deleteCartItem = async function (id: string) {
    return axiosInstance.delete("/me/cart/" + id)
}

export const clearCartRequest = async function () {
    return axiosInstance.delete("/me/cart")
}

export const mergeCartRequest = async function (items: CartItem[]) {
    return axiosInstance.post("/me/cart/merge", items)
}
