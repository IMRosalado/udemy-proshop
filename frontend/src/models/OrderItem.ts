import { Product } from "./Product"

  export type OrderItem = Product & {
    qty: number
  }