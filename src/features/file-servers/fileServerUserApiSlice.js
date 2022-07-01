import {apiSlice, fileServerUserTag} from "../../app/apiSlice";
import store from "../../app/store";
import {fileServerUserSlice, userAdapter} from "./fileServerUserSlice";

export const fileServerUserApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFileServerUsers: builder.query({
            query: (pluginId) => `/file-servers/file-server/${pluginId}/users`,
            providesTags: fileServerUserTag,
            transformResponse: (response) => {
                let users = response._embedded.users
                store.dispatch(fileServerUserSlice.actions.usersLoaded(users))
                return userAdapter.setAll(userAdapter.getInitialState(), users)
            }
        })
    })
})

export const {
    useGetFileServerUsersQuery,
} = fileServerUserApiSlice
