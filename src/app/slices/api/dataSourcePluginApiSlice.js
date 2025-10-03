import {JsonHeaders} from "../../constants";
import {apiSlice, competitionTag, dataSourcePluginTag, eventTag, teamTag} from "./apiSlice";
import store from "../../store";
import {dataSourcePluginSlice} from "../dataSourcePluginSlice";

const getSnapshotRequest = (refreshParams) => {
    return {
        startDate: "",
        fetchBodies: true,
        fetchImages: false,
        maxResults: 50,
        orderBy: "",
        pageToken: "",
        status: "",
        ...refreshParams
    }
}

export const dataSourcePluginApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllDataSourcePlugins: builder.query({
            query: () => '/data-source-plugins/all',
            providesTags: [dataSourcePluginTag],
            transformResponse: (response) => {
                let {_embedded} = response
                if (_embedded) {
                    let {data_source_plugins} = _embedded
                    store.dispatch(dataSourcePluginSlice.actions.pluginsLoaded(data_source_plugins))
                    return data_source_plugins
                }
                return []
            }
        }),
        getDataSourcePlugin: builder.query({
            query: pluginId => `/data-source-plugins/plugin/${pluginId}`,
            providesTags: [dataSourcePluginTag],
        }),
        enableDataSourcePlugin: builder.mutation({
            query: pluginId => ({
                url: `/data-source-plugins/plugin/${pluginId}/enable`,
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            }),
            invalidatesTags: [dataSourcePluginTag],
        }),
        disableDataSourcePlugin: builder.mutation({
            query: pluginId => ({
                url: `/data-source-plugins/plugin/${pluginId}/disable`,
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            }),
            invalidatesTags: [dataSourcePluginTag],
        }),
        refreshAllDataSourcePlugins: builder.mutation({
            query: refreshQuery => ({
                url: '/data-sources/refresh/all',
                method: 'POST',
                headers: JsonHeaders,
                body: getSnapshotRequest(refreshQuery),
            }),
            invalidatesTags: [eventTag, competitionTag, teamTag]
        }),
        refreshDataSourcesOnUrl: builder.mutation({
            query: url => ({
                url: '/data-sources/refresh/on-url',
                method: 'POST',
                headers: JsonHeaders,
                body: {url}
            }),
            invalidatesTags: [eventTag, competitionTag, teamTag]
        }),
    })
})

export const {
    useGetAllDataSourcePluginsQuery,
    useGetDataSourcePluginQuery,
    useRefreshAllDataSourcePluginsMutation,
    useEnableDataSourcePluginMutation,
    useDisableDataSourcePluginMutation,
    useRefreshDataSourcesOnUrlMutation,
} = dataSourcePluginApiSlice

