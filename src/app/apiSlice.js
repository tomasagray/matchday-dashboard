import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";

const baseUrl = "http://localhost:8080/"
// tagTypes:
const dataSourcePlugin = 'DataSourcePlugin'

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
    tagTypes: [dataSourcePlugin],
    endpoints: (builder) => ({
        getLatestEvents: builder.query({
            query: () => '/events/'
        }),
        // ... etc. ...
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

export const {
    useGetLatestEventsQuery,
    useGetAllDataSourcePluginsQuery,
    useRefreshAllDataSourcePluginsMutation,
    useEnableDataSourcePluginMutation,
    useDisableDataSourcePluginMutation
} = apiSlice
