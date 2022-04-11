import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";

const baseUrl = "http://localhost:8080/"
// tagTypes:
export const dataSourcePlugin = 'DataSourcePlugin'

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({baseUrl: baseUrl}),
    tagTypes: [dataSourcePlugin],
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
