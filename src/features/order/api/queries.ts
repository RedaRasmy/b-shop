import fetchOrders, {
    fetchAdminOrder,
    fetchAdminOrders,
} from "@/features/order/api/requests"
import { orderKeys, type AdminOrdersQuery } from "@/features/order/query-keys"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export function useOrders() {
    return useQuery({
        queryKey: orderKeys.customer(),
        queryFn: fetchOrders,
    })
}

export function useAdminOrders(query?: AdminOrdersQuery) {
    return useQuery({
        queryKey: orderKeys.admin.many(query),
        queryFn: () => fetchAdminOrders(query),
        placeholderData: keepPreviousData,
    })
}

export function useAdminOrder(id: number) {
    return useQuery({
        queryKey: orderKeys.admin.one(id),
        queryFn: () => fetchAdminOrder(id),
    })
}
