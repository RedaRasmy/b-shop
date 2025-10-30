import { cartKeys } from "@/features/cart/query-keys"
import {
    createCartItem,
    clearCartRequest,
    deleteCartItem,
    fetchCart,
    // mergeCartRequest,
    updateCartItem,
} from "@/features/cart/requests"
import type { CartProduct } from "@/features/cart/types"
import { fetchProductsByIds } from "@/features/products/requests"
import type { ProductSummary } from "@/features/products/types"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { cartActions, selectCart, type CartItem } from "@/redux/slices/cart"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"

export default function useCart(isAuthenticated: boolean) {
    console.log("useCart runs...")
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()
    const localCart = useAppSelector(selectCart)
    const ids = useMemo(
        () => localCart.map((item) => item.productId),
        [localCart]
    )

    // Fetch authenticated cart
    const {
        data: authCart,
        isLoading: isAuthCartLoading,
        error: authCartError,
    } = useQuery({
        queryKey: cartKeys.auth(),
        queryFn: fetchCart,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
    })

    const selectGuestCart = useCallback(
        (data: ProductSummary[]) => {
            return data.map((product: ProductSummary) => ({
                ...product,
                quantity: localCart.find((itm) => itm.productId === product.id)!
                    .quantity,
            })) as CartProduct[]
        },
        [localCart]
    )

    const {
        data: guestCart,
        isLoading: isGuestCartLoading,
        error: guestCartError,
    } = useQuery({
        queryKey: cartKeys.guest(ids),
        queryFn: () => fetchProductsByIds(ids),
        enabled: !isAuthenticated && ids.length > 0,
        staleTime: 1000 * 60 * 5,
        select: selectGuestCart,
    })

    // Mutations
    const addMutation = useMutation({
        mutationFn: async (item: CartItem) => {
            if (isAuthenticated) {
                return await createCartItem(item)
            } else {
                dispatch(cartActions.addToCart(item))
                return null
            }
        },
        onSuccess: () => {
            if (isAuthenticated) {
                queryClient.invalidateQueries({
                    queryKey: cartKeys.auth(),
                })
            }
        },
    })

    const updateMutation = useMutation({
        mutationFn: async ({
            id,
            quantity,
        }: {
            id: string
            quantity: number
        }) => {
            if (isAuthenticated) {
                await updateCartItem({ id, quantity })
            } else {
                dispatch(cartActions.setQuantity({ productId: id, quantity }))
            }
        },
        onSuccess: () => {
            if (isAuthenticated) {
                queryClient.invalidateQueries({
                    queryKey: cartKeys.auth(),
                })
            }
        },
    })

    const deleteMutation = useMutation({
        mutationFn: async ({ id }: { id: string }) => {
            if (isAuthenticated) {
                await deleteCartItem(id)
            } else {
                dispatch(cartActions.removeFromCart(id))
            }
        },
        onSuccess: () => {
            if (isAuthenticated) {
                queryClient.invalidateQueries({
                    queryKey: cartKeys.auth(),
                })
            }
        },
    })

    const clearMutation = useMutation({
        mutationFn: async () => {
            if (isAuthenticated) {
                await clearCartRequest()
            } else {
                dispatch(cartActions.clearCart())
            }
        },
        onSuccess: () => {
            if (isAuthenticated) {
                queryClient.invalidateQueries({
                    queryKey: cartKeys.auth(),
                })
            }
        },
    })

    // Cart data
    const items = isAuthenticated ? authCart || [] : guestCart || []
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
    const subtotal = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    )

    return {
        items,
        itemCount,
        subtotal,
        isLoading: isAuthCartLoading || isGuestCartLoading,
        error: authCartError || guestCartError,
        addItem: (productId: string, quantity: number = 1) => {
            addMutation.mutate({ productId, quantity })
        },
        updateQuantity: (productId: string, quantity: number) => {
            if (quantity <= 0) {
                deleteMutation.mutate({ id: productId })
            } else {
                updateMutation.mutate({ id: productId, quantity })
            }
        },
        removeItem: (productId: string) => {
            deleteMutation.mutate({ id: productId })
        },
        clearCart: () => {
            clearMutation.mutate()
        },
        isPending:
            addMutation.isPending ||
            updateMutation.isPending ||
            deleteMutation.isPending ||
            clearMutation.isPending,
    }
}
