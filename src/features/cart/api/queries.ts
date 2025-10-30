import { fetchCart } from "@/features/cart/api/requests"
import { cartKeys } from "@/features/cart/query-keys"
import { useQuery } from "@tanstack/react-query"

export function useCart({ isAuthenticated }: { isAuthenticated: boolean }) {
    return useQuery({
        queryKey: cartKeys.auth(),
        queryFn: fetchCart,
        enabled: isAuthenticated,
    })
}
