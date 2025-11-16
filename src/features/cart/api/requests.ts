import type { CartProduct } from "@/features/cart/types"
import { axiosInstance } from "@/lib/axios"
import type { CartItem } from "@/redux/slices/cart"

export const fetchCart = async function () {
    const res = await axiosInstance.get("/me/cart")
    return res.data as CartProduct[]
}

export const createCartItem = async function (cartItem: {
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
    return axiosInstance.patch("/me/cart/" + id, {
        quantity,
    })
}

export const deleteCartItem = async function (id: string) {
    axiosInstance.delete("/me/cart/" + id)
}

export const clearCartRequest = async function () {
    return axiosInstance.delete("/me/cart")
}

export const mergeCartRequest = async function (items: CartItem[]) {
    return axiosInstance.post("/me/cart/merge", items)
}
