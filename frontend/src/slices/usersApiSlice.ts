import { USERS_URL } from "../constants";
import { LoginUser, RegisterUser, User } from "../models/User";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
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
        }),
        getUsers: builder.query<User[], null>({
            query: () => ({
                url: USERS_URL
            }),
            providesTags: ["User"],
            keepUnusedDataFor: 5
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["User"]
        }),
        getUserById: builder.query({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`
            }),
            keepUnusedDataFor: 5
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["User"]
        })
        
    })
})

export const { 
    useLoginMutation, 
    useLogoutMutation, 
    useRegisterMutation, 
    useProfileUpdateMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserByIdQuery,
    useUpdateUserMutation
} = usersApiSlice;