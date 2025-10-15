import {
    addCartItem,
    clearCartRequest,
    deleteCartItem,
    getCart,
    updateCartItem,
} from "@/features/cart/cart-requests"
import type { CartProduct } from "@/features/cart/types"
import { getProductsByIds } from "@/features/products/product-requests"
import type { ProductSummary } from "@/features/products/products.validation"
// import { useDebounce } from "@/hooks/use-debounce"
import { queryKeys } from "@/lib/query-keys"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { cartActions, type CartItem } from "@/redux/slices/cart"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

export default function useCart(isAuthenticated: boolean) {
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()
    const localCart = useAppSelector((state) => state.cart)
    const ids = localCart.map((item) => item.productId)

    // Fetch authenticated cart
    const {
        data: authCart,
        isLoading,
        error,
    } = useQuery({
        queryKey: queryKeys.cart.auth(),
        queryFn: getCart,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5, // 5 minutes
        select: (res) => res.data as CartProduct[],
    })

    const {
        data: guestCart,
        // isLoading  ,
        // error,
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
            queryClient.invalidateQueries({ queryKey: ["cart"] })
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
                queryClient.invalidateQueries({ queryKey: ["cart"] })
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

    // // Sync guest cart to server on login
    // const syncCartOnLogin = useCallback(async () => {
    //     if (guestCart.length === 0) return

    //     try {
    //         // Add all guest items to server
    //         for (const item of guestCart) {
    //             try {
    //                 await addCartItem({
    //                     productId: item.id,
    //                     quantity: item.quantity,
    //                 })
    //             } catch (error: any) {
    //                 // If item already exists (409), update it instead
    //                 if (error.response?.status === 409) {
    //                     const existing = authCart?.find(
    //                         (c) => c.productId === item.productId
    //                     )
    //                     if (existing) {
    //                         await cartApi.updateItem(
    //                             existing.id,
    //                             existing.quantity + item.quantity
    //                         )
    //                     }
    //                 }
    //             }
    //         }

    //         // Clear guest cart
    //         dispatch(cartActions.clearCart())

    //         // Refresh server cart
    //         queryClient.invalidateQueries({ queryKey: ["cart"] })
    //     } catch (error) {
    //         console.error("Failed to sync cart:", error)
    //     }
    // }, [guestCart, authCart, dispatch, queryClient])

    // Cart data
    const items = isAuthenticated ? authCart || [] : guestCart || []

    // Computed values
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

    const subtotal = items.reduce((acc, item) => {
        return acc + item.price * item.quantity
    }, 0)

    // Helper functions
    const addItem = useCallback(
        (productId: string, quantity: number) => {
            addMutation.mutate({ productId, quantity })
        },
        [addMutation]
    )

    const updateQuantity = useCallback(
        (productId: string, quantity: number) => {
            if (quantity <= 0) {
                deleteMutation.mutate({ id: productId })
            } else {
                updateMutation.mutate({ id: productId, quantity })
            }
        },
        [updateMutation, deleteMutation]
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

    return {
        items,
        itemCount,
        subtotal,
        isLoading,
        error:
            error ||
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
        // syncCartOnLogin,
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
