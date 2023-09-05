export type PaypalResultType = {
  id: string,
  status: string,
  updateTime?: string,
  emailAddress?: string
}
 type Order = {
  _id: string,
  user: {
    name: string,
    email: string
  },
  orderItems: [{
    name: string,
    qty: number,
    image: string,
    price: number,
    product: string
  }],
  shippingAddress: {
    address: string,
    city: string,
    postalCode: string,
    country: string,
  },
  paymentMethod: string,
  paymentResult?: PaypalResultType,
  itemsPrice: number,
  taxPrice:number,
  shippingPrice:number,
  totalPrice:number,
  isPaid:boolean,
  paidAt?: Date,
  isDelivered:boolean,
  deliveredAt?:Date,
  createdAt: Date,
  updatedAt: Date
};

export default Order;