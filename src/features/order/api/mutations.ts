import { updateOrder } from "@/features/order/api/requests"
import { orderKeys } from "@/features/order/query-keys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useUpdateOrder() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: orderKeys.base,
            })
            // TODO : maybe I should invalidate other things
        },
    })
}
