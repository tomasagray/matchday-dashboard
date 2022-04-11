import {createSlice} from "@reduxjs/toolkit";
import {apiSlice, dataSourcePlugin} from "../../app/apiSlice";

const initialState = {
    selectedPlugin: null
}

const dataSourcesSlice = createSlice({
    name: 'datasources',
    initialState: initialState,
    reducers: {
        pluginSelected(state, action) {
            return {
                ...state,
                selectedPlugin: action.payload.plugin
            }
        },
        enableSelectedPlugin(state) {
            state.selectedPlugin.enabled = true
        },
        disableSelectedPlugin(state) {
            state.selectedPlugin.enabled = false
        },
    }
})

export const dataSourceApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllDataSourcePlugins: builder.query({
            query: () => '/data-sources/plugin/all',
            providesTags: [dataSourcePlugin],
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
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: getSnapshotRequest({}),
            })
        })
    })
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


export const {pluginSelected, enableSelectedPlugin, disableSelectedPlugin} = dataSourcesSlice.actions

export const {
    useGetAllDataSourcePluginsQuery,
    useRefreshAllDataSourcePluginsMutation,
    useEnableDataSourcePluginMutation,
    useDisableDataSourcePluginMutation
} = dataSourceApiSlice

export default dataSourcesSlice.reducer
