import { createSlice } from "@reduxjs/toolkit";
import { Product } from "../models/Product";
import { OrderItem } from '../models/OrderItem';
import { CartState, updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")||"") : {cartItems: []};


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state:CartState, action) => {
            const item = action.payload;

            const existItem = state.cartItems.find((i:OrderItem) => i._id === item._id);

            if(existItem) {
                state.cartItems = state.cartItems.map((i:OrderItem) => i._id === existItem._id ? item: i);
            } else {
                state.cartItems = [...state.cartItems, item]
            }

            updateCart(state);
        },
        removeFromCart : (state, action) => {
            state.cartItems = state.cartItems.filter( (item: OrderItem) => item._id !== action.payload);

            return updateCart(state)
        }
    }

});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;