import { USERS_URL } from "../constants";
import { LoginUser, RegisterUser, User } from "../models/User";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation<User, LoginUser>({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body:data
            })
        }),
        logout: builder.mutation<User, void>({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST"
            })
        }),
        profileUpdate: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: "PUT",
                body: data
            })
        }),
        register: builder.mutation<User, RegisterUser>({
            query: (data) => ({
                url: USERS_URL,
                method: "POST",
                body: data
            })
        })
        
    })
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useProfileUpdateMutation } = productApiSlice;