import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";

const baseUrl = "http://localhost:8080/"
export const dataSourcePlugin = 'DataSourcePlugin'

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
    endpoints: (builder) => ({
        getLatestEvents: builder.query({
            query: () => '/events/'
        }),
        // ... etc. ...
    })
})


export const {
    useGetLatestEventsQuery,
} = apiSlice
