import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { Product } from "../models/Product";
import { apiSlice } from "./apiSlice";

type GetProductsResponse = {
    products: Product[],
    page: number,
    pages: number
}

type GetProductsRequest = {
    pageNumber: string,
    keyword?: string
}

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProducts: builder.query<GetProductsResponse, GetProductsRequest>({
            query: ({ pageNumber, keyword }) => ({
                url: PRODUCTS_URL,
                params: {
                    pageNumber,
                    keyword
                }
            }),
            keepUnusedDataFor: 5,
            providesTags: ["Product"]
        }),
        getProductDetails: builder.query<Product, string>({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`
            }),
            keepUnusedDataFor: 5
        }),
        createProduct: builder.mutation({
            query: () => ({
                url: PRODUCTS_URL,
                method: "POST"
            }),
            invalidatesTags: ['Product']
        }),
        updateProduct: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}`,
                method: "PUT",
                body: {...data}
            }),
            invalidatesTags: ['Product']
        }),
        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: "POST",
                body: data
            })
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Product']
        }),
        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ['Product']
        }),
        getTopProducts: builder.query<Product[], null>({
            query: () => ({
                url: `${PRODUCTS_URL}/top`
            }),
            keepUnusedDataFor: 5
        }),
    })
})

export const { 
    useGetProductsQuery, 
    useGetProductDetailsQuery, 
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUploadProductImageMutation,
    useCreateReviewMutation,
    useGetTopProductsQuery
} 
= productApiSlice;