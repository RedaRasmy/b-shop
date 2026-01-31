import type { CartProduct } from "@/features/cart/types"
import { api } from "@/lib/axios"
import type { CartItem } from "@/redux/slices/cart"

export const fetchCart = async function () {
    const res = await api.get("/me/cart")
    return res.data as CartProduct[]
}

export const createCartItem = async function (cartItem: {
    productId: string
    quantity: number
}) {
    return api.post("/me/cart", cartItem)
}

export const updateCartItem = async function ({
    id,
    quantity,
}: {
    id: string
    quantity: number
}) {
    return api.patch("/me/cart/" + id, {
        quantity,
    })
}

export const deleteCartItem = async function (id: string) {
    return api.delete("/me/cart/" + id)
}

export const mergeCartRequest = async function (items: CartItem[]) {
    return api.post("/me/cart/merge", items)
}
