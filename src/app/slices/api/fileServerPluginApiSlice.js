import {apiSlice, fileServerPluginTag} from "./apiSlice";
import store from "../../store";
import {
    fileServerPluginAdapter,
    fileServerPluginSlice
} from "../fileServerPluginSlice";
import {JsonHeaders} from "../../constants";

export const fileServerPluginApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllFileServerPlugins: builder.query({
            query: () => '/file-servers/all',
            providesTags: [fileServerPluginTag],
            transformResponse: (response) => {
                let {_embedded} = response
                let {fileservers: fileServers} = _embedded
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
    useEnableFileServerPluginMutation,
    useDisableFileServerPluginMutation,
} = fileServerPluginApiSlice
