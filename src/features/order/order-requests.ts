import type { OrderFormData } from "@/features/order/order.validation"
import { axiosInstance } from "@/lib/axios"
import type { Prettify } from "@/lib/types"
import type { CartItem } from "@/redux/slices/cart"

type Order = Prettify<OrderFormData & { items: CartItem[] }>

export async function placeOrder(order: Order) {
    return axiosInstance.post("/orders", order)
}
