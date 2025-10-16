import {
    addCartItem,
    clearCartRequest,
    deleteCartItem,
    getCart,
    mergeCartRequest,
    updateCartItem,
} from "@/features/cart/cart-requests"
import type { CartProduct } from "@/features/cart/types"
import { getProductsByIds } from "@/features/products/product-requests"
import type { ProductSummary } from "@/features/products/products.validation"
import { useDebounce } from "@/hooks/use-debounce"
import { queryKeys } from "@/lib/query-keys"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { cartActions, type CartItem } from "@/redux/slices/cart"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export default function useCart(
    isAuthenticated: boolean,
    isAuthLoading: boolean
) {
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()
    const localCart = useAppSelector((state) => state.cart)
    const ids = localCart.map((item) => item.productId)

    const [pendingUpdates, setPendingUpdates] = useState<
        Record<string, number>
    >({})

    useDebounce({
        state: pendingUpdates,
        delay: 500,
        onDebounced: (updates) => {
            if (!isAuthenticated) return

            Object.entries(updates).forEach(([id, quantity]) => {
                updateMutation.mutate({ id, quantity })
            })
            setPendingUpdates({})
        },
    })

    // Fetch authenticated cart
    const {
        data: authCart,
        isLoading: isAuthCartLoading,
        error: authCartError,
    } = useQuery({
        queryKey: queryKeys.cart.auth(),
        queryFn: getCart,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5, // 5 minutes
        select: (res) => res.data as CartProduct[],
    })

    const {
        data: guestCart,
        isLoading: isGuestCartLoading,
        error: guestCartError,
    } = useQuery({
        queryKey: queryKeys.cart.guest(ids),
        queryFn: () => getProductsByIds(ids),
        enabled: !isAuthenticated,
        staleTime: 1000 * 60 * 5, // 5 minutes
        select: (res) =>
            // O(n^2) I think its not that bad in this case :)
            res.data.map((product: ProductSummary) => ({
                ...product,
                quantity: localCart.find((itm) => itm.productId === product.id)!
                    .quantity,
            })) as CartProduct[],
    })

    // Add item mutation
    const addMutation = useMutation({
        mutationFn: async (item: CartItem) => {
            if (isAuthenticated) {
                return await addCartItem(item)
            } else {
                dispatch(cartActions.addToCart(item))
                return null
            }
        },
        onSuccess: () => {
            if (isAuthenticated) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.cart.auth(),
                })
            }
        },
    })

    // Update item mutation
    const updateMutation = useMutation({
        mutationFn: async ({
            id,
            quantity,
        }: {
            id: string
            quantity: number
        }) => {
            await updateCartItem({ id, quantity })
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.cart.auth() })
        },
    })

    // Delete item mutation
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
                    queryKey: queryKeys.cart.auth(),
                })
            }
        },
    })

    // Delete item mutation
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
                queryClient.invalidateQueries({ queryKey: ["cart"] })
            }
        },
    })

    // Cart data
    const items = useMemo(
        () => (isAuthenticated ? authCart || [] : guestCart || []),
        [isAuthenticated, authCart, guestCart]
    )

    // Computed values
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

    const subtotal = items.reduce((acc, item) => {
        return acc + item.price * item.quantity
    }, 0)

    // Helper functions
    const addItem = useCallback(
        (productId: string, quantity: number = 1) => {
            addMutation.mutate({ productId, quantity })
        },
        [addMutation]
    )

    const updateQuantity = useCallback(
        (productId: string, quantity: number) => {
            if (quantity <= 0) {
                deleteMutation.mutate({ id: productId })
                return
            }

            if (isAuthenticated) {
                // Optimistic update for immediate UI feedback
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                queryClient.setQueryData(queryKeys.cart.auth(), (old: any) => {
                    if (!old?.data) return old
                    return {
                        ...old,
                        data: old.data.map((item: CartProduct) =>
                            item.id === productId ? { ...item, quantity } : item
                        ),
                    }
                })

                setPendingUpdates((prev) => ({
                    ...prev,
                    [productId]: quantity,
                }))
            } else {
                dispatch(cartActions.setQuantity({ productId, quantity }))
            }
        },
        [isAuthenticated, queryClient, dispatch, deleteMutation]
    )

    const incrementQuantity = useCallback(
        (productId: string, currentQuantity: number) => {
            updateQuantity(productId, currentQuantity + 1)
        },
        [updateQuantity]
    )

    const decrementQuantity = useCallback(
        (productId: string, currentQuantity: number) => {
            updateQuantity(productId, currentQuantity - 1)
        },
        [updateQuantity]
    )

    const removeItem = useCallback(
        (productId: string) => {
            deleteMutation.mutate({ id: productId })
        },
        [deleteMutation]
    )

    const clearCart = useCallback(() => {
        clearMutation.mutate()
    }, [clearMutation])

    /// Carts Merging

    const prevAuthRef = useRef(isAuthenticated)
    const hasInitialized = useRef(false)

    // Auto-sync when user logs in
    useEffect(() => {
        // Wait for auth to finish loading
        if (isAuthLoading) return

        // Skip first render after auth loads
        if (!hasInitialized.current) {
            hasInitialized.current = true
            prevAuthRef.current = isAuthenticated
            return
        }

        // Now we can safely detect login
        const justLoggedIn = prevAuthRef.current === false && isAuthenticated

        if (justLoggedIn && localCart.length > 0) {
            mergeCartRequest(localCart)
                .then(() => {
                    dispatch(cartActions.clearCart())
                    queryClient.invalidateQueries({
                        queryKey: queryKeys.cart.auth(),
                    })
                })
                .catch((error) => {
                    console.error("Failed to sync cart:", error)
                })
        }

        prevAuthRef.current = isAuthenticated
    }, [isAuthenticated, isAuthLoading, localCart, queryClient, dispatch])

    return {
        items,
        itemCount,
        subtotal,
        isLoading: isAuthCartLoading || isGuestCartLoading,
        error:
            authCartError ||
            guestCartError ||
            addMutation.error ||
            updateMutation.error ||
            deleteMutation.error ||
            clearMutation.error,
        addItem,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        removeItem,
        clearCart,
        isUpdating: updateMutation.isPending,
        isAdding: addMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isClearing: clearMutation.isPending,
        isPending:
            updateMutation.isPending ||
            addMutation.isPending ||
            deleteMutation.isPending ||
            clearMutation.isPending,
    }
}
