import type { CheckoutFormData } from "@/features/checkout/checkout.validation"
import { axiosInstance } from "@/lib/axios"
import type { Prettify } from "@/lib/types"
import type { CartItem } from "@/redux/slices/cart"

type Order = Prettify<CheckoutFormData & { items: CartItem[] }>

export async function placeOrder(order: Order) {
    return axiosInstance.post("/orders", order)
}
