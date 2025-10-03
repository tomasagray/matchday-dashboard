import {apiSlice, fileServerPluginTag} from "./apiSlice";
import {JsonHeaders} from "../../constants";
import {fileServerPluginSlice} from "../fileServerPluginSlice";
import store from "../../store";


export const fileServerPluginApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllFileServerPlugins: builder.query({
            query: () => '/file-servers/all',
            providesTags: [fileServerPluginTag],
            transformResponse: (response) => {
                let {_embedded} = response
                if (_embedded) {
                    let {fileservers: fileServers} = _embedded
                    store.dispatch(fileServerPluginSlice.actions.pluginsLoaded(fileServers))
                    return fileServers
                }
                return []
            }
        }),
        getFileServerPlugin: builder.query({
            query: pluginId => `/file-servers/file-server/${pluginId}`,
            providesTags: [fileServerPluginTag],
        }),
        enableFileServerPlugin: builder.mutation({
            query: (pluginId) => ({
                url: `/file-servers/file-server/${pluginId}/enable`,
                method: 'POST',
                headers: JsonHeaders,
            }),
            invalidatesTags: [fileServerPluginTag]
        }),
        disableFileServerPlugin: builder.mutation({
            query: pluginId => ({
                url: `/file-servers/file-server/${pluginId}/disable`,
                method: 'POST',
                headers: JsonHeaders,
            }),
            invalidatesTags: [fileServerPluginTag],
        })
    })
})

export const {
    useGetAllFileServerPluginsQuery,
    useGetFileServerPluginQuery,
    useEnableFileServerPluginMutation,
    useDisableFileServerPluginMutation,
} = fileServerPluginApiSlice
