import type { OrderFormData } from "@/features/order/validation"
import { axiosInstance } from "@/lib/axios"
import type { PaginatedResult, Prettify } from "@/types/global-types"
import type { CartItem } from "@/redux/slices/cart"
import type { AdminOrder, Order, SuccessfulOrder } from "@/features/order/types"
import type { AdminOrdersQuery } from "@/features/order/query-keys"
import { parseApiDates } from "@/utils/parse-api-dates"

// Customer

export async function createOrder(
    order: Prettify<OrderFormData & { items: CartItem[] }>
) {
    const res = await axiosInstance.post("/orders", order)

    return res.data.orderToken as string
}

export async function fetchOrder(token: string) {
    const res = await axiosInstance.get("/orders/" + token)

    return res.data as SuccessfulOrder
}

export default async function fetchOrders() {
    const res = await axiosInstance.get("/me/orders")

    return res.data as Order[]
}

/// Admin

export async function fetchAdminOrders(params?: AdminOrdersQuery) {
    const { data } = await axiosInstance.get<PaginatedResult<AdminOrder[]>>(
        "/admin/orders",
        {
            params,
        }
    )
    return {
        ...data,
        data: data.data.map((order) =>
            parseApiDates(order, ["createdAt", "updatedAt"])
        ),
    }
}

export async function fetchAdminOrder(id: number) {
    const { data } = await axiosInstance.get<AdminOrder>("/admin/orders/" + id)

    return parseApiDates(data, ["createdAt", "updatedAt"])
}

export async function updateOrder({
    id,
    status,
}: {
    id: number
    status: AdminOrder["status"]
}) {
    return axiosInstance.patch("/admin/orders/" + id, {
        status,
    })
}
