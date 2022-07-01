import {apiSlice, fileServerPluginTag} from "../../app/apiSlice";
import store from "../../app/store";
import {fileServerPluginAdapter, fileServerPluginSlice} from "./fileServerPluginSlice";
import {JsonHeaders} from "../../app/constants";

export const fileServerPluginApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllFileServerPlugins: builder.query({
            query: () => '/file-servers/all',
            providesTags: [fileServerPluginTag],
            transformResponse: (response) => {
                let fileServers = response._embedded.fileservers
                store.dispatch(fileServerPluginSlice.actions.pluginsLoaded(fileServers))
                return fileServerPluginAdapter.setAll(fileServerPluginAdapter.getInitialState(), fileServers)
            }
        }),
        enableFileServerPlugin: builder.mutation({
            query: (pluginId) => ({
                url: `/file-servers/file-server/${pluginId}/enable`,
                method: 'POST',
                headers: JsonHeaders,
            }),
            invalidatesTags: (result, error, arg) => [fileServerPluginTag]
        }),
        disableFileServerPlugin: builder.mutation({
            query: pluginId => ({
                url: `/file-servers/file-server/${pluginId}/disable`,
                method: 'POST',
                headers: JsonHeaders,
            }),
            invalidatesTags: (result, error, arg) => [fileServerPluginTag],
        })
    })
})

export const {
    useGetAllFileServerPluginsQuery,
    useEnableFileServerPluginMutation,
    useDisableFileServerPluginMutation,
} = fileServerPluginApiSlice
