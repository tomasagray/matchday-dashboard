import {JsonHeaders} from "../../constants";
import {dataSourcePluginSlice, pluginAdapter} from "../dataSourcePluginSlice";
import store from "../../store";
import {apiSlice, competitionTag, dataSourcePluginTag, eventTag, teamTag} from "./apiSlice";

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
                let {data_source_plugins} = _embedded
                store.dispatch(dataSourcePluginSlice.actions.pluginsLoaded(data_source_plugins))
                return pluginAdapter.setAll(pluginAdapter.getInitialState(), data_source_plugins)
            }
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
    useRefreshAllDataSourcePluginsMutation,
    useEnableDataSourcePluginMutation,
    useDisableDataSourcePluginMutation,
    useRefreshDataSourcesOnUrlMutation,
} = dataSourcePluginApiSlice

