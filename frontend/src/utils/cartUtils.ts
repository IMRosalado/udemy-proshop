import { OrderItem } from "../models/OrderItem";

export type CartState = {
    cartItems: OrderItem[],
    itemsPrice: string,
    shippingPrice: string,
    taxPrice: string,
    totalPrice: string
}

export const addDecimals = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

export const updateCart = (state: CartState) => {

    // calculate items price
    state.itemsPrice = addDecimals(state.cartItems.reduce((acc: number, item: OrderItem)=> acc + (item.price * item.qty), 0));

    // calculate shipping price (shipping is FEE if order > 100$ else 10$)
    state.shippingPrice = addDecimals(Number(state.itemsPrice)>100 ? 0 : 10);

    // calculate tax price (15% tax)
    state.taxPrice = addDecimals(Number(state.itemsPrice) * 0.15);

    // calculate total price
    state.totalPrice = (Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice)).toFixed(2);

    localStorage.setItem("cart", JSON.stringify(state));
    return state
}
