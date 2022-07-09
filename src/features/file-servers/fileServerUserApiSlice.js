import {apiSlice, fileServerUserTag} from "../../app/apiSlice";
import store from "../../app/store";
import {fileServerUserSlice, userAdapter} from "./fileServerUserSlice";
import {JsonHeaders} from "../../app/constants";

export const fileServerUserApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFileServerUsers: builder.query({
            query: (pluginId) => `/file-server-users/users/file-server/${pluginId}`,
            providesTags: [fileServerUserTag],
            transformResponse: (response) => {
                let users = response._embedded.users
                store.dispatch(fileServerUserSlice.actions.usersLoaded(users))
                return userAdapter.setAll(userAdapter.getInitialState(), users)
            }
        }),
        getUser: builder.query({
            query: userId => `/file-server-users/user/${userId}`,
            providesTags: (result, error, arg) => [{type: fileServerUserTag, id: arg}],
            transformResponse: (response) => {
                let user = response._embedded.user
                store.dispatch(fileServerUserSlice.actions.userLoaded(user))
                return userAdapter.setOne(userAdapter.getInitialState(), user)
            }
        }),
        loginUser: builder.mutation({
            query: user => ({
                url: `/file-server-users/login`,
                method: 'POST',
                headers: JsonHeaders,
                body: user,
            }),
            invalidatesTags: [fileServerUserTag],
            transformResponse: (response, meta, arg) => {
                console.log('login response: ', response, meta, arg)
                store.dispatch(fileServerUserSlice.actions.userUpdated(response))
                return response
            }
        }),
        uploadCredentials: builder.mutation({
            query: (body) => ({
                url: `/file-server-users/user/login-with-cookies`,
                method: 'POST',
                body,
            }),
            invalidatesTags: [fileServerUserTag],
            transformResponse: (response) => {
                console.log('got response, etc.', response)
                return response
            }
        }),
        logoutUser: builder.mutation({
            query: userId => ({
                url: `/file-server-users/user/${userId}/logout`,
                method: 'POST',
                headers: JsonHeaders,
            }),
            invalidatesTags: [fileServerUserTag],
            transformResponse: (response) => {
                store.dispatch(fileServerUserSlice.actions.userUpdated(response))
                return response
            }
        }),
        reloginUser: builder.mutation({
            query: (userId) => ({
                url: `/file-server-users/user/${userId}/relogin`,
                method: 'POST',
                headers: JsonHeaders,
            }),
            invalidatesTags: [fileServerUserTag],
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/file-server-users/user/${userId}/delete`,
                method: 'DELETE',
                headers: JsonHeaders,
            }),
            invalidatesTags: [fileServerUserTag],
            transformResponse: (response, meta, arg) => {
                if (response === arg) {
                    store.dispatch(fileServerUserSlice.actions.userDeleted(response))
                }
                return response
            }
        }),
    })
})

export const {
    useGetFileServerUsersQuery,
    useLoginUserMutation,
    useUploadCredentialsMutation,
    useLogoutUserMutation,
    useReloginUserMutation,
    useDeleteUserMutation,
} = fileServerUserApiSlice
