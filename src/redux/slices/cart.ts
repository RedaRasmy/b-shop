import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "@/redux/store"

export type CartItem = {
    productId: string
    quantity: number
}

export type CartState = CartItem[]

const initialState: CartState = []

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (
            state,
            action: PayloadAction<{
                productId: string
                quantity?: number
            }>
        ) => {
            const { productId, quantity = 1 } = action.payload

            // Validate quantity
            if (quantity <= 0) return

            const existingItem = state.find(
                (item) => item.productId === productId
            )

            if (existingItem) {
                return
            } else {
                state.push({ productId, quantity })
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            const id = action.payload

            return state.filter((item) => item.productId !== id)
        },
        setQuantity: (state, action: PayloadAction<CartItem>) => {
            const { productId, quantity } = action.payload

            // Remove item if quantity is 0 or less
            if (quantity <= 0) {
                return state.filter((item) => item.productId !== productId)
            } else {
                const item = state.find((item) => item.productId === productId)
                if (item) {
                    item.quantity = quantity
                }
            }
        },
        incrementQuantity: (
            state,
            action: PayloadAction<{ productId: string; amount?: number }>
        ) => {
            const { productId, amount = 1 } = action.payload
            const item = state.find((item) => item.productId === productId)

            if (item && amount > 0) {
                item.quantity += amount
            }
        },

        decrementQuantity: (
            state,
            action: PayloadAction<{ productId: string; amount?: number }>
        ) => {
            const { productId, amount = 1 } = action.payload
            const item = state.find((item) => item.productId === productId)

            if (item && amount > 0) {
                const newQuantity = item.quantity - amount

                if (newQuantity <= 0) {
                    // Remove item if quantity would become 0 or negative
                    return state.filter((i) => i.productId !== productId)
                } else {
                    item.quantity = newQuantity
                }
            }
        },

        clearCart: (state) => {
            state.length = 0
        },

        loadCart: (_, action: PayloadAction<CartItem[]>) => {
            return action.payload
        },
    },
})

export const cartActions = cartSlice.actions
export default cartSlice.reducer

// Selectors
export const selectCartItems = (state: RootState) => state.cart
export const selectIsInCart = (state: RootState, productId: string) =>
    state.cart.some((item) => item.productId === productId)
