import type { OrderFormData } from "@/features/order/order.validation"
import { axiosInstance } from "@/lib/axios"
import type { Prettify } from "@/types/global-types"
import type { CartItem } from "@/redux/slices/cart"

type Order = Prettify<OrderFormData & { items: CartItem[] }>

export async function placeOrder(order: Order) {
    const res = await axiosInstance.post("/orders", order)

    return res.data.orderToken as string
}

export async function getOrder(token: string) {
    const res = await axiosInstance.get("/orders/" + token)

    return res.data as { total: string; id: number }
}
