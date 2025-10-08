// import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"



const cartSlice = createSlice({
    name: "cart",
    initialState : [],
    reducers: {
        addToCart() {
            // const product = payload
        },
        
        
    },
})


export const cartActions = cartSlice.actions
export default cartSlice.reducer