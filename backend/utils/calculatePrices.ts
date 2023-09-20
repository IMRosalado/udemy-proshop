import { OrderItemType } from '../models/OrderModel';

const addDecimals = (num: number) => {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export const calculatePrices = (orderItems: OrderItemType[]) => {

  // calculate items price
  const itemsPrice = addDecimals(orderItems.reduce((acc: number, item: OrderItemType)=> acc + (item.price * item.qty), 0));

  // calculate shipping price (shipping is FEE if order > 100$ else 10$)
  const shippingPrice = addDecimals(Number(itemsPrice)>100 ? 0 : 10);

  // calculate tax price (15% tax)
  const taxPrice = addDecimals(Number(itemsPrice) * 0.15);

  // calculate total price
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

  return { itemsPrice, shippingPrice, taxPrice, totalPrice }
}
