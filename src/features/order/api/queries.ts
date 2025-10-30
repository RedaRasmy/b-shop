import getOrders from "@/features/order/api/requests"
import { orderKeys } from "@/features/order/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useOrders() {
    return useQuery({
        queryKey: orderKeys.customer(),
        queryFn: getOrders,
    })
}
