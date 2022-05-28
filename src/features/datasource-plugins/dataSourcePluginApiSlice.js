import {apiSlice, dataSourcePluginTag} from "../../app/apiSlice";
import {JsonHeaders} from "../../app/constants";
import {createSelector} from "@reduxjs/toolkit";
import {dataSourcePluginSlice, pluginAdapter} from "./dataSourcePluginSlice";
import store from "../../app/store";

const getSnapshotRequest = ({label = ''}) => {
    return {
        endDate: "",
        startDate: "",
        fetchBodies: true,
        fetchImages: false,
        maxResults: 50,
        labels: [label],
        orderBy: "",
        pageToken: "",
        status: ""
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
                url: `/data-sources/plugin/${pluginId}/enable`,
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
                url: `/data-sources/plugin/${pluginId}/disable`,
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            }),
            invalidatesTags: [dataSourcePluginTag],
        }),
        refreshAllDataSourcePlugins: builder.mutation({
            query: () => ({
                url: '/data-sources/refresh/all',
                method: 'POST',
                headers: JsonHeaders,
                body: getSnapshotRequest({}),
            })
        }),
    })
})

export const {
    useGetAllDataSourcePluginsQuery,
    useRefreshAllDataSourcePluginsMutation,
    useEnableDataSourcePluginMutation,
    useDisableDataSourcePluginMutation,
} = dataSourcePluginApiSlice

export const selectNormalizedPluginData = dataSourcePluginApiSlice.endpoints.getAllDataSourcePlugins.select()
export const selectPluginsData = createSelector(
    selectNormalizedPluginData,
    plugins => plugins?.data ?? []
)
