import {createSelector, createSlice} from "@reduxjs/toolkit";
import {apiSlice, dataSourcePlugin} from "../../app/apiSlice";

const dataSourceTag = 'DataSource'

const jsonHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
}

const initialState = {
    plugins: [],
    selectedPlugin: null,
}

const dataSourcesSlice = createSlice({
    name: 'dataSources',
    initialState: initialState,
    tagTypes: [dataSourceTag],
    reducers: {
        pluginSelected(state, action) {
            state.selectedPlugin = action.payload.plugin
        },
        enableSelectedPlugin(state) {
            state.selectedPlugin.enabled = true
        },
        disableSelectedPlugin(state) {
            state.selectedPlugin.enabled = false
        },
        patternKitUpdated(state, action) {
            const {id, pattern} = action.payload
            console.log('payload was', id, pattern)
            console.log('state is', JSON.stringify(state))
        }
    }
})

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

export const dataSourceApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => {
        return ({
            getAllDataSourcePlugins: builder.query({
                query: () => '/data-sources/plugin/all',
                keepUnusedDataFor: 3000,    // TODO: remove, subscribe in component, setup tag invalidation
                // providesTags: [dataSourcePlugin],
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
                invalidatesTags: [dataSourcePlugin],
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
                invalidatesTags: [dataSourcePlugin],
            }),
            refreshAllDataSourcePlugins: builder.mutation({
                query: () => ({
                    url: '/data-sources/refresh/all',
                    method: 'POST',
                    headers: jsonHeaders,
                    body: getSnapshotRequest({}),
                })
            }),
            getDataSourcesForPlugin: builder.query({
                query: (pluginId) => ({url: `/data-sources/plugin/${pluginId}/sources`}),
                transformResponse: (response, meta, arg) => {
                    console.log('[getDataSourcesForPlugin] Got response:', response, meta, arg)
                    let {_embedded} = response
                    if (_embedded) {
                        let {data_source} = _embedded
                        return data_source
                    }
                    return response
                }
            }),
            addDataSource: builder.mutation({
                query: ({dataSource}) => ({
                    url: '/data-sources/add-data-source',
                    method: 'POST',
                    headers: jsonHeaders,
                    body: {dataSource},
                }),
                invalidatesTags: (result, error, arg) => [
                    {type: dataSourceTag, id: arg.dataSourceId}
                ]
            })
        });
    }
})

export const {pluginSelected, enableSelectedPlugin, disableSelectedPlugin, patternKitUpdated} = dataSourcesSlice.actions

export const {
    useGetAllDataSourcePluginsQuery,
    useRefreshAllDataSourcePluginsMutation,
    useEnableDataSourcePluginMutation,
    useDisableDataSourcePluginMutation,
    useGetDataSourcesForPluginQuery,
    useAddDataSourceMutation,
} = dataSourceApiSlice

export const selectDataSourcePluginsResult = dataSourceApiSlice.endpoints.getAllDataSourcePlugins.select()

export const selectAllDataSourcePlugins = createSelector(
    selectDataSourcePluginsResult,
    pluginsResult => pluginsResult?.data ?? []
)

export const selectDataSourcePluginById = createSelector(
    selectAllDataSourcePlugins,
    (state, pluginId) => pluginId,
    (plugins, pluginId) => {
        const {_embedded} = plugins;
        if (_embedded) {
            const {data_source_plugins} = _embedded
            return data_source_plugins.find(plugin => plugin.id === pluginId)
        }
    }
)

// todo - use these
export const selectDataSourcesForPluginResult = (pluginId) =>
    dataSourceApiSlice.endpoints.getDataSourcesForPlugin.select(pluginId)

export const selectDataSourcesForPlugin = createSelector(
    selectDataSourcePluginsResult,
    (state) => state.dataSources.selectedPlugin.id,
    selectDataSourcesForPluginResult,
    (result, b) => result?.data ?? []
)

export default dataSourcesSlice.reducer
