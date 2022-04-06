import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";

const baseUrl = "http://localhost:8080/"

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
    endpoints: (builder) => ({
        getLatestEvents: builder.query({
            query: () => '/events/'
        }),
        // ... etc. ...
        getAllDataSourcePlugins: builder.query({
            query: () => '/data-sources/plugin/all'
        })
    })
})

export const {useGetLatestEventsQuery, useGetAllDataSourcePluginsQuery} = apiSlice
