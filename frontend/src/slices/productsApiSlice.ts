import { PRODUCTS_URL } from "../constants";
import { Product } from "../models/Product";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProducts: builder.query<Product[], null>({
            query: () => ({
                url: PRODUCTS_URL
            }),
            keepUnusedDataFor: 5
        }),
        getProductDetails: builder.query<Product, string>({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`
            }),
            keepUnusedDataFor: 5
        })
    })
})

export const { useGetProductsQuery, useGetProductDetailsQuery } = productApiSlice;