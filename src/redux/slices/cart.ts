import type { PayloadAction } from "@reduxjs/toolkit"
import type { ProductSummary } from "@/features/products/products.validation"
import type { Prettify } from "@/lib/types"
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "@/redux/store"

type CartItem = Prettify<ProductSummary & { quantity: number }>

export type CartState = {
    items: CartItem[]
    totalItems: number
    totalPrice: number
}

const initialState: CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
}

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )
    return { totalItems, totalPrice }
}

// Helper to update totals
const updateTotals = (state: CartState) => {
    const totals = calculateTotals(state.items)
    state.totalItems = totals.totalItems
    state.totalPrice = totals.totalPrice
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (
            state,
            action: PayloadAction<{
                product: ProductSummary
                quantity?: number
            }>
        ) => {
            const { product, quantity = 1 } = action.payload

            // Validate quantity
            if (quantity <= 0) return

            const existingItem = state.items.find(
                (item) => item.id === product.id
            )

            if (existingItem) {
                existingItem.quantity += quantity
            } else {
                state.items.push({ ...product, quantity })
            }

            updateTotals(state)
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload
            )
            updateTotals(state)
        },
        setQuantity: (
            state,
            action: PayloadAction<{ id: string; quantity: number }>
        ) => {
            const { id, quantity } = action.payload

            // Remove item if quantity is 0 or less
            if (quantity <= 0) {
                state.items = state.items.filter((item) => item.id !== id)
            } else {
                const item = state.items.find((item) => item.id === id)
                if (item) {
                    item.quantity = quantity
                }
            }

            updateTotals(state)
        },
        incrementQuantity: (
            state,
            action: PayloadAction<{ id: string; amount?: number }>
        ) => {
            const { id, amount = 1 } = action.payload
            const item = state.items.find((item) => item.id === id)

            if (item && amount > 0) {
                item.quantity += amount
                updateTotals(state)
            }
        },

        decrementQuantity: (
            state,
            action: PayloadAction<{ id: string; amount?: number }>
        ) => {
            const { id, amount = 1 } = action.payload
            const item = state.items.find((item) => item.id === id)

            if (item && amount > 0) {
                const newQuantity = item.quantity - amount

                if (newQuantity <= 0) {
                    // Remove item if quantity would become 0 or negative
                    state.items = state.items.filter((i) => i.id !== id)
                } else {
                    item.quantity = newQuantity
                }

                updateTotals(state)
            }
        },

        clearCart: (state) => {
            state.items = []
            state.totalItems = 0
            state.totalPrice = 0
        },

        loadCart: (state, action: PayloadAction<CartItem[]>) => {
            state.items = action.payload
            updateTotals(state)
        },
    },
})

export const cartActions = cartSlice.actions
export default cartSlice.reducer

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartTotal = (state: RootState) => state.cart.totalPrice
export const selectCartItemCount = (state: RootState) => state.cart.totalItems
export const selectCartItemById = (state: RootState, id: string) =>
    state.cart.items.find((item) => item.id === id)
export const selectIsInCart = (state: RootState, id: string) =>
    state.cart.items.some((item) => item.id === id)
export const selectCartItemQuantity = (state: RootState, id: string) =>
    state.cart.items.find((item) => item.id === id)?.quantity ?? 0
