import type { OrderFormData } from "@/features/order/validation"
import { axiosInstance } from "@/lib/axios"
import type { Prettify } from "@/types/global-types"
import type { CartItem } from "@/redux/slices/cart"
import type { Order, SuccessfulOrder } from "@/features/order/types"

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

export default async function getOrders() {
    const res = await axiosInstance.get("/me/orders")

    return res.data as Order[]
}

// export async function getAdminOrders(query) {
//     const res = await axiosInstance.get('/admin/orders',{
//         params : query
//     })

//     return res.data as
// }
