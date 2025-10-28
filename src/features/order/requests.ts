import type { OrderFormData } from "@/features/order/validation"
import { axiosInstance } from "@/lib/axios"
import type { Prettify } from "@/types/global-types"
import type { CartItem } from "@/redux/slices/cart"
import type { SuccessfulOrder } from "@/features/order/types"

export async function placeOrder(
    order: Prettify<OrderFormData & { items: CartItem[] }>
) {
    const res = await axiosInstance.post("/orders", order)

    return res.data.orderToken as string
}

export async function getOrder(token: string) {
    const res = await axiosInstance.get("/orders/" + token)

    return res.data as SuccessfulOrder
}
